class SnkLibrary
  attr_accessor :name, :lib_type, :lib_status, :address, 
  :postcode, :street, :addressnumber, :city, :okres, :kraj,
  :person, :phone, :website, :email, :using_street_addressing

  @@uid_counter_for_new_osm_points = -1

  def initialize csv_line
    self.name, self.lib_type, self.lib_status, self.address, 
    self.postcode, self.city, self.okres, self.kraj, 
    self.person, self.phone, self.website, self.email = csv_line.split ';'



    a2 = self.address.split(' ')
    self.street = a2[0..-2].join(' ')

    self.using_street_addressing = true
    if(self.street == self.city)
      # obec nepouziva nazvy ulic
      self.using_street_addressing = false
      self.street = nil
    end
    self.addressnumber = a2.last
  end

  def to_s
    out = "name: #{self.name}\n"
    out << "obec: #{self.city}\n"
    out << "kraj: #{self.kraj}, okres: #{self.okres}\n"

    out
  end

  def to_html
    html = "<tr>"
    html << <<-STRING
    <td>#{self.name}<br />
    obec: #{self.city}<br />
    ulica: #{self.street}<br />
    cislo: #{self.addressnumber}<br />
    stav: #{self.lib_status}
    </td>
    STRING
    if osm_address_found?
      html << "<td style=\"background-color: #18ff18\">Najdena v OSM ako adresa</td>"
    else
      html << "<td style=\"background-color: grey\">Nenajdena v OSM ako adresa</td>"
    end

    if osm_name_found?
      html << "<td style=\"background-color: #18ff18\">Najdena v OSM ako kniznica</td>"
    else
      html << "<td style=\"background-color: grey\">Nenajdena v OSM ako kniznica</td>"
    end

    html << "</tr>"
  end

  def is_matching library_filter
    library_filter.each do |k, v|
      if v.class == String && self.send(k) != v
        return false
      elsif !v.include?(self.send(k))
        return false
      end
    end
    return true
  end

  def to_overpass_query
    if(self.street)
      <<-STRING
        <query type="node">
          <has-kv k="addr:street" v="#{self.street}"/>
          <has-kv k="addr:streetnumber" v="#{self.addressnumber}"/>
          <has-kv k="addr:city" v="#{self.city}"/>
        </query>
        <print mode="meta"/>
        <query type="way">
          <has-kv k="addr:street" v="#{self.street}"/>
          <has-kv k="addr:streetnumber" v="#{self.addressnumber}"/>
          <has-kv k="addr:city" v="#{self.city}"/>
        </query>
        <print mode="meta" geometry=\"center\"/>
      STRING
    else
      <<-STRING
        <query type="node">
          <has-kv k="addr:housenumber" v="#{self.addressnumber}"/>
          <has-kv k="addr:city" v="#{self.city}"/>
        </query>
        <print mode="meta"/>
        <query type="way">
          <has-kv k="addr:housenumber" v="#{self.addressnumber}"/>
          <has-kv k="addr:city" v="#{self.city}"/>
        </query>
        <print mode="meta" geometry=\"center\"/>
      STRING
    end
  end

  def add_osm_data_from_address_search osm_hash
    # todo deal with multiple address matches
    @osm_hash_from_address_search = osm_hash
  end

  def osm_address_found?
    return @osm_hash_from_address_search
  end

  def add_osm_data_from_name_search osm_hash
    @osm_hash_from_name_search = osm_hash
  end

  def osm_name_found?
    return @osm_hash_from_name_search
  end

  def is_working?
    self.lib_status == 'Fungujúca'
  end

  def to_osc_modify_xml
    return unless is_working?
    return unless osm_name_found?

    library_tags_from_osm = @osm_hash_from_name_search['tags']
    library_tags_from_snk = to_osm_tags_hash
    merged_tags = library_tags_from_snk.merge library_tags_from_snk
    merged_tags['name'] = self.name
    merged_tags['note'] ||= ' '
    merged_tags['note'] << ' | updating existing amenity:library'

    version = @osm_hash_from_name_search['version'] + 1
    uid = @osm_hash_from_name_search['id']

    
    if(@osm_hash_from_name_search['type'] == 'node')
      lat = @osm_hash_from_name_search['lat']
      lon = @osm_hash_from_name_search['lon']
      xml = "\t<node id=\"#{uid}\" lat=\"#{lat}\" lon=\"#{lon}\" version=\"#{version}\">\n"
      merged_tags.each do |k,v|
        if v && v.length > 0
          xml += "\t\t<tag k=\"#{k}\" v=\"#{v}\"/>\n"
        end
      end
      xml += "\t</node>\n"    
    else 
      raise "TODO - implement osc modify for <way>"
    end

    xml
  end

  def to_osc_create_xml
    return unless is_working?
    return unless osm_address_found? 
    return if osm_name_found?

    if(@osm_hash_from_address_search['type'] == 'node')
      lat = @osm_hash_from_address_search['lat']
      lon = @osm_hash_from_address_search['lon']
    else
      lat = @osm_hash_from_address_search['center']['lat']
      lon = @osm_hash_from_address_search['center']['lon']        
    end

    library_tags_from_osm = @osm_hash_from_address_search['tags']
    library_tags_from_snk = to_osm_tags_hash
    merged_tags = library_tags_from_snk.merge library_tags_from_snk
    merged_tags['name'] = self.name
    merged_tags['note'] ||= ' '
    merged_tags['note'] << ' | creating new library via address matching'

    @@uid_counter_for_new_osm_points -= 1
    xml = "\t<node id=\"#{@@uid_counter_for_new_osm_points}\" lat=\"#{lat}\" lon=\"#{lon}\" version=\"1\">\n"
    merged_tags.each do |k,v|
      if v && v.length > 0
        xml += "\t\t<tag k=\"#{k}\" v=\"#{v}\"/>\n"
      end
    end
    xml += "\t</node>\n"

    return xml
  end

  def to_osm_tags_hash
    h = {
      'amenity' => 'library',
      'name' => self.name,
      'addr:city' => self.city,
      'addr:postcode' => self.postcode,
      'fixme' => 'yes'
    }

    if self.using_street_addressing
      h['addr:street'] = self.street
      h['addr:streetnumber'] = self.addressnumber
      h['addr:housenumber'] = self.addressnumber
    else
      h['addr:place'] = self.city
      h['addr:conscriptionnumber'] = self.addressnumber
      h['addr:housenumber'] = self.addressnumber
      h['note'] = ' overit ci addr:city == addr:place'

    end

    h['website'] = self.website if self.website
    h['contact:phone'] = self.phone.gsub(',', ';') if self.phone
    h['contact:email'] = self.email.strip if self.email
    
    h
  end
end
class SnkLibrary
  attr_accessor :name, :lib_type, :lib_status, :address, 
  :postcode, :street, :addressnumber, :city, :okres, :kraj,
  :person, :phone, :website, :email, :using_street_addressing

  @@uid_counter_for_new_osm_points = -1

  def initialize csv_line
    @snk_osm_diff = {}

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

    self.website = nil if self.website && self.website.length == 0
  end

  def to_s
    out = "name: #{self.name}\n"
    out << "obec: #{self.city}\n"
    out << "kraj: #{self.kraj}, okres: #{self.okres}\n"

    out
  end

  def to_html
    c = 'white'
    if self.lib_status != 'Fungujúca'
      c = 'yellow'
    end
    html = "<tr>"
    html << <<-STRING
    <td style=\"background-color: #{c}\">#{self.name}<br />
    obec: #{self.city}<br />
    ulica: #{self.street}<br />
    cislo: #{self.addressnumber}<br />
    stav: #{self.lib_status}<br />
    telefon: #{self.phone}<br />
    web: #{self.website}
    </td>
    STRING

    if osm_address_found?
      html << "<td style=\"background-color: #18ff18\">Najdena v OSM ako adresa</td>"
    else
      html << "<td style=\"background-color: grey\">Nenajdena v OSM ako adresa</td>"
    end

    if osm_name_found?
      if no_changes_between_snk_and_osm
        html << "<td style=\"background-color: #18ff18\">Najdena v OSM ako kniznica, ziadne nove zmeny </td>"
      else
        html << "<td style=\"background-color: yellow\">Najdena v OSM ako kniznica, v SNK su odlisne udaje. <br>#{@snk_osm_diff}</td>"
      end
    else
      html << "<td style=\"background-color: grey\">Nenajdena v OSM ako kniznica</td>"
    end

    html << "<td>"
    to_osm_tags_hash.each do |k,v|
      html << "#{k}<br/>"
      html << "\"#{v}\"<br/>"
    end
    html << "</td>"
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
    resolve_snk_osm_diff(library_tags_from_osm, library_tags_from_snk)

    return if no_changes_between_snk_and_osm

    merged_tags = library_tags_from_snk.merge library_tags_from_osm
    merged_tags['name'] = self.name

    version = @osm_hash_from_name_search['version']
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
       xml = "\t<way id=\"#{uid}\" version=\"#{version}\">\n"
       xml += "\t\t<tag k=\"amenity\" v=\"library\"/>\n"
       xml += "\t\t<tag k=\"name\" v=\"#{merged_tags['name']}\"/>\n"
       xml += "\t\t<tag k=\"note\" v=\" tento bod zmazat a rucne updatnut existujucu way\"/>\n"
       @osm_hash_from_name_search['nodes'].each do |nodeID|
        xml += "<nd ref=\"#{nodeID}\"/>"
       end
       
      xml += "\t</way>\n" 
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
      'note' => '  '
    }

    if self.using_street_addressing
      h['addr:street'] = self.street
      h['addr:streetnumber'] = self.addressnumber
      h['addr:housenumber'] = self.addressnumber
    else
      h['addr:place'] = self.city
      h['addr:conscriptionnumber'] = self.addressnumber
      h['addr:housenumber'] = self.addressnumber
      h['note'] << 'overit ci addr:city == addr:place'

    end

    h['website'] = self.website if self.website
    h['contact:phone'] = self.phone.gsub(',', ';') if self.phone
    h['contact:email'] = self.email.strip if self.email
    
    h
  end

  def resolve_snk_osm_diff osm, snk
    
    @snk_osm_diff['name'] = {:osm => osm['name'], :snk => snk['name']} if osm['name'] != snk['name']
    @snk_osm_diff['addr:city'] = {:osm => osm['addr:city'], :snk => snk['addr:city']} if osm['addr:city'] != snk['addr:city']

    @snk_osm_diff['website'] = {:osm => osm['website'], :snk => snk['website']} if osm['website'] != snk['website']
    @snk_osm_diff['contact:phone'] = {:osm => osm['contact:phone'], :snk => snk['contact:phone']} if osm['contact:phone'] != snk['contact:phone']
    @snk_osm_diff['contact:email'] = {:osm => osm['contact:email'], :snk => snk['contact:email']}  if osm['contact:email'] != snk['contact:email']
  
  end

  def no_changes_between_snk_and_osm
    @snk_osm_diff.empty?
  end
end
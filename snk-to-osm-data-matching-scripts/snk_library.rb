class SnkLibrary
  attr_accessor :name, :lib_type, :lib_status, :address, 
  :postcode, :street, :addressnumber, :city, :okres, :kraj,
  :person, :phone, :website, :email

  @@uid_counter_for_new_osm_points = -1

  def initialize csv_line
    self.name, self.lib_type, self.lib_status, self.address, 
    self.postcode, self.city, self.okres, self.kraj, 
    self.person, self.phone, self.website, self.email = csv_line.split ';'

    a2 = self.address.split(' ')
    self.street = a2[0..-2].join(' ')
    if(self.street == self.city)
      # obec nepouziva nazvy ulic
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

  def to_osm_change_create_xml
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

    t = @osm_hash_from_address_search['tags']

    kvs = {
      'amenity' => 'library',
      'name' => self.name,
      'addr:city' => self.city,
      'addr:postcode' => self.postcode,
      'addr:street' => t['addr:street'],
      'addr:streetnumber' => t['addr:streetnumber'],
      'addr:conscriptionnumber' =>  t['addr:conscriptionnumber'],
      'addr:housenumber' => t['addr:housenumber'],
      'website' => self.website,
      'contact:phone' => self.phone.gsub(',', ';'),
      'contact:email' => self.email.strip,
      'fixme' => 'yes'
    }

    @@uid_counter_for_new_osm_points -= 1
    xml = "\t<node id=\"#{@@uid_counter_for_new_osm_points}\" lat=\"#{lat}\" lon=\"#{lon}\" version=\"1\">\n"
    kvs.each do |k,v|
      if v && v.length > 0
        xml += "\t\t<tag k=\"#{k}\" v=\"#{v}\"/>\n"
      end
    end
    xml += "\t</node>\n"

    return xml
  end
end
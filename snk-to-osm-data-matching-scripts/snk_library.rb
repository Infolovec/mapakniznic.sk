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
    html << "<td>#{self.name}<br />obec: #{self.city}<br />ulica: #{self.street}<br />cislo: #{self.addressnumber}</td>"
    if osm_address_found?
      html << "<td style=\"background-color: #18ff18\">Adresa najdena v OSM</td>"
      if osm_library_found?
        html << "<td style=\"background-color: #18ff18\">Kniznica najdena v OSM</td>"
      else
        html << "<td style=\"background-color: yellow\">Este nie je v OSM ako kniznica</td>"
      end
    else
      html << "<td style=\"background-color: grey\">Adresa nenajdena v OSM</td><td></td>"
    end

    html << "</tr>"
  end

  def is_matching library_filter
    library_filter.each do |k, v|
      if self.send(k) != v
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

  def add_osm_data osm_hash
    # todo deal with multiple osm matched per single snk library
    @osm_hash = osm_hash
  end

  def osm_address_found?
    return @osm_hash
  end

  def osm_library_found?
    return osm_address_found? && @osm_hash['tags']['amenity'] && @osm_hash['tags']['amenity'] == 'library'
  end

  def to_osm_change_create_xml
    return unless osm_address_found?
    return if osm_library_found?

    if(@osm_hash['type'] == 'node')
      lat = @osm_hash['lat']
      lon = @osm_hash['lon']
    else
      lat = @osm_hash['center']['lat']
      lon = @osm_hash['center']['lon']        
    end

    t = @osm_hash['tags']

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
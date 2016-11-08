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

  def is_matching library_filter
    library_filter.each do |k, v|
      if self.send(k) != v
        return false
      end
    end
    return true
  end

  def to_overpass_query
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
  end

  def add_osm_data osm_hash
    # todo deal with multiple osm matched per single snk library
    @osm_hash = osm_hash
  end

  def osm_match_found?
    return @osm_hash
  end

  def to_osm_change_create_xml
    return unless osm_match_found?
    isExistingLibraryInOSM = @osm_hash['tags']['amenity'] && @osm_hash['tags']['amenity'] == 'library'
    return if isExistingLibraryInOSM

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
      'contact:email' => self.email,
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
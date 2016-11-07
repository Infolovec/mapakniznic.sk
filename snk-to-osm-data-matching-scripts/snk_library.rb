class SnkLibrary
  attr_accessor :name, :lib_type, :lib_status, :address, 
  :postcode, :street, :streetnumber, :city, :okres, :kraj
  def initialize csv_line
    self.name, self.lib_type, self.lib_status, self.address, self.postcode, self.city, self.okres, self.kraj, _ = csv_line.split ';'
    a2 = self.address.split(' ')
    self.street = a2[0..-2].join(' ')
    self.streetnumber = a2.last
  end

  def to_s
    out = "name: #{self.name}\n"
    out << "obec: #{self.city}\n"
    out << "kraj: #{self.kraj}, okres: #{self.okres}\n"

    return out
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
        <has-kv k="addr:streetnumber" v="#{self.streetnumber}"/>
        <has-kv k="addr:city" v="#{self.city}"/>
      </query>
      <print mode="meta"/>
      <query type="way">
        <has-kv k="addr:street" v="#{self.street}"/>
        <has-kv k="addr:streetnumber" v="#{self.streetnumber}"/>
        <has-kv k="addr:city" v="#{self.city}"/>
      </query>
      <print mode="meta" geometry=\"center\"/>
    STRING
  end
end
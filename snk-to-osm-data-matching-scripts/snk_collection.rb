class SnkCollection
  def initialize path_to_csv
    csv = File.read path_to_csv
    libraries_csv = csv.split("\n")[1..-1]
    puts "Loaded #{libraries_csv.length} SNK records"
    @libraries = []
    libraries_csv.each do |library_raw_data|
      @libraries << SnkLibrary.new(library_raw_data)
    end
  end

  def load_osm_data lib_filter
    matching_libraries = @libraries.select { |library| library.is_matching(lib_filter)}
    oquery = to_overpass_query matching_libraries
    json_osm_response = execute_overpass_query oquery

    puts json_osm_response
  end
  private

  def to_overpass_query lib_collection
    overpass_query = "<osm-script bbox=\"47.3793,16.3930,49.8595,23.4572\" output=\"json\">"
    lib_collection.each do |library|
      overpass_query += library.to_overpass_query
    end
    overpass_query += "</osm-script>"

    overpass_query
  end

  def execute_overpass_query query
    # File.open('./tmp/query.osm', 'w'){|f| f.write query}
    # response = `curl -X POST -d @tmp/query.osm http://overpass-api.de/api/interpreter`
    # JSON.parse response

    {"version"=>0.6, "generator"=>"Overpass API", "osm3s"=>{"timestamp_osm_base"=>"2016-11-07T16:39:04Z", "copyright"=>"The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."}, "bounds"=>{"minlat"=>47.3793, "minlon"=>16.393, "maxlat"=>49.8595, "maxlon"=>23.4572}, "elements"=>[{"type"=>"way", "id"=>60885892, "timestamp"=>"2014-12-15T08:01:43Z", "version"=>2, "changeset"=>27476074, "user"=>"Durko_freemap", "uid"=>1885079, "center"=>{"lat"=>47.8554509, "lon"=>17.7727728}, "nodes"=>[762028087, 762032110, 762036933, 762040828, 762036479, 762036328, 762040412, 762044883, 762021635, 762047598, 762023636, 762027660, 762031657, 762029673, 762034258, 762038554, 762042780, 762028087], "tags"=>{"addr:city"=>"Veľký Meder", "addr:conscriptionnumber"=>"203", "addr:country"=>"SK", "addr:housenumber"=>"203/18", "addr:street"=>"Komárňanská", "addr:streetnumber"=>"18", "building"=>"yes", "import"=>"budovy201004", "source"=>"kapor2"}}, {"type"=>"node", "id"=>3088754472, "lat"=>48.5879469, "lon"=>17.8249547, "timestamp"=>"2014-09-21T08:28:37Z", "version"=>1, "changeset"=>25574125, "user"=>"ppcr", "uid"=>1219164, "tags"=>{"addr:city"=>"Piešťany", "addr:conscriptionnumber"=>"4761", "addr:country"=>"SK", "addr:housenumber"=>"4761/19", "addr:street"=>"Školská", "addr:streetnumber"=>"19"}}, {"type"=>"node", "id"=>3225263129, "lat"=>48.4262069, "lon"=>17.7975704, "timestamp"=>"2014-12-28T20:32:23Z", "version"=>3, "changeset"=>27762905, "user"=>"Jose Riha", "uid"=>29762, "tags"=>{"addr:city"=>"Hlohovec", "addr:conscriptionnumber"=>"2", "addr:country"=>"SK", "addr:housenumber"=>"2/2", "addr:street"=>"Námestie sv. Michala", "addr:streetnumber"=>"2"}}]}
  end
end 

class SnkCollection
  def initialize path_to_csv
    csv = File.read path_to_csv
    libraries_csv = csv.split("\n")[1..-1]
    puts "Loaded #{libraries_csv.length} SNK records"
    @libraries = []
    @library_search_index = {}
    libraries_csv.each do |library_raw_data|
      library =  SnkLibrary.new(library_raw_data)
      @libraries << library
      if(library.street)
        search_key = [library.city, library.street, library.addressnumber]
      else
        search_key = [library.city, library.addressnumber]
      end
      @library_search_index[search_key] = library
    end
  end

  def load_osm_data lib_filter
    matching_libraries = @libraries.select { |library| library.is_matching(lib_filter)}

    puts "filtered to #{matching_libraries.length} libraries before doing osm search"
    oquery = to_overpass_query matching_libraries
    json_osm_response = execute_overpass_query oquery
    json_osm_response['elements'].each do |r|
      if(r['tags']['addr:street'])
        search_key = [r['tags']['addr:city'], r['tags']['addr:street'],r['tags']['addr:streetnumber']]
      else
        search_key = [r['tags']['addr:city'], r['tags']['addr:housenumber']]
      end
      
      snk_library_matching_to_osm_result = @library_search_index[search_key]

      if snk_library_matching_to_osm_result
        snk_library_matching_to_osm_result.add_osm_data r
      end
    end

    puts "paired #{matching_libraries.select {|l| l.osm_match_found?}.size} libraries with osm data"
  end

  def to_osm_change_xml
    xml = <<-STRING
<?xml version="1.0" encoding="UTF-8"?>
      <osmChange version="0.6" generator="Ruby">\n
    STRING
    xml << "\t<create>\n"
    xml << @libraries.map {|l| l.to_osm_change_create_xml}.compact.join("\n")
    xml << "\n\t</create>\n"
    xml << "</osmChange>"

    xml
  end

  def to_html
  end

  private

  def to_overpass_query lib_collection
    overpass_query = "<osm-script bbox=\"47.3793,16.3930,49.8595,23.4572\" output=\"json\">"
    lib_collection.each do |library|
      overpass_query += library.to_overpass_query
    end
    overpass_query += "</osm-script>"
  end

  def execute_overpass_query query
    File.open('./tmp/query.osm', 'w'){|f| f.write query}
    response = `curl -X POST -d @tmp/query.osm http://overpass-api.de/api/interpreter`
    json = JSON.parse response
    puts json
    return json
  end
end 

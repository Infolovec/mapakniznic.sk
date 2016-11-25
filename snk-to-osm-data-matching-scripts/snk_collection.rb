class SnkCollection
  OKRESY_BBOX = {"Bánovce nad Bebravou"=>"48.5316,17.8982,48.9952,18.5395", "Banská Bystrica"=>"48.5189,18.8911,48.9981,19.6045", "Banská Štiavnica"=>"48.2059,18.6506,48.6673,19.1142", "Bardejov"=>"49.0135,20.8865,49.5609,21.6364", "Bratislava I"=>"48.0359,16.9734,48.2745,17.2325", "Bratislava II"=>"47.9538,17.0174,48.2917,17.3845", "Bratislava III"=>"48.0559,16.964,48.3446,17.3316", "Bratislava IV"=>"48.0398,16.8461,48.3635,17.2373", "Bratislava V"=>"47.9067,16.9574,48.2418,17.3418", "Brezno"=>"48.5192,19.2504,49.0472,20.3675", "Bytča"=>"49.014,18.2734,49.4651,18.7422", "Čadca"=>"49.1981,18.2226,49.6194,19.2605", "Detva"=>"48.2829,19.1372,48.7615,19.8213", "Dolný Kubín"=>"49.0366,18.9776,49.433,19.6579", "Dunajská Streda"=>"47.659,17.1474,48.2741,17.9889", "Galanta"=>"47.8604,17.3674,48.4535,17.9845", "Gelnica"=>"48.5674,20.43,49.0647,21.1733", "Hlohovec"=>"48.2222,17.5794,48.6216,18.0647", "Humenné"=>"48.7397,21.6427,49.3041,22.2919", "Ilava"=>"48.796,17.9917,49.2449,18.6071", "Kežmarok"=>"48.9318,20.083,49.5079,20.7423", "Komárno"=>"47.6315,17.6054,48.0863,18.6346", "Košice I"=>"48.6149,21.021,48.9245,21.3996", "Košice II"=>"48.47,21.0215,48.8303,21.3488", "Košice III"=>"48.6135,21.166,48.8858,21.43", "Košice IV"=>"48.5417,21.1115,48.8239,21.4582", "Košice - okolie"=>"48.3911,20.6367,49.0057,21.6788", "Krupina"=>"48.0565,18.6984,48.5407,19.3338", "Kysucké Nové Mesto"=>"49.1475,18.5762,49.4887,19.0304", "Levice"=>"47.832,18.2434,48.5168,19.1721", "Levoča"=>"48.8522,20.34,49.255,21.0028", "Liptovský Mikuláš"=>"48.7968,19.2561,49.3427,20.1604", "Lučenec"=>"48.0535,19.2636,48.6448,20.0426", "Malacky"=>"48.1356,16.7334,48.754,17.4757", "Martin"=>"48.7767,18.5334,49.3181,19.2419", "Medzilaborce"=>"48.9989,21.6856,49.4917,22.2067", "Michalovce"=>"48.3479,21.6148,49.0014,22.2664", "Myjava"=>"48.5266,17.253,48.9467,17.8201", "Námestovo"=>"49.1796,19.0112,49.7138,19.6969", "Nitra"=>"48.0413,17.7334,48.5647,18.5388", "Nové Mesto nad Váhom"=>"48.5114,17.514,49.0264,18.1234", "Nové Zámky"=>"47.6552,17.861,48.3069,18.9561", "Partizánske"=>"48.3857,18.1083,48.8045,18.5979", "Pezinok"=>"48.104,17.0342,48.5561,17.5775", "Piešťany"=>"48.3721,17.457,48.7825,18.0855", "Poltár"=>"48.2622,19.4805,48.7488,20.0275", "Poprad"=>"48.771,19.7839,49.4278,20.5566", "Považská Bystrica"=>"48.8566,18.1481,49.419,18.6996", "Prešov"=>"48.7108,20.7705,49.285,21.5854", "Prievidza"=>"48.4613,18.2271,49.0712,18.9264", "Púchov"=>"48.8708,18.0184,49.3947,18.5375", "Revúca"=>"48.301,19.7858,48.9067,20.5699", "Rimavská Sobota"=>"48.0249,19.628,48.8696,20.5179", "Rožňava"=>"48.3565,20.082,49.0238,20.932", "Ružomberok"=>"48.7559,18.9788,49.2762,19.5611", "Sabinov"=>"48.9208,20.5522,49.3318,21.3267", "Senec"=>"47.9124,17.0874,48.4105,17.6292", "Senica"=>"48.4066,16.8348,48.8879,17.6331", "Skalica"=>"48.571,16.8785,48.9781,17.4992", "Snina"=>"48.7621,21.9162,49.2886,22.6657", "Sobrance"=>"48.4739,21.9574,49.0291,22.4876", "Spišská Nová Ves"=>"48.6889,20.1978,49.1199,21.0211", "Stará Ľubovňa"=>"49.0516,20.3013,49.5205,21.1156", "Stropkov"=>"48.9432,21.4694,49.4631,21.97", "Svidník"=>"48.9642,21.2689,49.5473,21.8715", "Šaľa"=>"47.8629,17.6548,48.3832,18.119", "Topolčany"=>"48.3205,17.7455,48.8144,18.4129", "Trebišov"=>"48.2326,21.4121,48.8941,22.2551", "Trenčín"=>"48.6359,17.7335,49.1693,18.4325", "Trnava"=>"48.1398,17.2022,48.7447,17.858", "Turčianske Teplice"=>"48.6412,18.5938,49.0666,19.1293", "Tvrdošín"=>"49.0978,19.3202,49.5586,19.9228", "Veľký Krtíš"=>"47.9537,18.9133,48.4983,19.6641", "Vranov nad Topľou"=>"48.6626,21.3044,49.2323,21.907", "Zlaté Moravce"=>"48.164,18.0921,48.6486,18.6762", "Zvolen"=>"48.182,18.8729,48.7848,19.5946", "Žarnovica"=>"48.2098,18.3787,48.7331,18.9762", "Žiar nad Hronom"=>"48.3775,18.5454,48.8694,19.1334", "Žilina"=>"48.8371,18.365,49.4643,19.2216"}

  def initialize path_to_csv, lib_filter
    @lib_filter = lib_filter
    raise Error.new('library filter must contain okres') unless @lib_filter[:okres]
    csv = File.read path_to_csv
    libraries_csv = csv.split("\n")[1..-1]
    puts "Loaded #{libraries_csv.length} SNK records"

    @libraries = []
    @library_search_by_address_index = {}
    libraries_csv.each do |library_raw_data|
      library =  SnkLibrary.new(library_raw_data)
      if library.is_matching(lib_filter)
        @libraries << library
        if(library.using_street_addressing)
          address_search_key = [library.city, library.street, library.addressnumber]
        else
          address_search_key = [library.city, library.addressnumber]
        end
        @library_search_by_address_index[address_search_key] = library 
      end
    end
    puts "Filtered to #{@libraries.length} SNK records"
  end

  def load_osm_data
    puts "fetching osm data to match by address"
    osm_results_for_address_search = JSON.parse execute_overpass_query(overpass_query_to_match_snk_libraries)

    osm_results_for_address_search['elements'].each do |r|
      if(r['tags']['addr:street'])
        search_key = [r['tags']['addr:city'], r['tags']['addr:street'],r['tags']['addr:streetnumber']]
      else
        search_key = [r['tags']['addr:city'], r['tags']['addr:housenumber']]
      end
      
      snk_library_matching_to_osm_result = @library_search_by_address_index[search_key]

      if snk_library_matching_to_osm_result
        snk_library_matching_to_osm_result.add_osm_data_from_address_search r
      end
    end
    puts "enhanced #{@libraries.select {|l| l.osm_address_found?}.size} SNK libraries with osm data based on address search"

    puts "fetching all amenity:library osm data for given bbox"
    all_amenity_libraries = JSON.parse execute_overpass_query(overpass_query_to_find_all_amenity_libraries)

    @unmatched_osm_libraries = []
    all_amenity_libraries['elements'].each do |r|
      name = r['tags']['name']
      matching_snk_libraries = @libraries.select {|l| l.name == name}  
      matching_snk_libraries.each {|l| l.add_osm_data_from_name_search r}

      if matching_snk_libraries.length == 0
        @unmatched_osm_libraries << r
      end
    end

    c1 = all_amenity_libraries['elements'].length
    c2 = @unmatched_osm_libraries.length
    puts "found #{c1} amenity:library records in OSM"
    puts "#{c1 - c2} of them were matched by name to SNK libraries"
  end

  def to_osm_unmatched_amenity_libraries
    xml = '<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="CGImap 0.0.2">'
    
    @unmatched_osm_libraries.each do |osm_hash|
      if(osm_hash['type'] == 'node')
        xml << "<node id=\"#{osm_hash['id']}\" version=\"#{osm_hash['version']}\"></node>"
      else
        xml << "<way id=\"#{osm_hash['id']}\" version=\"#{osm_hash['version']}\"></way>"
      end
    end

    xml << "</osm>"
    xml
  end

  def to_osc_create_xml
    xml = <<-STRING
<?xml version="1.0" encoding="UTF-8"?>
      <osmChange version="0.6" generator="Ruby">\n
    STRING
    xml << "\t<create>\n"
    xml << @libraries.map {|l| l.to_osc_create_xml}.compact.join("\n")
    xml << "\n\t</create>\n"
    xml << "</osmChange>"

    xml
  end

  def to_osc_modify_xml
    xml = <<-STRING
<?xml version="1.0" encoding="UTF-8"?>
      <osmChange version="0.6" generator="Ruby">\n
    STRING
    xml << "\t<modify>\n"
    xml << @libraries.map {|l| l.to_osc_modify_xml}.compact.join("\n")
    xml << "\n\t</modify>\n"
    xml << "</osmChange>"

    xml
  end

  def to_html
    html = <<-STRING
    <html>
    <style>
      table {
          font-family: sans-serif;
      }
      table tr td {
          padding: 3px;
          border: 1px solid grey;
      }
    </style>
    SNK libraries filtered by #{@lib_filter}
    <table>
    STRING
    html << @libraries.map {|l| l.to_html}.join("\n")
    html += "<table></html>"
    html
  end

  private

  def overpass_query_to_find_all_amenity_libraries
    bbox = OKRESY_BBOX[@lib_filter[:okres]]
    raise Error.new("no bbox for okres #{@lib_filter[:okres]}") unless bbox
    <<-STRING
      <osm-script bbox="#{bbox}" output=\"json\">
        <query type="node">
          <has-kv k="amenity" v="library"/>
        </query>
        <print mode="meta"/>
        <query type="way">
          <has-kv k="amenity" v="library"/>
        </query>
        <print mode="meta" />
      </osm-script>
    STRING
  end

  def overpass_query_to_match_snk_libraries
    bbox = OKRESY_BBOX[@lib_filter[:okres]]
    raise Error.new("no bbox for okres #{@lib_filter[:okres]}") unless bbox
    overpass_query = "<osm-script bbox=\"#{bbox}\" output=\"json\">"
    @libraries.each do |library|
      overpass_query += library.to_overpass_query
    end
    overpass_query += "</osm-script>"
  end

  def execute_overpass_query query
    File.open('./tmp/query.osm', 'w'){|f| f.write query}
    `curl -X POST -d @tmp/query.osm http://overpass-api.de/api/interpreter`
  end
end 

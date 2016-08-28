task :release do
  html = File.read './www/index-dev.html'
  now = Time.now.to_i

  html2 = html.gsub('?version', "?version=#{now}")
  File.open('./www/index.html', 'wb'){|f| f.write html2}

  puts 'www/index.html successfully refreshed'
end

task :'data' do
  require 'uri'
  require 'json'

  # https://docs.google.com/spreadsheets/d/1DM8i_Rx0ZzmVN6VaJA1et8ZQsSghIx7fZj2iy93j3zI/edit#gid=1209775770

  library_nodes = []
  library_ways = []
  library_relations = []

  osm_url_to_library_type = {}
  l = File.read './data/libraries.txt'
  l.split("\n").each do |line|
    library_url, library_type = line.split"\t"
    _, _, _, osm_type, osm_id = library_url.split('/')
    library_ways << osm_id if osm_type == 'way'
    library_nodes << osm_id if osm_type == 'node'
    library_relations << osm_id if osm_type == 'relation'
    osm_url_to_library_type["#{osm_type}/#{osm_id}"] = library_type
  end

  request_xml = '<osm-script output="json">'
  library_ways.each do |wid|
    request_xml += "<id-query ref=\"#{wid}\" type=\"way\"/><print geometry=\"center\"/>"
  end
  library_relations.each do |rid|
    request_xml += "<id-query ref=\"#{rid}\" type=\"relation\"/><print geometry=\"center\"/>"
  end
  library_nodes.each do |nid|
    request_xml += "<id-query ref=\"#{nid}\" type=\"node\"/><print/>"
  end

  request_xml += '</osm-script>'

  request_url = URI.escape('http://api.openstreetmap.fr/oapi/interpreter?data=' + request_xml)
  json_response = `curl #{request_url}`

  libraries1 = JSON.parse json_response
  libraries2 = []
  libraries1['elements'].each do |lib|
    lib['library_type'] = osm_url_to_library_type["#{lib['type']}/#{lib['id']}"]
    libraries2 << lib 
  end

  libraries_service_js = File.read './www/js/services/raw_libraries_data_service.template.js'
  libraries_service_js.sub! 'DATA', libraries2.to_json
  File.open('./www/js/services/raw_libraries_data_service.js', 'w') {|f| f.write libraries_service_js}

  puts 'services/libraries_service.js successfully updated'
end
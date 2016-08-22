require 'uri'
require 'json'

# https://docs.google.com/spreadsheets/d/1DM8i_Rx0ZzmVN6VaJA1et8ZQsSghIx7fZj2iy93j3zI/edit#gid=1209775770

library_nodes = []
library_ways = []
library_relations = []

l = File.read './libraries.txt'
l.split("\n").each do |line|
  library_url, library_type = line.split"\t"
  _, _, _, osm_type, osm_id = library_url.split('/')
  library_ways << osm_id if osm_type == 'way'
  library_nodes << osm_id if osm_type == 'node'
  library_relations << osm_id if osm_type == 'relation'
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
libraries2 = libraries1['elements']

libraries_service_js = File.read '../www/js/services/libraries_service.template.js'
libraries_service_js.sub! 'DATA', libraries2.to_json
File.open('../www/js/services/libraries_service.js', 'w') {|f| f.write libraries_service_js}
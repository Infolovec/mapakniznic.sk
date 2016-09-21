require 'uri'
require 'json'
require 'hashdiff'
require 'i18n'
require 'fileutils'

I18n.config.available_locales = :en

task :release do
  html = File.read './www/index-dev.html'
  now = Time.now.to_i

  html2 = html.gsub('?version', "?version=#{now}")
  File.open('./www/index.html', 'wb'){|f| f.write html2}

  $stdout << "rake release: www/index.html successfully refreshed\n"

  Rake::Task["sitemap"].execute
end

task :'update-data' do
  begin
    # https://docs.google.com/spreadsheets/d/1DM8i_Rx0ZzmVN6VaJA1et8ZQsSghIx7fZj2iy93j3zI/edit#gid=1209775770

    $stdout << "#{Time.now} running data update \n"
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

    request_url = URI.escape('http://overpass-api.de/api/interpreter?data=' + request_xml)
    json_response = `curl #{request_url}`

    libraries1 = JSON.parse json_response
    libraries2 = []
    libraries1['elements'].each do |lib|
      lib['library_type'] = osm_url_to_library_type["#{lib['type']}/#{lib['id']}"]
      lib['url_id'] = "#{lib['type'][0]}#{lib['id']}"
      lib['url_name'] = I18n.transliterate(lib['tags']['name']).downcase.gsub(/[^a-z0-9]/,'-').gsub(/(-)+/,'-')
      libraries2 << lib 
    end

    libraries_service_js = File.read './www/js/services/raw_libraries_data_service.template.js'
    libraries_service_js.sub! 'DATA', libraries2.to_json

    if(File.exists?('./www/for_bots/libraries.json'))
      FileUtils.cp './www/for_bots/libraries.json', './www/for_bots/libraries.json.old'
    end
    File.open('./www/for_bots/libraries.json', 'w'){|f| f.write libraries2.to_json}

    v1 = File.read './www/js/services/raw_libraries_data_service.js'
    v2 = libraries_service_js

    if(v1 == v2)
      $stdout << "OSM data not changed \n"
    else 
      $stdout << "OSM data has changed: services/libraries_service.js updated \n"
      File.open('./www/js/services/raw_libraries_data_service.js', 'w') {|f| f.write libraries_service_js}
      Rake::Task["release"].execute
      Rake::Task["changelog"].execute
    end
  rescue => e
    $stdout << "update data task failed due to #{e}\n"
    $stdout << e.backtrace
    $stdout << "\n"
  end
  STDOUT.flush
end

task 'update-data-periodically' do
  while true do
    Rake::Task["update-data"].execute
    sleep 5*60
  end
end

# /etc/supervisor/conf.d/mapakniznic.sk.data-update.conf 
# [program:mapakniznic.sk-data-update]
# command=rake update-data-periodically
# autostart=true
# autorestart=true
# startsecs=1
# startretries=1
# user=USER
# directory=/home/USER/repos/mapakniznic.sk
# environment=LANG="en_US.UTF-8",LANGUAGE="en_US.UTF-8",LC_ALL="en_US.UTF-8"
# logfile_maxbytes=1000000
# logfile_backups=3
# redirect_stderr=true

task :sitemap do  
  libraries  = JSON.parse File.read('./www/for_bots/libraries.json')
  sitemap = libraries.collect do |library|
    library_url = library['url_id']
    "https://mapakniznic.sk/#{library_url}"
  end.join("\n")

  File.open('./www/sitemap.txt', 'w'){|f| f.write sitemap}
  $stdout << "www/sitemap.txt written\n"

  static_libpage_template = File.read './www/for_bots/page.template.html'
  libraries.each do |library|
    page = static_libpage_template.clone
    title ="#{ library['tags']['name']} | mapakniznic.sk"
    page.gsub! 'TITLE', title
    desc = "#{library['tags']['addr:street']} "
    if library['tags']['addr:streetnumber']
      desc << library['tags']['addr:streetnumber']
    end
    desc << ', Bratislava. '

    page.gsub! 'DESCRIPTION', desc

    File.open("./www/for_bots/#{library['url_id']}.html", 'w'){|f| f.write page}
  end

  puts "static html pages written to www/for_bots/"
end

task :changelog do
  h_old = JSON.parse File.read('./www/for_bots/libraries.json.old')
  h_new = JSON.parse File.read('./www/for_bots/libraries.json')

  changelog_path = './www/for_bots/changelog.txt'
  if File.exists?(changelog_path)
    current_changelog = File.read(changelog_path)
  else
    current_changelog = ''
  end

  diffs = HashDiff.diff(h_old, h_new)

  File.open(changelog_path, 'w') do |f|
    f.puts "====== #{Time.now} ======="

    diffs.each do |diff|
      library_order_id = diff[1].match(/\d+/)[0].to_i
      if library_order_id
        lib = h_new[library_order_id]
        if lib
          f.puts "https://mapakniznic.sk/#{lib['url_name']}\n"
        end
      end

      f.puts diff
    end

    f.puts "\n"
    f.write current_changelog
  end

  $stdout << "updated changelog ./www/for_bots/changelog.txt \n"
  STDOUT.flush
end
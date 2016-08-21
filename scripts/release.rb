html = File.read './www/index-dev.html'
now = Time.now.to_i

html2 = html.gsub('?version', "?version=#{now}")
File.open('./www/index.html', 'wb'){|f| f.write html2}
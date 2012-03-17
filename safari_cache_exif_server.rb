#!/usr/bin/env ruby

require "rubygems"
require "active_record"
require "webrick"

SAFARI_CACHE_DB_FILE = "#{ENV["HOME"]}/Library/Caches/com.apple.Safari/Cache.db"

ActiveRecord::Base.establish_connection(
		:adapter => "sqlite3",
		:database => SAFARI_CACHE_DB_FILE,
		:timeout => 10000,
		:pool => 5
	)

class CfurlCacheResponse < ActiveRecord::Base
	set_table_name :cfurl_cache_response
end	

class CfurlCacheReceiverData < ActiveRecord::Base
	set_table_name :cfurl_cache_receiver_data
end

include WEBrick
server = HTTPServer.new :Port => 2345
server.mount_proc "/exif" do |req, res|
	file_url = req.query["url"]
	puts file_url
	entry_ID = CfurlCacheResponse.where(:request_key => file_url).first.entry_ID
	receiver_data = CfurlCacheReceiverData.where(:entry_ID => entry_ID).first	
	receiver_data = receiver_data.receiver_data
	exif_tool = IO.popen("exiftool - ", "w+")
	exif_tool.print receiver_data
	exif_tool.close_write
	exif_lines = []
	exif_tool.each_line do |line|

		line.gsub!(/[^\x0-\x7F]/, "")
		line.sub!(/^Camera Model Name\s*?:/, "01相机")
		line.sub!(/^Lens\s*?:/, "02镜头:")
		line.sub!(/^Exposure Time\s*?:/, "03曝光时间:")
		line.sub!(/^Exposure Mode\s*?:/, "04曝光模式:")
		line.sub!(/^Metering Mode\s*?:/, "05测光模式:")
		line.sub!(/^Flash\s*?:/, "06闪光灯:")
		line.sub!(/^F Number\s*?:/, "07光圈值:")
		line.sub!(/^Focal Length\s*?:/, "08焦距:")
		line.sub!(/^ISO\s*?:/, "09ISO:")
		line.sub!(/^AE Setting\s*?:/, "10曝光补偿:")
		line.sub!(/^White Balance\s*?:/, "11白平衡:")
		line.sub!(/^Software\s*?:/, "12软件:")
		line.sub!(/^Date\/Time Original\s*?:/, "13时间:")
		line.sub!(/^Image Size\s*?:/, "14尺寸")

		exif_lines << line if line =~ /^\d\d/
	end
	exif_lines = exif_lines.sort
	exif_lines.each {|line| line.sub!(/^\d\d/, "")}
	res.body = exif_lines.join("\n") 
	puts res.body
end

['INT', 'TERM'].each {|signal| 
    trap(signal) {server.shutdown}
  }
server.start
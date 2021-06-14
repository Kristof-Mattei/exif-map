require 'pry'
require 'exifr'
require 'csv'

binding.pry

throw "no photos environment variable provided. Please use PHOTOS=<some path>" unless ENV['PHOTOS']
starting_path = ENV['PHOTOS']
output_path = File.expand_path("#{File.dirname(__FILE__)}/../app/data/exif.csv")

def find_files(path)
  arr = []
  arr << Dir.glob("#{path}**/*.{jpg,jpeg}", File::FNM_CASEFOLD)
  Dir.glob("#{path}**/*/").each do |p|
    arr << find_files(p)
  end
  arr.flatten
end

CSV.open(output_path, "wb") do |csv|
  csv << ["file", "lat", "lon"]
  find_files(starting_path).each do |file|
    data = EXIFR::JPEG.new(file)
    if data && data.gps
      csv << [file.split('/').last, data.gps.latitude, data.gps.longitude]
    end
  end
end

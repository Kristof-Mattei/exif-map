require 'pry'
require 'exifr'
require 'csv'

file = '/Users/heavysixer/Pictures/Photos Library.photoslibrary/Originals/2016/01/06/20160106-154805/BWJT9341.jpg'
starting_path = '/Users/heavysixer/Pictures/Photos Library.photoslibrary/Originals/2016/'
output_path = File.expand_path("#{File.dirname(__FILE__)}/../app/data/exif.csv")

def find_files(path)
  arr = []
  arr << Dir.glob("#{path}**/*.jpg", File::FNM_CASEFOLD)
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


# data = EXIFR::JPEG.new(file)

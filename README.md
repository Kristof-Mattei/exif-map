Plotting picture locations to a map with D3 and exif data.

![Screenshot Example](/app/images/example.png?raw=true "Example")

Bootstrapping the local server
```bash
bower install && npm install
```

One this completes you should be able to start the server like this:

```bash
gulp serve
```

Your server should now be running on port 9000, and you should be able to visit it in a browser here:
[http://localhost:9000/](http://localhost:9000/)

You will now see circles plotted against a map. These circles are generated using the values stored in
`app/data/exif.csv`

To generate the exif data from your own photos follow these steps.

1. Install Ruby 2.3.0

2. Install dependencies
```bash
bundle install
```
3. From the root of the application run:
```bash
PHOTOS='/Users/heavysixer/Pictures/Photos Library.photoslibrary/Originals/2016/' ruby lib/exif.rb
```

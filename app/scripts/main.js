(function () {
  'use strict';
  console.log('bar');
  var renderChart = function () {
    var width = 960,
      height = 900;

    var projection = d3.geo.berghaus()
      .rotate([20, -90])
      .clipAngle(180 - 1e-3)
      .scale(155)
      .translate([width / 2, height * 0.55])
      .precision(0.1);

    var path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    var defs = svg.append("defs");

    defs.append("path")
      .datum({
        type: "Sphere"
      })
      .attr("id", "sphere")
      .attr("d", path);

    defs.append("clipPath")
      .attr("id", "clip")
      .append("use")
      .attr("xlink:href", "#sphere");

    svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

    svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");

    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("clip-path", "url(#clip)")
      .attr("d", path);

    d3.json("/data/world-110m.json", function (error, world) {
      if (error) throw error;

      svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("clip-path", "url(#clip)")
        .attr("d", path);

      svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
          return a !== b;
        }))
        .attr("class", "boundary")
        .attr("clip-path", "url(#clip)")
        .attr("d", path);

      d3.csv("/data/exif.csv", function (exifData) {
        svg.selectAll("circles.points")
          .data(exifData)
          .enter()
          .append("circle")
          .attr("r", 5)
          .attr("transform", function (d) {
            return "translate(" + projection([d.lon, d.lat]) + ")";
          });
      });
    });
  };
  renderChart();
})();
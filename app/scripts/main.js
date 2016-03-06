(function () {
  'use strict';
  var renderUs = function () {
    var width = 960,
      height = 500;

    var projection = d3.geo.conicConformal()
      .rotate([98, 0])
      .center([0, 38])
      .parallels([29.5, 45.5])
      .scale(1000)
      .translate([width / 2, height / 2])
      .precision(0.1);

    var path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule()
      .extent([
        [-98 - 45, 38 - 45],
        [-98 + 45, 38 + 45]
      ])
      .step([5, 5]);

    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

    d3.json("/data/us.json", function (error, us) {
      if (error) throw error;

      svg.insert("path", ".graticule")
        .datum(topojson.feature(us, us.objects.land))
        .attr("class", "land")
        .attr("d", path);

      svg.insert("path", ".graticule")
        .datum(topojson.mesh(us, us.objects.counties, function (a, b) {
          return a !== b && !(a.id / 1000 ^ b.id / 1000);
        }))
        .attr("class", "county-boundary")
        .attr("d", path);

      svg.insert("path", ".graticule")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) {
          return a !== b;
        }))
        .attr("class", "state-boundary")
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
  var renderGlobe = function () {
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
  renderGlobe();
  renderUs();
})();
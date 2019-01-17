/*
Name: Thomas Reus
Student number: 11150041
Assignment: linked views D3

Creates the legend
*/


function makeLegend() {
  /*
  Makes legend for different occupancies
  */

  // select svg
  var svg = d3.select("#legendSvg");

  // get width and height of svg
  var svgSize = document.getElementById("legendSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // make scale (2 x 4, so slice 0, 4)
  var ord = d3.scaleOrdinal()
              .domain(Object.keys(occupancyColors).slice(0, 4))
              .range(Object.values(occupancyColors).slice(0, 4));

  svg.append("g")
     .attr("class", "legendOrdinal")
     .attr("transform", "translate(" + [width / 4, height / 8] + ")");

  var legOrd = d3.legendColor()
                 .shape("path", d3.symbol().type(d3.symbolSquare).size(120)())
                 .shapePadding(10)
                 .scale(ord);

  // draw legend
  svg.select(".legendOrdinal")
     .call(legOrd);

  // make scale (2 x 4, so slice 4, 8)
  var ord = d3.scaleOrdinal()
             .domain(Object.keys(occupancyColors).slice(4, 8))
             .range(Object.values(occupancyColors).slice(4, 8));

  svg.append("g")
    .attr("class", "legendOrdinal2")
    .attr("transform", "translate(" + [width / 2, height / 8] + ")");

  var legOrd = d3.legendColor()
                .shape("path", d3.symbol().type(d3.symbolSquare).size(120)())
                .shapePadding(10)
                .scale(ord);

  // draw legend
  svg.select(".legendOrdinal2")
    .call(legOrd);
};

function descriptionFunction(input) {
  return "information about: " + input;
};

/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: interactive map of the Netherlands
*/

function mapNetherlands() {

  // make svg secondary chart
  svgMap = d3.select("#mainSvg")
             .append("svg")
             .attr("id", "mapSvg")
             // .attr("x", 10)
             // .attr("y", 10)
             .attr("width", 400)
             .attr("height", 400);

   d3.select('#mainSvg').select('#mapSvg').append('rect')
     .attr("fill", 'red')
     .attr("width", 400)
     .attr("height", 400);
};

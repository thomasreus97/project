/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: stacked barchart
*/

function stackedBarChart() {

  svgPie = d3.select("#mainSvg")
             .append("svg")
             .attr("id", "pieSvg")
             .attr("x", 0)
             .attr("y", 400)
             .attr("width", 400)
             .attr("height", 400);

   d3.select('#mainSvg').select('#pieSvg').append('rect')
     .attr("fill", 'green')
     .attr("width", 400)
     .attr("height", 400);
};

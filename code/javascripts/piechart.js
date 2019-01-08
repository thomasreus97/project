/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: pieChart
*/

function pieChart() {

  //
  // svgStackedBar = d3.select("#mainSvg")
  //                   .append("svg")
  //                   .attr("id", "stackedSvg")
  //                   .attr("x", 510)
  //                   .attr("y", 10)
  //                   .attr("width", 480)
  //                   .attr("height", 480);

  d3.select('#mainSvg').append("select")
                       .attr("class", "btn btn-primary dropdown-toggle")
                       .attr("x", 400)
                       .attr("y", 0);
};

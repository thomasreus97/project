/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates:
*/

window.onload = function() {
  /*
  Create global variables and
  load data in from a json file
  */

  // parameters plot
  margin = {
    left: 60,
    right: 120,
    top: 50,
    bottom: 130
  };
  param = {
    height: 250,
    width: 1000,
    radius: 125
  };

  // make svg primary chart
  mainSvg = d3.select("body")
              .append("div")
              .attr("id", "mainSvg")
              .style("position", "absolute")
              .style("left", 0)
              .style("right", 0)
              .style("margin-left", "auto")
              .style("margin-right", "auto")
              .style("width", "800px")
              .style("height", "800px");

  // import the json file then start main function
  d3.json("data/Bodemgebruik_data.json").then(function(response) {
    main(response);
  });
};


function main(response) {
  /*
  Function that calls and does everything
  that has to be done create the entire
  visualisation
  */

  for (i in response) {
    console.log(i)
  }



  // create visualisations
  mapNetherlands()
  stackedBarChart()
  pieChart()



};

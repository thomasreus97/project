/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates:
*/


window.onload = function() {
  /*
  Define variables:
  - colors, occupations, tooltip
  load data in from a json file
  start main function
  */

  // parameters plot
  margin = 100
  param = {
    height: 400,
    width: 400,
    radius: 200
  };

  // color list for different occupations
  occupancyColors = {"Traffic": '#808080',
                     "Built": '#ff0000',
                     "Semi-built": '#FFA500',
                     "Recreation": '#ffff00',
                     "Agricultural": '#8B4513',
                     "Forest & Nature": '#12820e',
                     "Water": '#0000FF',
                     "Undefined": "White"};

  // "global" occupancys list
  globalOccupancies = ["Total", "Traffic", "Built", "Semi-built",
                       "Recreation", "Agricultural", "Forest & Nature",
                       "Water", "Undefined"];

  indentifiers = [
    "NL-GR", "NL-FR", "NL-DR", "NL-OV", "NL-FL", "NL-GE",
    "NL-UT", "NL-NH", "NL-ZH", "NL-ZE", "NL-NB", "NL-LI"
  ];

  colorScales = {"Traffic": ['#d8d8d8', '#808080'],
                 "Built": ['#ffb2b2', '#ff0000'],
                 "Semi-built": ['#ffe4b2', '#FFA500'],
                 "Recreation": ['#ffffcc', '#ffff00'],
                 "Agricultural": ['#DEB887', '#8B4513'],
                 "Forest & Nature": ['#57ff51', '#12820e'],
                 "Water": ['#70a1ef', '#0000FF']};

  // tooltip
  tooltip = d3.select("body")
              .append("div")
              .style("position", "fixed")
              .style("text-align", "center")
              .style("width", "80px")
              .style("height", "30px")
              .style("visibility", "hidden")
              .style("border", "2px solid #e6550d")
              .style("background", "#3182bd")
              .style("border-radius", "5px")
              .style("line-height", "30px")
              .style("color", "white");

  // import the json file then start main function
  d3.json("data/Bodemgebruik_data.json").then(function(response) {
    main(response);
  });
};


function main(data) {
  /*
  Function that calls and does everything
  that has to be done create the entire
  visualisation
  */

  // start year, occupancy and name
  var year = 1950;
  var occupancy = "Traffic";
  var name = "Nederland";

  // create div and svg layout
  layoutMaker();

  // parse the data into another format
  var newData = dataParser(data);

  // assign data ranges to buttons
  buttonFixer(newData);
  sliderText(year);

  // create visualisations
  mapNetherlands(newData, year, occupancy);
  piechart(newData, name, year);
  stackedBarChart();

};


function layoutMaker(){
  /*
  Creates all div's and svg's for
  the layout of the visualisations.
  Adds buttons.
  */

  // main div
  d3.select("body")
    .append("div")
    .attr("id", "mainDiv")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("width", 4 * margin + 2 * param.width + "px")
    .style("height", 2 * margin + param.height + "px");

  // map div
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "mapDiv")
    .style("position", "absolute")
    .style("width", margin + param.width + "px")
    .style("height", 2 * margin + param.height + "px");

  // piechart svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "pieSvg")
    .style("position", "absolute")
    .style("right", margin + "px")
    .style("width", 2 * margin + param.width + "px")
    .style("height", 2 * margin + param.height + "px");

  // selection dropdown for provinces
  d3.select("#mainDiv")
    .append("select")
    .attr("id", "provinceDropdown")
    .attr("class", "btn btn-primary dropdown-toggle");

  // create slider and text with value of slider for year selection
  d3.select("#mainDiv")
    .append("input")
    .attr("id", "sliderYear")
    .attr("type", "range")
    .attr("class", "custom-range")
    .style("width", "200px")
    .style("position", "absolute")
    .style("left", margin + "px")
    .style("bottom", "0px");
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "sliderValue")
    .text("Year:");

  // selection dropdown occupancy
  d3.select("#mainDiv")
    .append("select")
    .attr("id", "occupancyDropdown")
    .attr("class", "btn btn-primary dropdown-toggle");
};


function dataParser(data) {
  /*
  Put all sub-occupations into their "global" occupation
  */

  // iterate through the data and add them into the correct global occupation
  var newData = {};
  for (var province in data) {
    newData[province] = {};
    for (var year in data[province]) {
      newData[province][year] = {};
      var currOcc = "";
      var counter = 0;
      var sumValue = Number.NaN;
      var totalSum = 0;
      for (var occupancy in data[province][year]) {
        var value = data[province][year][occupancy];
        occupancy = occupancy.split("/")[0];

        // if first occupancy define currOcc and total value
        if (currOcc === "") {
          currOcc = occupancy;
          var total = parseInt(value);
        }

        // if new occupancy add summed value to lists
        else if (currOcc !== occupancy) {
          newData[province][year][globalOccupancies[counter]] = sumValue;
          if (sumValue) {
            totalSum += sumValue;
          };
          counter += 1;
          sumValue = Number.NaN;
          currOcc = occupancy;
        };

        // add value to sum
        if (value !== ".") {
          if (sumValue) {
            sumValue += parseInt(value);
          }
          else {
            sumValue = parseInt(value);
          };
        };
      };

      // add last round
      newData[province][year][globalOccupancies[counter]] = sumValue;
      if (sumValue) {
        totalSum += sumValue;
      };
      counter += 1;

      // calculate and add "Undefined"
      if (totalSum === 0) {
        newData[province][year][globalOccupancies[counter]] = 0;
      }
      else {
        newData[province][year][globalOccupancies[counter]] = (2 * total -
                                                               totalSum);
      };
    };
  };

  return (newData);
};


function buttonFixer(data) {
  /*
  Add province names to dropdown
  Add year range to year slider
  */

  // get all years, occupancies and provinces
  var provinces = Object.keys(data);
  var years = Object.keys(data[provinces[0]]);
  var occupancies = globalOccupancies;
  occupancies.pop();
  occupancies.shift();

  // create slider and select
  var slider = d3.select("#sliderYear");
  var provinceDrop = d3.select("#provinceDropdown");
  var occupancyDrop = d3.select('#occupancyDropdown');

  // add functionality to slider
  slider.attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("step", "1");

  // add provinces to dropdown
  provinceDrop.selectAll("option")
              .data(provinces)
              .enter()
              .append("option")
              .text(function (d) {
                return d;
              });

  // add occupancies to dropdow
  occupancyDrop.selectAll("option")
               .data(occupancies)
               .enter()
               .append("option")
               .text(function (d) {
                 return d;
               });

  // add interactivity to occupancy dropdown
  occupancyDrop.on("input", function() {
      var chosenYear = slider.property("value");
      mapNetherlands(data, chosenYear, this.value);
    });

  // add interactivity to year slider
  slider.on("input", function(){
          sliderText(this.value);
          var chosenProvince = provinceDrop.property("value");
          var chosenOccupancy = occupancyDrop.property("value");
          pieUpdate(data, chosenProvince, this.value);
          mapNetherlands(data, this.value, chosenOccupancy);
        });

  // add interactivity to the select
  provinceDrop.on("input", function() {
      var chosenYear = slider.property("value");
      pieUpdate(data, this.value, chosenYear);
    });

};


function sliderText(sliderYear) {
  /* Shows current year */
  var sliderValue = document.getElementById("sliderValue");
  sliderValue.innerHTML = "Year: " + sliderYear;
};

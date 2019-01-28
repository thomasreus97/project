/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Main javascript
- Loads and parses the data
- Defines:
important variables, the div/svg layout,
the buttons and their functionalities, a tooltip
- Creates (the first):
map, legend, barchart and piechart.
*/

window.onload = function() {
  /*
  After running all scripts in the html:
  - Defines variables:
  margins, main occupancy colors, occupancies,
  map indentifiers, tooltip and colorscales for map.
  - loads data in from a json file and
  starts main function.
  */

  // parameters plot
  margin = 100
  param = {
    height: 600,
    width: 400,
    radius: 200,
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

  // occupancies list
  var globalOccupancies = ["Total", "Traffic", "Built", "Semi-built",
                           "Recreation", "Agricultural", "Forest & Nature",
                           "Water", "Undefined"];

  indentifiers = [
    "NL-GR", "NL-FR", "NL-DR", "NL-OV", "NL-FL", "NL-GE",
    "NL-UT", "NL-NH", "NL-ZH", "NL-ZE", "NL-NB", "NL-LI",
  ];

  colorScales = {"Traffic": ['#d8d8d8', '#808080'],
                 "Built": ['#ffb2b2', '#ff0000'],
                 "Semi-built": ['#ffe4b2', '#FFA500'],
                 "Recreation": ['#f3f772', '#a5a90e'],
                 "Agricultural": ['#DEB887', '#8B4513'],
                 "Forest & Nature": ['#57ff51', '#12820e'],
                 "Water": ['#70a1ef', '#0000FF']};

  // tooltip
  var toolTip = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");


  // import the json file then start main function
  d3.json("data/Bodemgebruik_data.json").then(function(response) {
    main(response, globalOccupancies);
  });
};


function main(data, globalOccupancies) {
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
  var newData = dataParser(data, globalOccupancies);

  // make legend
  var currentOccupancies = makeLegend(newData, globalOccupancies);

  // assign data ranges to buttons
  buttonFixer(newData, globalOccupancies, currentOccupancies);
  sliderText(year);

  // create visualisations
  currentOccupancy = occupancy;
  mapNetherlands(newData, year, currentOccupancy, currentOccupancies);
  pieUpdate(newData, name, year, currentOccupancies, false, false);
  stackedBarChart(newData, year, currentOccupancies);
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
    .style("position", "relative")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("top", "200px")
    .style("height", param.height + margin + "px")
    .style("width", "100%");

  // map div
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "mapDiv")
    .style("position", "absolute")
    .style("left", "3%")
    .style("top", "10%")
    .style("width", "30%")
    .style("height", "85%");

  // piechart svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "pieSvg")
    .style("position", "absolute")
    .style("left", "34.5%")
    .style("width", "30%")
    .style("height", "60%");

  // legend svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "legendSvg")
    .style("position", "absolute")
    .style("left", "34.5%")
    .style("width", "30%")
    .style("height", "40%")
    .style("bottom", "0px");

  // title map div
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "mapTitle")
    .style("position", "absolute")
    .style("width", "30%")
    .style("top", margin / 3 + "px")
    .style("text-align", "left")
    .style("left", 2 * margin / 3 + "px");

  // stacked barchart svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "barSvg")
    .style("position", "absolute")
    .style("left", "64.5%")
    .style("width", "34%")
    .style("height", "95%");

  // dropdown provinces
  d3.select(".topnav")
    .append("div")
    .attr("id", "buttonBox")
    .append("select")
    .attr("id", "provinceDropdown")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .style("width", 1.5 * margin + "px");

  // selection dropdown occupancy
  d3.select("#buttonBox")
    .append("select")
    .attr("id", "occupancyDropdown")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .style("width", 1.5 * margin + "px");

  // create year value
  d3.select(".topnav")
    .append("div")
    .attr("id", "sliderDiv")
    .append("span")
    .attr("id", "sliderValue")
    .text("Year:");

  // create slider bar
  d3.select("#sliderDiv")
    .append("input")
    .attr("id", "sliderYear")
    .attr("type", "range")
    .attr("class", "custom-range");

  // div for error message map
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "errorDiv")
    .attr("width", param.width)
    .style("position", "absolute")
    .style("left", "14%")
    .style("top", document.getElementById('mainDiv').clientHeight / 2 + "px");
};


function dataParser(data, globalOccupancies) {
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
        if (value !== "." && value !== "") {
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


function buttonFixer(data, globalOccupancies, currentOccupancies) {
  /*
  Add province names to dropdown
  Add year range to year slider
  */

  // get all years, occupancies and provinces
  var provinces = Object.keys(data);
  var years = Object.keys(data[provinces[0]]);
  var occupancies = globalOccupancies.slice();
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
    var chosenProvince = provinceDrop.property("value");
    currentOccupancy = this.value;
    updateMap(data, chosenYear, currentOccupancy, currentOccupancies);
    updateBar(data, chosenYear, currentOccupancies);
    pieUpdate(data, chosenProvince, chosenYear, currentOccupancies, true);
  });

  // add interactivity to year slider
  slider.on("input", function() {
          sliderText(this.value);
          var chosenProvince = provinceDrop.property("value");
          pieUpdate(data, chosenProvince, this.value, currentOccupancies, true);
          yearUpdateMap(data, this.value, currentOccupancy, currentOccupancies);
          updateBar(data, this.value, currentOccupancies);
          d3.select("#barchartTitle")
            .text("Distribution of occupancies per province in " + this.value);
        });

  // add interactivity to the select
  provinceDrop.on("input", function() {
                var chosenYear = slider.property("value");
                pieUpdate(data, this.value, chosenYear, currentOccupancies, true);
              });
};


function sliderText(sliderYear) {
  /* Shows current year */
  var sliderValue = document.getElementById("sliderValue");
  sliderValue.innerHTML = "Year: " + sliderYear;
};

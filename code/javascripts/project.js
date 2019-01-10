/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates:
*/


window.onload = function() {
  /*
  Define a few variables and
  load data in from a json file
  */

  // parameters plot
  margin = 100
  param = {
    height: 400,
    width: 400,
    radius: 200
  };

  // color list for different occupations
  occupationColors = {"Traffic": 'grey',
                      "Built": 'red',
                      "Semi-built": 'orange',
                      "Recreation": 'yellow',
                      "Agricultural": 'brown',
                      "Forest & Nature": 'green',
                      "Water": 'blue',
                      "Undefined": 'white'};

  // "global" occupations list
  globalOccupations = ["Total", "Traffic", "Built", "Semi-built",
                       "Recreation", "Agricultural", "Forest & Nature",
                       "Water", "Undefined"];

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

  // create div and svg layout
  layoutMaker();

  // parse the data into another format
  var newData = dataParser(data);

  // assign data ranges to buttons
  buttonFixer(newData);

  // create visualisations
  mapNetherlands();
  piechart(newData);
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
      for (var occupation in data[province][year]) {
        var value = data[province][year][occupation];
        occupation = occupation.split("/")[0];

        // if first occupation define currOcc and total value
        if (currOcc === "") {
          currOcc = occupation;
          var total = parseInt(value);
        }

        // if new occupation add summed value to lists
        else if (currOcc !== occupation) {
          newData[province][year][globalOccupations[counter]] = sumValue;
          if (sumValue) {
            totalSum += sumValue;
          };
          counter += 1;
          sumValue = Number.NaN;
          currOcc = occupation;
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
      newData[province][year][globalOccupations[counter]] = sumValue;
      if (sumValue) {
        totalSum += sumValue;
      };
      counter += 1;

      // calculate and add "Undefined"
      if (totalSum === 0) {
        newData[province][year][globalOccupations[counter]] = 0;
      }
      else {
        newData[province][year][globalOccupations[counter]] = (2 * total -
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

  // get all years and provinces
  var provinces = Object.keys(data);
  var years = Object.keys(data[provinces[0]]);

  // create slider and select
  var slider = d3.select("#sliderYear");
  var provinceDrop = d3.select("#provinceDropdown");

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

  // add interactivity to year slider
  slider.on("input", function(){
          sliderText(this.value);
          var chosenProvince = provinceDrop.property("value");
          pieUpdate(data, chosenProvince, this.value);
        });

  // add interactivity to the select
  d3.select("#provinceDropdown")
    .on("input", function() {
      var chosenYear = slider.property("value");
      pieUpdate(data, this.value, chosenYear);
    });

};


function sliderText(sliderYear) {
  /* Shows current year */
  var sliderValue = document.getElementById("sliderValue");
  sliderValue.innerHTML = "Year: " + sliderYear;
};

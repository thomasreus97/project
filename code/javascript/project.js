/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Main javascript
- Loads and parses the data
- Defines:
important consstants and variables, the div/svg layout,
the buttons and their functionalities, a tooltip
- Creates (the first):
map, legend, barchart and piechart.
*/

window.onload = function() {
  /*
  After running all scripts in the html:
  - Defines constants:
  margins, main occupancy colors, occupancies,
  map indentifiers.
  !! I made these global because they are used on several different places,
  and placing them all together here makes it, in my opinion, easier to change
  for the entire code (when someone want to do that) + calling them every time
  i call i function would make everything look messy !!
  - loads data in from a json file and
  starts main function.
  */

  // parameters plots
  param = {
    margin: 100,
    height: 600,
    width: 400,
  };

  // color list for different occupations
  occupancyColors = {"Traffic": "#808080",
                     "Built": "#ff0000",
                     "Semi-built": "#FFA500",
                     "Recreation": "#ffff00",
                     "Agricultural": "#8B4513",
                     "Forest & Nature": "#12820e",
                     "Water": "#0000FF",
                     "Undefined": "White"};

  // occupancies list
  globalOccupancies = ["Total", "Traffic", "Built", "Semi-built",
                       "Recreation", "Agricultural", "Forest & Nature",
                       "Water", "Undefined"];

  // map indentifiers
  indentifiers = [
    "NL-GR", "NL-FR", "NL-DR", "NL-OV", "NL-FL", "NL-GE",
    "NL-UT", "NL-NH", "NL-ZH", "NL-ZE", "NL-NB", "NL-LI",
  ];

  // import the json file then start main function
  d3.json("data/Bodemgebruik_data.json").then(function(response) {
    main(response);
  });
};


function main(data) {
  /*
  Calls the following functions:
  layoutMaker, dataParser, makeLegend,
  buttonFixer.
  And makes the initial map, pie and stackedbar.
  */

  // start year, occupancy and location
  var year = 1950;
  var occupancy = "Traffic";
  var name = "Nederland";

  // create div and svg layout
  layoutMaker();

  // parse the data into another format
  // subdivisions into the "main" divisions
  var output = dataParser(data);
  var newData = output[0];
  var yearsList = output[1];

  // make legend and define currentoccupancies list
  var currentOccupancies = makeLegend(newData);

  // assign data ranges to buttons
  buttonFixer(newData, currentOccupancies, yearsList);
  sliderText(year);

  // create initial visualisations
  mapNetherlands(newData, year, occupancy, currentOccupancies);
  pieUpdate(newData, name, year, currentOccupancies, false, false);
  stackedBarChart(newData, year, currentOccupancies);
};


function layoutMaker() {
  /*
  Creates all div's and svg's for
  the layout of the visualisations.
  Adds buttons and slider to the navbar
  Creates tooltip.
  */

  // tooltip
  d3.select("body")
    .append("div")
    .attr("class", "toolTip");

  // main div
  d3.select("body")
    .append("div")
    .attr("id", "mainDiv")
    .style("height", param.height + param.margin + "px");

  // map div
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "mapDiv");

  // piechart svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "pieSvg");

  // legend svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "legendSvg");

  // title map div
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "mapTitle")
    .style("top", param.margin / 3 + "px")
    .style("left", 2 * param.margin / 3 + "px");

  // stacked barchart svg
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "barSvg");

  // dropdown provinces
  d3.select(".topnav")
    .append("div")
    .attr("id", "buttonBox")
    .append("select")
    .attr("id", "provinceDropdown")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .style("width", 1.5 * param.margin + "px");

  // selection dropdown occupancy
  d3.select("#buttonBox")
    .append("select")
    .attr("id", "occupancyDropdown")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .style("width", 1.5 * param.margin + "px");

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

  // div for error message map (might parse the data, then this isnt needed)
  d3.select("#mainDiv")
    .append("div")
    .attr("id", "errorDiv")
    .attr("width", param.width)
    .style("top", document.getElementById("mainDiv").clientHeight / 2 + "px");
};


function dataParser(data) {
  /*
  Put all sub-occupations into the corresponding main occupancy
  main occupancies are: globalOccupancies
  Don't count years where no data is available at all (this is done in
  a different loop (could've been done in the same) to make it easier to
  follow what is going on).
  */

  // iterate through the data and add them into the correct global occupancy
  var newData = {};
  for (var province in data) {

    // sort by province
    newData[province] = {};
    for (var year in data[province]) {

      // then sort by year
      newData[province][year] = {};
      var currOcc = "";
      var counter = 0;
      var sumValue = Number.NaN;
      var totalSum = 0;
      for (var occupancy in data[province][year]) {

        // then sort by global occupancy
        var value = data[province][year][occupancy];
        occupancy = occupancy.split("/")[0];

        // if first occupancy define currOcc and total value
        if (currOcc === "") {
          currOcc = occupancy;
          var total = parseInt(value);
        }

        // if new occupancy add summed value to previous occupancy
        // reset the sum, count one up and redefine currentoccupancy
        else if (currOcc !== occupancy) {
          newData[province][year][globalOccupancies[counter]] = sumValue;
          if (sumValue) {
            totalSum += sumValue;
          };
          counter += 1;
          sumValue = Number.NaN;
          currOcc = occupancy;
        };

        // if same occupancy, add to sum
        if (value !== "." && value !== "") {
          if (sumValue) {
            sumValue += parseInt(value);
          }
          else {
            sumValue = parseInt(value);
          };
        };
      };

      // add last value of forloop to datalist
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

  // year selecttion
  // create years list
  var years = [];
  for (var province in data) {
    for (var year in data[province]) {
      years.push(year);
    };
    break;
  };

  // check for every year if there is data
  var emptyYears = [];
  var goodYears = [];
  for (var i in years) {
    var year = years[i];
    var dataYears = [];
    for (var province in data) {
      var dataProvince = [];

      // fill data from province+year into data province if available
      for (var occupancy in data[province][year]) {
        var value = data[province][year][occupancy];
        if (!isNaN(parseFloat(value))) {
          dataProvince.push(value);
        };
      };

      // if there is no data (next to undefined), push 1 to dataYears and break
      if (dataProvince.length <= 1) {
        continue;
      }
      else {
        dataYears.push(1);
        break;
      };
    };

    // if datayears length === 0, empty year is found
    if (dataYears.length === 0) {
      emptyYears.push(year);
    }
    else {
      goodYears.push(year);
    };
  };

  // delete empty years from newdata
  for (var province in newData) {
    for (var i in emptyYears) {
      delete newData[province][emptyYears[i]];
    };
  };
  
  // return formatted data and years
  return [newData, goodYears];
};


function buttonFixer(data, currentOccupancies, years) {
  /*
  Add all data and functionality to:
  Both dropdown buttons, yearslider
  Functionality = update map, pie, bar and titles accordingly.
  */

  // get all years, occupancies and provinces
  var provinces = Object.keys(data);
  var occupancies = globalOccupancies.slice();
  occupancies.pop();
  occupancies.shift();

  // select slider and dropdowns
  var slider = d3.select("#sliderYear");
  var provinceDrop = d3.select("#provinceDropdown");
  var occupancyDrop = d3.select("#occupancyDropdown");

  // add min and max years to slider
  slider.attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("step", "1");

  // add provinces to dropdown
  dropdownDataAdder(provinceDrop, provinces);

  // add occupancies to dropdown
  dropdownDataAdder(occupancyDrop, occupancies);

  // add interactivity to occupancy dropdown
  occupancyDrop.on("input", function() {

    // select variables
    var chosenYear = slider.property("value");
    var chosenProvince = provinceDrop.property("value");
    var currentOccupancy = this.value;

    // update visualisations
    updateMap(data, chosenYear, currentOccupancy, currentOccupancies);
    updateBar(data, chosenYear, currentOccupancies);
    pieUpdate(data, chosenProvince, chosenYear, currentOccupancies, true);
  });

  // add interactivity to year slider
  slider.on("input", function() {

          // select variables
          var chosenProvince = provinceDrop.property("value");
          var currentOccupancy = occupancyDrop.property("value");

          // check if available year, then change
          if (years.indexOf(this.value) > -1) {

            // update visualisations and texts of slider and barchart
            sliderText(this.value);
            pieUpdate(data, chosenProvince, this.value, currentOccupancies,
                      true);
            yearUpdateMap(data, this.value, currentOccupancy,
                          currentOccupancies);
            updateBar(data, this.value, currentOccupancies);
            d3.select("#barchartTitle")
              .text("Distribution of occupancies per province in " +
                    this.value);
          };
        });

  // add interactivity to the select
  provinceDrop.on("input", function() {

                // select year and update piechart
                var chosenYear = slider.property("value");
                pieUpdate(data, this.value, chosenYear, currentOccupancies,
                          true);
              });
};


function sliderText(sliderYear) {
  /* Shows current year in sliderdiv */

  var sliderValue = document.getElementById("sliderValue");
  sliderValue.innerHTML = "Year: " + sliderYear;
};


function dropdownDataAdder(item, data) {
  /* Adds datapoints to dropdown */

  item.selectAll("option")
      .data(data)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      });
};

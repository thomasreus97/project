/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Parses data
creates: div, svg, tooltip, dropdowns
Plots scatterplot when dropdown used
*/

window.onload = function() {
  /*
  After running all scripts in the html
  - Defines constants:
  margins, main occupancy colors, occupancies
  - Runs main
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

  // import the json file then start main function
  d3.json("data/Bodemgebruik_data.json").then(function(response) {
    main(response);
  });
};


function main(data) {
  /*
  Parses data, makes buttons and svg in div
  calls linechart function
  */

  // parse the data into another format
  // subdivisions into the "main" divisions
  var output = dataParser(data);
  var newData = output[0];
  var yearsList = output[1];

  // create div, svg and buttons in navbar
  // main div
  d3.select("body")
    .append("div")
    .attr("id", "mainDiv")
    .style("height", param.height + param.margin + "px");

  // svg for linechart
  d3.select("#mainDiv")
    .append("svg")
    .attr("id", "lineSvg");

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

  // toolTip
  d3.select("body")
    .append("div")
    .attr("class", "toolTip")
    .attr("id", "lineToolTip");

  // assign data ranges to buttons
  buttonFixer(newData, yearsList);

  // make first linechart
  linechartMaker(newData, true);
};


function linechartMaker(data, first) {
  /*
  Makes a linechart for an occupancy and a location
  first indicates whenever axes needs to be made or updated
  (first = true or false)
  */

  // select svg
  var svg = d3.select("#lineSvg");

  // select tooltip
  var toolTip = d3.select(".toolTip");

  // current occupancy and location
  var currentOccupancy = d3.select("#occupancyDropdown").property("value");
  var currentLocation = d3.select("#provinceDropdown").property("value");

  // get the x and y data
  var yData = [];
  var xData = [];
  for (var year in data[currentLocation]) {
    var dataPart = parseFloat(data[currentLocation][year][currentOccupancy]);
    if (!isNaN(dataPart)) {
      yData.push(dataPart);
      xData.push(parseInt(year));
    };
  };

  // create scale functions for selected year
  var scales = scaleMaker(xData, yData);

  // make/update axes
  if (first) {

    // create axes
    axesMaker(scales, currentOccupancy, currentLocation);
  }
  else {

    // update axes
    svg.select("#yAxis")
       .transition()
       .call(d3.axisLeft(scales[1]));
    svg.select("#xAxis")
       .transition()
       .call(d3.axisBottom(scales[0]).tickFormat(d3.format("d")))
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("class", "text")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", function(d) {
         return "rotate(-65)"
       });

    // update title
    d3.select("#lineTitle")
      .text(currentOccupancy + " in " + currentLocation + " over the years");
  };

  // all attributes
  var attrs = function(selection) {
    selection
      .attr("stroke", "black")
      .attr("opacity", "0.75")
      .attr("stroke-width", "2px")
      .attr("r", 8)
      .attr("cy", function(d) {
        return scales[1](d);
      })
      .attr("cx", function(d, i) {
        return scales[0](xData[i]);
      })
      .attr("fill", function(d) {
        return occupancyColors[currentOccupancy];
      });
  };

  // all on-attributes
  var onAttrs = function(selection) {
    selection

      // interactivity for mouse hovering (show info)
      .on("mouseover", function(d, i) {
        d3.select(this)
          .attr("stroke", "red")
          .attr("stroke-width", "2px")
        return ((toolTip.style("visibility", "visible")
                        .text(xData[i] + ': ' + d + ' km\xB2')))
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", "2px")
        return (toolTip.style("visibility", "hidden"));
      })
      .on("mousemove", function(d, i) {
        return toolTip.style("top", event.clientY - param.margin / 2 + "px")
                      .style("left", event.clientX + "px");
      });
  };

  // make not existing points
  var circles = svg.selectAll("circle").data(yData);

  circles.enter()
         .append("circle")
         .call(attrs)
         .call(onAttrs);

  // merge the points
  svg.selectAll("circle")
     .data(yData)
     .merge(circles)
     .transition()
     .call(attrs);

  // remove non-existing points
  svg.selectAll("circle")
     .data(yData)
     .exit()
     .remove();

  // connect the dots
  setTimeout(dotConnector, 500);
};


function dotConnector() {
  /*
  create line between coordinates of the points
  if first create path, else update
  */

  // select svg
  var svg = d3.select("#lineSvg");

  // select the circles
  var circles = svg.selectAll("circle");

  // get coordinates from circles
  var coordinates = [];
  for (var i in circles._groups[0]) {
    var item = circles._groups[0][i];

    // break at length of circles list
    if (typeof(item) === "number") {
      break;
    };

    // add coordinates to list
    coordinates.push({"x": item.cx.baseVal.value, "y": item.cy.baseVal.value});
  };

  // line generator
  var lineFunction = d3.line()
                       .x(function(d) { return d.x; })
                       .y(function(d) { return d.y; })
                       .curve(d3.curveMonotoneX)

  // remove line, had no time to do the transition
  svg.select("#lineId").remove().exit();

  // add line
  svg.append("path")
     .transition()
     .attr("id", "lineId")
     .attr("d", lineFunction(coordinates))
     .attr("stroke", "black")
     .attr("stroke-width", 2)
     .attr("fill", "none");
};


function scaleMaker(xData, yData) {
  /*
  First seperates the different data and then
  creates and returns the scale functions for these data
  */

  // get width and height of svg
  var svgSize = document.getElementById("lineSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // calculate scales
  var xScaleBar = d3.scaleLinear()
                    .domain([d3.min(xData), d3.max(xData)])
                    .range([param.margin, width - param.margin]);

  var yScaleBar = d3.scaleLinear()
                    .domain([0, parseInt(d3.max(yData) - d3.max(yData) % 100
                                         + 100)])
                    .range([height - param.margin, param.margin]);

  // return scales, xdata length and with+height as one variable
  return [xScaleBar, yScaleBar, [width, height]];
};


function axesMaker(scales, currentOccupancy, currentLocation) {
  /*
  scales = [xScaleBar, yScaleBar, [width, height]];
  Creates the axes for the svg with given
  parameters and data.
  */

  // select svg
  var svg = d3.select("#lineSvg");

  // create axes with format for x axis
  var xAxis = d3.axisBottom(scales[0]).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(scales[1]);

  // add title
  svg.append("text")
     .attr("class", "text")
     .attr("id", "lineTitle")
     .attr("transform",
           "translate("+[param.margin , param.margin / 3]+")")
     .text(currentOccupancy + " in " + currentLocation + " over the years");

  // plot x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("id", "xAxis")
     .attr("transform", "translate(" + [0, scales[2][1] -
           param.margin] + ")")
     .call(xAxis)

     // rotate the text
     // this part adapted from: http://bl.ocks.org/d3noob/ccdcb7673cdb3a796e13
     .selectAll("text")
     .attr("class", "text")
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("transform", function(d) {
       return "rotate(-65)"
     });

  // plot y-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("id", "yAxis")
     .attr("transform", "translate(" + [param.margin, 0] + ")")
     .call(yAxis);

  // y label
  svg.append("text")
     .attr("class", "text")
     .attr("transform", "rotate(-90)")
     .attr("x", - scales[2][1] / 3)
     .attr("y", 0)
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Area covered (km\xB2)");
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


function buttonFixer(data, years) {
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
  var provinceDrop = d3.select("#provinceDropdown");
  var occupancyDrop = d3.select("#occupancyDropdown");

  // add provinces to dropdown
  dropdownDataAdder(provinceDrop, provinces);

  // add occupancies to dropdown
  dropdownDataAdder(occupancyDrop, occupancies);

  // add interactivity to occupancy dropdown
  occupancyDrop.on("input", function() {
                  linechartMaker(data, false);
                });

  // add interactivity to the select
  provinceDrop.on("input", function() {
                linechartMaker(data, false);
              });
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

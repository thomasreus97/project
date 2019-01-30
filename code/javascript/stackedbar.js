/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Defines functions:
stackedBarChart: initialisation of the barchart,
calls scalemaker and axes maker then barGraphUpdater.
scaleMaker: creates scales from current data
axesMaker: creates the axis
updateBar: calls scalemaker, then updates the current axes and
then calls barGraphUpdater.
barGraphUpdater: Creates / updates the stacked barchart with the current data.
*/


function stackedBarChart(data, year, currentOccupancies) {
  /*
  initial barchart: create scale, make axes and add bars.
  */

  // create scale functions for selected year
  var scales = scaleMaker(data, year, currentOccupancies);

  // create axes
  axesMaker(scales, year);

  // plot the barchart
  barGraphUpdater(data, scales, year, currentOccupancies);
};


function updateBar(data, year, currentOccupancies, legend) {
  /*
  Update barchart: create new scales,
  update axes and update bars.
  */

  // create scale functions for selected year
  var scales = scaleMaker(data, year, currentOccupancies);

  // select svg
  var svg = d3.select("#barSvg");

  // update the axes
  svg.select("#yAxis")
     .transition()
     .call(d3.axisLeft(scales[1]));
  svg.select("#xAxis")
     .transition()
     .call(d3.axisBottom(scales[0])).selectAll("text")
     .style("text-anchor", "end")
     .attr("class", "text")
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("transform", function(d) {
       return "rotate(-65)"
     });

  // plot the barchart
  barGraphUpdater(data, scales, year, currentOccupancies, legend);
};


function scaleMaker(data, year, currentOccupancies) {
  /*
  First seperates the different data and then
  creates and returns the scale functions for these data
  */

  // get width and height of svg
  var svgSize = document.getElementById("barSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // seperate the wanted data and store in list
  var xDataBar = [];
  var yDataBar = [];
  for (var province in data) {
    var sum = 0;
    if (province === "Nederland") {
      continue;
    };
    for (var i in currentOccupancies) {
      if (data[province][year][currentOccupancies[i]]) {
        sum += data[province][year][currentOccupancies[i]];
      };
    };
    if (sum > 0) {
      xDataBar.push(province);
      yDataBar.push(sum);
    };
  };

  // calculate scales
  var xScaleBar = d3.scaleBand()
                    .domain(xDataBar)
                    .range([4 * param.margin / 5, 33 * width / 34]);

  var yScaleBar = d3.scaleLinear()
                    .domain([0, Math.round(d3.max(yDataBar) + 10 -
                                           d3.max(yDataBar) % 10)])
                    .range([height - 1.5 * param.margin, param.margin]);

  // return scales, xdata length and with+height as one variable
  return [xScaleBar, yScaleBar, xDataBar.length, [width, height]];
};


function axesMaker(scales, year) {
  /*
  scales = [xScaleBar, yScaleBar, xDataBar.length, [width, height]];
  Creates the axes for the svg with given
  parameters and data.
  */

  // select svg
  var svg = d3.select("#barSvg");

  // create axes with format for x axis
  var xAxis = d3.axisBottom(scales[0]);
  var yAxis = d3.axisLeft(scales[1]);

  // add title
  svg.append("text")
     .attr("class", "text")
     .attr("id", "barchartTitle")
     .attr("transform",
           "translate("+[param.margin / 2, param.margin / 2]+")")
     .text("Distribution of occupancies per province in " + year);

  // plot x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("id", "xAxis")
     .attr("transform", "translate(" + [0, scales[3][1] - 1.5 * param.margin] +
                                   ")")
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
     .attr("transform", "translate(" + [4 * param.margin / 5, 0] + ")")
     .call(yAxis);

  // y label
  svg.append("text")
     .attr("class", "text")
     .attr("transform", "rotate(-90)")
     .attr("x", - scales[3][1] / 3)
     .attr("y", 0)
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Area covered (km\xB2)");
};


function barGraphUpdater(data, scales, year, currentOccupancies, legend=false) {
  /*
  Creates / updates stacked barchart.
  If legend === false (default): transition bars
  if legend === true: only merge (no transition) bars (this is done
  because if legend === true there will be less bars, which would make the
  transition animation ugly).
  */

  // select svg
  var svg = d3.select("#barSvg");

  // select tooltip
  var toolTip = d3.select(".toolTip");

  // select currentOccupancy
  var currentOccupancy = d3.select("#occupancyDropdown").property("value");

  // put all data values into one list
  // give 0 to undefined/NaN values
  var dataListBar = [];
  var provinces = [];
  for (var i in data) {
    if (i !== "Nederland" && scales[0](i)) {
      provinces.push(i);
      for (var j in currentOccupancies) {
        var dataValue = data[i][year][currentOccupancies[j]];
        if (dataValue) {
          dataListBar.push(dataValue);
        }
        else {
          dataListBar.push(0);
        }
      };
    };
  };

  // list will all attributes
  var attrs = function(selection) {
    var step = 0;
    selection.attr("stroke", "black")

             // give strokewidth when its the current occupancy
             .attr("stroke-width", function(d, i) {
               var j = i % currentOccupancies.length;
               var selectedOccupancy = d3.select("#occupancyDropdown")
                                         .property("value");
               if (selectedOccupancy === currentOccupancies[j]) {
                 return 3;
               }
               else {
                 return 0;
               };
             })

             // give width to bars
             .attr("width", (scales[3][0] - 4 * param.margin / 3) / scales[2] +
                             "px")

             // add color of occupancy
             .attr("fill", function(d, i) {
               var j = i % currentOccupancies.length;
               return occupancyColors[currentOccupancies[j]];
             })

             // assign the same x for all stacked
             .attr("x", function(d, i) {
               var j = parseInt(i / currentOccupancies.length);
               return scales[0](provinces[j]) + 1 + "px"
             })

             // add height for every province
             .attr("y", function(d, i) {
               var j = i % currentOccupancies.length;
               if (j === 0) {
                 step = 0;
               };
               var stepAddition = scales[3][1] - 1.5 * param.margin -
                                  scales[1](d);
               step += stepAddition;
               return scales[3][1] - 1.5 * param.margin - step + "px";
             })

             // scale height
             .attr("height", function(d) {
               var h = scales[3][1] - 1.5 * param.margin - scales[1](d);
               if (h > 0) {
                 return h + "px";
               }
               else {
                 return "0px";
               };
             });
  };

  // all on-attributes
  var onAttrs = function(selection) {
    selection

      // show tooltip + text
      .on("mouseover", function(d, i) {
        var j = i % currentOccupancies.length;
        d3.select(this)
          .style("cursor", "pointer")
          .attr("opacity", 0.5);
        return (toolTip.style("visibility", "visible")
                      .text(currentOccupancies[j] + ": " + d + " km\xB2"))
                      .style("z-index", 9999);
      })

      // hide tooltip
      .on("mouseout", function() {
        d3.select(this)
          .attr("opacity", 1);
        return (toolTip.style("visibility", "hidden"));
      })

      // move tooltip near cursor
      .on("mousemove", function() {

        // get width of page and tooltip
        var mainDiv = document.getElementById("mainDiv");
        var width = mainDiv.clientWidth;
        var tool = document.getElementsByClassName("toolTip");
        var toolWidth = tool[0].clientWidth;

        // move tooltip to left when page is passed, otherwise right
        if (event.clientX + toolWidth > width) {
          return toolTip.style("top", event.clientY -
                               param.margin / 3 + "px")
                        .style("left", event.clientX - toolWidth + "px");
        }
        else {
          return toolTip.style("top", event.clientY -
                               param.margin / 3 + "px")
                        .style("left", event.clientX + "px");
        };
      })

      // on click update visualisations
      .on("click", function(d, i) {
        var j = i % currentOccupancies.length;
        if (currentOccupancies[j] !== "Undefined") {

          // get variables
          var chosenYear = d3.select("#sliderYear")
                             .property("value");
          var chosenName = d3.select("#provinceDropdown")
                             .property("value");
          var currOcc = currentOccupancies[j];

          // update visuals when new occupancy
          if (currentOccupancy !== currOcc) {
            currentOccupancy = currOcc;
            updateMap(data, chosenYear, currentOccupancy, currentOccupancies);
            d3.select("#occupancyDropdown")
              .property("value", currentOccupancy);
            updateBar(data, chosenYear, currentOccupancies);
            pieUpdate(data, chosenName, chosenYear, currentOccupancies, true);
          };
        };
      });
  };

  // define bars with data
  var bars = d3.select("#barSvg")
               .selectAll("rect")
               .data(dataListBar);

  // merge + transform or only merge, depending of legend being true or false
  var duration = 500;
  if (legend) {
    bars.enter()
        .append("rect")
        .call(onAttrs)
        .call(attrs)
        .merge(bars)
        .call(attrs);
  }
  else {
    bars.enter()
        .append("rect")
        .call(onAttrs)
        .call(attrs)
        .merge(bars)
        .transition()
        .duration(duration)
        .call(attrs);
  };

  // remove bars when no data
  bars = d3.select("#barSvg").selectAll("rect").data(dataListBar);
  bars.exit().remove();
};

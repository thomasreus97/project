/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Defines function:
- pieUpdate: takes the correct data and creates
the initial g when updateQuestion === false,
fills in the data and updates when there is already
data available, initialise/updates title.
*/


function pieUpdate(data, name, year, currentOccupancies, updateQuestion) {
  /*
  Parses the wanted data into a list: dataList
  When updateQuestion === false: initialise the g element
  If there is no data: show "no data"-text
  Create/update the piechart for the current data
  */

  // select svg
  var svg = d3.select("#mainDiv").select("#pieSvg");

  // select toolTip
  var toolTip = d3.select(".toolTip");

  // get width and height of svg
  var svgSize = document.getElementById('pieSvg');
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // put non-NaN data and keys into lists
  // when NaN, add 0 to the values
  var dataSet = data[name][year];
  var dataList = [];
  var dataKeys = [];
  for (key in dataSet) {
    if (key !== "Total") {
      dataKeys.push(key);
      if (dataSet[key]) {
        dataList.push(dataSet[key]);
      }
      else {
        dataList.push(0);
      };
    };
  };

  // check if all data is zero
  var noData = true;
  for (i in dataList) {
    if (dataList[i] !== 0) {
      noData = false;
    };
  };

  // show message when no data avaiable
  if (noData) {
    svg.selectAll("#noData").remove();
    svg.append("text")
       .attr("id", "noData")
       .attr("transform",
             "translate(" + [width / 2 - param.margin / 1.5,
                             width / 3 + param.margin] + ")")
       .text("No Data Available");
  }
  else {
    svg.selectAll("#noData").remove();
  };

  // create g on initialisation
  if (!updateQuestion) {
    svg.append("g")
       .attr("class", "slices")
       .attr("id", "groupG")
       .style("position", "absolute")
       .attr("transform", "translate("+[width / 2,
                                        height / 2 + param.margin / 2]+")");
  };

  // create pie function
  var pie = d3.pie()
              .padAngle(0.01)
              .sort(null)
              .value(function(d) {
                return d;
              });

  // define arc
  var arc = d3.arc()
              .innerRadius(height / 20)
              .outerRadius(height / 3);

  // select currentOccupancy
  var currentOccupancy = d3.select("#occupancyDropdown").property("value");

  // all attributes collected
  var attrs = function(selection) {
    selection
      .attr("stroke", "black")

      // give a stroke when current occupancy in map
      .attr("stroke-width", function(d, i) {
        var currOcc = dataKeys[i];
        if (currentOccupancy === currOcc) {
          return 3;
        }
        else {
          return 0;
        };
      })

      // give opacity 0.3 when deselected in legend
      .attr("opacity", function(d, i) {
        var currOcc = dataKeys[i];
        if (currentOccupancies.indexOf(currOcc) > -1) {
          return 1;
        }
        else {
          return 0.3;
        };
      })
      .on("click", function(d, i) {

        // current occupancy, year and name
        var currOcc = dataKeys[i];
        var chosenYear = d3.select("#sliderYear").property("value");
        var chosenName = d3.select("#provinceDropdown").property("value");

        // change legend opacities when occupancy wasnt selected
        // and update barchart and piechart
        if (currentOccupancies.indexOf(currOcc) < 0) {
          currentOccupancies.push(currOcc);
          updateBar(data, chosenYear, currentOccupancies, true);
          pieUpdate(data, chosenName, chosenYear, currentOccupancies, true);
          d3.selectAll("#legendBlocks")
            .attr("opacity", function(d) {
              if (currentOccupancies.indexOf(d) < 0) {
                return 0.3;
              }
              else {
                return 1;
              };
            })
        };

        // discriminate Undefined and redefine currentOccupancy when changed
        // update map
        if (currOcc !== "Undefined" && currOcc !== currentOccupancy) {
            currentOccupancy = currOcc;
            d3.select("#occupancyDropdown")
              .property("value", currentOccupancy);
            updateMap(data, chosenYear, currOcc, currentOccupancies);
            updateBar(data, chosenYear, currentOccupancies);
            pieUpdate(data, chosenName, chosenYear, currentOccupancies, true);
        };
      })

      // show/hide, move and change text of tooltip on
      // mouse -over, -out and -move
      .on("mouseover", function(d, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .attr("opacity", 0.5);
        return toolTip.style("visibility", "visible")
                      .text(dataKeys[i] + ": " + d.data + " km\xB2")
                      .style("z-index", 9999);
      })
      .on("mouseout", function(d, i) {
        d3.select(this)
          .attr("opacity", function() {
            var currOcc = dataKeys[i];
            if (currentOccupancies.indexOf(currOcc) > -1) {
              return 1;
            }
            else {
              return 0.3;
            };
          });
        return (toolTip.style("visibility", "hidden"));
      })
      .on("mousemove", function(d, i) {
        return toolTip.style("top", event.clientY - param.margin / 3 + "px")
                      .style("left", event.clientX + "px");
      });
    };

  // inspiration from website
  // source: https://bl.ocks.org/rshaker/225c6df494811f46f6ea53eba63da817
  
  // duration of transition
  var duration = 500;

  // select old data
  var oldData = svg.select(".slices")
                   .selectAll("path")
                   .data().map(function(d) { return d; });

  // if no old data, old data = new data
  if (oldData.length == 0) {
    oldData = dataList;
  };

  // define a slice path with the old data
  var slice = svg.select(".slices")
                 .selectAll("path")
                 .data(pie(oldData));

  // enter the slice and safe old data in current
  slice.enter()
       .insert("path")
       .attr("class", "slice")
       .each(function(d) {
         this._current = d;
       });

  // append new data to the slices
  slice = svg.select(".slices")
             .selectAll("path")
             .data(pie(dataList));

  // transition from old to new
  slice.transition()
       .duration(duration)
       .attr("fill", function(d, i) {
         return occupancyColors[dataKeys[i]];
       })
       .attrTween("d", function(d) {
         var interpolate = d3.interpolate(this._current, d);
         var _this = this;
         return function(t) {
           _this._current = interpolate(t);
           return arc(_this._current);
         };
       });

  // add not existing pies
  slice = svg.select(".slices")
             .selectAll("path")
             .data(pie(dataList))
             .call(attrs);

  // remove already existing slices
  slice.exit()
       .transition()
       .delay(duration)
       .duration(0)
       .remove();

  // create or update title
  if (updateQuestion) {

    // update title
    d3.select("#pieTitle")
      .transition()
      .attr("class", "text")
      .text("Distribution occupancies of " + name + " in " + year);
  }
  else {

    // add title
    svg.append("text")
       .attr("class", "text")
       .attr("id", "pieTitle")
       .attr("transform",
             "translate("+[param.margin / 2, param.margin / 2]+")")
       .text("Distribution occupancies of " + name + " in " + year);
  };
};

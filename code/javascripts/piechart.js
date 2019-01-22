/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Two functions;
- pieChart: creating a piechart
- pieUpdate: updating a piechart
*/


function pieUpdate(data, name, year, currentOccupancies, updateQuestion) {

  // select svg
  var svg = d3.select("#mainDiv").select("#pieSvg");

  // put non-NaN data and keys into lists
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

  // check if all zero
  var noData = true;
  for (i in dataList) {
    if (dataList[i] !== 0) {
      noData = false;
    };
  };

  // get width and height of svg
  var svgSize = document.getElementById('pieSvg');
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // show message when no data avaiable
  if (noData) {
    svg.selectAll("#noData").remove();
    svg.append("text")
       .attr("id", "noData")
       .attr("transform",
             "translate(" + [width / 2 - margin / 1.5, width / 3 + margin] + ")")
       .text("No Data Available");
  }
  else {
    svg.selectAll("#noData").remove();
  };

  // create g
  if (!updateQuestion) {
    svg.append("g")
       .attr("class", "slices")
       .attr("id", "groupG")
       .style("position", "absolute")
       .attr("transform", "translate("+[width / 2,
                                        width / 3 + margin]+")");
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
              .innerRadius(width / 20)
              .outerRadius(width / 3);

  // call update function
  update(dataList);

  function update(dataList) {
    /*
    source: https://bl.ocks.org/rshaker/225c6df494811f46f6ea53eba63da817
    */

    var attrs = function(selection) {
      selection
        .attr("stroke", "black")
        .attr("stroke-width", function(d, i) {
          var currOcc = dataKeys[i];
          if (currentOccupancy === currOcc) {
            return 3;
          }
          else {
            return 0;
          };
        })
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
            updateBar(data, chosenYear, currentOccupancies);
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
        .on("mouseover", function(d, i) {
          d3.select(this)
            .attr("opacity", 0.5);
          return tooltip.style("visibility", "visible")
                        .text(dataKeys[i] +
                              ": " + d.data)
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
            })
          return (tooltip.style("visibility", "hidden"));
        })
        .on("mousemove", function(d, i) {
          return tooltip.style("top", event.clientY -
                               param.height / 8 + "px")
                        .style("left", event.clientX + "px")
        });
      };

    var duration = 500;

    var oldData = svg.select(".slices")
                     .selectAll("path")
                     .data().map(function(d) { return d; });

    if (oldData.length == 0) {
      oldData = dataList;
    };

    var slice = svg.select(".slices")
                   .selectAll("path")
                   .data(pie(oldData));

    slice.enter()
         .insert("path")
         .attr("class", "slice")
         .each(function(d) {
           this._current = d;
         });

    slice = svg.select(".slices")
               .selectAll("path")
               .data(pie(dataList));

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

    slice = svg.select(".slices")
               .selectAll("path")
               .data(pie(dataList))
               .call(attrs);

    slice.exit()
         .transition()
         .delay(duration)
         .duration(0)
         .remove();
  };

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
             "translate("+[margin / 2, margin / 2]+")")
       .text("Distribution occupancies of " + name + " in " + year);
    };
};

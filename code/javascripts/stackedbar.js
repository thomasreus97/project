/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: stacked barchart
*/


function stackedBarChart(data, year, currentOccupancies) {
  /*
  initial barchart
  */

  // create scale functions for selected year
  var scales = scaleMaker(data, year, currentOccupancies);

  // create axes
  axesMaker(scales, year);

  // plot the barchart
  barGraphUpdater(data, scales, year, currentOccupancies);
};


function scaleMaker(data, year, currentOccupancies) {
  /*
  First seperates the different data and then
  creates the scale functions for these data
  */

  // seperate data and store in list
  var xDataBar = [];
  var yDataBar = [];
  for (var province in data) {
    var sum = 0;
    if (province === "Nederland") {
      continue
    };
    for (var i in currentOccupancies){
      if (data[province][year][currentOccupancies[i]]) {
        sum += data[province][year][currentOccupancies[i]];
      };
    };
    if (sum > 0) {
      xDataBar.push(province);
      yDataBar.push(sum);
    };
  };

  // get width and height of svg
  var svgSize = document.getElementById('barSvg');
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // calculate scales
  var xScaleBar = d3.scaleBand()
                    .domain(xDataBar)
                    .range([3 * margin / 5, width]);

  var yScaleBar = d3.scaleLinear()
                    .domain([0, Math.round(d3.max(yDataBar) + 10 -
                                           d3.max(yDataBar) % 10)])
                    .range([height - margin, margin]);

  return [xScaleBar, yScaleBar, xDataBar.length, [width, height]];
};


function axesMaker(scales, year) {
  /*
  Creates the axes for the svg with given
  parameters and data.
  */

  // create axes with format for x axis
  var xAxis = d3.axisBottom(scales[0])
  var yAxis = d3.axisLeft(scales[1]);

  // select svg
  var svg = d3.select("#barSvg");

  // add title
  svg.append("text")
     .attr("class", "text")
     .attr("id", "barchartTitle")
     .attr("transform",
           "translate("+[margin / 2, margin / 2]+")")
     .style("font-weight", "bold")
     .style("font-size", "20")
     .text(year);

  // plot x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("id", "xAxis")
     .attr("transform", "translate(" + [0, scales[3][1] - margin] + ")")
     .call(xAxis)

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
     .attr("transform", "translate(" + [3 * margin / 5, 0] + ")")
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


function updateBar(data, year, currentOccupancies) {
  /*
  Updates stacked barchart
  */

  // create scale functions for selected year
  var scales = scaleMaker(data, year, currentOccupancies);

  // select svg
  var svg = d3.select("#barSvg");

  // update the axes
  svg.select("#yAxis").transition().call(d3.axisLeft(scales[1]));
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
  barGraphUpdater(data, scales, year, currentOccupancies);
};


function barGraphUpdater(data, scales, year, currentOccupancies) {
  /*
  update the bars
  */

  // select svg
  var svg = d3.select("#barSvg");

  // put all data values into one list
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
  var step = 0;
  var attrs = function(selection) {
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
             .attr("width", (scales[3][0] - margin) / scales[2] + "px")

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
               step += scales[3][1] - margin - scales[1](d);
               return scales[3][1] - margin - step + "px";
             })

             // scale height
             .attr("height", function(d) {
               var h = scales[3][1] - margin - scales[1](d) - 1;
               if (h > 0) {
                 return h + "px";
               }
               else {
                 return "0px";
               };
             });
  };

  var bars = d3.select("#barSvg").selectAll("rect").data(dataListBar);

  bars.enter().append('rect').call(attrs)
      .on("mouseover", function(d, i){
        var j = i % currentOccupancies.length;
        d3.select(this)
          .attr("opacity", 0.5);
        return (tooltip.style("visibility", "visible")
                       .text(currentOccupancies[j] + ": " + d))
                       .style("z-index", 9999);
      })
      .on("mouseout", function(){
        d3.select(this)
          .attr("opacity", 1);
        return (tooltip.style("visibility", "hidden"));
      })
      .on("mousemove", function(){
        return tooltip.style("top", event.clientY -
                             param.height / 8 + "px")
                      .style("left", event.clientX + "px");
      })
      .on("click", function(d, i) {
        var j = i % currentOccupancies.length;
        if (currentOccupancies[j] !== "Undefined"){
          var chosenYear = d3.select("#sliderYear")
                             .property("value");
          var chosenName = d3.select("#provinceDropdown")
                             .property("value");
          var currOcc = currentOccupancies[j];
          if (currentOccupancy !== currOcc) {
            currentOccupancy = currOcc;
            updateMap(data, chosenYear, currentOccupancy, currentOccupancies);
            d3.select("#occupancyDropdown")
              .property("value", currentOccupancy);
            updateBar(data, chosenYear, currentOccupancies);
            pieUpdate(data, chosenName, chosenYear, currentOccupancies, true)
          };
        };
      });

  bars = d3.select("#barSvg").selectAll("rect").data(dataListBar);

  bars.transition().duration(500).call(attrs);

  bars = d3.select("#barSvg").selectAll("rect").data(dataListBar);

  bars.exit().remove();
};

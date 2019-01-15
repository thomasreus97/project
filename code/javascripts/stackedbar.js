/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: stacked barchart
*/


function stackedBarChart(data, year, occupancies) {
  /*
  Creates (stacked) barchart of selected occupancies
  */

  // create scale functions for selected year
  var scales = scaleMaker(data, year, occupancies);

  // create axes
  axesMaker(scales);

  // plot the barchart
  barGraph(data, scales, year, occupancies);
};


function scaleMaker(data, year, occupancies) {
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
    for (var i in occupancies){
      if (data[province][year][occupancies[i]]) {
        sum += data[province][year][occupancies[i]];
      };
    };
    xDataBar.push(province);
    yDataBar.push(sum);
  };

  // calculate scales
  var xScaleBar = d3.scaleBand()
                    .domain(xDataBar)
                    .range([margin, 2 * param.width + margin +
                            xDataBar.length * 1.5]);

  var yScaleBar = d3.scaleLinear()
                    .domain([0, Math.round(d3.max(yDataBar) + 500 -
                                           d3.max(yDataBar) % 500)])
                    .range([param.height + margin, margin]);

  return [xScaleBar, yScaleBar, xDataBar.length];
};


function axesMaker(scales) {
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
     .attr("transform",
           "translate("+[margin / 2, margin / 2]+")")
     .style("font-weight", "bold")
     .style("font-size", "20")
     .text("Title");

  // plot x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("id", "xAxis")
     .attr("transform", "translate("+[0, param.height + margin]+")")
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
     .attr("transform", "translate("+[margin, 0]+")")
     .call(yAxis);

  // y label
  svg.append("text")
     .attr("class", "text")
     .attr("transform", "rotate(-90)")
     .attr("x", - 3 * param.height / 5)
     .attr("y", 0)
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Area covered (km\xB2)");
};


function barGraph(data, scales, year, occupancies) {
  /*
  creates a barchart for one year
  input: data, svg, scales and the start year
  */

  // select svg
  var svg = d3.select("#barSvg");

  // put all data values into one list
  var dataListBar = [];
  var provinces = [];
  for (var i in data) {
    if (i !== "Nederland") {
      provinces.push(i);
      for (var j in occupancies) {
        var dataValue = data[i][year][occupancies[j]];
        if (dataValue) {
          dataListBar.push(dataValue);
        }
        else {
          dataListBar.push(0);
        }
      };
    };
  };

  // create bars
  var step = 0;
  var bars = svg.selectAll("rect")
                .data(dataListBar)
                .enter()
                .append("rect")
                // .attr("stroke", "black")
                // .attr("stroke-width", 2)
                .attr("width", param.width / scales[2] + "px")

                // add color of occupancy
                .attr("fill", function(d, i) {
                  var j = i % occupancies.length;
                  return occupancyColors[occupancies[j]];
                })

                // assign the same x for all stacked
                .attr("x", function(d, i) {
                  var j = parseInt(i / occupancies.length);
                  return scales[0](provinces[j]) +
                         param.width / (2 * scales[2]) + "px"
                })

                // add height for every province
                .attr("y", function(d, i) {
                  var j = i % occupancies.length;
                  if (j === 0) {
                    step = 0;
                  };
                  step += param.height + margin - scales[1](d);
                  return param.height + margin - step + "px";
                })

                // scale height
                .attr("height", function(d) {
                  return param.height + margin - scales[1](d) + "px";
                })

                // interactivity for mouse hovering
                .on("mouseover", function(d, i){
                  var j = i % occupancies.length;
                  d3.select(this)
                    .attr("opacity", 0.5);
                  tooltip.style("width", "200px")
                  return (tooltip.style("visibility", "visible")
                                 .text(occupancies[j] + ": " + d));
                })
                .on("mouseout", function(){
                  d3.select(this)
                    .attr("opacity", 1);
                  tooltip.style("width", "80px");
                  return (tooltip.style("visibility", "hidden"));
                })
                .on("mousemove", function(){
                  return tooltip.style("top", event.clientY -
                                       param.height / 8 + "px")
                                .style("left", event.clientX + "px");
                });
};

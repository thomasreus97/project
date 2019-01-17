/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Two functions;
- pieChart: creating a piechart
- pieUpdate: updating a piechart
*/


function piechart(data, name, year) {
  /*
  Make donut chart + legend + title
  Donut source: https://codepen.io/alexmorgan/pen/XXzpZP
  */

  // select svg
  var svg = d3.select("#mainDiv").select("#pieSvg");

  // put non-NaN data and keys into lists
  var dataSet = data[name][year];
  var dataList = [];
  var dataKeys = [];
  for (key in dataSet) {
    if (key !== "Total") {
      dataKeys.push(key);
      if (dataSet[key]){
        dataList.push(dataSet[key]);
      }
      else {
        dataList.push(0);
      };
    };
  };

  // get width and height of svg
  var svgSize = document.getElementById("pieSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // append g to svg
  var group = svg.append("g")
                 .style("position", "absolute")
                 .attr("transform", "translate(" + [width / 2,
                                                    width / 3 + margin] + ")");

  // define arc
  var arc = d3.arc()
              .innerRadius(0)
              .outerRadius(width / 3);

  // define the pie
  var pie = d3.pie()
              .value(function(d) {return d})
              .sort(null);

  // create arcs with the data
  var path = group.datum(dataList).selectAll("path")
                  .data(pie)
                  .enter()
                  .append("path")
                  .attr("d", arc)
                  .attr("fill", function(d) {
                    return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
                  })

                  // interactivity for mouse hovering
                  .on("mouseover", function(d) {
                    d3.select(this)
                      .attr("opacity", 0.5);
                    return (tooltip.style("visibility", "visible")
                                   .text(dataKeys[dataList.indexOf(d.data)] +
                                         ": " + d.data))
                                   .style("z-index", 9999);
                  })
                  .on("mouseout", function() {
                    d3.select(this)
                      .attr("opacity", 1);
                    return (tooltip.style("visibility", "hidden"));
                  })
                  .on("mousemove", function(d, i) {
                    return tooltip.style("top", event.clientY -
                                         param.height / 8 + "px")
                                  .style("left", event.clientX + "px");
                  })
                  .on("click", function(d) {
                    if (dataKeys[dataList.indexOf(d.data)] !== "Undefined"){
                      var chosenYear = d3.select("#sliderYear")
                                         .property("value");
                      var currOcc = dataKeys[dataList.indexOf(d.data)];
                      if (currentOccupancy !== currOcc) {
                        currentOccupancy = currOcc;
                        updateMap(data, chosenYear, currentOccupancy);
                        d3.select("#occupancyDropdown")
                          .property("value", currentOccupancy);
                      };
                    };
                  });

  // add title
  svg.append("text")
     .attr("class", "text")
     .attr("id", "pieTitle")
     .attr("transform",
           "translate("+[margin / 2, margin / 2]+")")
     .style("font-weight", "bold")
     .style("font-size", "20")
     .text(name + " (" + year + ")");
};


function pieUpdate(data, name, year) {
  /*
  Update pie chart
  */

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
    svg.append("text")
       .attr("id", "noData")
       .attr("transform",
             "translate(" + [width / 2, width / 3 + margin] + ")")
       .text("No Data Available");
  }
  else {
    svg.selectAll("#noData").remove();
  };

  // define arc
  var arc = d3.arc()
              .innerRadius(0)
              .outerRadius(width / 3);

  // define the pie
  var pie = d3.pie()
              .value(function(d) {return d})
              .sort(null);

  // create arcs with the data
  var pies = svg.selectAll("path").data(pie(dataList));
  pies.enter().append("path")
              .attr("d", arc)
              // .attr("stroke", "black")
              // .attr("stroke-width", 0.2)
              .attr("fill", function(d) {
                return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
              });

  pies.transition()
      .duration(10)
      .attr("d", arc)
      .attr("fill", function(d) {
        return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
      });

  pies.exit().remove();

  // update on click with new data
  svg.selectAll("path")
     .on("click", function(d) {
       if (dataKeys[dataList.indexOf(d.data)] !== "Undefined"){
         var chosenYear = d3.select("#sliderYear").property("value");
         var currOcc = dataKeys[dataList.indexOf(d.data)];
         if (currentOccupancy !== currOcc) {
           currentOccupancy = currOcc;
           updateMap(data, chosenYear, currentOccupancy);
           d3.select("#occupancyDropdown")
             .property("value", currentOccupancy);
         };
       }
     })
     .on("mouseover", function(d) {
       d3.select(this)
         .attr("opacity", 0.5);
       return (tooltip.style("visibility", "visible")
                      .text(dataKeys[dataList.indexOf(d.data)] +
                            ": " + d.data))
                      .style("z-index", 9999);
     });

  // update title
  d3.select("#pieTitle")
    .transition()
    .attr("class", "text")
    .text(name + " (" + year + ")");
};

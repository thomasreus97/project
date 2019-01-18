/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Two functions;
- pieChart: creating a piechart
- pieUpdate: updating a piechart
*/


function pieUpdate(data, name, year, currentOccupancies, update) {
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
             "translate(" + [width / 2 - margin, width / 3 + margin] + ")")
       .text("No Data Available");
  }
  else {
    svg.selectAll("#noData").remove();
  };

  // create or select g
  if (update) {

    // select group
    var group = svg.select("#groupG")
  }
  else {

    // append g to svg
    var group = svg.append("g")
                   .attr("id", "groupG")
                   .style("position", "absolute")
                   .attr("transform", "translate("+[width / 2,
                                                    width / 3 + margin]+")");
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
  var pies = group.datum(dataList).selectAll("path").data(pie);

  pies.exit().remove();

  // enter new data
  pies.enter().append("path")
              .attr("d", arc)
              .attr("fill", function(d) {
                return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
              });

  // transition updated data
  pies.transition()
      .duration(10)
      .attr("d", arc)
      .attr("fill", function(d) {
        return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
      });

  // update on click with new data
  svg.selectAll("path")
     .attr("stroke", "black")
     .attr("stroke-width", function(d) {
       var currOcc = dataKeys[dataList.indexOf(d.data)];
       if (currentOccupancy === currOcc) {
         d3.select(this).moveToFront();
         return 3;
       }
       else {
         d3.select(this).moveToBack();
         return 0;
       };
     })
     .attr("opacity", function(d) {
       var currOcc = dataKeys[dataList.indexOf(d.data)];
       if (currentOccupancies.indexOf(currOcc) > -1) {
         return 1;
       }
       else {
         return 0.3;
       };
     })
     .on("click", function(d) {

       // current occupancy, year and name
       var currOcc = dataKeys[dataList.indexOf(d.data)];
       var chosenYear = d3.select("#sliderYear").property("value");
       var chosenName = d3.select("#provinceDropdown").property("value");

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

       // change legend opacities when occupancy wasnt selected
       // and update barchart and piechart
       if (currentOccupancies.indexOf(currOcc) < 0) {
         currentOccupancies.push(currOcc);
         updateBar(data, chosenYear, currentOccupancies);
         pieUpdate(data, chosenName, chosenYear, currentOccupancies, true);
         d3.selectAll(legendBlocks)
           .attr("opacity", function(d) {
             if (currentOccupancies.indexOf(d) < 0) {
               return 0.3;
             }
             else {
               return 1;
             };
           })
       };
     })
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
         .attr("opacity", function(d) {
           var currOcc = dataKeys[dataList.indexOf(d.data)];
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

  // create or update title
  if (update) {

    // update title
    d3.select("#pieTitle")
      .transition()
      .attr("class", "text")
      .text(name + " (" + year + ")");
  }
  else {

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
};

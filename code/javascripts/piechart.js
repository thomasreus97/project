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

  // append g to svg
  var group = svg.append("g")
                 .style("position", "absolute")
                 .attr("transform",
                       "translate(" + [param.width / 2 + margin,
                                       param.height / 2 + margin] + ")");

  // define arc
  var arc = d3.arc()
              .innerRadius(param.radius * 0)
              .outerRadius(param.radius);

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
                  // .attr("stroke", "black")
                  // .attr("stroke-width", 0.2)
                  .attr("fill", function(d) {
                    return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
                  })

                  // interactivity for mouse hovering
                  .on("mouseover", function(d){
                    d3.select(this)
                    return (tooltip.style("visibility", "visible")
                                   .text(d.data))
                                   .style("z-index", 9999);
                  })
                  .on("mouseout", function(){
                    d3.select(this)
                    return (tooltip.style("visibility", "hidden"));
                  })
                  .on("mousemove", function(d, i){
                    return tooltip.style("top", event.clientY -
                                         param.height / 8 + "px")
                                  .style("left", event.clientX + "px");
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
      if (dataSet[key]){
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

  // show message when no data avaiable
  if (noData) {
    svg.append("text")
       .attr("id", "noData")
       .attr("transform",
             "translate(" + [param.width / 2 + margin / 2,
                             param.height / 2 + margin] + ")")
       .text("No Data Available");
  }
  else {
    svg.selectAll("#noData").remove();
  };

  // define arc
  var arc = d3.arc()
              .innerRadius(param.radius * 0)
              .outerRadius(param.radius);

  // define the pie
  var pie = d3.pie()
              .value(function(d) {return d})
              .sort(null);

  // create arcs with the data
  svg.selectAll("path")
     .data(pie(dataList))
     .transition()
     .attr("d", arc)
     .attr("fill", function(d) {
       return occupancyColors[dataKeys[dataList.indexOf(d.data)]];
     });

  // update title
  d3.select("#pieTitle")
    .transition()
    .attr("class", "text")
    .text(name + " (" + year + ")");
};

/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Two functions;
- pieChart: creating a piechart
- pieUpdate: updating a piechart
*/


function piechart(data) {
  /*
  Make donut chart + legend + title
  Donut source: https://codepen.io/alexmorgan/pen/XXzpZP
  */

  // select svg
  var svg = d3.select("#mainDiv").select("#pieSvg");

  // take first name and year (initialisation)
  var name = Object.keys(data)[0];
  var year = Object.keys(data[name])[0];

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
  group = svg.append("g")
     .style("position", "absolute")
     .attr("transform",
           "translate(" + [param.width / 2 + margin,
                           param.height / 2 + margin] + ")");

  // define arc
  arc = d3.arc()
              .innerRadius(param.radius * 0.4)
              .outerRadius(param.radius);

  // define the pie
  pie = d3.pie()
              .value(function(d) {return d})
              .sort(null);

  // create arcs with the data
  path = group.datum(dataList).selectAll("path")
                  .data(pie)
                  .enter()
                  .append("path")
                  .attr("d", arc)
                  // .attr("stroke", "black")
                  // .attr("stroke-width", 0.2)
                  .attr("fill", function(d) {
                    return occupationColors[dataKeys[dataList.indexOf(d.data)]];
                  })

                  // interactivity for mouse hovering
                  .on("mouseover", function(d){
                    d3.select(this)
                      .attr("stroke", "#e6550d")
                    return (tooltip.style("visibility", "visible")
                                   .text(d.data))
                                   .style("z-index", 9999);
                  })
                  .on("mouseout", function(){
                    d3.select(this)
                      .attr("stroke", "black")
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
     .text(name);
};


function pieUpdate(data, name, year) {
  /*
  Update pie chart
  */

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

  // pie.value(function(d) { return d; });
  // path = path.data(pie);
  // path.transition().duration(750).attrTween("d", arcTween());

  // // if not available reset
  // if (data[0] === "") {
  //   return pieUpdate(data, "Nederland", year);
  // };

  // create arcs with the data
  var arcs = group.selectAll("path")
                  .data(pie(dataList))
                  .transition()
                  .attr("d", arc)
                  .attr("fill", function(d) {
                    return occupationColors[dataKeys[dataList.indexOf(d.data)]];
                  });

  // update title
  d3.select("#pieTitle")
    .transition()
    .attr("class", "text")
    .text(name);

  // function arcTween(a) {
  //   var i = d3.interpolate(this._current, a);
  //   this._current = i(0);
  //   return function(t) {
  //     return arc(i(t));
  //   };
  // }
};

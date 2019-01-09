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
    if (key !== "Total" && dataSet[key]) {
      dataKeys.push(key);
      dataList.push(dataSet[key]);
    };
  };
  console.log(dataList)
  console.log(dataKeys)

  // append group to svg
  group = svg.append("g")
             .attr("transform",
                   "translate(" + [param.width / 2 + margin,
                                   param.height / 2 + margin] + ")");

  // define arc
  arc = d3.arc()
          .innerRadius(param.radius * 0.4)
          .outerRadius(param.radius);

  // define the pie
  pie = d3.pie()
          .padAngle(.015)
          .value(function(d) {return d});

  // create arcs with the data
  var arcs = group.selectAll("arc")
                  .data(pie(dataList))
                  .enter()
                  .append("g")
                  .attr("class", "arc");

  // fill the arcs
  arcs.append("path")
      .attr("d", arc)
      .attr("stroke", "black")
      .attr("stroke-width", 0.2)
      .attr("fill", function(d) {
        return occupationColors[dataKeys[dataList.indexOf(d.data)]]
      })

      // interactivity for mouse hovering (how value and change color bar)
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


function pieUpdate(allData, name, year) {
  /*
  Update pie chart
  */

  // put needed data into lists
  var dataSet = allData[year][name];
  var data = [];
  for (key in dataSet) {
    data.push(dataSet[key])
  };
  var total = data[0];
  data = data.slice(1);
  data.push(total - data.reduce(function(a, b) { return parseInt(a) +
                                                 parseInt(b); }, 0));

  // if not available reset
  if (data[0] === "") {
    return pieUpdate(allData, "Nederland", year);
  };

  // create arcs with the data
  var arcs = group.selectAll("path")
                  .data(pie(data))
                  .transition()
                  .attr("d", arc);

  // update title
  d3.select("#pieTitle")
    .transition()
    .attr("class", "text")
    .text("Distribution births with a non-western migration background of " +
          name + " (total births: " + total + ")");
};

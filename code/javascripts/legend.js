/*
Name: Thomas Reus
Student number: 11150041
Assignment: linked views D3

Creates the legend
*/


function makeLegend(data, occupanciesList) {
  /*
  Makes legend for different occupancies
  */

  // make list with occupancies (remove total form list)
  var occupancies = occupanciesList.slice();
  occupancies.shift();

  var currentOccupancies = occupancies.slice();

  // make the two parts of legend
  legendPart([0, Math.round(occupancies.length / 2)], 1, "legendOrdinal");
  legendPart([Math.round(occupancies.length / 2), occupancies.length], 2,
             "legendOrdinal2");

  // add interactivity to legend boxes
  var blocks = d3.select("#legendSvg").selectAll(".swatch")
                 .attr("stroke", "black")
                 .attr("stroke-width", 2)
                 .attr("id", "legendBlocks")
                 .on("click", function(i) {
                   var chosenYear = d3.select("#sliderYear").property("value");
                   var chosenName = d3.select("#provinceDropdown")
                                      .property("value");
                   var index = currentOccupancies.indexOf(i);
                   if (index > -1) {
                     currentOccupancies.splice(index, 1);
                     d3.select(this)
                       .attr("opacity", 0.3);
                   }
                   else {
                     currentOccupancies.push(i);
                     d3.select(this)
                       .attr("opacity", 1);
                   };
                   updateBar(data, chosenYear, currentOccupancies);
                   pieUpdate(data, chosenName, chosenYear, currentOccupancies,
                             true);
                 });

  return currentOccupancies;
};


function legendPart(range, number, name) {
  /* creates one part of a legend */

  // select svg
  var svg = d3.select("#legendSvg");

  // get width and height of svg
  var svgSize = document.getElementById("legendSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // make scale, slice for range
  var ord = d3.scaleOrdinal()
              .domain(Object.keys(occupancyColors).slice(range[0], range[1]))
              .range(Object.values(occupancyColors).slice(range[0], range[1]));

  svg.append("g")
     .attr("class", name)
     .attr("transform", "translate(" + [number * width / 4, height / 5] + ")");

  var legOrd = d3.legendColor()
                 .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                 .shapePadding(10)
                 .scale(ord);

  // draw legend
  svg.select(`.${name}`)
     .call(legOrd);

};

function descriptionFunction(input) {
  return "information about: " + input;
};

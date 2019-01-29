/*
Name: Thomas Reus
Student number: 11150041
Assignment: linked views D3

Creates a legend for the 8 different occupations
(including Undefined) Adds (de)select possibility to
the legend and updates pie and barchart accordingly.
*/


function makeLegend(data) {
  /*
  Function that calls the legendpart function
  two times to create the desired legend.
  Adds onclick to legend boxes to update the
  currentOccupancies list and the map and barchart accordingly:
  - barchart only from selected parts
  - piechart and legend have selection indicated by opacity
  */

  // make list with occupancies (remove total from list)
  var occupancies = globalOccupancies.slice();
  occupancies.shift();

  // list with the currently selected occupancies
  var currentOccupancies = occupancies.slice();

  // make the two parts of legend
  legendPart([0, Math.round(occupancies.length / 2)], 1, "legendOrdinal");
  legendPart([Math.round(occupancies.length / 2), occupancies.length], 2,
             "legendOrdinal2");

  // add id and interactivity to the legend boxes (.swatch)
  d3.select("#legendSvg").selectAll(".swatch")
    .attr("id", "legendBlocks")

    // on click ask year and location and update bar and piechart accordingly
    .on("click", function(i) {
     var chosenYear = d3.select("#sliderYear").property("value");
     var chosenName = d3.select("#provinceDropdown")
                        .property("value");

     // check if clicked uccupancy was selected or not and (de)select
     // selection is indicated by occupancy
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

     // update map and barchart
     updateBar(data, chosenYear, currentOccupancies, true);
     pieUpdate(data, chosenName, chosenYear, currentOccupancies,
               true);
    })

    // adds a fancy pointer on mouseover (to indicate you can click)
    .on("mouseover", function() {
      d3.select(this).style("cursor", "pointer");
    });

  // return list with currentOccupancies for use in barchart and pie functions
  return currentOccupancies;
};


function legendPart(range, number, name) {
  /*
  Creates one part of a legend with given range and
  indicators using legendColor().
  Number makes sure that the horizontal spacing
  between the two part is correct.
  Name is used for classifying the different g's.
  */

  // select svg
  var svg = d3.select("#legendSvg");

  // get width and height of svg for appending locations
  var svgSize = document.getElementById("legendSvg");
  var width = svgSize.clientWidth;
  var height = svgSize.clientHeight;

  // make scale, slice for range
  var ord = d3.scaleOrdinal()
              .domain(Object.keys(occupancyColors).slice(range[0], range[1]))
              .range(Object.values(occupancyColors).slice(range[0], range[1]));

  // create g for legend
  svg.append("g")
     .attr("class", name)
     .attr("transform", "translate(" + [(number - 1) * width / 3 + width / 4,
                                        height / 5] + ")");

  // add legend boxes and text to the g
  var legOrd = d3.legendColor()
                 .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                 .shapePadding(10)
                 .scale(ord);

  // draw legend
  svg.select(`.${name}`)
     .call(legOrd);
};

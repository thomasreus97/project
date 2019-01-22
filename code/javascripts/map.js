/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: interactive map of the Netherlands
*/


function mapNetherlands(data, year, currentOccupancy, currentOccupancies) {
  /*
  Creates map of the Netherlands
  */

  // all data
  var allData = [];
  for (i in data){
    if (i !== "Nederland") {
      for (j in data[i]) {
        if (data[i][j][currentOccupancy]) {
          allData.push(data[i][j][currentOccupancy])
        };
      };
    };
  };

  // parse data into list
  var dataList = [];
  var provinces = [];
  for (i in data) {
    provinces.push(i);
    dataList.push(data[i][year][currentOccupancy]);
  }
  dataList.shift();
  provinces.shift();

  // add data to indentifier
  dataMapFull = {};
  dataMap = {};
  for (i = 0; i < dataList.length; i++) {
    dataMapFull[indentifiers[i]] = dataList[i];
    if (dataList[i]) {
      dataMap[indentifiers[i]] = dataList[i];
    };
  };

  // provinces where data is NaN
  var nanProv = $(Object.keys(dataMapFull)).not(Object.keys(dataMap)).get();
  colorNanProv = {};
  for (i in nanProv) {
    colorNanProv[nanProv[i]] = '#ece7f2';
  };

  // print message when no data available
  errorMessage(colorNanProv, dataList);

  // change title
  d3.select("#mapTitle").text("Km\xB2 " + currentOccupancy + " per province" +
                              " in " + year);

  // place map nl, adapted from: http://jvectormap.com/
  $(function(){
    $('#mapDiv').vectorMap({
      map: 'nl_merc',
      backgroundColor: '#ece7f2',
      regionStyle: {
        hover: { 'fill-opacity': 0.5 }
      },
      series: {
        regions: [{

          // add color scale with legend
          attribute: 'fill',
          values: dataMap,
          min: jvm.min(allData),
          max: jvm.max(allData),
          scale: colorScales[currentOccupancy],
          normalizeFunction: 'lineal',
          legend: {
            horizontal: true,
            title: currentOccupancy + " (km\xB2)" ,
          }
        },

        // fill provinces with NaN values
          {
          values: colorNanProv,
          attribute: 'fill',
        }]
      },

      // show text with name and occupancy on hover
      onRegionTipShow: function(event, label, code){
        label.html(
          '<b>'+label.html()+'</b></br>'+
          '<b>'+currentOccupancy+': </b>'+dataMapFull[code]+' km\xB2'
        );
      },

      // update other visualisations on click
      onRegionClick: function(e, regio, code) {
        var province = provinces[Object.keys(dataMapFull).indexOf(regio)];
        var chosenYear = d3.select("#sliderYear").property("value");
        d3.select("#provinceDropdown").property("value", province);
        var chosenProvince = d3.select("#provinceDropdown").property("value")
        pieUpdate(data, chosenProvince, chosenYear, currentOccupancies, true);
      }
    })
  });
};


function updateMap(data, year, currentOccupancy, currentOccupancies) {
  /*
  reset map and legend
  */
  var mapObject = $('#mapDiv').vectorMap('get', 'mapObject').remove();
  mapNetherlands(data, year, currentOccupancy, currentOccupancies);
};


function yearUpdateMap(data, year, currentOccupancy, currentOccupancies) {

  // update title
  d3.select("#mapTitle").transition()
                        .text("Km\xB2 " + currentOccupancy + " per province" +
                              " in " + year);

  // get data
  var dataList = [];
  var provinces = [];
  for (i in data) {
    provinces.push(i);
    dataList.push(data[i][year][currentOccupancy]);
  }
  dataList.shift();
  provinces.shift();

  // add data to indentifier
  dataMapFull = {};
  dataMap = {};
  for (i = 0; i < dataList.length; i++) {
    dataMapFull[indentifiers[i]] = dataList[i];
    if (dataList[i]) {
      dataMap[indentifiers[i]] = dataList[i];
    };
  };

  // provinces where data is NaN
  var nanProv = $(Object.keys(dataMapFull)).not(Object.keys(dataMap)).get();
  colorNanProv = {};
  for (i in nanProv) {
    colorNanProv[nanProv[i]] = '#ece7f2';
  };

  // print message when no data available
  errorMessage(colorNanProv, dataList);

  // select map object
  var mapObject = $('#mapDiv').vectorMap('get', 'mapObject');

  // update graph variables
  mapObject.series.regions[0].clear();
  mapObject.series.regions[1].clear();
  mapObject.series.regions[0].setValues(dataMap);
  mapObject.series.regions[1].setValues(colorNanProv);
};


function errorMessage(listNoData, listAll) {
  /*
  checks if all data is unavailable
  if so, shows message: "No data available"
  */

  d3.selectAll("#noDataMap").remove();
  if (Object.keys(listNoData).length === listAll.length) {
    d3.select("#errorDiv").append("text")
      .attr("id", "noDataMap")
      .text("No Data Available");
  };
};

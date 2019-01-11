/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: interactive map of the Netherlands
*/

function mapNetherlands(data) {
  /*
  Creates map of the Netherlands
  */

  var year = 1950;
  var occupancy = "Traffic";

  // parse data into list
  var dataList = [];
  var provinces = [];
  for (i in data) {
    provinces.push(i);
    dataList.push(data[i][year][occupancy]);
  }
  dataList.shift();
  provinces.shift();

  // add data to indentifier
  var dataMapFull = {};
  var dataMap = {};
  for (i = 0; i < dataList.length; i++) {
    dataMapFull[indentifiers[i]] = dataList[i];
    if (dataList[i]) {
      dataMap[indentifiers[i]] = dataList[i];
    };
  };

  // provinces where data is NaN
  var nanProv = $(Object.keys(dataMapFull)).not(Object.keys(dataMap)).get();
  var colorNanProv = {};
  for (i in nanProv) {
    colorNanProv[nanProv[i]] = '#ece7f2';
  };

  // place map nl, adapted from: http://jvectormap.com/
  $(function(){
    $('#mapDiv').vectorMap({
      map: 'nl_merc',
      backgroundColor: '#ece7f2',
      regionStyle: {
        hover: { 'fill-opacity': 1 }
      },
      series: {
        regions: [{

          // add color scale with legend
          attribute: 'fill',
          values: dataMap,
          scale: colorScales[occupancy],
          normalizeFunction: 'polynomial',
          legend: {
            horizontal: true,
            title: occupancy + " (km\xB2)" ,
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
          '<b>'+occupancy+': </b>'+dataMapFull[code]+' km\xB2'
        );
      },

      // update other visualisations on click
      onRegionClick: function(e, regio, code) {
        var province = provinces[Object.keys(dataMapFull).indexOf(regio)];
        pieUpdate(data, province, year);
        // d3.select("#provinceDropdown").property("value") = province;
      }
    })
  });
};

function updateMap(data, year, occupancy) {

};

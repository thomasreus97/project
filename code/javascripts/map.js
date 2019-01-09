/*
Name: Thomas Reus
Student number: 11150041
Project: dataprocessing

Creates: interactive map of the Netherlands
*/

function mapNetherlands() {

  // place map nl, adapted from: http://jvectormap.com/
  $(function(){
    $('#mapDiv').vectorMap({
      map: 'nl_merc',
      backgroundColor: '#ece7f2'
      // focusOn: {
      //   x: 2,
      //   y: -0.2,
      //   scale: 7
      // }
    });
  });
};

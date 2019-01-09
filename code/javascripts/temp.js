var map = jQuery(document).ready(function($){
	$('#mapid').vectorMap({map: 'world_mill', backgroundColor: '#ffffff',
             lines: lines,
             lineToggleButton: true,
             lineDefaultDisplay: true,
             lineToggleButtonLabel: 'Road visibility:',
             markers: pointsOfTheRoad,
onRegionClick: function (e, code) {
//disable clicking on disabled regions
     if ( isCountryDisabled(code) )
                    { e.preventDefault();
    }else{
    //or if specified to be enabled then enable click to Country name
        var map = $('#mapid').vectorMap('get', 'mapObject');
        var country = getCountryDetails(code);
       if(country.link  === undefined){
        window.location.href = "/map/" + map.getRegionName(code);
       }else if(country.link=='disable'){
          e.preventDefault();
       }else{
          window.location.href = "/map/" + country.link;
       }
    }
}, onRegionOver:function(e, code){
//disable hovering on disabled regions
    if ( isCountryDisabledForLink(code) )
                    {e.preventDefault();}
},
onRegionTipShow: function(e, label, code){
    //hovering disabled for disabled regions
    if ( isCountryDisabled(code) )
        {
            e.preventDefault();
            label.html( '<b>'+label.html()+' - test</b>');
            return false;
        }
    var country = getCountryDetails(code);
    if(country === undefined) {
        label.html( '<b>'+label.html()+'</b>');
    }else{
        label.html( '<b>'+label.html()+' - '+country.en+'</b>');
    }
 },
regionStyle: {
	  initial: {
                //Default color for countries (light grey)
		fill: '#E5E5E5',
		"fill-opacity": 1,
		stroke: '#ffffff',
		"stroke-width": 0.1,
		"stroke-opacity": 1
	  },
	  hover: {
		"fill-opacity": 0.8,
		cursor: 'pointer'
	  },
	  selected: {
		fill: 'yellow'
	  },
	  selectedHover: {
	  }
	},
lineStyle:{
                    initial:{
                        stroke:'#666'
                    },
                    selected: {
                        stroke: 'red'
                    }
                },
series: {
          regions: [{
            //Color for Dark countries
            scale: ['#bac0c6', '#9f2742'],
            normalizeFunction: 'linear',
            values: regions.reduce(function(p, c){
             p[c.name] = c.status;
              return p;
               },{}
               ),
          }]
        }
});
});

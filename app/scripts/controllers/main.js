'use strict';

angular.module('myappApp')
  .controller('MainCtrl', ['$scope','$http','$window','leafletData',function ($scope, $http,$window,leafletData) {
  	$scope.center = {
	    lat: 22.280727,
	    lng: 114.165079,
	    zoom: 14
  	}

    $scope.defaults = {
            // crs: 'Simple',
            reuseTiles:true,
            maxZoom: 17,
            minZoom:15
    };

console.log(leafletData);
    var promise =  leafletData.getMap();
promise.finally(function() {
    console.log('failed');
})
// $scope.doSth = function() {
leafletData.getMap('map').then(function(map) {
var locateControl = $window.L.control.locate({
    position: 'topleft',  // set the location of the control
    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
    follow: false,  // follow the user's location
    setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
    locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);

locateControl.locate();
});
    
// };


// $window.L.control.locate({
//     position: 'topleft',  // set the location of the control
//     drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
//     follow: false,  // follow the user's location
//     setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
//     keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
//     stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
//     // markerClass: L.circleMarker, // L.circleMarker or L.marker
//     circleStyle: {},  // change the style of the circle around the user's location
//     markerStyle: {},
//     followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
//     followMarkerStyle: {},
//     icon: 'icon-location',  // `icon-location` or `icon-direction`
//     iconLoading: 'icon-spinner  animate-spin',  // class for loading icon
//     circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
//     metric: true,  // use metric or imperial units
//     onLocationError: function(err) {alert(err.message)},  // define an error callback function
//     // onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
//     //         alert(context.options.strings.outsideMapBoundsMsg);
//     // },
//     strings: {
//         title: "Show me where I am",  // title of the locate control
//         popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle
//         outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
//     }
//     locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
// }]).addTo($window.map);


    $scope.markerTypes = [
        { "key":"water", "checked": true, "name": "水機"},
        { "key":"wifi", "checked": false, "name": "Wi-Fi"},
        { "key":"toilet", "checked": false, "name": "廁所"},
        { "key":"recycle", "checked": false, "name": "回收桶"}
    ];

	$scope.alldata = [];
	$scope.markers = [];
    var local_icons = {
        'defaultIcon': {},
        'water': {
            iconUrl: 'images/water.png',
            iconSize:     [32, 35], // size of the icon            
            iconAnchor:   [19, 22] // point of the icon which will correspond to marker's location            
        },
        'wifi': {
            iconUrl: 'images/wifi.png',
            iconSize:     [32, 35], // size of the icon            
            iconAnchor:   [20, 19] // point of the icon which will correspond to marker's location            
        },
        'toilet': {
            iconUrl: 'images/toilet.png',
            iconSize:     [32, 35], // size of the icon            
            iconAnchor:   [20, 19] // point of the icon which will correspond to marker's location            
        },
        'recycle': {
            iconUrl: 'images/recycle.png',
            iconSize:     [32, 35], // size of the icon            
            iconAnchor:   [20, 19] // point of the icon which will correspond to marker's location            
        }
    };
  	$http.get('https://spreadsheets.google.com/feeds/list/0AgDEdGmA1LoQdHdScTBZUkF5ejJSV3lra0FJVUhxMGc/1/public/values?alt=json')
       .then(function(res){

			var rawdata = res.data.feed.entry;
			var lefttop = {"lat" : 22.291597, "lng" : 114.119932};
			var rightbot = {"lat" : 22.274373, "lng" : 114.196150};

			for (var i = 0; i < rawdata.length; i++){
				var templat = parseFloat(rawdata[i].gsx$lat.$t);
				var templng = parseFloat(rawdata[i].gsx$lng.$t);
				if (templat > rightbot.lat && templat < lefttop.lat && templng > lefttop.lng && templng < rightbot.lng){
					var tempdata = {
						"lat" : templat,
						"lng" : templng,
						"type" : rawdata[i].gsx$type.$t,
						"message" : rawdata[i].gsx$address.$t,
                        "icon" : local_icons[rawdata[i].gsx$type.$t]


					};
                    

					$scope.alldata.push(tempdata);
				}
			}
			$scope.markers = $scope.alldata;
       	});
       
    $scope.layers = {
        baselayers: {
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        }
    };
    $scope.changed = function(){
    	$scope.markers = [];
    	for (var i = 0; i < $scope.alldata.length; i++){
            for (var j = 0; j < $scope.markerTypes.length; j++)
                if ($scope.alldata[i].type === $scope.markerTypes[j].key && $scope.markerTypes[j].checked)
                    $scope.markers.push($scope.alldata[i]);    
    	}
    }
  }]);

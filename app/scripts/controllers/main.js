'use strict';

angular.module('myappApp')
  .controller('MainCtrl', function ($scope, $http) {
  	$scope.london = {
	    lat: 22.280727,
	    lng: 114.165079,
	    zoom: 14
  	}

    $scope.markerTypes = [
        { "key":"water", "checked": true, "name": "水機"},
        { "key":"wifi", "checked": true, "name": "Wi-Fi"},
        { "key":"toilet", "checked": true, "name": "廁所"},
        { "key":"recycle", "checked": true, "name": "回收桶"}
    ];

	$scope.alldata = [];
	$scope.markers = [];
    var local_icons = {
        'defaultIcon': {},
        'leafIcon': {
            iconUrl: 'img/leaf-green.png',
            shadowUrl: 'img/leaf-shadow.png',
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        },
        'redMarker': L.AwesomeMarkers.icon({
								    icon: 'home',
								    markerColor: 'red'
							  	})
    };
    console.log(local_icons);
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
						"message" : rawdata[i].gsx$address.$t
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
  });

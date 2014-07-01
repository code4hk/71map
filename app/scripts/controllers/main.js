'use strict';

angular.module('myappApp')
  .controller('MainCtrl', function ($scope, $http) {
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
    }

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
  });

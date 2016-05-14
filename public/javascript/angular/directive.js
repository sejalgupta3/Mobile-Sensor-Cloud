sensorCloudApp.directive('myMap', function() {
	// directive link function
	var link = function(scope, element, attrs) {
		console.log(scope);
		var map, infoWindow;
		var markers = [];
        var haightAshbury = {lat: 37.769, lng: -122.446};

        // map config
        var mapOptions = {
            center: haightAshbury,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            scrollwheel: false
        };

        // init the map
        function initMap() {
        	if (map === void 0) {
        		map = new google.maps.Map(element[0], mapOptions);
        	}
        }

        // place a marker
        function setMarker(map, position, title, id ,content, status, user) {
            var marker;
            var color;
            if(status == 'active'){
            	color = 'green';
            }else{
            	color = 'red';
            }
            var markerOptions = {
                position: position,
                map: map,
                title: title,       
                icon: 'https://maps.google.com/mapfiles/ms/icons/'+color+'-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array

            google.maps.event.addListener(marker, 'click', function () {
            	// close window if not undefined
            	if (infoWindow !== void 0) {
            		infoWindow.close();
                }
                
                // create new window
                infoWindow = new google.maps.InfoWindow();
                if(scope.user == 'admin'){
                    infoWindow.setContent('<div><strong>' + title + '</strong></div><div>'+ content +'</div><div><a href="#/stationData/'+id+'">Read More</a></div>');
                }else{
                    infoWindow.setContent('<div><strong>' + title + '</strong></div><div>'+ content +'</div><div><a href="#/userSensorData/'+id+'">Read More</a></div>');
                }
                infoWindow.open(map, marker);
            });
        }

        function setMapOnAll(map) {
        	for (var i = 0; i < markers.length; i++) {
        		markers[i].setMap(map);
        	}
        }

        function deleteMarkers() {
        	clearMarkers();
        	markers = [];
        }

        function clearMarkers() {
        	setMapOnAll(null);
        }
        
        // show the map and place some markers
        initMap();
        
        scope.$watch(function($scope) {
        	return {stations:scope.stations, sensors:scope.sensors};
        }, function(newVal, oldVal, scope){
        	deleteMarkers();
        	for(index in newVal.stations){
        		var station = newVal.stations[index];
        		var sensorList = '';
        		for(index in newVal.sensors){
        			var sensor = newVal.sensors[index];
        			if(sensor.stationId == station.stationId){
            			if(index == newVal.sensors.length-1){
            				sensorList = sensorList + ' ' + sensor.sensorType
            			}else{
            				sensorList = sensorList + ' ' + sensor.sensorType + ','
            			}  	
        			}
        		}
        		setMarker(map, new google.maps.LatLng(station.stationLat, station.stationLong), station.stationName, station.stationId, sensorList, station.stationStatus);
        	}
        }, true);
    };

    return {
    	restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope: {
        	stations : '=',
        	sensors : '=',
        	user: '@user'
        },
        link: link
    };
});

sensorCloudApp.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        var haightAshbury = {lat: 37.769, lng: -122.446};
        
        // map config
        var mapOptions = {
            center: haightAshbury,
            zoom: 4,
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
        function setMarker(map, position, title, content, status) {
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
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        
        for(index in scope.stations){
        	var station = scope.stations[index];
        	console.log(station);
        	setMarker(map, new google.maps.LatLng(station.lat, station.long), station.name, station.id, station.status);
        }
       
        
//        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
//        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
//        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope: {
        	stations : '='
        },
        link: link
    };
});


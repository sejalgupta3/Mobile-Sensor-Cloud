
var sensorColumn = {
		"WDIR":"5",
		"SPD":"6",
		"GST":"7",
		"WVHT":"8",
		"DPD":"9",
		"APD":"10",
		"MWD":"11",
		"PRES":"12",
		"ATMP":"13",
		"WTMP":"14",
		"DEWP":"15",
		"VIS":"16",
		"PTDY":"17",
		"TIDE":"18",
};

var sensorTypes = ["Air Temperature", "Conductivity", "Currents", "Salinity", "Sea Level Pressure", "Water Level", "Water Temperature", "Waves", "Winds"];

var stations = [];
var http = require('http');

exports.getStationList = function(req, res) {
    res.send(stations);
}

exports.addStation = function (req, res) {
	stations.push(req.body);
	res.send(stations);
};

exports.editStation = function (req, res) {
    var stationId = req.param("id");
    var stationName = req.param("name");
    var stationLat = req.param("lat");
    var stationLong = req.param("long");
    var stationStatus = req.param("status");
     console.log(req.param("id"));
     console.log(stationId);


    for (index in stations) {
        var station = stations[index]
        if(station.id == stationId){
        	console.log(station.id);
            station.name = stationName;
            station.lat = stationLat;
            station.long = stationLong;
            station.status = stationStatus;
            stations[index] = station;
        }
    }
	res.send("edit successful");
};

exports.deleteStation = function (req, res) {
    var stationId = req.param("id");
    console.log(stationId);
    for (index in stations) {
        var station = stations[index]
        if(station.id == stationId){
            stations.splice(index,1);
        	res.send(stations);
        }
    }
};

exports.addSensor = function (req, res) {
    var stationId = req.param("station");
    var sensorName = req.param("name");
    var sensorType = req.param("type");
    var sensorStatus = req.param("status");

    var sensorToadd = { name: sensorName, type : sensorType, status : sensorStatus}

    var station;
    console.log(stations);
    for (stationIndex in stations){
         station = stations[stationIndex]
         console.log(station.Id)
          console.log(stationId)

        if(station.id == stationId){
        	console.log(station);
        	console.log(station.sensorList);
            station.sensorList.push(sensorToadd);
        }
    }
	res.send(station);
};

exports.editSensor = function (req, res) {
    var stationId = req.param("station");
    var sensorName = req.param("name");
    var sensorType = req.param("type");
    var sensorStatus = req.param("status");

    var sensorToUpdate = { name: sensorName, type : sensorType, status : sensorStatus}

    var station;
    for (stationIndex in stations){
         station = stations[stationIndex]
        if(station.id == stationId){
        	console.log(station.Id);
        	console.log(station);
        	station.sensorList.splice(stationIndex,1,sensorToUpdate);
        }
    }
	res.send(station);
};

exports.deleteSensor = function (req, res) {
    var stationId = req.param("id");
    var sensorName = req.param("name");
    var station;
    for (index in stations) {
     station = stations[index]
        if(station.id == stationId){
            var sensorList = station.sensorList;
            for (index in sensorList){
                var sensor = sensorList[index];
                if (sensor.name == sensorName) {
                    sensorList.splice(index,1);
                }
            }
        }
    }
	res.send(stations);
};

exports.getSensorTypes = function (req, res) {
	res.send(sensorTypes);
};

exports.showSelectedSensorTypeStations = function(req,res) {

    var requestedsensortype = req.param("selectedType")
    var requestedStations = [];

    if (requestedsensortype == "All") {
        requestedStations = stations;
    }else {
        for (var index in stations) {
            var station = stations[index];
            var sensorList = station.sensorList;

            for (id in sensorList) {
                var sensor = sensorList[id];
                var sensorType = sensor.type;
                if ( sensorType == requestedsensortype) {
                    requestedStations.push(station);
                    break;
                }
            }
        }
    }
    res.send(requestedStations);
}

exports.changeSensorStatus = function(req, res){
	var stationId = req.body.id;
	for(index in stations){
		var station = stations[index];
		if(stationId == station.id){
			if(station.status == 'active'){
				station.status = 'inactive';
			}else{
				station.status = 'active';
			}
			res.send("Success");
		}
	}
}

exports.getSensorLatestData = function(req, res){
	var stationId = req.body.id;
	return http.get({
        host: 'www.ndbc.noaa.gov',
        path: '/data/realtime2/'+stationId+'.txt'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        var prevDate = '';
        response.on('end', function() {
        	var data = body.split("\n");
        	var stationData = [];
        	for(var i=2; i<data.length; i++){
        		var dataRow = data[i].replace( /\s\s+/g, ' ' ).split(" ");
        		if(dataRow[2] != prevDate){
        			prevDate = dataRow[2];
        			var dataObject = {
                		date : '',
                		dataArray : []
                	}
            		dataObject.date = dataRow[1] + '/' + dataRow[2] +  '/' + dataRow[0];
        			for(index in stations){
        				var station = stations[index];
        				if(station.id == stationId){
        					for(j in station.sensorList){
        						var sensor = station.sensorList[j];
        						dataObject.dataArray.push({sensorId : sensor.name , data:  dataRow[sensorColumn[sensor.name]]});
        					}
        				}
        			}
            		stationData.push(dataObject);
        		}
        	}
            res.send(stationData);
        });
    });
}

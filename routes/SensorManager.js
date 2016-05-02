
//var station = {
//    name : "",
//    id : "",
//    lat : "",
//    long : "",
//    status : "",
//    sensorList : ""
//}

var stations = [];

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

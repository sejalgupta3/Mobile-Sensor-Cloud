
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

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/sensor";

var sensorTypes = ["Air Temperature", "Conductivity", "Currents", "Salinity", "Sea Level Pressure", "Water Level", "Water Temperature", "Waves", "Winds"];

var stations = [];
var http = require('http');

exports.getStationList = function(req, res) {
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('station');
		coll.find({}).toArray(function(err, result){
			if (result) {
				console.log(result);
				 res.send(result);

			} else {
				console.log("Problem Displaying station");
				res.send("Problem Displaying station ");
			}
		});
	});
}


exports.getStationDetails = function(req, res) {
	console.log("getStationDetails : " + req.body.id );
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('station');
		coll.find({stationId : req.body.id  }).toArray(function(err, result){
			if (result) {
				console.log(result);
				 res.send(result);

			} else {
				console.log("Problem Editing station");
				res.send("Problem Editing station ");
			}
		});
	});
}


exports.addStation = function (req, res) {
	var name , id  , lat, long ,status  ;
	name = req.body.name;
	id = req.body.id;
	lat = req.body.lat;
	long = req.body.long;
	status =  req.body.status;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('station');
		coll.insert({stationName: name, stationId:id, stationLat:lat, stationLong : long , stationStatus : status , counter : 0 }, function(err, result){
			if (result) {
				console.log( "Inserted Id " + result.insertedIds);
				res.send("Station Added Successful");

			} else {
				console.log("Problem in Adding station");
				res.send("Problem in Adding station ");
			}
		});
	});
};

exports.editStation = function (req, res) {
	var stationId = req.param("id");
    var stationName = req.param("name");
    var stationLat = req.param("lat");
    var stationLong = req.param("long");
    var stationStatus = req.param("status");
     console.log(req.param("id"));

     mongo.connect(mongoURL, function(){
 		console.log('Connected to mongo at: ' + mongoURL);
 		var coll = mongo.collection('station');
 		coll.update({ stationId: stationId },
 			   { $set:
 			      {
 				  stationName: stationName,
 				  stationLat: stationLat,
 				  stationLong: stationLong,
 				 stationStatus : stationStatus
 			      }
 			   },function(err, user){
 			if (user) {
 				res.send("Edit successful");

 			} else {
 				res.send("Error Editing Station");
 			}
 		});

 	});
};

exports.deleteStation = function (req, res) {
	var stationId = req.param("id");
    console.log("Delete id " + req.body.id + " " + stationId );
    mongo.connect(mongoURL, function(){
 		console.log('Connected to mongo at: ' + mongoURL);
 		var coll = mongo.collection('station');
 		var col2 = mongo.collection('sensor');
 		coll.remove({  stationId: stationId
 			   },function(err, user){
 			if (user) {
 				col2.remove({  stationId: stationId});
 				res.send("Delete successful");

 			} else {
 				res.send("Error Delete Station");
 			}
 		});

 	});
};



exports.addSensor = function (req, res) {
    var stationId = req.param("station");
    var sensorName = req.param("name");
    var sensorType = req.param("type");
    var sensorStatus = req.param("status");

    mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('sensor');
		coll.insert({sensorName: sensorName, sensorType:sensorType, sensorStatus:"active", stationId : stationId }, function(err, result){
			if (result) {
				console.log( "Inserted Id " + result.insertedIds);
				res.send("Sensor Added Successful");

			} else {
				console.log("Problem in Adding sensor");
				res.send("Problem in Adding sensor ");
			}
		});
	});
};

exports.editSensor = function (req, res) {
	var stationId = req.param("station");
    var sensorName = req.param("name");
    var sensorType = req.param("type");
    var sensorStatus = req.param("status");

    mongo.connect(mongoURL, function(){
 		console.log('Connected to mongo at: ' + mongoURL);
 		var coll = mongo.collection('sensor');
 		coll.update({ stationId: req.body.stationId , sensorName : req.body.selectedSensor },
 			   { $set:
 			      {
 				  sensorName: req.body.sensorName,
 				 sensorType : req.body.sensorType
 			      }
 			   },function(err, user){
 			if (user) {
 				res.send("Edit successful");

 			} else {
 				res.send("Error Editing Station");
 			}
 		});

 	});
};

exports.deleteSensor = function (req, res) {
    var stationId = req.param("id");
    var sensorName = req.param("name");
    var station;
    console.log("in delete sensorrrr " + stationId + " " + sensorName);
   mongo.connect(mongoURL, function(){
 		console.log('Connected to mongo at: ' + mongoURL);
 		var coll = mongo.collection('sensor');
 		coll.remove({  stationId: stationId , sensorName : sensorName
 			   },function(err, user){
 			if (user) {
 				console.log("done");
 				res.send("Delete sensor successful");

 			} else {
 				console.log("undone");
 				res.send("Error Delete sensor");
 			}
 		});

 	});
};

exports.getSensorTypes = function (req, res) {
	res.send(sensorTypes);
};

exports.getSensorList = function(req, res) {
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('sensor');
		coll.find({}).toArray(function(err, result){
			if (result) {
				console.log(result);
				 res.send(result);

			} else {
				console.log("Problem Displaying station");
				res.send("Problem Displaying station ");
			}
		});
	});
};

exports.getSensorDetails = function(req, res) {
	console.log("getSensorDetails : " + req.body.stationId );
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('sensor');
		coll.find({stationId : req.body.stationId , sensorName : req.body.sensorName  }).toArray(function(err, result){
			if (result) {
				console.log(result);
				 res.send(result);

			} else {
				console.log("Problem Editing sensor");
				res.send("Problem Editing sensor ");
			}
		});
	});
};


exports.showSelectedSensorTypeStations = function(req,res) {
    var requestedsensortype = req.param("selectedType");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('sensor');
		var stationCollection = mongo.collection('station');
		coll.find({}).toArray(function(err, result){
			if (result) {
				var stationIds = [];
				for (index in result) {
					var sensorObject = result[index];
					if (sensorObject.sensorType == requestedsensortype){
						stationIds.push(sensorObject.stationId);
					}
				}

				mongo.connect(mongoURL, function(){
					stationCollection.find().toArray(function(err , result){
						if (result) {
							var requestedStations = [];
							for (index in stationIds) {
								var stationId = stationIds[index];
								for (stationIndex in result){
									var stationObject = result[stationIndex];
									if (stationObject.stationId == stationId){
										requestedStations.push(stationObject);
									}
								}
							}
							console.log(requestedStations);
							res.send(requestedStations);
						}
					});
			});
			} else {
				res.send("Problem Displaying station ");
			}
		});
	});
}

exports.changeStationStatus = function(req, res){
	var stationId = req.body.id;

	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('station');
		coll.findOne( { stationId : stationId}, function(err, user){
			if (user) {
				var currentStatus = user.stationStatus;
				if (currentStatus === "active"){
					coll.update( { stationId : stationId}, { $set : {stationStatus : "deactive"}});
				}
				if (currentStatus === "deactive"){
					coll.update( { stationId : stationId}, { $set : {stationStatus : "active"}});
				}
				res.send("Success");
			}else {
				console.log("error changing status");
			}
		});
	});
};

exports.changeSensorStatus = function(req, res){
	var stationId = req.body.id;
	var sensorName = req.body.sensorName;
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('sensor');
		coll.findOne( { stationId : stationId , sensorName :sensorName }, function(err, user){
			if (user) {
				var currentStatus = user.sensorStatus;
				if (currentStatus === "active"){
					coll.update( { stationId : stationId,sensorName :sensorName}, { $set : {sensorStatus : "deactive"}});
				}
				if (currentStatus === "deactive"){
					coll.update( { stationId : stationId , sensorName :sensorName}, { $set : {sensorStatus : "active"}});
				}
				res.send("Success");
			}else {
				console.log("error changing status");
			}
		});
	});
}

exports.getSensorLatestData = function(req, res){
	var arr =[];
	var stationId = req.body.id;
	return http.get({
        host: 'www.ndbc.noaa.gov',
        path: '/data/realtime2/' + stationId + '.txt'
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        var prevDate = '';
        response.on('end', function() {
			mongo.connect(mongoURL, function(){
				var coll = mongo.collection('sensor');
				coll.find({stationId : stationId }).toArray(function(err, result){
					if (result) {
						var data = body.split("\n");
			        	var stationData = [];
			        	var ListOfSensor = [];
			        	for ( var k =0 ; k < result.length ; k++){
			        		ListOfSensor.push(result[k]);
			        	}
			        	for(var i=2; i<data.length; i++){
			        		var dataRow = data[i].replace( /\s\s+/g, ' ' ).split(" ");
			        		if(dataRow[2] != prevDate){
			        			prevDate = dataRow[2];
			        			for (var j =0 ; j < result.length ;j++){
			        				var dataObject = {
			        					date : '',
	 			                    	data : '',
	 			                    	sensorName : ''
	 			                    }
			        				dataObject.date = dataRow[1] + '/' + dataRow[2] +  '/' + dataRow[0];
			        				dataObject.data =  dataRow[sensorColumn[result[j].sensorName]];
			        				dataObject.sensorName = result[j].sensorName;
			        				arr.push(dataObject);
			        			}
			            	}
			            }
					}else {
						console.log("Problem Displaying station");
					}
					res.send({arr:arr , length : result.length , ListOfSensor : ListOfSensor});
				});
			});
        });
    });
};


exports.getTotalUser = function(req, res){
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.find({}).toArray(function(err, result){
			if (result) {
				res.send(""+result.length);
			} else {
				console.log("Problem Displaying station");
				res.send("Problem Displaying station ");
			}
		});
	});
};

exports.addUserHistory = function(req, res) {

	var stationId = req.body.id;
	var userId = req.session.userid;

	var userCollection = mongo.collection('users');
	var timeStamp = new Date();
	var count = 0;
	mongo.connect(mongoURL, function(){
	userCollection.find({ email : userId}).toArray(function(err, userResult){
			if (userResult) {
				var userInfo = userResult[0];
				var currentUserCounter = userInfo.counter;
				currentUserCounter++;
				var stationInfo = userInfo.stationInfo;
				var stationCollection = mongo.collection('station');
				 mongo.connect(mongoURL, function(){
					stationCollection.find({stationId : stationId }).toArray(function(err, result){
						if (result) {
							if (stationInfo.length == 0) {
								var stationData  = {
									station : result[0],
									counter : count,
									timeStamp : timeStamp
								}
								stationInfo.push(stationData);
								userCollection.update({email : userId},{$set : {stationInfo : stationInfo, counter : currentUserCounter}})
							} else {
								for (index in stationInfo) {
								var stationObject = stationInfo[index]

								if (stationObject.station.stationId == stationId) {
									var newCounter = stationObject.counter + 1;
									var newTimeStamp = new Date();
									var newStation = stationObject.station;

									var newStationInfo = {
										station : newStation,
										counter : newCounter,
										timeStamp : newTimeStamp
									}

									stationInfo[index] = newStationInfo;
									userCollection.update({email : userId},{$set : {stationInfo : stationInfo, counter: currentUserCounter}});
									return ;
								}
							}
							var stationData  = {
								station : result[0],
								counter : count,
								timeStamp : timeStamp
							}
							stationInfo.push(stationData);
							userCollection.update({email : userId},{$set : {stationInfo : stationInfo, counter : currentUserCounter}})

							}

							var currentCounter = result.counter;
							currentCounter++;
							stationCollection.update( { stationId : stationId}, { $set : {counter : currentCounter}});

						}
						else {
							console.log("Problem Displaying station");
						}
					});
				 });
			}
		})
	});
}

exports.fetchUserHistory = function (req, res) {
	var userId = req.session.userid;

	mongo.connect(mongoURL, function(){
		var userCollection = mongo.collection('users');
		userCollection.find({ email : userId}).toArray(function(err, userResult){
			if (userResult) {
				var userInfo = userResult[0];
				var stationInfo = userInfo.stationInfo;
				stationInfo.sort(function(a, b){
					return b.timeStamp - a.timeStamp;
				})
				res.send(stationInfo);
			}
		});
	});
}


exports.getBillingInfo = function (req, res){
	var userId = req.session.userid;
	var billingObject;
	mongo.connect(mongoURL, function(){
		var userCollection = mongo.collection('users');
		userCollection.find({email : userId}).toArray(function(err, userResult){
			console.log("Firstly Came", userResult[0]);
			billingObject= userResult[0].counter;
			console.log("Came here",billingObject);
			res.send(billingObject * 0.50 + "");
		});	
	});
}

exports.fetchMostVisitedStations = function (req, res) {
	var userId = req.session.userid;

	mongo.connect(mongoURL, function(){
		var userCollection = mongo.collection('users');
		userCollection.find({ email : userId}).toArray(function(err, userResult){
			if (userResult) {
				var userInfo = userResult[0];
				var stationInfo = userInfo.stationInfo;
				stationInfo.sort(function(a, b){
					return b.counter - a.counter;
				})
				res.send(stationInfo);
			}
		});
	});
}

exports.getTotalStations = function(req, res){
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('station');
		coll.find({}).toArray(function(err, result){
			if (result) {
				res.send(""+result.length);
			} else {
				console.log("Problem counting station");
				res.send("Problem counting station ");
			}
		});
	});
};

exports.fetchAdminHistory = function(req,res) {

	var topStations = [];
	var topUsers = [];
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('station');
		coll.find().toArray(function(err, stationResult){
			if (stationResult) {
				stationResult.sort(function(a, b){
					return b.counter - a.counter;
				})
				stationResult = stationResult.splice(0,5);
				var coll = mongo.collection('users');

				coll.find().toArray(function(err, userResult){
					if (userResult) {
						userResult.sort(function(a, b){
							return b.counter - a.counter;
						})
						userResult = userResult.splice(0,5);
						console.log("admin history top user",userResult);
						console.log("admin history top station",stationResult);

						res.send({topUsers : userResult , topStations : stationResult});
					}
				});
			}
		});
});
}

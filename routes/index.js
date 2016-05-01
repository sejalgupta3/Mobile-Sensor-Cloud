var users = [];
var http = require('http');
var station = [];

exports.index = function(req, res){
	res.render('index');
};

exports.partials = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

exports.register = function (req, res) {
	users.push(req.body);
	res.send("Registration Successful.");
};

exports.validateUser = function(req, res){
	for(var i=0; i<users.length; i++){
		var currentUser = users[i];
		if(currentUser.username == req.body.username && currentUser.password == req.body.password){
			if(currentUser.userType == 'endUser'){
				res.send({message:'Login Successful',userType:"endUser"});
			}else{
				res.send({message:'Login Successful',userType:"admin"});
			}
		}
	}
	res.send({message:'Login Unsuccessful'});
};

exports.getSensorLatestData = function(req, res){
	var sensorId = "TDPC1";
	return http.get({
        host: 'www.ndbc.noaa.gov',
        path: '/data/realtime2/TDPC1.txt'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
        	var data = body.split("\n");
        	//console.log(data);
        	var readings = data[2].replace( /\s\s+/g, ' ' ).split(" ");
            console.log("Latest Temperater data:"+readings[14]);
        });
    });
}

exports.addStation = function (req, res) {
	station.push(req.body);
	res.send("Station added Successful.");
};

var users = [];
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

exports.addStation = function (req, res) {
	station.push(req.body);
	res.send("Station added Successful.");
};

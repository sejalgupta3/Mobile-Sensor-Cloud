var users = [];
var station = [];
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/sensor";

exports.index = function(req, res){
	res.render('index');
};

exports.partials = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

exports.register = function (req, res) {
	var email , pwd  , firstname, lastname  ;
	firstname = req.body.firstName;
	lastname = req.body.lastName;
	email = req.body.email;
	pwd = req.body.password;
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.insert({firstname: firstname, lastname:lastname, email:email, password : pwd , station : [] }, function(err, user){
			if (user) {
				console.log( "Inserted Id " + user.insertedIds);
				console.log("Successful Registration");
				res.send("Registration Successful");

			} else {
				console.log("Invalid Registration");
				res.send("Registration UnSuccessful");
			}
		});
	});
};

exports.validateUser = function(req, res){
	var username , password   ;
	username = req.body.username;
	password = req.body.password;
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.findOne({email: username, password:password }, function(err, user){
			if (user) {
				console.log( "Inserted Id " + user.insertedIds);
				console.log("Successful Registration");
				res.send({message:'Login Successful',userType:"endUser"});

			} else {
				console.log("Invalid Registration");
				res.send({message:'Login Unsuccessful'});
			}
		});
	});
};
var nodemailer = require("nodemailer");
var crypto = require("crypto");

var users = require('./users.js');

var dict = new Map();
var dict_maxsize = 1000000

//SMTP
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
    	user: process.env.EMAIL,
    	pass: process.env.EMAIL_PASSWORD
    }
});
var mailOptions,link;

var SendVerification = exports.SendVerification = function(email, host){

	if(dict.size > dict_maxsize) dict.clear;

	var id = crypto.randomBytes(20).toString('hex');
	dict.set(id, email);
	
	this.sendEmailVerification = function(){
		return new Promise((resolve, reject) => {

		    link="http://"+host+"/verify?id="+id;
		    mailOptions={
		        to : email,
		        subject : "Please confirm your Email account",
		        html : "Hello,<br> Thank you for using <b>Car2Park</b>. Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br>Thank you for using our app. Any questions can be directed to cpen321foobar@gmail.com" 
		    }
		    console.log(mailOptions);
		    smtpTransport.sendMail(mailOptions, function(error, response){
			    if(error){
			        console.log(error);
					reject(error, 500);
			    }else{
			        console.log("Message sent: " + response.message);
					resolve(response);
			    }
		    });
		});
	}

}

var VerifyEmail = exports.VerifyEmail = function(id){

    var email = dict.get(id);

	this.verifyEmail = function(){
		return new Promise((resolve, reject) => {
			//Handles case if the dictionary is cleared
			console.log('email:', email);
			if(email == null || email === undefined) {
				reject("Please enter your email again to verify", 500);
			}
			console.log("GET HERE");
		    users.verifyUser(email)
			.then((res) => {
			    resolve("YAY");
			}, (err) => {
			    reject(err);
			});
		});
	}

}

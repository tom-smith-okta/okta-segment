require('dotenv').config()

const express = require('express')
var fs = require('fs')
// var bodyParser = require('body-parser')
// var request = require('request');
// var session = require("express-session");

const app = express()

app.use(express.static('public'))
// app.use(bodyParser.json())
// var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: 10000000, parameterLimit: 100000 });
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { httpOnly: false, maxAge: parseInt(process.env.COOKIE_MAX_AGE) }}))

var port = process.env.PORT || 3090

app.listen(port, function () {
	console.log('App listening on port ' + port)
})

// HOME PAGE
app.get('/', function (req, res) {
	fs.readFile('./html/index.html', (err, data) => {
		if (err) {
			console.log("error reading the index.html file");
		}

		var page = data.toString()

		page = page.replace(/{{OKTA_TENANT}}/g, process.env.OKTA_TENANT)
		page = page.replace(/{{OKTA_CLIENT_ID}}/g, process.env.OKTA_CLIENT_ID)
		page = page.replace(/{{OKTA_REDIRECT_URI}}/g, process.env.OKTA_REDIRECT_URI)
		// page = page.replace("{{logo}}", process.env.OKTA_LOGO);

		res.send(page)
	})
})

// app.post('/setSession', urlencodedParser, function (req, res) {

// 	console.log("The idToken is: " + req.body.idToken)

// 	var options = {
// 		method: 'POST',
// 		url: process.env.OKTA_TENANT + '/oauth2/v1/introspect',
// 		qs: {
// 			token: req.body.idToken,
// 			token_type_hint: 'id_token',
// 			client_id: process.env.OKTA_CLIENT_ID,
// 			client_secret: process.env.OKTA_CLIENT_SECRET
// 		},
// 		headers: {
// 			'Cache-Control': 'no-cache',
// 			'Content-Type': 'application/x-www-form-urlencoded',
// 			Accept: 'application/json'
// 		}
// 	}

// 	request(options, function (error, response, body) {
// 		if (error) throw new Error(error)

// 		var obj = JSON.parse(body)

// 		if (obj.active === true) {
// 			console.log("the id token is valid.")

// 			console.dir(obj)

// 			req.session.okta_user_id = obj.sub

// 			console.log("the user id is: " + req.session.okta_user_id)

// 			res.send({result: "successfully set session"})

// 		}
// 	})

// })

// app.post('/syncRecords', urlencodedParser, function (req, res) {

// 	// ** Important: in production, you need to check the 
// 	// transactionID here against the Acuant server

// 	console.log("The body is: " + JSON.stringify(req.body))
// 	console.dir(req.body)

// 	var profile = {}

// 	for (var prop in req.body) {
// 		console.dir("the value of " + prop + " is: " + req.body[prop])

// 		profile[prop] = req.body[prop]
// 	}

// 	console.log("the user id is: " + req.session.okta_user_id)

// 	if (req.body.acuant_authentication_result === "Passed") {

// 		var url = process.env.OKTA_TENANT + '/api/v1/users/' + req.session.okta_user_id

// 		console.log("the url is: " + url)

// 		var options = {
// 			method: 'POST',
// 			url: url,
// 			headers: {
// 				'Cache-Control': 'no-cache',
// 				Authorization: 'SSWS ' + process.env.OKTA_API_TOKEN,
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json'
// 			},
// 			body: {
// 				profile: profile
// 			},
// 			json: true
// 		}

// 		request(options, function (error, response, body) {
// 			if (error) throw new Error(error)

// 			console.log(body)

// 			res.send({msg: "successfully updated user record"})

// 		})
// 	}
// })
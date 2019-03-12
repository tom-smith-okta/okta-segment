require('dotenv').config()

const express = require('express')

var fs = require('fs')

const app = express()

app.use(express.static('public'))

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
		page = page.replace(/{{REDIRECT_URI}}/g, process.env.REDIRECT_URI)

		res.send(page)
	})
})

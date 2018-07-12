<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
	<meta name="description" content="">
	<meta name="author" content="">

	<title>Okta + Segment integration</title>

	<!-- CSS -->

	<!-- BOOTSTRAP CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

	<link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.6.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">

	<style>

		body {
			padding-top: 3rem;
		
/*			padding-top: 1px;
*/		}

		#userMsg {
			margin-top: 5px;
		}
		.starter-template {
			padding: 3rem 1.5rem;
			text-align: center;
		}

		body, html {
			height: 100%;
		}

		.bg { 
			background-image: url("https://s3.amazonaws.com/tom-smith-okta-demo-images/coffeShop.png");

			height: 75%; 

			/* Center and scale the image nicely */
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		#transparentDiv {
			background: rgba(255,255,255,.6);
			height: 100%;
		}

		#signoutDiv, #signoutLink {
			display: none;
		}

	</style>

<!-- ********** JAVASCRIPT ***************** -->

<!-- SEGMENT.IO -->
<script type="text/javascript">
	!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
	analytics.load("tR8O4O9BeNdSi78OePN6sH45IgASSieh");
	analytics.page();
	}}();
</script>

<!-- OKTA AUTHN WIDGET -->

<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.8.0/okta-auth-js.min.js" type="text/javascript"></script>

<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.6.0/js/okta-sign-in.min.js" type="text/javascript"></script>

<!-- JQUERY -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

<!-- BOOTSTRAP JS-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>

<script>

var oktaSignIn = new OktaSignIn({
	baseUrl: '{{OKTA_TENANT}}',
	clientId: '{{OKTA_CLIENT_ID}}',
	redirectUri: '{{OKTA_REDIRECT_URI}}',

	authParams: {
		scopes: ['openid', 'email', 'profile', 'address', 'phone']
	},

	registration: {
		parseSchema: function(schema, onSuccess, onFailure) {
			// handle parseSchema callback
			onSuccess(schema)
		},
		preSubmit: function (postData, onSuccess, onFailure) {
			// handle preSubmit callback
			onSuccess(postData)
		},
		postSubmit: function (response, onSuccess, onFailure) {
			// handle postsubmit callback

			onSuccess(response)

			localStorage.setItem("reg_state", "new_reg")

		}
	},
	features: {
		// Used to enable registration feature on the widget.
		// https://github.com/okta/okta-signin-widget#feature-flags
		registration: true // REQUIRED
	}
})

window.onload = function() {

	$("#okta-container").hide()
	localStorage.setItem("reg_state", "none")

	oktaSignIn.session.get(function (res) {
		// Session exists, show logged in state.
		if (res.status === 'ACTIVE') {
			console.log("there is an okta session")

			console.dir(res)

			setWelcome(res.login)

			analytics.identify(
				localStorage.userID,
				{
					name: localStorage.name,
					email: localStorage.email
				},
				{
					integrations: {
						'Salesforce': true
				}
			})

analytics.identify('1234554321', {
  name: 'Peter Gibbons',
  title: 'VP of Derp',
  email: 'peter.gibbons@initech.com',
  company: {id: 666, name: 'Initech'},
  phone: '570-690-4150',
  state: 'California',
  rating: 'Hot',
  address: {
    city: 'east greenwich',
    postalCode: '94115',
    country: 'USA',
    street: '19123 forest lane',
    state: 'RI'
  }
}, { 
  'integrations':{
    'Salesforce': true
  }
});

		}
	  // No session, or error retrieving the session. Render the Sign-In Widget.
	  else if (res.status === 'INACTIVE') {
	    oktaSignIn.renderEl(
	      {el: '#okta-login-container'},
	      function success(res) {
	      	if (res.status === "SUCCESS") {
	      		console.log("success!!")
		      	console.log("the status is: " + res.claims)
		      	console.dir(res.claims)
		      	oktaSignIn.hide()
		      	$("#okta-container").hide()


		      	if (localStorage.getItem("reg_state") === "new_reg") {
		      		console.log("this is a new registration.")
		      		localStorage.setItem("reg_state", "none")

		      		// $.post('/setSession', {"idToken": res.idToken}, function(data) {
		      		// 	console.log("after trying to set the session, the result is: " + data.result)

          //           }, "json")
				}
				// localStorage.setItem("given_name", res.claims.given_name)

				console.log("the id_token is: " + res.idToken)
				console.dir(res)

				setWelcome(res.claims.given_name)

				localStorage.setItem("userID", res.claims.sub)
				localStorage.setItem("name", res.claims.given_name + " " + res.claims.family_name)
				localStorage.setItem("email", res.claims.preferred_username)

				// analytics.identify(res.claims.sub, {
				// 	name: res.claims.given_name + " " + res.claims.family_name,
				// 	email: res.claims.preferred_username
				// })

				// analytics.identify(localStorage.userID, {
				// 	name: localStorage.name,
				// 	email: localStorage.email
				// })
				// analytics.identify(
				// 	localStorage.userID,
				// 	{
				// 		name: localStorage.name,
				// 		email: localStorage.email
				// 	},
				// 	{ 
				// 		integrations: {
				// 			'Salesforce': true
				// 	}
				// })

analytics.identify('1234554321', {
  name: 'Peter Gibbons',
  title: 'VP of Derp',
  email: 'peter.gibbons@initech.com',
  company: {id: 666, name: 'Initech'},
  phone: '570-690-4150',
  state: 'California',
  rating: 'Hot',
  address: {
    city: 'east greenwich',
    postalCode: '94115',
    country: 'USA',
    street: '19123 forest lane',
    state: 'RI'
  }
}, { 
  'integrations':{
    'Salesforce': true
  }
});


			}
		},
	      function error(err) {
	      	console.log("there was an error: " + err)
	        // handleError(err)
	      }
	    )
	  }
	})
}

function setWelcome(given_name) {

// alert("hi user!!")
	var msg = "<h4>Welcome to Consumer Bank, " + given_name + "!</h4>"
	msg += "<p>To start your line of credit, you can stop by one of our branches.</p>"
	msg += "<p>Or, you can get a $500 line of credit immediately by clicking <a href = 'dlduplexfacialmatch.htm'>here</a>.</p>"

	$("#userMsg").html(msg)
	$("#loginLink").hide()
	$("#signoutLink").show()

}

function showWidget() {
	$("#userMsg").html("")
	$("#okta-container").show()

	oktaSignIn.show()
}

</script>

<script>

function signOut() {
	oktaSignIn.session.close(function (err) {
		if (err) {
			// The user has not been logged out, perform some error handling here.
			return
		}
		location.reload(true)
	})
}

</script>

</head>


<!-- NAVBAR
================================================== -->
<body>


	<div class = "bg">
	  <div id = "transparentDiv">

		<div class="navbar-wrapper">
		  <div class="container">

<!-- 	        <nav class="navbar navbar-inverse navbar-static-top">
			  <div class="container">
				<div class="navbar-header">
				  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				  <a class="navbar-brand" href="#">Solar System API</a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
				  <ul class="nav navbar-nav">
					<li class="active"><a href="#">Home</a></li>
					<li id = "loginLink"><a href="#" onclick="event.preventDefault(); renderWidget()">Log in</a></li>
					<li id = "registerLink"><a href="#" onclick="event.preventDefault(); register()">Register</a></li>
					<li id = "signoutLink"><a href="#" onclick="event.preventDefault(); signOut()" id="signout">Sign out</a></li>
					<li><a href="#" target = "_blank">Github</a></li>
				  </ul>
				</div>
			  </div>
			</nav>
 -->	
	 <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
	  <a class="navbar-brand" href="#">Consumer Bank</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>

		<div class="collapse navbar-collapse" id="navbarsExampleDefault">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
				</li>
				<li class="nav-item" id = "signoutLink">
					<a class="nav-link" href="#" id="signout" onclick="event.preventDefault(); signOut()">Sign out</a>
				</li>

				<li class="nav-item" id = "loginLink">
					<a class="nav-link" href="#" onclick="event.preventDefault(); showWidget()">Sign In / Sign Up</a>
				</li>

			</ul>
		</div>
	</nav>

<div class="container">
  <div class="row">
	<div class="col-sm">
		<div class="card" style="background: rgba(255,255,255,.7); margin-top: 20px">
			<div class="card-body" id ="ui">
				<div id = "userMsg">
					<h3>Welcome</h3>
					<p>Thank you for choosing us for your banking needs.<p>
					<p>You can begin the application process by clicking <a href="#" onclick="event.preventDefault(); showWidget()">"Sign In / Sign Up"</a></p>
				</div>

				<div id = "okta-container">
					<div id="okta-login-container"></div>
				</div>

			</div>
		</div>
	</div>
  </div>
</div>

		  </div>
		</div>
	  </div>
	</div>

	<!-- Marketing messaging and featurettes
	================================================== -->
	<!-- Wrap the rest of the page in another container to center all the content. -->

<!-- Modal -->
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

	<!-- Modal content-->
	<div class="modal-content">
	  <div class="modal-header" style="text-align: center;">
		<button type="button" class="close" data-dismiss="modal">&times;</button>
		<table border = 0 width = "100%">
			<tr>
				<td><img src = "https://s3.amazonaws.com/tom-smith-okta-demo-images/Resources_BoxPlatform400.jpg" width = "250"></td>
				<td><img src = "https://s3.amazonaws.com/tom-smith-okta-demo-images/oktaLogo.png" width="175"></td>
			</tr>
		</table>
		
		<h4 class="modal-title" style="margin-top: 10px" id="modal-title-element"></h4>
	  </div>
	  <div class="modal-body" id="ui">

	  </div>
	  <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	  </div>
	</div>

  </div>
</div>

<!--       <div class="row featurette">
		<div class="col-md-7">
		  <h2 class="featurette-heading">Great Projects start with you.</h2>
		</div>
	  </div>
 -->

	<div class="container marketing">

	  <!-- START THE FEATURETTES -->

	  <hr class="featurette-divider">

<!--       <div class="row featurette">
		<div class="col-md-7">
		  <h2 class="featurette-heading">Great Projects start with you.</h2>
		</div>
	  </div> -->

	  <!-- /END THE FEATURETTES -->

	  <!-- FOOTER -->
<!--       <footer>
		<p>&copy; Big Project, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
	  </footer>
 -->
	</div><!-- /.container -->

  </body>
</html>
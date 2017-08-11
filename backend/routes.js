const express = require('express');
const Uber = require('node-uber');
const router = express.Router();
const bodyParser = require('body-parser');
const { localGetCommand } = require('./processHuman');
// todo imports
//const Reminder = require('./models/models').Reminder;
// twilio imports
const accountSid = process.env.TWILIO_SID; // Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Auth Token from www.twilio.com/console
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
const FROM_NUMBER = process.env.MY_TWILIO_NUMBER; // custom Twilio number
const TO_NUMBER = process.env.MY_PHONE_NUMBER; // telephone number to text; format: +1234567890


router.get('/',(req,res) => {
	console.log("thanks");
	res.send(200);
})
/*------------------- ToDo Routes -----------------------*/

/*router.get('/todo', (req, res) => {
    //get all the ToDo's from database and return them when pushed into an array --> set this.setState with it
    Reminder.find()
    .then((resp) =>{
        console.log("mounting",resp);
        res.send(resp)
    })
})

router.post('/todo', (req, res) => {
    //create new Reminder form model and store it in DB
    var r = new Reminder({
        task: req.body.task
    })
    //save to database
    r.save(function(err, reminder) {
      if (err) {
        console.log(err);
        res.status(500).send('fail');
        return;
      }
      console.log("adding", reminder)
      res.send(reminder);
    });
})

router.post('/deltodo', (req, res) => {
    Reminder.remove({task: req.body.task})
    .then(() =>{
        Remider.find()
        .then((resp) => {
            console.log("deleted", resp);
            res.send(resp)
        })
    })
});
*/
/*------------------- Uber Routes -----------------------*/

// initialize node-uber
const uber = new Uber({
  client_id: process.env.UBER_CLIENT_ID,
  client_secret: process.env.UBER_CLIENT_SECRET,
  server_token: process.env.UBER_SERVER_TOKEN,
  redirect_uri: 'http://localhost:3000/callback',
  name: 'IRIS',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true // optional, defaults to false
});

router.get('/login', function(req, res) {
  var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
  res.redirect(url);
});

router.get('/callback', function(req, res) {
   uber.authorizationAsync({authorization_code: req.query.code})
   .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
     // store the user id and associated access_token, refresh_token, scopes & token expiration date
     console.log('New access_token retrieved: ' + access_token);
     console.log('... token allows access to scopes: ' + authorizedScopes);
     console.log('... token is valid until: ' + tokenExpiration);
     console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);
     // redirect the user back to actual app
     res.redirect('/');
   })
   .error(function(err) {
     console.error('ERROR:', err);
   });
});

router.get('/products', function(req, res) {
    let query = req.query
    uber.products.getAllForAddressAsync(query.pickup)
    .then(function(resp) {
        res.send(resp.products);
    })
    .error(function(err) {
      console.error("could not get available products", err);
    });
  })

router.get('/price', function(req, res) {
  let query = req.query
  uber.estimates.getPriceForRouteByAddressAsync(query.pickup, query.destination)
  .then(function(resp) {
    res.send(resp);
  })
  .error(function(err) {
    console.error("could not get price estimate", err);
  });
})

router.get('/home', function(req, res) {
  uber.places.getHomeAsync()
  .then(function(resp) {
    res.send(resp);
  })
  .error(function(err) {
    console.log('could not get home address', err);
  })
})

router.get('/estimate', function(req, res) {
  let query = req.query;
  let home;
  uber.requests.getEstimatesAsync({
  "product_id": query.product_id,
  "startAddress": query.pickup,
  "endAddress": query.destination
  })
  .then(function(resp) {
    res.send(resp);
  })
  .error(function(err) {
    console.error("could not get estimates", err);
  });
})


router.get('/delete', function(req, res) {
  uber.requests.deleteCurrentAsync()
  .then(function(resp) {
      res.send(resp);
  })
  .error(function(err) {
    console.error("could not delete current request", err);
  });
})

router.get('/modify', function(req, res) {
  uber.requests.updateCurrentAsync({
  "endAddress": req.query.updatedDestination,
  })
  .then(function(resp) {
      res.send(resp);
  })
  .error(function(err) {
    console.error("could not modify current request", err);
  });
})

router.get('/current', function(req, res) {
  uber.requests.getCurrentAsync()
  .then(function(resp) {
      res.send(resp);
  })
  .error(function(err) {
    console.error("could not get current request", err);
  });
})


/*------------------- News Routes -----------------------*/

//use twilio to send article link to phone via text
router.post('/sendArticle', (req, res) => {
  client.messages.create({
    body: req.body.link,
    to: TO_NUMBER,  // Text this number
    from: FROM_NUMBER // From a valid Twilio number
  })
  .then( msg => {
    console.log('SERVER sent msg:', msg);
  });

})

module.exports = router;

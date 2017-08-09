const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// start twilio things
const accountSid = process.env.TWILIO_SID; // Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Auth Token from www.twilio.com/console
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
const FROM_NUMBER = process.env.MY_TWILIO_NUMBER; // custom Twilio number
const TO_NUMBER = process.env.MY_PHONE_NUMBER; // telephone number to text; format: +1234567890
// end twilio things

// INSERT UBER ROUTES


// INSERT TODOLIST ROUTES


// NEWS TWILIO ROUTE
router.post('/sendArticle', (req, res) => {
  console.log('SERVER in send article with', req);

  client.messages.create({
    body: req.link,
    to: TO_NUMBER,  // Text this number
    from: FROM_NUMBER // From a valid Twilio number
  })
  .then( msg => {
    console.log('SERVER sent msg:', msg);
  });

})

module.exports = router;

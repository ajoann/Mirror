var ImageModel = require('./models/models').ImageModel;
var { sendMessage } = require('./sendMessage');
var axios = require('axios');


const { getCurrentWeather } = require( '.././reactApp/helperFunctions/getWeather.js');
const config = require('./config/personalConfig.js');
const WEATHER_API = config.WEATHER_API_ID || '';

function suggestion(sendToMom){

  getCurrentWeather('5506956', WEATHER_API)
  // axios.get('http://api.openweathermap.org/data/2.5/weather?q=SanFrancisco&APPID=89fdd5afd3758c1feb06e06a64c55260')
  .then(resp => {
    ImageModel.find({description: resp.data.weather[0].description})
    .then(images => {
      if(!images || !images.length) {
        sendMessage("Sorry no available suggestions", false);
      } else {
        // sendMessage(images[0].link);

        /* NEW CHANGES */
        sendMessage(images[0].link, true);
      }
    })
    .catch(err => {
      console.log(err);
    })
  })
  .catch(err => {
    console.log(err);
  })
}
module.exports = {
  suggestion
}

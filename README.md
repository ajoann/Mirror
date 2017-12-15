# Mirror
A Smart Mirror powered by a Raspberry Pi. 

<img align="center" width="300" height="250" src="https://github.com/ajoann/Mirror/blob/master/img/mirror_left.JPG">
<img align="right" width="300" height="250" src="https://github.com/ajoann/Mirror/blob/master/img/mirror_right.jpg">

### Widgets 
Weather, News, Uber, Reminders, and Outfit Tracking.
- Weather: the current weather of the day (obtained from www.openweathermap.org) is always shown adjacent to the time
- News: the user can choose from any of the top 60 news sources (provided by www.newsapi.org), see the 5 most recent articles, scroll through blocks of 5 articles, and send one of the articles to one's phone (through Twilio)
- Uber: (still in development mode) user can call an uber, selecting the destination and service
- Outfit Tracking: the mirror's connection to a PiCamera allows a user to snap a picture of their outfit, and save it to a database based on the weather. The user can then request to see outfit suggestions, and any outfits stored in the database with weather similar to that of the current day will be presented to the user. 


### Watch our demo! 

[![Watch the video](https://img.youtube.com/vi/HZM_5S88JLk/0.jpg)](https://www.youtube.com/embed/HZM_5S88JLk)

### Current work in progress:
Adding interaction from the Pi to a Particle Photon in order to control dorm lights. 

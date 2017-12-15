# Iris
A Smart Mirror powered by a Raspberry Pi. 
Iris is a voice controlled smart mirror which allows a user to view and switch between widgets entirely by speech.

<img align="left" width="300" height="250" src="https://github.com/ajoann/Mirror/blob/master/img/mirror_left.JPG">
<img align="center" width="300" height="250" src="https://github.com/ajoann/Mirror/blob/master/img/mirror_right.jpg">


### Widgets 
Weather, News, Uber, Reminders, and Outfit Tracking.
- Weather: view the current weather of the day (obtained from www.openweathermap.org) as it always shown adjacent to the time
- Reminders: add and remove reminders for the day, week, or any time. The reminders are stored to a database, so they will remain active (whether or not the widget is open) until the user checks each task as completed
- News: choose from any of the top 60 news sources (provided by www.newsapi.org), see the 5 most recent articles, scroll through blocks of 5 articles, and send one of the articles to one's phone (through Twilio)
- Uber: (still in development mode) call an uber, selecting the destination and service, and get updates about the driver, car, and estimated arrival time
- Outfit Tracking: the mirror's connection to a PiCamera allows a user to snap a picture of their outfit, and save it to a database based on the weather. The user can then request to see outfit suggestions, and any outfits stored in the database with weather similar to that of the current day will be presented to the user. 


### Watch our demo! 

[![Watch the video](https://img.youtube.com/vi/HZM_5S88JLk/0.jpg)](https://www.youtube.com/embed/HZM_5S88JLk)

### Current work in progress:
- [ ] Adding interaction from the Pi to a Particle Photon in order to control dorm lights. (checkout branch: lights)


#### This mirror runs on Node.js, Express, React, MongoDB, Twilio, and Particle!

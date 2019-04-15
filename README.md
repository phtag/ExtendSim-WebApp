# ExtendSim-WebApp

Project @


### Overview
This project demonstrates the beginning stages of a full-stack solution for a software product that is being developed to provide customers
of Imagine That, Inc. with the capability to remotely run ExtendSim simulations on a server using a web page. The ExtendSim ASP license is a 
simulation product that is installed on a server in the backend and is serviced by a self-hosting server application. The self-hosting 
server application provides a collection of APIs for exchanging data between clients and the ExtendSim server and executing commands that
are processed by the ExtendSim application. This psimulation ExtendSim Web-Based Simulation
This project uses Node.js and Express to create a server application to host users searching for friends that match their preferences. It provides a web-based frontend where users can fill out their name, provide a picture of themselves and answer a survey of questions and submit this information to search for the friend that most closely matches their survery question answers. After submitting their information, users are provided with the name and picture of the friend most closely matching their preferences.

The server code is implemented in node.js using Express. The server services both html and api routes. The html routes send html files to the client browser based on user actions.

The api serves routes for:
* getting a JSON formatted list of all possible friends on the site
* posting information about the current user

### Home Page of Friend-Finder
![Home page Screenshot](/images/Friends-Finder-HomePage-screenShot.jpg)

### Survey Page of Friend-Finder
![Survey Screenshot](/images/Friends-Finder-Survey-screenShot.jpg)

NOTE: This project is referenced on my portfolio page at [my portfolio](https://phtag.github.io/Updated-portfolio/)

### Purpose
The purpose of this assignment is to learn how to create a node.js server application using Express that services different routes from a client. In particular, the server services both GET and POST requests from clients as well as providing different routes for sending web pages to the client.

### Getting Started
To use the Friend Finder application, go to the Heruko link: https://sleepy-temple-45120.herokuapp.com/

From the home page, click on the "Go to survey" button. This takes you to the survey page. Enter your name and a link to a photo of yourself and answer all of the 10 survey questions. When finished, click the "submit" button and the Friends-Finder application will display the name and a photo of the closest matching friend.

You can also click on the link in the footer of the page to view a list of all friends on the site and how they answered their survey questions.

This project is maintained by Peter Tag

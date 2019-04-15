# ExtendSim-WebApp

Project @


### Overview
This project demonstrates the beginning stages of a full-stack solution for a software product that is being developed to provide customers
of Imagine That, Inc. with the capability to remotely run ExtendSim simulations on a server from a browser. This project uses the ExtendSim ASP product which is installed on a server and is serviced by a self-hosting server application. The self-hosting 
server application provides a collection of APIs for exchanging data between clients and the ExtendSim server and executing commands that
are processed by the ExtendSim application. A new server was created using Express and Node.js to directly service all client-side interactions from a browser and convert these interactions to API calls that are made to the self-hosting service application on the ExtendSim server.

The architecture consists of a web-based client-side interface where users create simulation scenarios to test how a system they are analyzing will perform under different circumstances. These scenarios are submitted from the browser to the Node.js server and passed on to the ExtendSim server. The results of the simulation run are stored in a MySQL database and are available for review by the user in the browser.

### Home Page of the ExtendSim Web Simulation
![Home page Screenshot](/images/ExtendSimWebAppLoginPage.jpeg)

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

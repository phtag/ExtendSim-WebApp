# ExtendSim-WebApp

Project @


### Overview
This project demonstrates the beginning stages of a full-stack solution for a software product that is being developed to provide customers
of Imagine That, Inc. with the capability to remotely run ExtendSim simulations on a server from a browser. This project uses the ExtendSim ASP product which is installed on a server and is serviced by a self-hosting server application. The self-hosting 
server application provides a collection of APIs for exchanging data between clients and the ExtendSim server and executing commands that
are processed by the ExtendSim application. A new server was created using Express and Node.js to directly service all client-side interactions from a browser and convert these interactions to API calls that are made to the self-hosting service application on the ExtendSim server.

The architecture consists of a web-based client-side interface where users create simulation scenarios to test how a system they are analyzing will perform under different circumstances. These scenarios are submitted from the browser to the Node.js server and passed on to the ExtendSim server. The results of the simulation run are stored in a MySQL database and are available for review by the user in the browser.

### Login Page of the ExtendSim Web Simulation
The starting point for a user session is the login. The user provides a username and password to login to the ExtendSim server. This is required to determine which simulation models the user has access to on the server. For this demonstration, the user is not provided with an ability to select which model they want to run a simulation for, but a future version will provide this capability. 
![Login page Screenshot](/images/ExtendSimWebAppLoginPage.jpeg)

### Scenario Inputs Page
The scenarion inputs page is where the user configures the scenario that will be submitted to the ExtendSim server. Currently, this is done as a two step process:
- Specify a scenario name
- Drag and drop input files into the drop zone
![Inputs page Screenshot](/images/ExtendSimWebAppScenarioInputsPage.jpeg)
After completing the above two steps, a submit simulation button will appear for submitting the configured scenarion. When the submit button is clicked, the input files will be pushed to the ExtendSim server and copied to a folder from which the scenario will be run. The user will be informed when the scenario has completed its run and presented with a button to click to view simulation results

### Scenario Results Page
![Inputs page Screenshot](/images/ExtendSimWebAppScenarioResultsPage.jpeg)

The next phase of this project will greatly expand the reports page by providing users with several different reports at the detailed and summary levels and charting of results.

NOTE: This project is referenced on my portfolio page at [my portfolio](https://phtag.github.io/Updated-portfolio/)

### Purpose
The purpose of this project was to create a web-based simulation capability so that users can run the ExtendSim simulation without having to install it on their computers.

### Getting Started
To use the ExtendSim web application, go to the Heruko link: https://extendsim-webapp.herokuapp.com/. Use admin as the username and model as the password in the login page. After logging in, the scenario inputs page will appear. Type any name for your scenario and use the 4 text files located in the input files folder in my project on GitHub https://github.com/phtag/ExtendSim-WebApp.git

Once you have setup the scenario inputs, click the "Submit simulation scenario" button. Observe the status of the simulation. When it completes, click on the "Show scenario results" button to view a table of cycle-time data for the 10 process steps being represented in the simulation model.

This project is maintained by Peter H. Tag

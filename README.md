# rsi-class-server
Server for our class fictional company.
We will be adding an API to our backend database, Postgres.

## Prerequisites

1. Install [Node.js](http://nodejs.org)
 - on OSX use [homebrew](http://brew.sh) `brew install node`
 - on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

2. Install Postgres from https://www.postgresql.org

3. Install pgAdmin from https://www.pgadmin.org

4. Download or Clone the repository into a project folder.

5. From a command line / terminal, cd into the project folder.

6. Install dependencies

    ```bash
    npm install
    ``` 
## Running the app

We have 2 separate node apps in this setup. One is our web server, and the other will act as an API server that will be accessible to our own web pages, mobile apps and external customers who may want access to our data.

NOTE: When running the web_server.js, you will need admin / root privlidges due to the port number being 80.

1. From a command line / terminal, cd into the project folder then run the web server with:

    ```bash
    node web_server.js
    ``` 
    
2. From a seperate command line / terminal, cd into the project folder then run the api server with:

    ```bash
    node api_server.js
    ```  
    
3. Open a browser and go to http://localhost for the default home page (we are working on that) or http://localhost/admin for the administrator pages.   

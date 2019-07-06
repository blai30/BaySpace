# Application Folder
## Installing NodeJS dependencies
Dependencies are listed in package.json. Before working on this application, PLEASE open up your terminal at this directory (`application/`) and run `npm install`. This command will add a `node_modules` directory and install all dependencies in it. You must have NodeJS installed on your machine to run the command.

### controllers/
Controllers is part of the MVC architecture and is in charge of responding to the user based on the user's requests. When the user interacts with the view, a request is generated which shall then be handled by the controller.

### models/
Models is part of the MVC architecture and is in charge of maintaining the data in the application. Only models shall access the database.

### public/
This folder is for static files served publically to the user. Frontend.

### routes/
This folder is for routing web pages to the web app. Should be .js files.

### views/
This folder is for .hbs files. Handlebars (hbs) is the NodeJS view engine. Views is part of the MVC architecture and is in charge of rendering components for the user interface. Views utilizes the data from models and presents data in the form that the users want. Users are allowed to make changes to the data. Consists of both static and dynamic pages.

### app.js
This is the main NodeJS file. Handles views, express, errors.

### index.js
This file is the entry point to the web app. Run the server with `npm start` or `node index.js` from this directory (`application/`).

## Purpose
The purpose of this folder is to store all the source code and related files for your team's application. Source code MUST NOT be in any of folder. <strong>YOU HAVE BEEN WARNED</strong>

You are free to organize the contents of the folder as you see fit. But remember your team is graded on how you use Git. This does include the structure of your application. Points will be deducted from poorly structured application folders.

## Please use the rest of the README.md to store important information for your team's application.

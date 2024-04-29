# teameverest-api

Team Everest vision is to Inspire everyone to Volunteer
and make Volunteering as a Habit.

---
## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.18.2

    $ npm --version
    9.8.1

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---

## Install

    $ git clone https://github.com/sundarideas2it/teameverest-api.git
    $ cd teameverest-api
    $ npm install

## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;

## Initialize the app environment variables

Rename the `.env.example` file to `.env` and ensure to update the respective values within the `.env` file before initiating the application.

## Initialize the database config values

Initialize the database connectivity config values in the `src/config/config.js` file for models initialization and database connection

## Migrate application tables

Run the following command in `src/` directory to generate the application tables in database

`npx sequelize-cli db:migrate`

## Load application master data through seeding

Execute the following command in `src/` directory to load the application's pre-requisite data

`npx sequelize-cli db:seed:all`

## Running the project

    $ node .
    or
    $ npm run dev

## API documentation

The API documentation can be accessed using http://localhost:3000/api-docs/
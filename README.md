# Express Rest Boilerplate

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A Minimal Starter Boilerplate for NodeJS REST API with ExpressJS & MongoDB.

## Tech Stack

**Language:** JavaScript <br/>
**Server:** NodeJS, ExpressJS <br/>
**Database:** MongoDB <br/>

## Project Structure

```bash
express-rest-boilerplate
 ┣ src
 ┃ ┣ config
 ┃ ┃ ┗ conn.js
 ┃ ┣ controllers
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┣ auth.controller.js
 ┃ ┃ ┃ ┗ auth.validator.js
 ┃ ┃ ┣ user
 ┃ ┃ ┃ ┣ user.controller.js
 ┃ ┃ ┃ ┗ user.validator.js
 ┃ ┃ ┗ file.controller.js
 ┃ ┣ models
 ┃ ┃ ┗ User.model.js
 ┃ ┣ routes
 ┃ ┃ ┣ auth.routes.js
 ┃ ┃ ┣ file.routes.js
 ┃ ┃ ┗ user.routes.js
 ┃ ┣ utils
 ┃ ┃ ┣ config.js
 ┃ ┃ ┣ protected.js
 ┃ ┃ ┣ response.js
 ┃ ┃ ┗ securePassword.js
 ┃ ┗ view
 ┃ ┃ ┗ serverRunning.html
 ┣ uploads
 ┃ ┗ LOCAL_FILE_UPLOADS
 ┣ .gitignore
 ┣ LICENCE
 ┣ package.json
 ┣ README.md
 ┣ server.js
 ┗ yarn.lock
```

## How to use?

You can use this template as starter package of express/mongo

## Install as starter pack

To use as starter pack

```bash
npx express-mongo-boilerplate <folder_name>
```

## Connect with database

To connect with MongoDB please go to the **src** folder then open **config** folder.

```bash
  cd src
  cd config
```

and open database file and add your database connection string like below.

```js
module.exports = {
  database:
    'mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]',
}
```

## How to run?

For development environment:

```bash
  npm run dev
```

If you are using yarn

```bash
  yarn dev
```

For production environment:

```bash
  npm start
```

If you are using yarn

```bash
  yarn start
```

## PORT

In the development server by default, it will open at port **5000**, and in the production server, it will open in the server's default port.

## Authors

- [@ahmmedabir9](https://github.com/ahmmedabir9)

## Contributors

<a href="https://github.com/ahmmedabir9/express-rest-boilerplate/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ahmmedabir9/express-rest-boilerplate" />
</a>

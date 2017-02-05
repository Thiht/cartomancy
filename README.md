# Cartomancy

[![Build Status](https://travis-ci.org/Thiht/cartomancy-backend.svg?branch=master)](https://travis-ci.org/Thiht/cartomancy-backend)
[![Dependencies Status](https://david-dm.org/Thiht/cartomancy-backend/status.png)](https://david-dm.org/Thiht/cartomancy-backend)

This is the backend of Cartomancy.

* [cartomancy-backend](https://github.com/Thiht/cartomancy-backend)
* [cartomancy-frontend](https://github.com/Thiht/cartomancy-frontend)

## Get started

### Requirements:

* [NodeJS](https://nodejs.org/en/), at least the LTS version.
* [MongoDB](https://www.mongodb.com/fr), running on [http://localhost:27017/](http://localhost:27017/) by default. This can be configured in the [environment config files](./config).

Before anything, install the dependencies:

    npm install

### Development

Run the server with hot-reload with the command:

    npm start

The recommended development environment is [Visual Studio Code](https://code.visualstudio.com/) with the following plugins:

* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Production

Generate the production distribution with:

    npm run build

You can then run the server with a process manager such as [pm2](http://pm2.keymetrics.io/):

    cd dist/
    pm2 start server/index.js

## License

See the [LICENSE](./LICENSE) file.

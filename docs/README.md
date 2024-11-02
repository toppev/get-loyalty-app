# get-loyalty-app

Loyalty app setup with (progressive web) app, backend, management panel and a scanner app.

The solution for building versatile loyalty apps easier with a WYSIWYG editor.

This project is no longer maintained. Feel free to use this as an example or for your next project :)

### [Screenshots](screenshots.md)
The screenshots are from the development version and will be updated later.

## Features

- Customizable pages
    - [grapesjs](https://grapesjs.com/) WYSIWYG editor
    - or HTML/CSS and JavaScript
- Customizable [app](../../loyalty-app) and app settings
- Versatile campaigns
    - stamps, birthday and custom campaigns
    - more [here](../../loyalty-campaigns)
- Customer points and customer levels
- Customer rewards
- QR codes in the app to identify the customer and reward
    - QR code reader app ([scanner-app](../scanner-app))
- Progressive web app (e.g add to home screen)
- Push notifications
- Charts and API (soon...)

...and more

## Start development

Prerequisites: [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/)

1. Create `.env` in the root directory.
2. Add `NPM_TOKEN=<token here>` (a Github token)
3. Run the `start-dev.sh` script to start the development environment.

You can run each service manually as well. In that case, you must install requirements (such as NPM, Yarn and MongoDB) manually.

For developing the scanner-app see instructions [here](/scanner-app/README.md).

## Panel

The control/management panel where you create the campaigns, pages etc.

Default development port: [3002](http://localhost:3002)

### Technologies

- ReactJS
- NPM
- [Material-UI](https://material-ui.com/)
- [grapesjs](https://grapesjs.com/)

## loyalty-app

The web app (PWA) the users/customers will use. You can see the pages, on going campaigns, your rewards and more here.

Default development port: [3000](http://localhost:3000)

### Technologies
- ReactJS
- [yarn](https://yarnpkg.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## scanner-app

A simple app to scan customer QR codes and confirm purchases and rewards.

### Technologies
- [Flutter](https://flutter.dev/)

## Backend

The backend of the loyalty app (one per app). Uses MongoDB as the database for users, campaigns, pages etc.

### Technologies
- Node.js + NPM
- [Express](https://expressjs.com/)
- [MongDB](https://www.mongodb.com/) + mongoose

Default development port: [3001](http://localhost:3001)

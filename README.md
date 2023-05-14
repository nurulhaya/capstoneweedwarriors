[![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Weed Warriors

Frontend for a reporting system where users collaboratively map instances of local invasive plant species.

## Prerequisites

1. **Node & npm** - This project requires [NodeJS](http://nodejs.org/) and [NPM](https://npmjs.org/). To make sure you have them available on your machine, try running the following command.

```sh
$ npm -v "&&" node -v
8.11.0
v16.16.0
```

2. **Google Cloud Storage** - Follow the steps in this article to create a Google Cloud Storage account for uploading images: [Image Upload With Google Cloud Storage and Node.js](https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876)
3. **Postgres database** - Download a database administration platform for Postgres like [pgAdmin](https://www.pgadmin.org) and create an empty database, then run the [creation script](/prereq/weedwarriors_pgcreate.sql) to instantiate tables. Import [catalog](/prereq/weedwarriors_catalog.csv) and [severity](/prereq/weedwarriors_severity.csv) data into respective tables.
4. Create a `.env` file with the following variables (see [Sequelize documentation](https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database) on connecting to a database):

```
PG_URI='postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE'
PROJECT_ID=Google Cloud project ID
STORAGE_BUCKET=Google Cloud bucket name
STORAGE_KEY=Path to Google Cloud .json service account key (ideally with key in the name for gitignore)
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/nurulhaya/weedwarriors.git
$ cd weedwarriors
```

To install and set up the library, run:

```sh
$ npm install
```

### Serving the app

```sh
$ npm start
```

## API
See: [HTTP primer for frontend developers]() and [primer on JavaScript `fetch()` method](https://javascript.info/fetch)
#### Catalog
- GET `/api/catalog` - Retrieve all data catalog entries in the database.

#### Media
- GET `/api/media` - Retrieve all media entries in the database.
- POST `/api/media` - Create a new media entry, example:

<details>
<summary>Example</summary>

```javascript
await fetch("/api/media", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://site.com/example.png",
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
```

</details>
<br/>

#### Reports
- GET `/api/reports` - Retrieve all report entries in the database.
- POST `/api/reports` - Create a new report entry. Example:

<details>
<summary>Example</summary>

```javascript
await fetch("/api/reports", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    catalog_id: 1,
    latitude: "31.007027",
    longitude: "-73.922880",
    severity: "10%",
    media_id: 1,
    comments: "N/A",
    user_id: 1,
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
```

</details>
<br/>

#### Severity
- GET `/api/severity` - Retrieve all severity category entries in the database.

#### Tickets
- GET `/api/tickets` - Retrieve all ticket entries in the database.
- POST `/api/tickets` - Create a new ticket entry.
<details>
<summary>Example</summary>

```javascript
await fetch("/api/tickets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: 'New ticket',
    description: 'Ticket description',
    priority: 'High',
    status: "Not started",
    report_id: 1,
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
```

</details>
<br/>


#### Users
- GET `/api/users` - Retrieve all user entries in the database.
- POST `/api/users` - Create a new user entry.

<details>
<summary>Example</summary>

```javascript
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: "First",
    last_name: "Last",
    email: "your@email.com",
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
```

</details>
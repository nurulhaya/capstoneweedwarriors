[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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
4. Create a .env file with the following variables:
```
PG_URI='postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE'
PROJECT_ID=Google Cloud project ID
STORAGE_BUCKET=Google Cloud bucket name
STORAGE_KEY=Path to Google Cloud .json service account key (ideally with key in the name for gitignore)
```

<!-- ## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Serving the app](#serving-the-app)
    - [Running the tests](#running-the-tests)
    - [Building a distribution version](#building-a-distribution-version)
    - [Serving the distribution version](#serving-the-distribution-version)
  - [API](#api)
    - [useBasicFetch](#usebasicfetch)
      - [Options](#options)
    - [fetchData](#fetchdata)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license) -->

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
<!-- See deployment for notes on how to deploy the project on a live system. -->

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


* GET `/api/catalog` - All data catalog entries in the database.
* GET `/api/severity` - All severity category entries in the database.
* GET `/api/media` - All media entries in the database.
* POST `/api/media` - Create a new media entry, requires url in request body. Example:

``` javascript
  await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: 'https://site.com/example.png',
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
```

* GET `/api/users` - All user entries in the database.
* POST `/api/users` - Create a new user entry, requires first name, last name, and email in request body. Example:

``` javascript
  await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: 'First',
      last_name: 'Last',
      email: 'your@email.com',
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
```

* GET `/api/reports` - All report entries in the database.
* POST `/api/reports` - Create a new report entry. Example:

``` javascript
  await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      catalog_id: 1,
      location: '(31.007027, -73.922880)',
      severity_id: 1,
      media_id: 1,
      comments: 'N/A',
      user_id: 1,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
```
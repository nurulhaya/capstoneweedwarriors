<!-- [![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) -->

# Weed Warriors

> Frontend for a reporting system where users collaboratively map instances of local invasive plant species. 

## Prerequisites

This project requires [NodeJS](http://nodejs.org/) and [NPM](https://npmjs.org/). 

To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v "&&" node -v
8.11.0
v16.16.0
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

## Installation

<!-- **BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites) -->

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/nurulhaya/weedwarriors.git
$ cd weedwarriors
```

To install and set up the library, run:

```sh
$ npm install 
```

## Usage

### Serving the app

```sh
$ npm start
```

<!-- ### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside your local `dist/` folder

### Serving the distribution version

```sh
$ npm run serve:dist
```

This will use `lite-server` for serving your already
generated distribution version of the project.

*Note* this requires
[Building a distribution version](#building-a-distribution-version) first. -->

## API

### Data catalog

* GET `/api/catalog` - Current data catalog entries in the database.
``` javascript
  await fetch("/api/catalog");
```
### Severity
* GET `/api/severity` - Current severity category entries in the database.
``` javascript
  await fetch("/api/severity");
```
### Media
* GET `/api/media` - Current media entries in the database.
``` javascript
  await fetch("/api/media");
```
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
### Users
* GET `/api/users` - Current user entries in the database.
``` javascript
  await fetch("/api/users");
```
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
### Reports
* GET `/api/reports` - Current report entries in the database.
``` javascript
  await fetch("/api/reports");
```
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
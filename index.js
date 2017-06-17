'use strict';

const fetch = require('make-fetch-happen');

class GitHub {
  constructor() {
    this.root = 'https://api.github.com';
  }

  get(reqPath) {
    let reqUrl = this.root + reqPath;
    return fetch(reqUrl).then(res => res.json());
  }
}

module.exports = GitHub;

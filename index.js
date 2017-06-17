'use strict';

const fetch = require('make-fetch-happen');

module.exports = GitHub;

function GitHub() {
  if (!(this instanceof GitHub)) {
    return new GitHub();
  }
  this.root = 'https://api.github.com';
}

GitHub.prototype.get = function get(reqPath) {
  let reqUrl = this.root + reqPath;
  return fetch(reqUrl).then(res => res.json());
}

'use strict';

const debug = require('debug')('gh-fetched');
const fetch = require('make-fetch-happen');
const lo = require('lodash');

const DEFAULTS = {
  root: 'https://api.github.com',
};

class GitHub {
  constructor(opts) {
    opts = lo.defaults(DEFAULTS, opts);
    this.root = opts.root;
    this.token = opts.token;
    let headers = {};
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    this.fetch = fetch.defaults({headers: headers});
    this.quota = {};
  }

  get(reqPath) {
    let reqUrl = this.root + reqPath;
    return this.fetch(reqUrl).then(res => {
      this.quota['limit'] = 0|res.headers.get('x-ratelimit-limit');
      this.quota['remaining'] = 0|res.headers.get('x-ratelimit-limit');
      this.quota['reset'] = new Date((0|res.headers.get('x-ratelimit-reset')) * 1000);
      debug('ratelimit:', this.quota);
      return res.json();
    });
  }
}

module.exports = GitHub;

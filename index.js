'use strict';

const debug = require('debug')('gh-fetched');
const fetch = require('make-fetch-happen');
const lo = require('lodash');
const url = require('url');

const DEFAULTS = {
  root: 'https://api.github.com',
  cacheManager: null,
};

class GitHub {
  constructor(opts) {
    opts = lo.defaults(opts, DEFAULTS);
    this.root = opts.root;
    this.token = opts.token;
    let headers = {};
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    this.fetch = fetch.defaults({
      headers: headers,
      cacheManager: opts.cacheManager,
    });
    this.quota = {};
  }

  _get(reqUrl) {
    return this.fetch(reqUrl).then(res => {
      this.quota['limit'] = 0|res.headers.get('x-ratelimit-limit');
      this.quota['remaining'] = 0|res.headers.get('x-ratelimit-remaining');
      this.quota['reset'] = new Date((0|res.headers.get('x-ratelimit-reset')) * 1000);
      debug('cache:', res.headers.get('X-Local-Cache'));
      debug('ratelimit:', this.quota);
      return res.json();
    });
  }

  get(reqPath) {
    return this._get(this.root + reqPath);
  }

  getAll(reqPath) {
    let reqUrl = url.parse(this.root + reqPath);
    reqUrl.query = {
      per_page: 100,
      page: 1,
    };
    let collection = [];
    let getPage = (r) => {
      collection = collection.concat(r);
      if (r.length === reqUrl.query.per_page) {
        reqUrl.query.page++;
        return this._get(url.format(reqUrl)).then(getPage);
      } else {
        return collection;
      }
    }
    return this._get(url.format(reqUrl)).then(getPage);
  }
}

module.exports = GitHub;

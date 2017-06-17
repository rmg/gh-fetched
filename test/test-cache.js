'use strict';

const GitHub = require('../');
const path = require('path');
const test = require('tap').test;

const cacheDir = path.join(__dirname, '.cache-test');
const cachedGH = new GitHub({cacheManager: cacheDir});
let initial = null;

test('uncached fetch', t => {
  t.comment('using cache dir:', cacheDir);
  return cachedGH.get('/repos/rmg/gh-fetched').then(r => {
    t.ok(r.id, 'fetches repo');
    initial = cachedGH.quota.remaining;
    t.equal(cachedGH.quota.limit, 60, 'should have higher quota');
  });
});

test('cached fetch', t => {
  return cachedGH.get('/repos/rmg/gh-fetched').then(r => {
    t.ok(r.id, 'still returns the repo');
    t.equal(cachedGH.quota.remaining, initial, 'should have higher quota');
  });
});

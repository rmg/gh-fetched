'use strict';

const GitHub = require('../');
const path = require('path');
const test = require('tap').test;

const gh = new GitHub({token: process.env.GITHUB_TOKEN});
let initial = null;

test('fetch a collection of repositories', t => {
  return gh.getAll('/orgs/strongloop/repos').then(r => {
    t.comment(`fetched ${r.length} repos`);
    t.ok(r.length > 100, 'returned more than 100 repos');
  });
});

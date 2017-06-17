'use strict';

const test = require('tap').test;
const GitHub = require('../');

const maybeSkip = {};
if (!process.env.GITHUB_TOKEN) {
  maybeSkip.skip = 'env does not hvae GITHUB_TOKEN set, skipping';
}

test('basic API', maybeSkip, t => {
  const authed = new GitHub({token: process.env.GITHUB_TOKEN});
  return authed.get('/').then(r => {
    t.ok(r.current_user_url, 'resonse looks like the GH API root');
    t.equal(authed.quota.limit, 5000, 'should have higher quota');
  });
});

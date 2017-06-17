'use strict';

const test = require('tap').test;
const GitHub = require('../');

test('basic API', t => {
  const anon = new GitHub();
  return anon.get('/').then(r => {
    t.ok(r.current_user_url, 'resonse looks like the GH API root');
  });
});

#!/usr/bin/env node

(async () => {
  const rnn = require("./index.js");

  let params = process.argv.slice(2);

  let out = await rnn(params[0]);

  console.log(out);
})();

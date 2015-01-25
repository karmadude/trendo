var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe("trendo");

var trendo = require("../trendo");

suite.addBatch({
  "trendo": {
  	topic: trendo.version,
    "is defined": function(version) {
      assert.isString(version);
    }
  }
});

suite.export(module);


var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe("trendo");

var trendo = require("../trendo");

suite.addBatch({
  "trendo.version": {
  	topic: trendo.version,

    "is defined": function(version) {
      assert.isString(version);
    }
  },

  "trendo.trends": {
	  	topic: trendo,

	    "when no data is provided, returns undefined": function(trendo) {
	      assert.isUndefined(trendo.trends());
	    },

	    "when data is not an array, returns undefined": function(trendo) {
	      assert.isUndefined(trendo.trends("a,b,c"));
	    },

	    "when data is an empty array, returns trends object with empty arrays": function(trendo) {
	    	var trends = trendo.trends([]);
	    	assert.isObject(trends);
	    	["pastDay", "pastWeek", "pastMonth", "pastYear"].forEach(function(d) {
	    		assert.include(trends, d);
	    		assert.isArray(trends[d]);
	      	assert.isEmpty(trends[d]);
	    	});
	    }
  }
});

suite.export(module);


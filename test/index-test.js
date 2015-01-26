var vows = require('vows'),
    assert = require('assert'),
    moment = require('moment');

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

	    "calling `trendo.trends([])`": {
	    	topic: function(trendo) {
	    		return trendo.trends([]);
	    	},

	    	"should return default trends object": function(trends) {
	    		assert.isObject(trends);
	    		["total", "day", "week", "month", "year"].forEach(function(d) {

	    			assert.include(trends, d);

	    			var group = trends[d];
	    			
	    			assert.isObject(group);

	    			assert.include(group, "unit");

	    			if(d !== "total") {
	    				assert.include(group, "length");
	    				assert.include(group, "counts");
	    				assert.isArray(group.counts)
	    				assert.equal(group.length, group.counts.length);
	    			}

	    			assert.include(group, "timeframe");
	    			assert.include(group.timeframe, "start");
	    			assert.include(group.timeframe, "end");

	    		});
	    	},

	    	"should return formatted hours in hourly trend data": function(trends) {
	    		trends.day.counts.forEach(function(trend, i) {
	    			var date = moment(new Date(trend.date));
	    			assert.equal(trend.text, 
	    				date.format(trends.day.unitFormat));
	    		});
	    	},

	    	"should return formatted days in weekly trend data": function(trends) {
	    		trends.week.counts.forEach(function(trend, i) {
	    			var date = moment(new Date(trend.date));
	    			assert.equal(trend.text, 
	    				date.format(trends.week.unitFormat(date, i)));
	    			
	    			if(i === 0) 
	    				assert.equal(trend.text, "Today");
	    			else
	    				assert.equal(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/gi.test(trend.text), true);
	    		});
	    	},

	    	"should return formatted weeks in montly trend data": function(trends) {
	    		trends.month.counts.forEach(function(trend, i) {
	    			var date = moment(new Date(trend.date));
	    			assert.equal(trend.text, 
	    				date.format(trends.month.unitFormat(date, i)));

	    			if(i === 0) assert.equal(trend.text, "This Week");
	    			if(i === 1) assert.equal(trend.text, "Last Week");
	    			if(i > 1) assert.equal(/weeks ago$/gi.test(trend.text), true);
	    		});
	    	},

	    	"should return formatted months in yearly trend data": function(trends) {
	    		trends.year.counts.forEach(function(trend, i) {
	    			var date = moment(new Date(trend.date));
	    			assert.equal(trend.text, 
	    				date.format(trends.year.unitFormat(date, i)));

	    			if(i === 0) assert.equal(trend.text, "This Month");
	    			if(i > 1) assert.equal(/^jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/gi.test(trend.text), true);
	    		});
	    	}
	    },

	    "calling `trendo.trends([data,...])`": {
	    	topic: function(trendo) {
	    		var data = [];
	    		var mDate = moment();
	    		for(var i = 0; i < 24; i++) {
	    			data.push({
	    				date: mDate.clone().toDate().getTime(),
	    				title: "d" + i
	    			});
	    			console.log(data[i].date);
	    			mDate.subtract(1, 'hour');
	    		}
	    		return {data: data, trends: trendo.trends(data)};
	    	},

	    	"should return last day trends in hours": function(d) {
	    		d.trends.day.counts.forEach(function(c, i) {
	    			console.log(i + ": " + c)
	    			assert.equal(c.count, 1);

	    			var mDate = moment(d.data[i].date)
	    				.set('minute', 0)
	    				.set('second', 0)
	    				.set('millisecond', 0);
	    			assert.equal(c.date, mDate.toDate().getTime());
	    		});
	    	}
	    }
  }
});

suite.export(module);


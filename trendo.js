var moment = require('moment');

!function() {
	var trendo = {
    version: "1.0.0"
  };

  var TREND_GROUPS = ["day", "week", "month", "year"];

  trendo.trends = function(data) {
  	if(!(data instanceof Array)) return;

  	var response = {
  		total: {
  			unit: "total",
  			timeframe: {start: 0, end: Date.now()},
  			valid: {count: 0, data: []},
  			invalid: {count: 0, data: []},
  			excluded: {count: 0, data: []}
  		}  	
  	};

  	var mNow = moment(response.total.timeframe.end);

  	// Init trend groups
  	response["day"] = createTrendGroup('hour', 24, mNow, 'h:00a');
  	response["week"] = createTrendGroup('day', 7, mNow, function(mDate, i) {
  		return (i === 0) ? '[Today]' : 'dddd';
  	});
  	response["month"] = createTrendGroup('week', 5, mNow, function(mDate, i) {
  		return "[" 
  			+ ((i === 0) 
  				? 'This Week' : (i === 1)
  				? 'Last Week' : i + " weeks ago")
  			+ "]";
  	});
  	response["year"] = createTrendGroup('month', 12, mNow, function(mDate, i) {
  		return (i === 0) ? '[This Month]' : "MMM 'YY";
  	});

  	response.total.timeframe.start = moment(response.year.timeframe.start)
  		.startOf('day')
  		.toDate().getTime();

  	data.forEach(function(d, i) {
  		if(isInvalidDate(d.date)) {
				response.total.invalid.data.push(d);
  			response.total.invalid.count++;
  			return;
  		}

  		if(shouldExcludeDate(d.date, response.total.timeframe)) {
  			response.total.excluded.data.push(d);
  			response.total.excluded.count++;
  			return;
  		}

  		TREND_GROUPS.forEach(function(key) {
  			var trend = response[key],
  					mDate,
  					offset,
  					index;

  			mDate = moment(d.date)
  				.set('minute', 0)
  				.set('second', 0)
  				.set('millisecond', 0);

  			if(d.unit !== 'hour') mDate.set('hour', 0);

  			if(shouldExcludeDate(mDate.toDate().getTime(), trend.timeframe)) return;

  			switch(key) {
  				case 'day':
  					var hour = mDate.hour();
  					offset = moment(response.day.counts[0].date).hour();
  					index = (hour <= offset) ? offset - hour : offset + (hour - offset);
  					response.day.counts[index].count++;
  					response.day.counts[index].data.push(d);
  					break;
  				// case 'week':
  				// 	var day = mDate.day();
  				// 	offset = moment(response.week.counts[0].date).day();
  				// 	index = (day <= offset) ? offset - day : offset + (day - offset);
  				// 	response.week.counts[index].count++;
  				// 	response.week.counts[index].data.push(d);
  				// 	break;
  			}
  		});
  	});
  	
  	return response;
  };

  function createTrendGroup(unit, length, mDate, format) {
		var trend = {
			unit: unit,
			unitFormat: format,
			length: length,
			timeframe: {start: 0, end: 0},
			counts: []
		};

		var mNow = mDate.clone()
  		.set('minute', 0)
  		.set('second', 0)
  		.set('millisecond', 0);

  	if(unit !== 'hour') mNow.set('hour', 0);
  		
  	trend.timeframe.end = mNow.toDate().getTime();
  	for(var d = 0; d < trend.length; d++) {
  		mNow = mNow.clone().subtract(d > 0 ? 1 : 0, unit);
  		trend.counts[d] = {
  			text: mNow.format(typeof format === 'function' ? format(mNow, d) : format), 
  			date: mNow.toDate().getTime(), 
  			count: 0, 
  			data: []
  		};
  	}
  	trend.timeframe.start = mNow.toDate().getTime();

  	return trend;
  }

  function isInvalidDate(date) {
  	return isNaN(new Date(date));
  }

  function shouldExcludeDate(date, timeframe) {
  	return date < timeframe.start || date > timeframe.end;
  }

  if (typeof define === "function" && define.amd) 
  	define(trendo);
  else if (typeof module === "object" && module.exports) 
  	module.exports = trendo;

  this.trendo = trendo;
}();
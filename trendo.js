!function() {
	var trendo = {
    version: "1.0.0"
  };

  trendo.trends = function(data) {
  	if(!(data instanceof Array)) return;

  	return {
  		pastDay: [],
  		pastWeek: [],
  		pastMonth: [],
  		pastYear: []
  	};
  }

  if (typeof define === "function" && define.amd) 
  	define(trendo);
  else if (typeof module === "object" && module.exports) 
  	module.exports = trendo;

  this.trendo = trendo;
}();
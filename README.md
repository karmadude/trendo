# Trendo

Trendo converts time series data into past day, week, month, and year trends.

## Install

    $ npm install trendo

## Examples

```
var trendo = require('trendo');

var data = [
    {date: "Jan 1 2015 08:00:00", ...},
    {date: "Jan 2 2015 08:30:00", ...},
    ...
];

var trends = trendo.trends(data);
```

#### Response

```
    {
        total: {
            unit: 'total',
            timeframe: {start: timestamp, end: timestamp},
            valid: {count: 0, data: []},
            invalid: {count: 0, data: []},
            excluded: {count: 0, data: []},
        },
        day: {
            unit: 'hour',
            unitFormat: 'h:00a',
            length: 24,
            timeframe: {start: timestamp, end: timestamp},
            counts: [
                {text: "8:00am", date: timestamp, count: 0, data: []},
                {text: "9:00am", date: timestamp, count: 0, data: []},
                ...
            ]
        },
        week: {
            unit: 'day',
            unitFormat: function,
            length: 7,
            timeframe: {start: timestamp, end: timestamp},
            counts: [
                {text: "Today", date: timestamp, count: 0, data: []},
                {text: "Thursday", date: timestamp, count: 0, data: []},
                ...
            ]
        },
        month: {
            unit: 'week',
            unitFormat: function,
            length: 5,
            timeframe: {start: timestamp, end: timestamp},
            counts: [
                {text: "This Week", date: {start: timestamp, end: timestamp, count: 0, data: []},
                {text: "Last Week", date: {start: timestamp, end: timestamp, count: 0, data: []},
                ...
            ]
        },
        year: {
            unit: 'month',
            unitFormat: function,
            length: 12,
            timeframe: {start: timestamp, end: timestamp},
            counts: [
                {text: "This Month", date: {start: timestamp, end: timestamp, count: 0, data: []},
                {text: "Dec '14", date: {start: timestamp, end: timestamp, count: 0, data: []},
                ...
            ]
        }
    }
```
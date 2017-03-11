'use strict';

var cluster = require('./lib/cluster.js'),
    metrics = require('./lib/metrics.js');

module.exports = function (inputs, options) {
  var key, defaults = {
        maxLinkage: Infinity,
        distance: metrics.distance.manhattan,
        linkage: metrics.linkage.average
      }, levels;

  if (options) {
    for (key in options) {
      if (typeof options[key] === 'string') {
        defaults[key] = metrics[key][options[key]];
      } else {
        defaults[key] = options[key];
      }
    }
  }

  levels = cluster(inputs, defaults);

  levels.fit = function (regression, callback) {
    var length = levels.length,
        index = 0,
        points = [],
        x, y, line;

    for (; index < length; index++) {
      x = (index + 1) / length;
      y = levels[index].linkage;

      if (callback !== undefined &&
          callback(x, y) === false) {
        continue;
      }

      points.push([x, y]);
    }

    line = regression(points);

    line.points.forEach(function (point, i) {
      point.index = i;
      point.level = levels[i];
      point.point = points[i];
      point.linkage = point.level.linkage;
      point.distance = distance(point, points[i]);
    });

    return line;
  }

  return levels;
}

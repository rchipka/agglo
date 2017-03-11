'use strict';

var Link = require('./link.js');

module.exports = function cluster(inputs, options) {
  var length = inputs.length,
      clusters = inputs.map(function (v, i) {
        if (options.indexes !== false && typeof v === 'number') {
          return [i];
        }

        return [v];
      }),
      links = new Link(inputs, clusters, options.distance),
      maxLevels = length - 1,
      levels = Array(maxLevels),
      index = 0, link, sourceIndex, targetIndex;

  while (index < maxLevels) {
    link = links.minimum();

    sourceIndex = link.source.index;
    targetIndex = link.target.index;

    mergeArray(
      link.source.cluster = clusters[sourceIndex],
      link.target.cluster =
        clusters[targetIndex] = clusters[targetIndex].slice(0));

    clusters[sourceIndex] = null;

    links.merge(link, options.linkage);

    levels[index++] = {
      source: {
        index: sourceIndex,
        value: inputs[sourceIndex]
      },
      target: {
        index: targetIndex,
        value: inputs[targetIndex]
      },
      linkage: link.linkage,
      clusters: getClusters(clusters, length, index)
    }
  }

  return levels;
}

function getClusters(array, length, offset) {
  var i = 0, j = 0, clusters = Array(length - offset);

  for (; i < length; i++) {
    if (array[i] !== null) {
      clusters[j++] = array[i];
    }
  }

  return clusters;
}

function mergeArray(source, target) {
  var length, i = 0;

  for (length = source.length; i < length; i++) {
    target.push(source[i]);
  }
}

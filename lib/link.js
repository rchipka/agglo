'use strict';

var Matrix = require('./matrix.js');

function Link(inputs, clusters, distance) {
  this.matrix = new Matrix(inputs, clusters, distance);

  return this;
}

Link.prototype.minimum = function () {
  var matrix = this.matrix,
      row = matrix.row,
      min = null;

  while (true) {
    row = row.next;

    if (row.minimum.source !== null) {
      if (row.minimum.update === true ||
          row.minimum.source.removed === true) {
        row.minimum.update = false;
        this.update(row);
      }

      if (min === null ||
          row.minimum.linkage < min.linkage) {
        min = row.minimum;
      }
    }

    if (row === matrix.row) {
      break;
    }
  }

  return min;
}

Link.prototype.merge = function (link, linkageFunc) {
  var source = link.source,
      target = link.target,
      sourceIndex = source.index, sourceLink,
      targetIndex = target.index, targetLink,
      matrix = this.matrix,
      row = matrix.row;

  while (true) {
    row = row.next;

    if (row.index !== sourceIndex &&
        row.index !== targetIndex) {
      sourceLink = matrix.get(sourceIndex, row.index);
      targetLink = matrix.get(targetIndex, row.index);

      row.linkage = sourceLink;
      target.linkage = targetLink;

      this.setMinimum(targetIndex, row.index, linkageFunc(row, target));
    }

    if (row === matrix.row) {
      break;
    }
  }

  source.removed = true;
  target.count += source.count;

  if (matrix.row === source) {
    matrix.row = target;
  }

  source.prev.next = source.next;
  source.next.prev = source.prev;
}

Link.prototype.update = function (target) {
  var row = target, min = target.minimum, link,
      matrix = this.matrix;

  min.linkage = Infinity;
  min.source = null;

  while (row = row.prev) {
    if (row.index >= target.index) {
      break;
    }

    link = target.links[row.index];

    if (link < min.linkage) {
      min.linkage = link;
      min.source = matrix.get(row.index);
    }
  }
}

Link.prototype.setMinimum = function (x, y, linkage) {
  var sourceIndex = x,
      targetIndex = y,
      matrix = this.matrix,
      target, minimum;

  matrix.set(x, y, linkage);

  if (x > y) {
    sourceIndex = y;
    targetIndex = x;
  }

  target = matrix.get(targetIndex);
  minimum = target.minimum;

  if (linkage < minimum.linkage) {
    minimum.linkage = linkage;
    minimum.source = matrix.get(sourceIndex);
  } else if (sourceIndex === minimum.source.index &&
             minimum.linkage !== linkage) {
    minimum.update = true;
  }
}

module.exports = Link;

'use strict';

function Matrix(inputs, clusters, distance) {
  var length = inputs.length,
      i = length,
      matrix = Array(length),
      j, v, link, min, firstRow, row,
      prevRow;

  for (i = 0; i < length; i++) {
    if (matrix[i] === undefined) {
      matrix[i] = createRow(i, clusters);
    }

    row = matrix[i];

    j = i;
    v = inputs[i];

    for (j = 0; j < i; j++) {
      if (matrix[j] === undefined) {
        matrix[j] = createRow(j, clusters);
      }

      matrix[i].links[j] = link = distance(v, inputs[j]);

      if (link < row.minimum.linkage) {
        row.minimum.linkage = link;
        row.minimum.source = matrix[j];
        row.minimum.target = matrix[i];
      }
    }

    if (firstRow === undefined) {
      firstRow = row;
    }

    if (prevRow !== undefined) {
      prevRow.next = row;
      row.prev = prevRow;
    }

    prevRow = row;
  }

  row.next = firstRow;
  firstRow.prev = row;

  this.row = row;
  this.matrix = matrix;

  return this;
}

Matrix.prototype.get = function(x, y) {
  if (y === undefined) {
    return this.matrix[x];
  }

  if (x > y) {
    return this.matrix[x].links[y];
  }

  return this.matrix[y].links[x];
}

Matrix.prototype.set = function (x, y, value) {
  if (x > y) {
    return (this.matrix[x].links[y] = value);
  }

  return (this.matrix[y].links[x] = value);
}

function createRow(index, clusters) {
  return {
    index: index,
    count: 1,
    links: new Float32Array(index),
    cluster: clusters[index],
    linkage: Infinity,
    minimum: {
      update: false,
      linkage: Infinity,
      source: null,
      target: null
    },
    removed: false,
    next: null,
    prev: null
  };
}

module.exports = Matrix;

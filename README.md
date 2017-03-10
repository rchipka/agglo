# Agglo
Fast hierarchical agglomerative clustering in Javascript


## Install

`npm install agglo`


## Usage
```javascript
var levels = agglo(inputs, [options]);
```

## inputs

An array of numbers to measure the distance between.

```javascript
agglo([0, 1, 2]);
```

To measure multiple dimensions, use multiple arrays of numbers.

```javascript
agglo([
  [1, 10, 50.32],
  [9, 3, 18.0]
  [0, 1.5, 9.7]
]);
```

If you define your own distance function, your inputs can be more abstract.

```javascript
agglo(db.get('users'), {
  distance: measureUserDistance
});
```


## options


## levels

Agglo will return an array of `inputs.length - 1` levels. The first level represents the first two clusters to merge. The last level represents the last two clusters to merge.

```javascript
[
  { // level 1
    linkage: 2,
    source: {
      index: 0,
      value: [5, 13]
    },
    target: {
      index: 2,
      value: [6, 12]
    },
    clusters: [
      [[9, 22]],
      [[5, 13], [6, 12]],
      ...
    ]
  },
  ...
]
```

### levels.fit(regression, callback)

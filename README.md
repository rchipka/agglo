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

* *maxLinkage*

 Limits clustering to a maximum linkage (distance).

 Default: Infinity

 Note: This will likely change the number of returned levels

* *linkage*

 Specifies the linkage function to use (default: "average")

 * "average"
 
   Merge clusters based on the average distance between items in each cluster.

 * "complete"

   Merge clusters based on the largest distance between items in each cluster.

 * "single"

   Merge clusters based on the smallest distance between items in each cluster.

 * function (source, target)

   A custom linkage function that returns the distance between the `source` cluster and the `target` cluster.
 
   The `source` and `target` look objects like this:
 
   ```javascript
    {
       index: 5,      // the value's index in the original input
       count: 2,      // the number of values in this cluster
       links: [],     // an array of numeric links to every preceeding input value
       linkage: 1.5,  // the linkage between this cluster and the last value to merge into it
       cluster: []    // an array of input values
     }
    ```
* *distance*

 Specifies the function to use for measing the distance between each input.
 
 * "euclidean"
 * "manhattan"
 * "max"
 * function (a, b)
 
   A custom distance function that compares input value A to input value B and returns a number (usually between 0 and 1).

## levels

Agglo will return an array of `inputs.length - 1` levels. The first level represents the first two clusters that were merged. The last level represents the last two clusters that were merged.

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

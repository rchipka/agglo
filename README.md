# agglo
Fast hierarchical agglomerative clustering in Javascript

# Usage

## agglo(inputs, options)

#### inputs

Your input is an array of numbers to measure the distance between.

```javascript
agglo([0, 1, 2]);
```

You can also use an array numbers per each input.

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

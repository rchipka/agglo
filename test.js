'use strict';

var agglo       = require('./index.js'),
    ANSI_RED    = '\x1B[31m',
    ANSI_GREEN  = '\x1B[32m',
    ANSI_RESET  = '\x1B[0m',
    CROSS_MARK  = '\u2718',
    CHECK_MARK  = '\u2714',
    PAD_LEFT    = '  ',
    PAD_RIGHT   = '  ',
    LEVEL       = 'Level: ',
    ASSERT_OK   = PAD_LEFT + ANSI_GREEN + CHECK_MARK + ANSI_RESET + PAD_RIGHT,
    ASSERT_FAIL = PAD_LEFT + ANSI_RED + CROSS_MARK + ANSI_RESET + PAD_RIGHT,
    success     = 0,
    total       = 0,
    status      = function () {
      return success + ' / ' + total + ' tests passing\n';
    },
    input       = [0, 0, 1, 5, 7, 10, 15, 50];

console.log();

[
  {
    linkage: 'average',
    distance: 'manhattan',
    expected: [
      [[0, 0]],
      [[0, 0, 1]],
      [[0, 0, 1], [5, 7]],
      [[0, 0, 1], [5, 7, 10]],
      [[0, 0, 1, 5, 7, 10]],
      [[0, 0, 1, 5, 7, 10, 15]],
      [input]
    ],
    indexes: false
  },
  {
    linkage: 'single',
    distance: 'manhattan',
    expected: [
      [[0, 0]],
      [[0, 0, 1]],
      [[0, 0, 1], [5, 7]],
      [[0, 0, 1], [5, 7, 10]],
      [[0, 0, 1, 5, 7, 10]],
      [[0, 0, 1, 5, 7, 10, 15]],
      [input]
    ],
    indexes: false
  },
  {
    linkage: 'complete',
    distance: 'manhattan',
    expected: [
      [[0, 0]],
      [[0, 0, 1]],
      [[0, 0, 1], [5, 7]],
      [[0, 0, 1], [5, 7], [10, 15]],
      [[0, 0, 1, 5, 7], [10, 15]],
      [[0, 0, 1, 5, 7, 10, 15]],
      [input]
    ],
    indexes: false
  }
].forEach(function (test, index, tests) {
  console.log(
    (index + 1) + '/' + tests.length + PAD_LEFT +
    'distance: ' + test.distance + ', ' +
    'linkage: ' + test.linkage + '\n');

  agglo(input, test)
    .forEach(function (level, index) {
      var result   = level.clusters,
          expected = test.expected[index],
          passed = result.every(function (source) {
            if (source.length < 2) {
              return true;
            }

            if (!expected) {
              return false;
            }

            return expected.some(function (target) {
              return match(source.sort(), target.sort());
            });
          });

      if (passed) {
        console.log(
          ASSERT_OK + LEVEL + (index + 1) + PAD_LEFT);
        success++;
      } else {
        console.error(
          ASSERT_FAIL + LEVEL + (index + 1) +
          PAD_LEFT + PAD_LEFT +
          JSON.stringify(result) + ' != ' +
          JSON.stringify(expected));
      }

      total++;
    });

  console.log();
});

console.log('\n');

if (success !== total) {
  console.log(ASSERT_FAIL + status());
  process.exit(1);
}

console.log(ASSERT_OK + status());

function match(a, b) {
  var index = a.length;

  while (index--) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}

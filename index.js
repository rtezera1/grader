#!/usr/bin/env node 

var async = require('async'), 
  _ = require('lodash');

var argv = require('yargs')
  .usage("-n [list of numbers]")
  .alias("n", "array of numbers")
  .argv;

var listOfnumbers = argv.n;

function sortedNum (next) {
  // convert to json object
  var numbers = JSON.parse(listOfnumbers)
  numbers.sort(function (num1, num2) {
    return num1 - num2;
  });
  next(null, numbers)
}

function grading (numbers, next) {
  var fiveGrades;
  numbersLength = numbers.length;

  numberOfscoresPerGrade = numbersLength/5;

  rounded = Math.round(numberOfscoresPerGrade)
  splitToGroups =  _.chunk(numbers, rounded)
 
  if (splitToGroups.length != 5) {
      last = splitToGroups.pop()
      secondTolast = splitToGroups[splitToGroups.length - 2 ]
      junedin = secondTolast.concat(last)
    
      anotherPop = splitToGroups.pop()
      fiveGrades = splitToGroups.concat([junedin])

  } else {
    fiveGrades = splitToGroups
  }

  next(null, fiveGrades)

}

function combiningTheLike (fiveGrades, next) {
  fiveGrades[0].forEach(function (element) {
    if (fiveGrades[1].indexOf(element) != -1) {
        fiveGrades[0] = _.without(fiveGrades[0], element)
        fiveGrades[1].push(element)
    }
  })
  fiveGrades[1].forEach(function (element) {
    if (fiveGrades[2].indexOf(element) != -1) {
        fiveGrades[1] = _.without(fiveGrades[1], element)
        fiveGrades[2].push(element)
    }
  })
  fiveGrades[2].forEach(function (element) {
    if (fiveGrades[3].indexOf(element) != -1) {
        fiveGrades[2] = _.without(fiveGrades[2], element)
        fiveGrades[3].push(element)
    }
  })
  fiveGrades[4].forEach(function (element) {
    if (fiveGrades[3].indexOf(element) != -1) {
        fiveGrades[4] = _.without(fiveGrades[4], element)
        fiveGrades[3].push(element)
    }
  })

  next(null, fiveGrades)
  
}

function hashFormat (fiveGrades, next) {
  var gradeOptions = {};
  gradeOptions.A = fiveGrades[0]
  gradeOptions.B = fiveGrades[1]
  gradeOptions.C = fiveGrades[2]
  gradeOptions.D = fiveGrades[3]
  gradeOptions.E = fiveGrades[4]

  next(null, gradeOptions)
}
async.waterfall([
  sortedNum,
  grading,
  combiningTheLike,
  hashFormat
  ], function (err, res) {
    if (err) {
      console.log('errr bru')
    } else {
      console.log("Grades: " + JSON.stringify(res));
    }
});




const chai = require('chai');
const assert = chai.assert;

const {testStrings,puzzlesAndSolutions} = require('../controllers/puzzle-strings')

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters',function(){
    assert.isTrue(solver.validate(testStrings[0]))
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',function(){
    assert.equal(solver.validate(testStrings[1]).error,'Invalid characters in puzzle')
  })
  test('Logic handles a puzzle string that is not 81 characters in length',function(){
    assert.equal(solver.validate(testStrings[2]).error,'Expected puzzle to be 81 characters long')
  })

  test('Logic handles a valid row placement',function(){
    assert.isTrue(solver.checkRowPlacement(testStrings[0],1,0,3))
  })

  test('Logic handles an invalid row placement',function(){
    assert.isFalse(solver.checkRowPlacement(testStrings[0],1,0,1))
  })

  test('Logic handles a valid column placement',function(){
    assert.isTrue(solver.checkColPlacement(testStrings[0],1,0,3))
  })

  test('Logic handles an invalid column placement',function(){
    assert.isFalse(solver.checkColPlacement(testStrings[0],3,0,3))
  })

  test('Logic handles a valid region (3x3 grid) placement',function(){
    assert.isTrue(solver.checkRegionPlacement(testStrings[0],1,0,3))
  })

  test('Logic handles an invalid region (3x3 grid) placement',function(){
    assert.isFalse(solver.checkRegionPlacement(testStrings[0],1,0,6))
  })

  test('Valid puzzle strings pass the solver',function(){
    const result = solver.solve(puzzlesAndSolutions[0][0],0)
    assert.isString(result)
    assert.equal(result.length,81)
  })

  test('Invalid puzzle strings fail the solver',function(){
    const result = solver.solve(testStrings[3],0)
    assert.isFalse(result)
  })

  test('Valid puzzle strings pass the solver',function(){
    const result = solver.solve(puzzlesAndSolutions[0][0],0)
    assert.isString(result)
    assert.equal(result.length,81)
    assert.equal(result,puzzlesAndSolutions[0][1])
  })
 
});

require("@babel/polyfill");

function SudokuSolver() {
  this.coordinateTransform = function(coordinate) {
    const regex = /^([a-iA-I]){1}[1-9]{1}$/
    if (!regex.test(coordinate)) { return false }
    const firstLetter = `${coordinate[0]}`.toLowerCase().charCodeAt(0)
    const column = firstLetter - 97
    const row = `${(coordinate[1] * 1) - 1}`
    return { column, row }
  }

  this.replaceAt = function(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
  }

  this.delay = (n) => new Promise(r => setTimeout(r, n * 1000));

  this.validate = function(puzzleString) {
    const regexCharacter = /^[\d\.]{81}$/
    if (!(puzzleString.length === 81)) { return { error: "Expected puzzle to be 81 characters long" } }
    if (!regexCharacter.test(puzzleString)) { return { error: "Invalid characters in puzzle" } }

    return true
  }

  this.checkComplete = function(puzzleString) {
    const regex = /^[\d]{81}$/
    return regex.test(puzzleString)
  }

  this.checkRowPlacement = function(puzzleString, row, column, value) {
    const columnPosition = (column) * 9;
    if (puzzleString[columnPosition + row] == value) { return true }

    for (let i = 0; i < 9; i++) {
      if (row == i) { continue; }
      let actualPosition = puzzleString[columnPosition + i]
      if (actualPosition == value) {
        return false
      }
    }
    return true
  }

  this.checkColPlacement = function(puzzleString, row, column, value) {
    const rowPosition = row * 1;

    for (let i = 0; i < 9; i++) {
      if (column == i) { continue; }
      let actualPosition = puzzleString[rowPosition + i * 9]
      if (actualPosition == value) {
        return false
      }
    }
    return true
  }

  this.checkRegionPlacement = function(puzzleString, row, column, value) {
    const rowPosition = Math.trunc(row / 3)
    const columnPosition = Math.trunc(column / 3)
    const xPos = rowPosition * 3;
    const yPos = columnPosition * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (j == row % 3 && i == column % 3) { continue; }

        let actualPosition = puzzleString[(xPos + j) + ((yPos + i) * 9)]
        if (actualPosition == value) {
          return false
        }
      }
    }
    return true
  }
  this.checker = function(puzzleString, row, column, value) {
    if (!this.checkRowPlacement(puzzleString, row, column, value) || !this.checkColPlacement(puzzleString, row, column, value) || (!this.checkRegionPlacement(puzzleString, row, column, value))) {
      return false
    }
    return true
  }
  this.solve = function(puzzleString, pos) {
    const regex = /^[\d]{81}$/;
    let columnPosition = Math.trunc(pos / 9);
    let rowPosition = pos % 9

    if (regex.test(puzzleString)) { return puzzleString }
    if (pos >= 81) { return false }

    if (puzzleString[pos] != '.') {
      if (this.checker(puzzleString, rowPosition, columnPosition, puzzleString[pos])) {
        return this.solve(puzzleString, pos + 1)
      } else {
        return false
      }
    }

    for (let j = 1; j <= 9; j++) {
      if (!this.checker(puzzleString, rowPosition, columnPosition, j)) {
        continue
      }
      let newPuzzleString = `${this.replaceAt(puzzleString, pos, j + '')}`;
      let result = this.solve(newPuzzleString, pos + 1)
      if (regex.test(result)) { return result }
    }
    return false
  }

  this.solver = function(puzzleString) {
    const regex = /^[\d]{81}$/;
    if (regex.test(puzzleString)) {
      console.log(puzzleString)
      const result = this.checkAllSquares(puzzleString)
      return (result) ? puzzleString : false
    }
    return this.solve(puzzleString, 0)
  }

  this.checkAllSquares = function(puzzleString) {
    for (let i = 0; i < puzzleString.length; i++) {
      let columnPosition = Math.trunc(i / 9);
      let rowPosition = i % 9
      let result = this.checker(puzzleString, rowPosition, columnPosition, puzzleString[i])
      if (!result) { return false }
    }
    return true
  }
}

module.exports = SudokuSolver;


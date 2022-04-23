'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const { coordinate, value, puzzle } = req.body;
      if (!coordinate || !value || !puzzle) { res.json({ error: 'Required field(s) missing' }); return; }

      const validate = solver.validate(req.body.puzzle);
      if (validate.error) { res.json(validate); return }

      const { column, row } = solver.coordinateTransform(coordinate)

      if (typeof column === 'undefined' || typeof row === 'undefined') { res.json({ error: 'Invalid coordinate' }); return; }
      if (!(/^[1-9]$/.test(value))){ res.json({ error: 'Invalid value' }); return; }
      
      let conflicts = []
      if (!solver.checkColPlacement(puzzle, row, column, value)) { conflicts.push('column') }
      if (!solver.checkRowPlacement(puzzle, row, column, value)) { conflicts.push('row') }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) { conflicts.push('region') }

      res.json({ valid: (conflicts.length == 0) ? true : false, conflict: conflicts })
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        if (!req.body.puzzle) { res.json({ error: 'Required field missing' }); return; }
        const validate = solver.validate(req.body.puzzle);
        if (validate.error) { res.json(validate); return }
        const result = solver.solver(req.body.puzzle)
        if (!solver.checkComplete(result)) { res.json({ error: 'Puzzle cannot be solved' }); return }
        res.json({ solution: result });
      } catch (err) {

      }
    });
};

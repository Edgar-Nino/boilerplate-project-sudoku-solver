const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { testStrings, puzzlesAndSolutions } = require('../controllers/puzzle-strings')

suite('Functional Tests', () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done) {
    chai.request(server)
      .post('/api/solve')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ puzzle: testStrings[0] })
      .end(function(err, res) {
        const { solution } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(solution);
        assert.isString(solution);
        assert.equal(solution.length, 81)
        done();
      })
  })

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done) {
    chai.request(server)
      .post('/api/solve')
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.isString(error);
        assert.equal(error, 'Required field missing')
        done();
      })
  })

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done) {
    chai.request(server)
      .post('/api/solve')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ puzzle: testStrings[1] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.isString(error);
        assert.equal(error, 'Invalid characters in puzzle')
        done();
      })
  })

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done) {
    chai.request(server)
      .post('/api/solve')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ puzzle: testStrings[2] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.isString(error);
        assert.equal(error, 'Expected puzzle to be 81 characters long')
        done();
      })
  })

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done) {
    chai.request(server)
      .post('/api/solve')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ puzzle: testStrings[3] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.isString(error);
        assert.equal(error, 'Puzzle cannot be solved')
        done();
      })
  })

  test("Check a puzzle placement with all fields: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'A2', value: '3', puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res) {
        const { valid, conflict } = res.body
        assert.equal(res.status, 200);
        assert.isTrue(valid);
        assert.isBoolean(valid)
        assert.isArray(conflict)
        assert.isEmpty(conflict);
        done();
      })
  })
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'A2', value: 8, puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res) {
        const { valid, conflict } = res.body
        assert.equal(res.status, 200);
        assert.isFalse(valid);
        assert.isBoolean(valid)
        assert.isArray(conflict)
        assert.equal(conflict[0], "row", 1);
        assert.equal(conflict.length, 1);
        done();
      })
  })
  
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'B2', value: 1, puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res) {
        const { valid, conflict } = res.body
        assert.equal(res.status, 200);
        assert.isFalse(valid);
        assert.isBoolean(valid)
        assert.isArray(conflict)
        assert.isTrue(conflict.includes('row'));
        assert.isTrue(conflict.includes('region'));
        assert.equal(conflict.length, 2);
        done();
      })
  })
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'B2', value: 6, puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res) {
        const { valid, conflict } = res.body
        assert.equal(res.status, 200);
        assert.isFalse(valid);
        assert.isBoolean(valid)
        assert.isArray(conflict)
        assert.isTrue(conflict.includes('row'));
        assert.isTrue(conflict.includes('region'));
        assert.isTrue(conflict.includes('column'));
        assert.equal(conflict.length, 3);
        done();
      })
  })

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({})
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.equal(error,'Required field(s) missing')
        done();
      })
  })
  
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'B2', value: 6, puzzle: testStrings[1] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.equal(error,'Invalid characters in puzzle')
        done();
      })
  })

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'B2', value: 6, puzzle: testStrings[2] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.equal(error,'Expected puzzle to be 81 characters long')
        done();
      })
  })

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'JA', value: 6, puzzle: testStrings[0] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.equal(error,'Invalid coordinate')
        done();
      })
  })

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done) {
    chai.request(server)
      .post('/api/check')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ coordinate: 'A1', value: 15, puzzle: testStrings[0] })
      .end(function(err, res) {
        const { error } = res.body
        assert.equal(res.status, 200);
        assert.isDefined(error);
        assert.equal(error,'Invalid value')
        done();
      })
  })
});


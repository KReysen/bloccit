const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const baseMarco = "http://localhost:3000/marco";

describe("routes : static", () => {

//#1
  describe("GET /", () => {

//#2
    it("should return status code 200", (done) => {

//#3
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);

//#4
        done();
      });
    });
  });
  describe("GET /", () => {
    it("should return status code 200", (done) => {
      request.get(baseMarco, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        // expect body of response to be "polo"
        done();
      });
    });
    it("should contain the string polo", (done) => {
      request.get(baseMarco, (err, res, body) => {
        expect(body).toContain("polo");
        done();
      });
    });
  });

});
// New method for assignment

const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisement/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement


describe("routes : advertisement", () => {

  beforeEach((done) => {
  this.advertisement;
  sequelize.sync({force: true}).then((res) => {

   Advertisement.create({
     title: "JS Frameworks",
     description: "There is a lot of them"
   })
    .then((advertisement) => {
      this.advertisement = advertisement;
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });
});

  describe("GET /advertisement", () => {

    it("should return a status code 200 and all advertisements", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisement");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("GET /advertisement/new", () => {
    it("should render a new ad creation form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });

  describe("POST /advertisement/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "blink-182 songs",
        description: "What's your favorite blink-182 song?"
      }
    };
    it("should create a new ad and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Advertisement.findOne({where: {title: "blink-182 songs"}})
        .then((advertisement) => {
          expect(res.statusCode).toBe(303);
          expect(advertisement.title).toBe("blink-182 songs");
          expect(advertisement.description).toBe("What's your favorite blink-182 song?");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      }
    );
   });
 });

   describe("GET /advertisement/:id", () => {
     it("should render a view with the selected ad", (done) => {
       request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });

   describe("POST /advertisement/:id/destroy", () => {

     it("should delete the ad with the associated ID", (done) => {

       Advertisement.all()
       .then((advertisement) => {
         const adCountBeforeDelete = advertisement.length;
         expect(adCountBeforeDelete).toBe(1);
         request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
           Advertisement.all()
           .then((advertisement) => {
             expect(err).toBeNull();
             expect(advertisement.length).toBe(adCountBeforeDelete - 1);
             done();
           })
         });
       });
     });
   });

   describe("GET /advertisement/:id/edit", () => {

     it("should render a view with an edit ad form", (done) => {
       request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit Advertisement");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });

   describe("POST /advertisement/:id/update", () => {

        it("should update the ad with the given values", (done) => {
           const options = {
              url: `${base}${this.advertisement.id}/update`,
              form: {
                title: "JavaScript Frameworks",
                description: "There are a lot of them"
              }
            };
            request.post(options,
              (err, res, body) => {
              expect(err).toBeNull();
              Advertisement.findOne({
                where: { id: this.advertisement.id }
              })
              .then((advertisement) => {
                expect(advertisement.title).toBe("JavaScript Frameworks");
                done();
              });
            });
        });
      });

}); // end test suite

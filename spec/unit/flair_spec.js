const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {
 // create a new topic and flair before each test
  beforeEach((done) => {
    this.topic;
    this.flair;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;

        Flair.create({
          name: "Snazzy space flair",
          color: "silver",
          topicId: this.topic.id
        })
        .then((flair) => {
          this.flair = flair;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });  // end beforeEach
// test for create method
  describe("#create()", () => {
    it("should create a flair object with a name and color and add it to the assigned topic", (done) => {
      Flair.create({
        name: "Great galaxy flair",
        color: "green",
        topicId: this.topic.id
      })
      .then((flair) => {
        expect(flair.name).toBe("Great galaxy flair");
        expect(flair.color).toBe("green");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});

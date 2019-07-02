const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const request = require("request");

describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

// For the create method, test that when calling Topic.create with valid arguments, that a topic object is created and stored in the database.
  describe("#create()", () => {
    it("should create a topic object with a title and description", (done) => {
      Topic.create({
        title: "Should we use Cryosleep on the long journey?",
        description: "Pros? Cons? Discuss",
      })
      .then((topic) => {
        expect(topic.title).toBe("Should we use Cryosleep on the long journey?");
        expect(topic.description).toBe("Pros? Cons? Discuss");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });
// For getPosts, create and associate a post with the topic in scope. The getPosts method returns an array of Post objects that are associated with the topic the method was called on. The test should confirm that the associated post is returned when that method is called.
  describe("#getPosts()", () => {
    
  })


});

const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Snowball Fighting",
          body: "So much snow!",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
            name: "Charlotte Flair",
            color: "lightBlue",
            topicId: this.topic.id
          })
          .then((Flair) => {
            this.flair = flair;
            done();
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

});

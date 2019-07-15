const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

  beforeEach((done) => {
    this.user;
    this.topic;
    this.post;
    this.comment;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.post = this.topic.posts[0];
          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id
          })
          .then((coment) => {
            this.comment = coment;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  // guest user context
  describe("guest attempting to perform CRUD actions for Comment", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /topics/:topicId/posts/:postId/comments/create", () => {
      it("should not create a new comment", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!"
          }
        };
        request.post(options,
          (err, res, body) => {
            Comment.findOne({where: {body: "This comment is amazing!"}})
            .then((comment) => {
              expect(comment).toBeNull();    // ensure no comment was created
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

    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
      it("should not delete the comment with the associated ID", (done) => {
        Comment.all()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(1);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
            Comment.all()
            .then((comments) => {
              expect(err).toBeNull();
              expect(comments.length).toBe(commentCountBeforeDelete);
              done();
            })
          });
        })
      });
    });
  }); // guest user context end

  // Member user context start
  describe("signed in user performing CRUD actions for Comment", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /topics/:topicId/posts/:postId/comments/create", () => {
      it("should create a new comment and redirect", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!"
          }
        };
        request.post(options,
          (err, res, body) => {
            Comment.findOne({where: {body: "This comment is amazing!"}})
            .then((comment) => {
              expect(comment).not.toBeNull();
              expect(comment.body).toBe("This comment is amazing!");
              expect(comment.id).not.toBeNull();
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

    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
      it("should delete the comment with the associated ID", (done) => {
        Comment.all()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(1);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Comment.all()
              .then((comments) => {
                expect(err).toBeNull();
                expect(comments.length).toBe(commentCountBeforeDelete - 1);
                done();
              })
          });
        })
      });
    });
  }); //End User Context

  // signed in member trying to destroy another's comment
  describe("signed in user performing CRUD actions on another's comment", () => {
    describe("POST /topics/:topicId/posts/:postId/comments/create", () =>  {
      beforeEach((done) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "member",
            userId: this.user.id
          }
        }, (err, res, body) => {
          done();
        }
      );
      });
      it("should create a new comment and redirect", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!"
          }
        };
        request.post(options,
        (err, res, body) => {
          Comment.findOne({where: {body: "This comment is amazing!"}})
          .then((comment) => {
            expect(comment).not.toBeNull();
            expect(comment.body).toBe("This comment is amazing!");
            expect(comment.id).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
          });
        });
      });
    });

   describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
     beforeEach((done) => {
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",
           userId: 2
         }
       },
         (err, res, body) => {
           done();
         }
       );
   });
   it("should NOT delete another members comment", (done) => {
     Comment.findAll()
     .then((comments) => {
       const commentCountBeforeDelete = comments.length;
       expect(commentCountBeforeDelete).toBe(1);
       request.post(
         `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
         (err, res, body) => {
           expect(res.statusCode).toBe(401);
           Comment.findAll()
           .then((comments) => {
             expect(err).toBeNull();
             expect(comments.length).toBe(commentCountBeforeDelete);
             done();
           })
         }
       );
     })
   });
 });
});
 // end of user deleting another user's comment

 // admin user deleting another user's comment
 describe("admin user performing CRUD actions on another's comment", () => {
   describe("POST /topics/:topicId/posts/:postId/comments/create", () =>  {
     beforeEach((done) => {
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",
           userId: this.user.id
         }
       }, (err, res, body) => {
         done();
       }
     );
     });
     it("should create a new comment and redirect", (done) => {
       const options = {
         url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
         form: {
           body: "This comment is amazing!"
         }
       };
       request.post(options,
       (err, res, body) => {
         Comment.findOne({where: {body: "This comment is amazing!"}})
         .then((comment) => {
           expect(comment).not.toBeNull();
           expect(comment.body).toBe("This comment is amazing!");
           expect(comment.id).not.toBeNull();
           done();
         })
         .catch((err) => {
           console.log(err);
         });
       });
     });
   });
describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
  beforeEach((done) => {
    User.create({
      email: "mack@mydog.com",
      password: "woof",
      role: "admin"
    })
    .then((user) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: user.role,
          userId: user.id,
          email: user.email
        }
      },
      (err, res, body) => {
        done();
      }
    );
  });
});

  it("should delete another member's comment", (done) => {
    Comment.all()
    .then((comments) => {
      const commentCountBeforeDelete = comments.length;
      expect(commentCountBeforeDelete).toBe(1);
      request.post(
        `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
        (err, res, body) => {
          expect(res.statusCode).toBe(302);
          Comment.all()
          .then((comments) => {
            expect(err).toBeNull();
            expect(comments.length).toBe(commentCountBeforeDelete - 1);
            done();
          })
        }
      );
    })
  });
});
});
// end admin deleting other's comment
});

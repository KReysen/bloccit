const postQueries = require("../db/queries.posts.js");
const Authorizer = require("../policies/post.js");

module.exports = {

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

     if(authorized) {
       res.render("topics/new");
     } else {
       req.flash("notice", "You are not authorized to do that.");
       res.redirect("/topics");
     }
  },

  create(req, res, next){
    let newPost= {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId,
      userId: req.user.id
    };
    postQueries.addPost(newPost, (err, post) => {
      if(err){
        res.redirect(500, "/posts/new");
      } else {
        res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
      }
    });
  },

  show(req, res, next){
     postQueries.getPost(req.params.id, (err, post) => {
       if(err || post == null){
         res.redirect(404, "/");
       } else {
         res.render("posts/show", {post});
       }
     });
   },

   destroy(req, res, next){
     postQueries.deletePost(req.params.id, (err, deletedRecordsCount) => {
       if(err){
         res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}`)
       } else {
         res.redirect(303, `/topics/${req.params.topicId}`)
       }
     });
   },

   edit(req, res, next){
     postQueries.getPost(req.params.id, (err, post) => {
       if(err || post == null){
         res.redirect(404, "/");
       } else {
         res.render("posts/edit", {post});
       }
     });
   },

   update(req, res, next){
     postQueries.updatePost(req.params.id, req.body, (err, post) => {
       if(err || post == null){
         res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
       } else {
         res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
       }
     });
   }

}

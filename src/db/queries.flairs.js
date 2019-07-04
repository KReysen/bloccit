const Flair = require("./models").Flair;
const Post = require("./models").Post;

module.exports = {

  getFlair(id, callback) {
    return Flair.findById(id)
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },
  
  addFlair(newFlair, callback){
    return Flair.create(newFlair)
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  }


}
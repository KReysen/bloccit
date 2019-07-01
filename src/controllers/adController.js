const adQueries = require("../db/queries.advertisement.js");

module.exports = {
  index(req, res, next){
    adQueries.getAllAdvertisements((err, advertisement) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("advertisement/index", {advertisement});
      }
    })
  },

  new(req, res, next) {
    res.render("advertisement/new");
  }

  
}

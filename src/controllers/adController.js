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
  },

  create(req, res, next){
     let newAd = {
       title: req.body.title,
       description: req.body.description
     };
     adQueries.addAdvertisement(newAd, (err, advertisement) => {
       if(err){
         res.redirect(500, "/advertisement/new");
       } else {
         res.redirect(303, `/advertisement/${advertisement.id}`);
       }
     });
   }


}

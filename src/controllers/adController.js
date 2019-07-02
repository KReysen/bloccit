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
   },

   show(req, res, next){
     adQueries.getAdvertisement(req.params.id, (err, advertisement) => {
       if(err || advertisement == null){
         res.redirect(404, "/");
       } else {
         res.render("advertisement/show", {advertisement});
       }
     });
   },

   destroy(req, res, next){
     adQueries.deleteAdvertisement(req.params.id, (err, advertisement) => {
       if(err){
         res.redirect(500, `/advertisement/${advertisement.id}`)
       } else {
         res.redirect(303, "/advertisement")
       }
     });
   },

   edit(req, res, next){
     adQueries.getAdvertisement(req.params.id, (err, advertisement) => {
       if(err || advertisement == null){
         res.redirect(404, "/");
       } else {
         res.render("advertisement/edit", {advertisement});
       }
     });
   },

   update(req, res, next){
     adQueries.updateAdvertisement(req.params.id, req.body, (err, advertisement) =>{
       if(err || advertisement == null){
         res.redirect(404, `/advertisement/${req.params.id}/edit`);
       } else {
         res.redirect(`/advertisement/${advertisement.id}`);
       }
     });
   }


}

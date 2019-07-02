const Advertisement = require("./models").Advertisement;

module.exports = {

  getAllAdvertisements(callback){
    return Advertisement.all()
    .then((advertisements) => {
      callback(null, advertisements);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addAdvertisement(newAd, callback){
    return Advertisement.create({
      title: newAd.title,
      description: newAd.description
    })
    .then((advertisement) => {
      callback(null, advertisement);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getAdvertisement(id, callback){
    return Advertisement.findById(id)
    .then((advertisement) => {
      callback(null, advertisement);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteAdvertisement(id, callback){
    return Advertisement.destroy({
      where: {id}
    })
    .then((advertisement) => {
      callback(null, advertisement);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateAdvertisement(id, updatedAd, callback){
     return Advertisement.findById(id)
     .then((advertisement) => {
       if(!advertisement){
         return callback("Ad not found");
       }
       advertisement.update(updatedAd, {
         fields: Object.keys(updatedAd)
       })
       .then(() => {
         callback(null, advertisement);
       })
       .catch((err) => {
         callback(err);
       });
     });
   }
   
}  //end exports

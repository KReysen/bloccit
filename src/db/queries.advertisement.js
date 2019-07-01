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

  addAdvertisement(newAd, callback) {
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
  }

}  //end exports

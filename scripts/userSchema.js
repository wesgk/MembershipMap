var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  // _id: Number, // auto generated
  fname: { type: String, required: true  },
  lname: { type: String, required: true  },
  email: { type: String, required: true },
  telephone: { type: String, required: true  },
  addresses: [
  {
    _id: Number,
    buildingNumber: String,
    apartmentNumber: String,
    streetName: String,
    city: String,
    country: String,
    province: String,
    postalCode: String,
    lat: String,
    lng: String,
    specialInstructions: String
  }],
  defaultAddress: { type: Number, default: 0 },
  note: String,
  password: String,
  userType: { type: Number, default: 5 },
  updated_at: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);
module.exports = {
  User: User
};

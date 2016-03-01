
var mongooseObjectId = require('mongoose').Types.ObjectId;; // mongoose
var mongoUser = require('./userSchema').User; // mongo controller

module.exports.getAll = function(req, res, next) {
  mongoUser.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
};

module.exports.post = function(req, res, next) {
  mongoUser.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

module.exports.get = function(req, res, next) {
  mongoUser.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

module.exports.update = function(req, res, next) {
  mongoUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

module.exports.delete = function(req, res, next) {
  mongoUser.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

module.exports.getEmailCountFilterId = function(req, res, next) {
  var objId = new mongooseObjectId(req.params.id);
  mongoUser.find({ _id: { $ne: objId }, email: req.params.email }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

module.exports.getEmailExistsFilterId = function(req, res, next) {
  var objId = new mongooseObjectId(req.params.id);
  mongoUser.find({ _id: { $ne: objId }, email: req.params.email }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  }); 
};

module.exports.getEmailExists = function(req, res, next) {
  mongoUser.find({ email: req.params.email }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
};

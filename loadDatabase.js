"use strict";

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load the data and schema definitions
const models = require("./modelData/photoApp.js").models;
const User = require("./user.js");
const Photo = require("./photo.js");
const SchemaInfo = require("./schemaInfo.js");

const versionString = "1.0";

// Wipe existing collections
const removePromises = [
  User.deleteMany({}),
  Photo.deleteMany({}),
  SchemaInfo.deleteMany({}),
];

Promise.all(removePromises)
  .then(() => {
    const userModels = models.userListModel();
    const mapFakeId2RealId = {};
    const userPromises = userModels.map((user) => {
      return User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
      })
        .then((userObj) => {
          mapFakeId2RealId[user._id] = userObj._id;
          user.objectID = userObj._id;
          console.log(`Adding user: ${user.first_name} ${user.last_name}`);
        })
        .catch((err) => {
          console.error("Error creating user:", err);
        });
    });

    return Promise.all(userPromises).then(() => {
      const photoModels = [];
      const userIDs = Object.keys(mapFakeId2RealId);
      userIDs.forEach((id) => {
        photoModels.push(...models.photoOfUserModel(id));
      });

      const photoPromises = photoModels.map((photo) => {
        return Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: mapFakeId2RealId[photo.user_id],
        })
          .then((photoObj) => {
            if (photo.comments) {
              photo.comments.forEach((comment) => {
                photoObj.comments.push({
                  comment: comment.comment,
                  date_time: comment.date_time,
                  user_id: mapFakeId2RealId[comment.user._id],
                });
              });
            }
            return photoObj.save();
          })
          .catch((err) => {
            console.error("Error creating photo:", err);
          });
      });

      return Promise.all(photoPromises).then(() => {
        return SchemaInfo.create({ version: versionString })
          .then((schemaInfo) => {
            console.log("SchemaInfo created with version:", schemaInfo.version);
          })
          .catch((err) => console.error("Error creating SchemaInfo:", err));
      });
    });
  })
  .then(() => {
    mongoose.disconnect().then(() => console.log("loadDatabase Completed"));
  })
  .catch((err) => {
    console.error("Unexpected error:", err);
  });

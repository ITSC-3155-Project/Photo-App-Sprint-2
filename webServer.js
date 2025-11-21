"use strict";

/**
 * Photo App Sprint 2 web server.
 * Uses MongoDB (project6) via Mongoose v7+ (async/await, no callbacks).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);

const asyncLib = require("async");
const express = require("express");
const app = express();

const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files from the project root directory
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send("Simple web server of files from " + __dirname);
});

/**
 * /test, /test/info, /test/counts
 */
app.get("/test/:p1?", async (req, res) => {
  const param = req.params.p1 || "info";

  try {
    if (param === "info") {
      const info = await SchemaInfo.find({}).exec();
      if (!info || info.length === 0) {
        res.status(500).send("Missing SchemaInfo");
        return;
      }
      res.status(200).send(info[0]);
    } else if (param === "counts") {
      const collections = [
        { name: "user", collection: User },
        { name: "photo", collection: Photo },
        { name: "schemaInfo", collection: SchemaInfo },
      ];

      // use asyncLib to keep structure close to original
      asyncLib.each(
        collections,
        (col, done) => {
          col.collection
            .countDocuments({})
            .exec()
            .then((count) => {
              col.count = count;
              done();
            })
            .catch((err) => done(err));
        },
        (err) => {
          if (err) {
            res.status(500).send(JSON.stringify(err));
            return;
          }
          const obj = {};
          collections.forEach((c) => {
            obj[c.name] = c.count;
          });
          res.status(200).send(obj);
        }
      );
    } else {
      res.status(400).send("Bad param " + param);
    }
  } catch (err) {
    console.error("Error in /test:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

/**
 * GET /user/list
 * -> [{ _id, first_name, last_name }]
 */
app.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "first_name last_name").exec();
    const result = users.map((u) => ({
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
    }));
    res.status(200).send(result);
  } catch (err) {
    console.error("Error in /user/list:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

/**
 * GET /user/:id
 * -> full user or 400 if invalid/not found
 */
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send("Not found");
    return;
  }

  try {
    const user = await User.findById(id).exec();
    if (!user) {
      res.status(400).send("Not found");
      return;
    }
    res.status(200).send({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  } catch (err) {
    console.error("Error in /user/:id:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

/**
 * GET /photosOfUser/:id
 * -> photos for that user with comment.user populated
 */
app.get("/photosOfUser/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send("Not found");
    return;
  }

  try {
    // ensure the user exists
    const user = await User.findById(id).exec();
    if (!user) {
      res.status(400).send("Not found");
      return;
    }

    const photos = await Photo.find({ user_id: id }).lean().exec();

    // collect all commenter user_ids
    const commentUserIds = new Set();
    photos.forEach((p) =>
      (p.comments || []).forEach((c) => {
        if (c.user_id) commentUserIds.add(String(c.user_id));
      })
    );

    const usersForComments = await User.find(
      { _id: { $in: Array.from(commentUserIds) } },
      "first_name last_name"
    )
      .lean()
      .exec();

    const userMap = {};
    usersForComments.forEach((u) => {
      userMap[String(u._id)] = {
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
      };
    });

    const responsePhotos = photos.map((p) => ({
      _id: p._id,
      file_name: p.file_name,
      date_time: p.date_time,
      user_id: p.user_id,
      comments: (p.comments || []).map((c) => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: userMap[String(c.user_id)],
      })),
    }));

    if (responsePhotos.length === 0) {
      // For this assignment/tests: valid user id but no photos => 400.
      res.status(400).send("Not found");
    } else {
      res.status(200).send(responsePhotos);
    }
  } catch (err) {
    console.error("Error in /photosOfUser/:id:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

// Start the server ONLY when running this file directly.
// When required by Mocha tests, no server is started.
if (require.main === module) {
  const server = app.listen(3000, () => {
    const port = server.address().port;
    // eslint-disable-next-line no-console
    console.log(
      "Listening at http://localhost:" +
        port +
        " exporting the directory " +
        __dirname
    );
  });
}

module.exports = app;

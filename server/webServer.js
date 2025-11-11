cat > webServer.js << 'EOF'
"use strict";

/**
 * Photo App Sprint 2 web server.
 * Uses MongoDB (project6) via Mongoose; no modelData.
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);

const async = require("async");
const express = require("express");
const app = express();

// Load models from root
const User = require("./user.js");
const Photo = require("./photo.js");
const SchemaInfo = require("./schemaInfo.js");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files from project root
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send("Simple web server of files from " + __dirname);
});

/**
 * /test, /test/info, /test/counts
 */
app.get("/test/:p1?", (req, res) => {
  const param = req.params.p1 || "info";

  if (param === "info") {
    SchemaInfo.find({}, (err, info) => {
      if (err) {
        res.status(500).send(JSON.stringify(err));
        return;
      }
      if (!info || info.length === 0) {
        res.status(500).send("Missing SchemaInfo");
        return;
      }
      res.status(200).send(info[0]);
    });
  } else if (param === "counts") {
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];

    async.each(
      collections,
      (col, done) => {
        col.collection.countDocuments({}, (err, count) => {
          col.count = count;
          done(err);
        });
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
});

/**
 * GET /user/list
 * Return [{ _id, first_name, last_name }]
 */
app.get("/user/list", (req, res) => {
  User.find({}, "_id first_name last_name", (err, users) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
    res.status(200).send(
      users.map((u) => ({
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
      }))
    );
  });
});

/**
 * GET /user/:id
 * Return full user or 400 if invalid / not found.
 */
app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send("Not found");
    return;
  }

  User.findById(id, (err, user) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
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
  });
});

/**
 * GET /photosOfUser/:id
 * Return photos for user id, with comment.user populated.
 */
app.get("/photosOfUser/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send("Not found");
    return;
  }

  User.findById(id, (err, user) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
    if (!user) {
      res.status(400).send("Not found");
      return;
    }

    Photo.find({ user_id: id })
      .lean()
      .exec((err, photos) => {
        if (err) {
          res.status(500).send(JSON.stringify(err));
          return;
        }

        const commentUserIds = new Set();
        photos.forEach((p) =>
          (p.comments || []).forEach((c) => {
            if (c.user_id) commentUserIds.add(String(c.user_id));
          })
        );

        User.find(
          { _id: { $in: Array.from(commentUserIds) } },
          "_id first_name last_name",
          (err, usersForComments) => {
            if (err) {
              res.status(500).send(JSON.stringify(err));
              return;
            }

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
              res.status(400).send("Not found");
            } else {
              res.status(200).send(responsePhotos);
            }
          }
        );
      });
  });
});

const server = app.listen(3000, () => {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
EOF

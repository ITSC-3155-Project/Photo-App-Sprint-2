"use strict";

/**
 * Photo App Sprint 3 web server.
 * Uses MongoDB (project6) via Mongoose v7+ (async/await, no callbacks).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
const path = require("path");
const asyncLib = require("async");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Multer helper for photo uploads
const processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedphoto"
);

const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files
app.use("/compiled", express.static(path.join(__dirname, "compiled")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(__dirname));

// Sessions and JSON body parsing
app.use(
  session({
    secret: "someSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());


// Auth middleware: require login for API endpoints, but allow static files.
const protectedPrefixes = [
  "/user",
  "/photosOfUser",
  "/commentsOfPhoto",
  "/photos",
  "/test",
];

app.use((request, response, next) => {
  // Always allow login/logout
  if (
    request.path.startsWith("/admin/login") ||
    request.path.startsWith("/admin/logout")
  ) {
    return next();
  }

  // Allow REGISTRATION without being logged in
  if (request.path === "/user" && request.method === "POST") {
    return next();
  }

  // Only enforce auth on protected API routes
  const needsAuth = protectedPrefixes.some((prefix) =>
    request.path.startsWith(prefix)
  );

  if (needsAuth && !request.session.user_id) {
    return response.status(401).send("Unauthorized");
  }

  return next();
});



/**
 * Root – just a simple message; not used by the React app/tests.
 */
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
 * POST /admin/login
 * Body: { login_name, password }
 * Sets session and returns basic user info.
 */
app.post("/admin/login", async (request, response) => {
  const { login_name, password } = request.body || {};

  if (!login_name || !password) {
    return response.status(400).send("Missing login_name or password");
  }

  try {
    const user = await User.findOne({ login_name }).exec();
    if (!user || user.password !== password) {
      return response.status(400).send("Invalid login name or password");
    }

    request.session.user_id = user._id;
    request.session.login_name = user.login_name;

    response.status(200).send({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    console.error("Error in /admin/login:", err);
    response.status(500).send(JSON.stringify(err));
  }
});

/**
 * POST /admin/logout
 * Clears the session.
 */
app.post("/admin/logout", (request, response) => {
  if (!request.session.user_id) {
    return response.status(400).send("Not logged in");
  }
  request.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return response.status(500).send(JSON.stringify(err));
    }
    response.status(200).send("Logged out");
  });
});

/**
 * POST /user
 * Registration.
 * Body: { login_name, password, first_name, last_name, location, description, occupation }
 */
app.post("/user", async (request, response) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body || {};

  if (!login_name || !first_name || !last_name || !password) {
    return response.status(400).send("Required fields missing");
  }

  try {
    const existing = await User.findOne({ login_name }).exec();
    if (existing) {
      return response.status(400).send("Login name already exists");
    }

    const user = new User({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    const savedUser = await user.save();
    response.status(200).send({
      _id: savedUser._id,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
    });
  } catch (err) {
    console.error("Error in /user:", err);
    response.status(500).send(JSON.stringify(err));
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
      res.status(400).send("Not found");
    } else {
      res.status(200).send(responsePhotos);
    }
  } catch (err) {
    console.error("Error in /photosOfUser/:id:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

/**
 * POST /commentsOfPhoto/:photo_id
 * Body: { comment }
 * Adds a comment by the logged-in user.
 */
app.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  const photoId = request.params.photo_id;
  const text = (request.body && request.body.comment) || "";

  if (!text || text.trim().length === 0) {
    return response.status(400).send("Comment must be non-empty");
  }

  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    return response.status(400).send("Bad photo id");
  }

  try {
    const photo = await Photo.findById(photoId).exec();
    if (!photo) {
      return response.status(400).send("Photo not found");
    }

    photo.comments.push({
      comment: text,
      date_time: new Date(),
      user_id: request.session.user_id,
    });

    const savedPhoto = await photo.save();
    response.status(200).send(savedPhoto);
  } catch (err) {
    console.error("Error in /commentsOfPhoto/:photo_id:", err);
    response.status(500).send(JSON.stringify(err));
  }
});

/**
 * POST /photos/new
 * Upload a photo for the current user.
 * Body: multipart/form-data with field 'uploadedphoto'.
 */
app.post("/photos/new", (request, response) => {
  processFormBody(request, response, (err) => {
    if (err || !request.file) {
      console.error("Multer error or no file:", err);
      response.status(400).send("No file uploaded");
      return;
    }

    const timestamp = new Date().valueOf();
    const filename = `U${timestamp}${request.file.originalname}`;
    const filePath = path.join(__dirname, "images", filename);

    fs.writeFile(filePath, request.file.buffer, async (writeErr) => {
      if (writeErr) {
        console.error("Error writing uploaded file:", writeErr);
        response.status(500).send(JSON.stringify(writeErr));
        return;
      }

      try {
        const newPhoto = new Photo({
          file_name: filename,
          date_time: new Date(),
          user_id: request.session.user_id,
          comments: [],
        });

        const savedPhoto = await newPhoto.save();
        response.status(200).send(savedPhoto);
      } catch (dbErr) {
        console.error("Error saving Photo document:", dbErr);
        response.status(500).send(JSON.stringify(dbErr));
      }
    });
  });
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


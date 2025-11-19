"use strict";

/**
 * Mocha tests for the Photo-App API.
 * File: serverApiTest.js
 *
 * Run with:  npm test
 */

const assert = require("assert");
const request = require("supertest");
const app = require("./webServer.js"); // uses the exported Express app

// Give Mongo a little time to respond
describe("Photo-App API", function () {
  this.timeout(10000);

  //
  // /test/info
  //
  describe("GET /test/info", function () {
    it("returns schema info with a version field", async function () {
      const res = await request(app).get("/test/info");

      assert.strictEqual(res.status, 200);
      assert.ok(res.body, "response body should exist");
      assert.ok(
        Object.prototype.hasOwnProperty.call(res.body, "__v"),
        "schema info should have __v"
      );
    });
  });

  //
  // /user/list
  //
  describe("GET /user/list", function () {
    it("returns an array of users with _id, first_name, last_name", async function () {
      const res = await request(app).get("/user/list");

      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body), "body should be an array");
      assert.ok(res.body.length > 0, "should return at least one user");

      const u = res.body[0];
      assert.ok(u._id, "user should have _id");
      assert.ok(u.first_name, "user should have first_name");
      assert.ok(u.last_name, "user should have last_name");
    });
  });

  //
  // /user/:id
  //
  describe("GET /user/:id", function () {
    let firstUserId;

    // Grab a valid user id once for these tests
    before(async function () {
      const res = await request(app).get("/user/list");
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.length > 0, "need at least one user for tests");
      firstUserId = res.body[0]._id;
    });

    it("returns full user info for a valid id", async function () {
      const res = await request(app).get(`/user/${firstUserId}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body._id, firstUserId);
      assert.ok(res.body.first_name);
      assert.ok(res.body.last_name);
      assert.ok(
        Object.prototype.hasOwnProperty.call(res.body, "location"),
        "user should include location"
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(res.body, "occupation"),
        "user should include occupation"
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(res.body, "description"),
        "user should include description"
      );
    });

    it("returns 400 for an invalid id format", async function () {
      const res = await request(app).get("/user/not-a-valid-id");
      assert.strictEqual(res.status, 400);
    });
  });

  //
  // /photosOfUser/:id
  //
  describe("GET /photosOfUser/:id", function () {
    let someUserId;

    before(async function () {
      const res = await request(app).get("/user/list");
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.length > 0);
      someUserId = res.body[0]._id;
    });

    it("returns photos or 'Not found' for a valid user id", async function () {
      const res = await request(app).get(`/photosOfUser/${someUserId}`);

      // Your server returns:
      //  - 200 with an array of photos, OR
      //  - 400 + "Not found" if the user has no photos
      if (res.status === 200) {
        assert.ok(Array.isArray(res.body), "body should be an array");
        if (res.body.length > 0) {
          const p = res.body[0];
          assert.ok(p._id);
          assert.ok(p.file_name);
          assert.ok(p.date_time);
          assert.ok(
            Array.isArray(p.comments),
            "comments should be an array"
          );
        }
      } else {
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.text, "Not found");
      }
    });

    it("returns 400 for an invalid id format", async function () {
      const res = await request(app).get("/photosOfUser/not-a-valid-id");
      assert.strictEqual(res.status, 400);
    });
  });
});

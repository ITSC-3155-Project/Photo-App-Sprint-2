"use strict";


const users = [
  {
    _id: "1",
    first_name: "Alice",
    last_name: "Anderson",
    location: "New York",
    description: "Photographer and traveler",
    occupation: "Photographer",
  },
  {
    _id: "2",
    first_name: "Bob",
    last_name: "Brown",
    location: "Los Angeles",
    description: "Film editor who loves landscapes",
    occupation: "Editor",
  },
  {
    _id: "3",
    first_name: "Carol",
    last_name: "Clark",
    location: "Chicago",
    description: "Student learning computer science",
    occupation: "Student",
  },
];

// Photo data with comments referencing user IDs above
const photos = [
  {
    _id: "p1",
    file_name: "alice1.jpg",
    date_time: "2020-08-30T20:04:00Z",
    user_id: "1",
    comments: [
      {
        comment: "Great shot!",
        date_time: "2020-09-01T14:00:00Z",
        user: users[1], // Bob
      },
      {
        comment: "Love the lighting.",
        date_time: "2020-09-02T11:00:00Z",
        user: users[2], // Carol
      },
    ],
  },
  {
    _id: "p2",
    file_name: "bob1.jpg",
    date_time: "2020-08-22T16:00:00Z",
    user_id: "2",
    comments: [
      {
        comment: "Nice colors!",
        date_time: "2020-08-23T10:00:00Z",
        user: users[0], // Alice
      },
    ],
  },
  {
    _id: "p3",
    file_name: "carol1.jpg",
    date_time: "2020-08-25T12:00:00Z",
    user_id: "3",
    comments: [],
  },
];

/**
 * Export functions matching Project 6 interface
 */
exports.models = {
  userListModel: function () {
    // Return a shallow copy of all users
    return users.map((u) => ({ ...u }));
  },

  userModel: function (id) {
    return users.find((u) => String(u._id) === String(id)) || null;
  },

  photoOfUserModel: function (id) {
    return photos.filter((p) => String(p.user_id) === String(id));
  },
};

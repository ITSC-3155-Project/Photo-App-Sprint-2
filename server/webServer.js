// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 3001;

// // Mock Model Data
// const models = {
//   schemaInfo: () => ({
//     _id: "schema1",
//     __v: 1,
//     load_date_time: new Date().toISOString()
//   }),

//   userListModel: () => [
//     {
//       _id: "1",
//       first_name: "John",
//       last_name: "Doe",
//       location: "San Francisco, CA",
//       description: "Photography enthusiast and software developer",
//       occupation: "Software Engineer"
//     },
//     {
//       _id: "2",
//       first_name: "Jane",
//       last_name: "Smith",
//       location: "New York, NY",
//       description: "Travel blogger and content creator",
//       occupation: "Content Creator"
//     },
//     {
//       _id: "3",
//       first_name: "Mike",
//       last_name: "Johnson",
//       location: "Austin, TX",
//       description: "Nature lover and wildlife photographer",
//       occupation: "Photographer"
//     },
//     {
//       _id: "4",
//       first_name: "Sarah",
//       last_name: "Williams",
//       location: "Seattle, WA",
//       description: "Urban explorer and designer",
//       occupation: "Designer"
//     }
//   ],

//   userModel: (userId) => {
//     const users = models.userListModel();
//     return users.find(u => u._id === userId);
//   },

//   photoOfUserModel: (userId) => {
//     const users = models.userListModel();
//     const photos = {
//       "1": [
//         {
//           _id: "p1",
//           user_id: "1",
//           date_time: "2024-01-15T10:30:00",
//           file_name: "photo1.jpg",
//           comments: [
//             {
//               _id: "c1",
//               photo_id: "p1",
//               user: users[1],
//               date_time: "2024-01-15T11:00:00",
//               comment: "Amazing shot! The lighting is perfect."
//             },
//             {
//               _id: "c2",
//               photo_id: "p1",
//               user: users[2],
//               date_time: "2024-01-15T12:00:00",
//               comment: "Love the composition and depth of field."
//             }
//           ]
//         },
//         {
//           _id: "p2",
//           user_id: "1",
//           date_time: "2024-01-20T14:30:00",
//           file_name: "photo2.jpg",
//           comments: [
//             {
//               _id: "c3",
//               photo_id: "p2",
//               user: users[3],
//               date_time: "2024-01-20T15:00:00",
//               comment: "Beautiful colors! This is stunning."
//             }
//           ]
//         }
//       ],
//       "2": [
//         {
//           _id: "p3",
//           user_id: "2",
//           date_time: "2024-02-01T09:00:00",
//           file_name: "photo3.jpg",
//           comments: [
//             {
//               _id: "c4",
//               photo_id: "p3",
//               user: users[0],
//               date_time: "2024-02-01T10:00:00",
//               comment: "Incredible travel photo! Where was this taken?"
//             },
//             {
//               _id: "c5",
//               photo_id: "p3",
//               user: users[2],
//               date_time: "2024-02-01T11:30:00",
//               comment: "Awwwwww!"
//             }
//           ]
//         },
//         {
//           _id: "p4",
//           user_id: "2",
//           date_time: "2024-02-05T16:00:00",
//           file_name: "photo4.jpg",
//           comments: []
//         }
//       ],
//       "3": [
//         {
//           _id: "p5",
//           user_id: "3",
//           date_time: "2024-02-10T16:00:00",
//           file_name: "photo5.jpg",
//           comments: [
//             {
//               _id: "c6",
//               photo_id: "p5",
//               user: users[0],
//               date_time: "2024-02-10T17:00:00",
//               comment: "What a beautiful find. Great capture!"
//             }
//           ]
//         },
//         {
//           _id: "p6",
//           user_id: "3",
//           date_time: "2024-02-12T08:00:00",
//           file_name: "photo6.jpg",
//           comments: [
//             {
//               _id: "c7",
//               photo_id: "p6",
//               user: users[1],
//               date_time: "2024-02-12T09:00:00",
//               comment: "The photography skills are impressive!"
//             },
//             {
//               _id: "c8",
//               photo_id: "p6",
//               user: users[3],
//               date_time: "2024-02-12T10:00:00",
//               comment: "How did you get so close to capture this?"
//             }
//           ]
//         }
//       ],
//       "4": [
//         {
//           _id: "p7",
//           user_id: "4",
//           date_time: "2024-02-15T13:00:00",
//           file_name: "photo7.jpg",
//           comments: [
//             {
//               _id: "c9",
//               photo_id: "p7",
//               user: users[0],
//               date_time: "2024-02-15T14:00:00",
//               comment: "Great urban perspective! Love the architecture."
//             },
//             {
//               _id: "c10",
//               photo_id: "p7",
//               user: users[1],
//               date_time: "2024-02-15T15:00:00",
//               comment: "This is stunning! The city looks beautiful."
//             }
//           ]
//         }
//       ]
//     };
//     return photos[userId] || [];
//   }
// };

// // Middleware
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../public')));

// // Enable CORS for development
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// // API Routes
// app.get('/test/info', (req, res) => {
//   const info = models.schemaInfo();
//   res.json(info);
// });

// app.get('/user/list', (req, res) => {
//   const users = models.userListModel();
//   res.json(users);
// });

// app.get('/user/:id', (req, res) => {
//   const user = models.userModel(req.params.id);
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404).json({ error: 'User not found' });
//   }
// });

// app.get('/photosOfUser/:id', (req, res) => {
//   const photos = models.photoOfUserModel(req.params.id);
//   res.json(photos);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Web server is running on http://localhost:${PORT}`);
//   console.log(`Test API at http://localhost:${PORT}/test/info`);
// });












import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Mock Model Data
const models = {
  schemaInfo: () => ({
    _id: "schema1",
    __v: 1,
    load_date_time: new Date().toISOString()
  }),

  userListModel: () => [
    {
      _id: "1",
      first_name: "John",
      last_name: "Doe",
      location: "San Francisco, CA",
      description: "Photography enthusiast and software developer",
      occupation: "Software Engineer"
    },
    {
      _id: "2",
      first_name: "Jane",
      last_name: "Smith",
      location: "New York, NY",
      description: "Travel blogger and content creator",
      occupation: "Content Creator"
    },
    {
      _id: "3",
      first_name: "Mike",
      last_name: "Johnson",
      location: "Austin, TX",
      description: "Nature lover and wildlife photographer",
      occupation: "Photographer"
    },
    {
      _id: "4",
      first_name: "Sarah",
      last_name: "Williams",
      location: "Seattle, WA",
      description: "Urban explorer and designer",
      occupation: "Designer"
    }
  ],

  userModel: (userId) => {
    const users = models.userListModel();
    return users.find(u => u._id === userId);
  },

  photoOfUserModel: (userId) => {
    const users = models.userListModel();
    const photos = {
      "1": [
        {
          _id: "p1",
          user_id: "1",
          date_time: "2024-01-15T10:30:00",
          file_name: "photo1.jpg",
          comments: [
            {
              _id: "c1",
              photo_id: "p1",
              user: users[1],
              date_time: "2024-01-15T11:00:00",
              comment: "Amazing shot! The lighting is perfect."
            },
            {
              _id: "c2",
              photo_id: "p1",
              user: users[2],
              date_time: "2024-01-15T12:00:00",
              comment: "Love the composition and depth of field."
            }
          ]
        },
        {
          _id: "p2",
          user_id: "1",
          date_time: "2024-01-20T14:30:00",
          file_name: "photo2.jpg",
          comments: [
            {
              _id: "c3",
              photo_id: "p2",
              user: users[3],
              date_time: "2024-01-20T15:00:00",
              comment: "Beautiful colors! This is stunning."
            }
          ]
        }
      ],
      "2": [
        {
          _id: "p3",
          user_id: "2",
          date_time: "2024-02-01T09:00:00",
          file_name: "photo3.jpg",
          comments: [
            {
              _id: "c4",
              photo_id: "p3",
              user: users[0],
              date_time: "2024-02-01T10:00:00",
              comment: "Incredible travel photo! Where was this taken?"
            },
            {
              _id: "c5",
              photo_id: "p3",
              user: users[2],
              date_time: "2024-02-01T11:30:00",
              comment: "This makes me want to travel right now!"
            }
          ]
        },
        {
          _id: "p4",
          user_id: "2",
          date_time: "2024-02-05T16:00:00",
          file_name: "photo4.jpg",
          comments: []
        }
      ],
      "3": [
        {
          _id: "p5",
          user_id: "3",
          date_time: "2024-02-10T16:00:00",
          file_name: "photo5.jpg",
          comments: [
            {
              _id: "c6",
              photo_id: "p5",
              user: users[0],
              date_time: "2024-02-10T17:00:00",
              comment: "Nature at its finest. Great capture!"
            }
          ]
        },
        {
          _id: "p6",
          user_id: "3",
          date_time: "2024-02-12T08:00:00",
          file_name: "photo6.jpg",
          comments: [
            {
              _id: "c7",
              photo_id: "p6",
              user: users[1],
              date_time: "2024-02-12T09:00:00",
              comment: "The wildlife photography skills are impressive!"
            },
            {
              _id: "c8",
              photo_id: "p6",
              user: users[3],
              date_time: "2024-02-12T10:00:00",
              comment: "How did you get so close to capture this?"
            }
          ]
        }
      ],
      "4": [
        {
          _id: "p7",
          user_id: "4",
          date_time: "2024-02-15T13:00:00",
          file_name: "photo7.jpg",
          comments: [
            {
              _id: "c9",
              photo_id: "p7",
              user: users[0],
              date_time: "2024-02-15T14:00:00",
              comment: "Great urban perspective! Love the architecture."
            },
            {
              _id: "c10",
              photo_id: "p7",
              user: users[1],
              date_time: "2024-02-15T15:00:00",
              comment: "This is stunning! The city looks beautiful."
            }
          ]
        }
      ]
    };
    return photos[userId] || [];
  }
};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.get('/test/info', (req, res) => {
  const info = models.schemaInfo();
  res.json(info);
});

app.get('/user/list', (req, res) => {
  const users = models.userListModel();
  res.json(users);
});

app.get('/user/:id', (req, res) => {
  const user = models.userModel(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/photosOfUser/:id', (req, res) => {
  const photos = models.photoOfUserModel(req.params.id);
  res.json(photos);
});

// Start server
app.listen(PORT, () => {
  console.warn(`Web server is running on http://localhost:${PORT}`);
  console.warn(`Test API at http://localhost:${PORT}/test/info`);
});
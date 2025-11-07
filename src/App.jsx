// import React from 'react';
// import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
// import { Box, Grid } from '@mui/material';
// import TopBar from './components/topBar/TopBar';
// import UserList from './components/userList/UserList';
// import UserDetail from './components/userDetail/UserDetail';
// import UserPhotos from './components/userPhotos/UserPhotos';

// function App() {
//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <TopBar />
//       <Grid container sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
//         <Grid item xs={3} sx={{ borderRight: 1, borderColor: 'divider', overflowY: 'auto', height: '100%' }}>
//           <UserList />
//         </Grid>
//         <Grid item xs={9} sx={{ overflowY: 'auto', height: '100%', bgcolor: '#f5f5f5' }}>
//           <Routes>
//             <Route path="/" element={<WelcomeView />} />
//             <Route path="/users" element={<WelcomeView />} />
//             <Route path="/users/:userId" element={<UserDetail />} />
//             <Route path="/photos/:userId" element={<UserPhotos />} />
//           </Routes>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// function WelcomeView() {
//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         height: '100%',
//         color: 'text.secondary'
//       }}
//     >
//       <Box sx={{ fontSize: 64, mb: 2 }}>📷</Box>
//       <Box sx={{ fontSize: 24 }}>Select a user to view their profile</Box>
//     </Box>
//   );
// }

// export default App;



import { Routes, Route } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import TopBar from './components/topBar/TopBar';
import UserList from './components/userList/UserList';
import UserDetail from './components/userDetail/UserDetail';
import UserPhotos from './components/userPhotos/UserPhotos';

function App() {
  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <TopBar />
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
        <Grid item xs={3} sx={{ 
          borderRight: 1, 
          borderColor: 'rgba(255,255,255,0.1)', 
          overflowY: 'auto', 
          height: '100%',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <UserList />
        </Grid>
        <Grid item xs={9} sx={{ 
          overflowY: 'auto', 
          height: '100%', 
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)'
        }}>
          <Routes>
            <Route path="/" element={<WelcomeView />} />
            <Route path="/users" element={<WelcomeView />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos />} />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
}

function WelcomeView() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: 'text.secondary'
      }}
    >
      <Box sx={{ 
        fontSize: 80, 
        mb: 3,
        filter: 'drop-shadow(0 4px 20px rgba(102, 126, 234, 0.4))',
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }}>
        📷
      </Box>
      <Box sx={{ 
        fontSize: 28, 
        fontWeight: 300,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Select a user to explore their world
      </Box>
    </Box>
  );
}

export default App;
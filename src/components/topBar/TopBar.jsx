// import React, { useEffect, useState } from 'react';
// import { AppBar, Toolbar, Typography, Box } from '@mui/material';
// import { useLocation, useParams } from 'react-router-dom';
// import FetchModel from '../../lib/fetchModelData';

// function TopBar() {
//   const [context, setContext] = useState('Photo Sharing App');
//   const [version, setVersion] = useState('');
//   const location = useLocation();

//   // Fetch version on mount
//   useEffect(() => {
//     FetchModel('/test/info')
//       .then(response => {
//         setVersion(`v${response.data.__v}`);
//       })
//       .catch(error => {
//         console.error('Error fetching schema info:', error);
//       });
//   }, []);

//   // Update context based on current route
//   useEffect(() => {
//     const path = location.pathname;
    
//     if (path === '/' || path === '/users') {
//       setContext('Photo Sharing App');
//     } else if (path.startsWith('/users/')) {
//       const userId = path.split('/')[2];
//       FetchModel(`/user/${userId}`)
//         .then(response => {
//           const user = response.data;
//           setContext(`${user.first_name} ${user.last_name}`);
//         })
//         .catch(error => {
//           console.error('Error fetching user:', error);
//           setContext('User Details');
//         });
//     } else if (path.startsWith('/photos/')) {
//       const userId = path.split('/')[2];
//       FetchModel(`/user/${userId}`)
//         .then(response => {
//           const user = response.data;
//           setContext(`Photos of ${user.first_name} ${user.last_name}`);
//         })
//         .catch(error => {
//           console.error('Error fetching user:', error);
//           setContext('User Photos');
//         });
//     }
//   }, [location]);

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div">
//           Monish Munagala
//         </Typography>
//         <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
//           <Typography variant="h6">
//             {context}
//           </Typography>
//         </Box>
//         <Typography variant="body2" sx={{ opacity: 0.8 }}>
//           {version}
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default TopBar;










import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import FetchModel from '../../lib/fetchModelData';

function TopBar() {
  const [context, setContext] = useState('Photo Sharing App');
  const [version, setVersion] = useState('');
  const location = useLocation();

  // Fetch version on mount
  useEffect(() => {
    FetchModel('/test/info')
      .then(response => {
        setVersion(`Photo Sprint App ${response.data.__v}`);
      })
      .catch(error => {
        console.error('Error fetching schema info:', error);
      });
  }, []);

  // Update context based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/' || path === '/users') {
      setContext('Photo Sharing App');
    } else if (path.startsWith('/users/')) {
      const userId = path.split('/')[2];
      FetchModel(`/user/${userId}`)
        .then(response => {
          const user = response.data;
          setContext(`${user.first_name} ${user.last_name}`);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setContext('User Details');
        });
    } else if (path.startsWith('/photos/')) {
      const userId = path.split('/')[2];
      FetchModel(`/user/${userId}`)
        .then(response => {
          const user = response.data;
          setContext(`Photos of ${user.first_name} ${user.last_name}`);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setContext('User Photos');
        });
    }
  }, [location]);

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}
          >
            Monish Munagala
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography 
            variant="h5"
            sx={{
              fontWeight: 300,
              letterSpacing: '0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {context}
          </Typography>
        </Box>
        
        <Chip 
          label={version}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 500,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
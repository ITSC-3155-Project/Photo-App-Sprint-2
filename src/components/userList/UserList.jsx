// import React, { useEffect, useState } from 'react';
// import { 
//   List, 
//   ListItem, 
//   ListItemButton, 
//   ListItemText, 
//   Divider,
//   Typography,
//   CircularProgress,
//   Box 
// } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import FetchModel from '../../lib/fetchModelData';

// function UserList() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     FetchModel('/user/list')
//       .then(response => {
//         setUsers(response.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error loading users:', err);
//         setError('Failed to load users');
//         setLoading(false);
//       });
//   }, []);

//   const handleUserClick = (userId) => {
//     navigate(`/users/${userId}`);
//   };

//   const isUserSelected = (userId) => {
//     return location.pathname.includes(userId);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, color: 'error.main' }}>
//         <Typography>{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//       <ListItem sx={{ bgcolor: 'grey.200' }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//           Users
//         </Typography>
//       </ListItem>
//       <Divider />
//       {users.map((user) => (
//         <React.Fragment key={user._id}>
//           <ListItemButton
//             selected={isUserSelected(user._id)}
//             onClick={() => handleUserClick(user._id)}
//           >
//             <ListItemText 
//               primary={`${user.first_name} ${user.last_name}`}
//               primaryTypographyProps={{ fontWeight: 'medium' }}
//             />
//           </ListItemButton>
//           <Divider />
//         </React.Fragment>
//       ))}
//     </List>
//   );
// }

// export default UserList;







import { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/user/list');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const isUserSelected = (userId) => {
    return location.pathname.includes(userId);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
      <ListItem sx={{ 
        bgcolor: 'transparent',
        py: 2.5,
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px'
          }}
        >
          Community
        </Typography>
        <Chip 
          label={users.length}
          size="small"
          sx={{
            ml: 1.5,
            height: 20,
            fontSize: '0.7rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600
          }}
        />
      </ListItem>
      
      {users.map((user) => (
        <ListItemButton
          key={user._id}
          selected={isUserSelected(user._id)}
          onClick={() => handleUserClick(user._id)}
          sx={{
            py: 2,
            px: 2.5,
            mb: 0.5,
            mx: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              transform: 'translateX(5px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
            },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              borderLeft: '3px solid #667eea',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
              }
            }
          }}
        >
          <ListItemAvatar>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              {getInitials(user.first_name, user.last_name)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={`${user.first_name} ${user.last_name}`}
            secondary={user.occupation}
            primaryTypographyProps={{ 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
            secondaryTypographyProps={{
              fontSize: '0.8rem',
              sx: { 
                mt: 0.3,
                color: 'text.secondary'
              }
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}

export default UserList;

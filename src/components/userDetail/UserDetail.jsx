// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Card, 
//   CardContent, 
//   Typography, 
//   Button,
//   CircularProgress,
//   Divider
// } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';
// import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import WorkIcon from '@mui/icons-material/Work';
// import InfoIcon from '@mui/icons-material/Info';
// import FetchModel from '../../lib/fetchModelData';

// function UserDetail() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
    
//     FetchModel(`/user/${userId}`)
//       .then(response => {
//         setUser(response.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error loading user details:', err);
//         setError('Failed to load user details');
//         setLoading(false);
//       });
//   }, [userId]);

//   const handleViewPhotos = () => {
//     navigate(`/photos/${userId}`);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error || !user) {
//     return (
//       <Box sx={{ p: 8 }}>
//         <Typography color="error" variant="h6">
//           {error || 'User not found'}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Card sx={{ maxWidth: 800, mx: 'auto' }}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             {user.first_name} {user.last_name}
//           </Typography>
//           <Divider sx={{ mb: 3 }} />
          
//           <Box sx={{ mb: 3 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
//               <Typography variant="body1">
//                 <strong>Location:</strong> {user.location}
//               </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
//               <Typography variant="body1">
//                 <strong>Occupation:</strong> {user.occupation}
//               </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//               <InfoIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
//               <Typography variant="body1">
//                 <strong>Description:</strong> {user.description}
//               </Typography>
//             </Box>
//           </Box>

//           <Button
//             variant="contained"
//             startIcon={<PhotoLibraryIcon />}
//             onClick={handleViewPhotos}
//             size="large"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             View {user.first_name}'s Photos
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default UserDetail;







import { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user details:', err);
        setError('Failed to load user details');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);


  const handleViewPhotos = () => {
    navigate(`/photos/${userId}`);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 8 }}>
        <Typography color="error" variant="h6">
          {error || 'User not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(255,255,255,0.5)',
          overflow: 'visible'
        }}
      >
        <Box
          sx={{
            height: 150,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              position: 'absolute',
              bottom: -60,
              left: 40,
              border: '6px solid white',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}
          >
            {getInitials(user.first_name, user.last_name)}
          </Avatar>
        </Box>

        <CardContent sx={{ pt: 9, px: 5, pb: 5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px',
                mb: 1
              }}
            >
              {user.first_name} {user.last_name}
            </Typography>
            <Chip 
              label={user.occupation}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.85rem',
                height: 28
              }}
            />
          </Box>
          
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2.5,
                bgcolor: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(5px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                }
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <LocationOnIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  LOCATION
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user.location}
                </Typography>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2.5,
                bgcolor: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(5px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                }
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <InfoIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  ABOUT
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.description}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<PhotoLibraryIcon />}
            onClick={handleViewPhotos}
            size="large"
            fullWidth
            sx={{ 
              mt: 2,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            View {user.first_name}&apos;s Gallery
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetail;

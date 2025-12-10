import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Paper,
  TextField,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

// Turn URLs in comment text into clickable links.
const renderCommentText = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // If this part matches the URL regex, render it as a link
    if (urlRegex.test(part)) {
      // reset regex state so multiple matches work correctly
      urlRegex.lastIndex = 0;
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1976d2", textDecoration: "underline" }}
          // prevent clicking the link from triggering the Paper's onClick (which navigates to the user)
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    // Normal text chunk
    return <span key={index}>{part}</span>;
  });
};


function UserPhotos() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // per-photo comment text: { [photoId]: string }
  const [newCommentText, setNewCommentText] = useState({});

  // -------- load photos + user --------
  useEffect(() => {
    const fetchPhotosAndUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const [photosResponse, userResponse] = await Promise.all([
          axios.get(`/photosOfUser/${userId}`),
          axios.get(`/user/${userId}`)
        ]);

        setPhotos(photosResponse.data);
        setUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading photos:', err);
        setError('Failed to load photos');
        setLoading(false);
      }
    };

    fetchPhotosAndUser();
  }, [userId]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCommentUserClick = (commentUserId) => {
    navigate(`/users/${commentUserId}`);
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return '?';
    }
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // -------- comment handlers --------
  const handleCommentChange = (photoId, value) => {
    setNewCommentText((prev) => ({
      ...prev,
      [photoId]: value
    }));
  };

  const handleCommentSubmit = async (photoId) => {
    const text = (newCommentText[photoId] || '').trim();
    if (!text) {
      return;
    }

    try {
      // post new comment
      await axios.post(`/commentsOfPhoto/${photoId}`, { comment: text });

      // refresh photos for this user so new comment appears
      const photosResponse = await axios.get(`/photosOfUser/${userId}`);
      setPhotos(photosResponse.data);

      // clear this photo's input
      setNewCommentText((prev) => ({
        ...prev,
        [photoId]: ''
      }));
    } catch (err) {
      console.error('Error posting comment:', err);
      // you *could* setError("Failed to post comment"); but that would override load error
    }
  };

  // -------- UI states --------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 8 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Box sx={{ p: 8, textAlign: 'center' }}>
        <Box sx={{ fontSize: 80, mb: 2, opacity: 0.3 }}>📷</Box>
        <Typography variant="h6" color="text.secondary">
          No photos available for {user?.first_name} {user?.last_name}
        </Typography>
      </Box>
    );
  }

  // -------- main render --------
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}
        >
          {user?.first_name}&apos;s Gallery
        </Typography>
        <Chip
          label={`${photos.length} ${photos.length === 1 ? 'Photo' : 'Photos'}`}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {photos.map((photo) => (
          <Card
            key={photo._id}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(255,255,255,0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 25px 70px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="500"
              image={`/images/${photo.file_name}`}
              alt={`Photo by ${user?.first_name}`}
              sx={{
                objectFit: 'cover',
                bgcolor: 'grey.200'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />

            <Box
              sx={{
                height: 500,
                bgcolor: 'grey.300',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  📷
                </Typography>
                <Typography variant="h6">{photo.file_name}</Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 18, color: '#667eea' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontWeight: 500 }}
                  >
                    {formatDateTime(photo.date_time)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip
                    icon={<CommentIcon sx={{ fontSize: 16 }} />}
                    label={photo.comments?.length || 0}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>

              {photo.comments && photo.comments.length > 0 ? (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CommentIcon sx={{ mr: 1.5, color: '#667eea', fontSize: 22 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#667eea'
                      }}
                    >
                      Comments
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {photo.comments.map((comment) => (
                      <Paper
                        key={comment._id}
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background:
                            'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                            borderColor: '#667eea'
                          }
                        }}
                        onClick={() => handleCommentUserClick(comment.user._id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                          >
                            {getInitials(
                              comment.user.first_name,
                              comment.user.last_name
                            )}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 700,
                                  color: '#667eea',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                {comment.user.first_name} {comment.user.last_name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', fontWeight: 500 }}
                              >
                                {formatDateTime(comment.date_time)}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{ color: 'text.primary', lineHeight: 1.6 }}
                            >
                              {comment.comment}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CommentIcon
                      sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      No comments yet. Be the first to share your thoughts!
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* add-comment input (always visible if route is accessible, meaning user is logged in) */}
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add a comment"
                    variant="outlined"
                    value={newCommentText[photo._id] || ''}
                    onChange={(e) =>
                      handleCommentChange(photo._id, e.target.value)
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                    onClick={() => handleCommentSubmit(photo._id)}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default UserPhotos;

// src/components/userList/userList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      try {
        // /user/list now returns photoCount + commentCount on each user
        const usersRes = await axios.get("/user/list");
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load user list");
      }
    };

    fetchUsers();
  }, []);

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "?";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleCommentBubbleClick = (event, userId) => {
    // don’t trigger the row’s onClick
    event.stopPropagation();
    navigate(`/comments/${userId}`);
  };

  const getSelectedUserIdFromPath = () => {
    const parts = location.pathname.split("/");
    // /users/:id
    if (parts[1] === "users" && parts[2]) {
      return parts[2];
    }
    // /photos/:id
    if (parts[1] === "photos" && parts[2]) {
      return parts[2];
    }
    // /comments/:id (new view for count bubbles story)
    if (parts[1] === "comments" && parts[2]) {
      return parts[2];
    }
    return null;
  };

  const selectedUserId = getSelectedUserIdFromPath();

  return (
    <Box
      sx={{
        height: "100vh",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #f5f7ff 0%, #ffffff 60%)",
        p: 2
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
          textTransform: "uppercase",
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          color: "text.secondary"
        }}
      >
        Photographers
      </Typography>

      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <List dense sx={{ overflowY: "auto", maxHeight: "calc(100vh - 80px)" }}>
          {users.map((user) => {
            const photoCount = user.photoCount ?? 0;
            const commentCount = user.commentCount ?? 0;
            const isSelected = selectedUserId === String(user._id);

            return (
              <ListItemButton
                key={user._id}
                selected={isSelected}
                onClick={() => handleUserClick(user._id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(90deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12))"
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: 12
                    }}
                  >
                    {getInitials(user.first_name, user.last_name)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: isSelected ? 700 : 500
                  }}
                />

                {/* Two count bubbles: green = photos, red = comments */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {/* Photo count (green) */}
                  <Chip
                    label={photoCount}
                    size="small"
                    color="success"
                    sx={{ minWidth: 28, fontWeight: 600 }}
                  />
                  {/* Comment count (red, clickable) */}
                  <Chip
                    label={commentCount}
                    size="small"
                    color="error"
                    sx={{ minWidth: 28, fontWeight: 600 }}
                    onClick={(e) => handleCommentBubbleClick(e, user._id)}
                  />
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default UserList;

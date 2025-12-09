import React, { useEffect, useState, useRef } from "react";
import { AppBar, Toolbar, Typography, Box, Chip, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TopBar({ loggedInUser, onLogout }) {
  const [context, setContext] = useState("Photo Sharing App");
  const [version, setVersion] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // hidden file input for photo upload
  const fileInputRef = useRef(null);

  // --- fetch schema version once ---
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await axios.get("/test/info");
        setVersion(`Photo App v${response.data.__v}`);
      } catch (error) {
        console.error("Error fetching schema info:", error);
      }
    };
    fetchVersion();
  }, []);

  // --- update context when the route changes ---
  useEffect(() => {
    const fetchContext = async () => {
      const path = location.pathname;

      if (path === "/" || path === "/users") {
        setContext("Photo Sharing App");
        return;
      }

      if (path.startsWith("/users/") || path.startsWith("/photos/")) {
        const userId = path.split("/")[2];

        try {
          const response = await axios.get(`/user/${userId}`);
          const user = response.data;

          if (path.startsWith("/users/")) {
            setContext(`${user.first_name} ${user.last_name}`);
          } else {
            setContext(`Photos of ${user.first_name} ${user.last_name}`);
          }
        } catch (error) {
          console.error("Error fetching user for context:", error);
          setContext(path.startsWith("/users/") ? "User Details" : "User Photos");
        }
      }
    };

    fetchContext();
  }, [location]);

  // ------------- PHOTO UPLOAD HANDLERS -------------

  const handleAddPhotoClick = () => {
    if (!loggedInUser) {
      return; // should not happen because button is hidden when logged out
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear previous selection
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("uploadedphoto", file);

      await axios.post("/photos/new", formData);
      // simplest way to see the new photo: reload current view
      // (that’s fine for this project)
      window.location.reload();
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Photo upload failed. Check the console for details.");
    }
  };

  // ------------- LOGOUT HANDLER -------------

  const handleLogoutClick = async () => {
    try {
      await axios.post("/admin/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    if (onLogout) {
      onLogout();
    }
    navigate("/"); // back to login/register
  };

  // ------------- RENDER -------------

  return (
    <>
      {/* hidden file input used by Add Photo button */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          {/* left side – course / team name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 600, letterSpacing: "-0.5px" }}
            >
              Monish Munagala
            </Typography>
          </Box>

          {/* middle – context text */}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 300,
                letterSpacing: "0.5px",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              {context}
            </Typography>
          </Box>

          {/* right side – greeting, Add Photo, logout, version */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {loggedInUser ? (
              <>
                <Typography variant="body1">Hi {loggedInUser.first_name}</Typography>

                {/* ADD PHOTO BUTTON – only when logged in */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddPhotoClick}
                  sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  Add Photo
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogoutClick}
                  sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    borderColor: "rgba(255,255,255,0.6)",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Typography variant="body1">Please Login</Typography>
            )}

            <Chip
              label={version}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default TopBar;

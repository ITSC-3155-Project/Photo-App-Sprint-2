// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Grid } from "@mui/material";
import axios from "axios";

import TopBar from "./components/topBar/TopBar.jsx";
import UserList from "./components/userList/userList.jsx";
import UserDetail from "./components/userDetail/userDetail.jsx";
import UserPhotos from "./components/userPhotos/userPhotos.jsx";
import LoginRegister from "./components/loginRegister/loginRegister.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  const isLoggedIn = !!loggedInUser;

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // --- NEW: check existing session on first load / refresh ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/current-user");
        // if cookie/session is valid, this will return the user
        setLoggedInUser(response.data);
      } catch (err) {
        // likely 401 "No current user" – just treat as logged out
        setLoggedInUser(null);
      } finally {
        setCheckedSession(true);
      }
    };

    fetchCurrentUser();
  }, []);

  // Optionally: while we’re checking the session, don’t render routes yet
  if (!checkedSession) {
    return null; // or a small loading spinner if you prefer
  }

  return (
    <div>
      <TopBar loggedInUser={loggedInUser} onLogout={handleLogout} />

      <Grid container>
        {/* Left column: user list – only when logged in */}
        <Grid item xs={3}>
          {isLoggedIn && <UserList />}
        </Grid>

        {/* Right column: main view */}
        <Grid item xs={9}>
          <Routes>
            {/* Login / register page */}
            <Route
              path="/login-register"
              element={
                isLoggedIn ? (
                  <Navigate to={`/users/${loggedInUser._id}`} replace />
                ) : (
                  <LoginRegister
                    onLogin={handleLogin}
                    setLoggedInUser={setLoggedInUser}
                  />
                )
              }
            />

            {/* User detail – protected */}
            <Route
              path="/users/:userId"
              element={
                isLoggedIn ? (
                  <UserDetail />
                ) : (
                  <Navigate to="/login-register" replace />
                )
              }
            />

            {/* User photos – protected */}
            <Route
              path="/photos/:userId"
              element={
                isLoggedIn ? (
                  <UserPhotos />
                ) : (
                  <Navigate to="/login-register" replace />
                )
              }
            />

            {/* Default route */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to={`/users/${loggedInUser._id}`} replace />
                ) : (
                  <Navigate to="/login-register" replace />
                )
              }
            />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

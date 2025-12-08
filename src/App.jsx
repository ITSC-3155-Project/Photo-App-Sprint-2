// src/App.jsx
import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Grid } from "@mui/material";

import TopBar from "./components/topBar/TopBar.jsx";
import UserList from "./components/userList/userList.jsx";
import UserDetail from "./components/userDetail/userDetail.jsx";
import UserPhotos from "./components/userPhotos/userPhotos.jsx";
import LoginRegister from "./components/loginRegister/loginRegister.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const isLoggedIn = !!loggedInUser;

  const handleLogin = (user) => {
    // called by LoginRegister when /admin/login succeeds
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    // TopBar will also POST /admin/logout; this just clears local state
    setLoggedInUser(null);
  };

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
          <Switch>
            {/* Login / register page */}
            <Route path="/login-register">
              {isLoggedIn ? (
                // already logged in – go to their details page
                <Redirect to={`/users/${loggedInUser._id}`} />
              ) : (
                <LoginRegister
                  onLogin={handleLogin}
                  setLoggedInUser={setLoggedInUser}
                />
              )}
            </Route>

            {/* User detail – protected */}
            <Route path="/users/:userId">
              {isLoggedIn ? <UserDetail /> : <Redirect to="/login-register" />}
            </Route>

            {/* User photos – protected */}
            <Route path="/photos/:userId">
              {isLoggedIn ? <UserPhotos /> : <Redirect to="/login-register" />}
            </Route>

            {/* Default route */}
            <Route path="/">
              {isLoggedIn ? (
                <Redirect to={`/users/${loggedInUser._id}`} />
              ) : (
                <Redirect to="/login-register" />
              )}
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

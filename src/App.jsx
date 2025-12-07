import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "./styles/main.css";

import TopBar from "./components/topBar/TopBar.jsx";
import UserList from "./components/userList/userList.jsx";
import UserDetail from "./components/userDetail/userDetail.jsx";
import UserPhotos from "./components/userPhotos/userPhotos.jsx";
import LoginRegister from "./components/loginRegister/loginRegister.jsx";

/**
 * Root React component for the Photo App.
 * The router is created in photoShare.jsx; here we just define routes.
 */
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div className="cs142-main">
      {/* Top toolbar always visible */}
      <TopBar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />

      <div className="cs142-content">
        <Switch>
          {/* Login / registration page – always reachable */}
          <Route path="/login-register">
            <LoginRegister setLoggedInUser={setLoggedInUser} />
          </Route>

          {/* Everything below here requires a logged-in user */}
          {loggedInUser ? (
            <>
              <Route path="/users/:userId">
                <div className="cs142-main-content">
                  <div className="cs142-left-pane">
                    <UserList />
                  </div>
                  <div className="cs142-right-pane">
                    <UserDetail />
                  </div>
                </div>
              </Route>

              <Route path="/photos/:userId">
                <div className="cs142-main-content">
                  <div className="cs142-left-pane">
                    <UserList />
                  </div>
                  <div className="cs142-right-pane">
                    <UserPhotos />
                  </div>
                </div>
              </Route>

              <Route path="/users">
                <div className="cs142-main-content">
                  <div className="cs142-left-pane">
                    <UserList />
                  </div>
                  <div className="cs142-right-pane">
                    <div>Please select a user.</div>
                  </div>
                </div>
              </Route>

              {/* default route when logged in: go to own user page */}
              <Redirect to={`/users/${loggedInUser._id}`} />
            </>
          ) : (
            // If not logged in, force them to the login/register view
            <Redirect to="/login-register" />
          )}
        </Switch>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import TopBar from "../topBar/TopBar.jsx";
import UserList from "../userList/userList.jsx";
import UserDetail from "../userDetail/userDetail.jsx";
import UserPhotos from "../userPhotos/userPhotos.jsx";

function PhotoApp() {
  return (
    <div>
      <TopBar />
      <div className="cs142-main-body">
        <Switch>
          <Route exact path="/users" component={UserList} />
          <Route path="/users/:userId" component={UserDetail} />
          <Route path="/photos/:userId" component={UserPhotos} />
          <Redirect to="/users" />
        </Switch>
      </div>
    </div>
  );
}

export default PhotoApp;

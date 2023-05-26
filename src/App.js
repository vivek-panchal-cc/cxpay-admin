import React, { Component } from "react";
import { Switch, Router, Redirect, Route } from "react-router-dom";
import { history } from "./_helpers";
import "./scss/style.scss";
import "./assets/admin/css/custom.css";
import { PrivateRoute, LoginLessRoute } from "./components/PrivateRoute";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"> </div>{" "}
  </div>
);

// Containers
//const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import("./views/pages/admin/login/Login"));
const Forgot_password = React.lazy(() =>
  import("./views/pages/admin/forgot_password/Forgot_password")
);
const Reset_password = React.lazy(() =>
  import("./views/pages/admin/reset_password/Reset_password")
);
const TheFrontLayout = React.lazy(() =>
  import("./views/pages/frontend/TheFrontLayout")
);

class App extends Component {
  render() {
    return (
      <>
        <ReactNotifications />
        <React.Suspense fallback={loading}>
          <Router history={history}>
            <Switch>
              {/* This is a Admin Route Its always start with '/admin' and follow the /admin/{module_name}/{module_action} URL pattern */}{" "}
              <LoginLessRoute path="/admin/login" component={Login} />{" "}
              <LoginLessRoute
                path="/admin/forgot_password"
                component={Forgot_password}
              />{" "}
              <LoginLessRoute
                path="/admin/reset_password"
                component={Reset_password}
              />{" "}
              <PrivateRoute path="/" name="Home" />
              {/* Note: TheFrontLayout is last because it is used for the root "/" */}{" "}
              {/* <Route path="/" name="Landing page" render={props => <TheFrontLayout {...props} />} />                */}{" "}
              <Redirect from="*" to="/" />
            </Switch>{" "}
          </Router>{" "}
        </React.Suspense>{" "}
      </>
    );
  }
}

export default App;

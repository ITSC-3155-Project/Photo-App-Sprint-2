import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./loginRegister.css";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // login form
      login_name: "",
      loginPassword: "",
      loginError: "",

      // registration form
      reg_login_name: "",
      reg_password: "",
      reg_password2: "",
      reg_first_name: "",
      reg_last_name: "",
      reg_location: "",
      reg_description: "",
      reg_occupation: "",
      regError: "",
      regSuccess: ""
    };
  }

  // --- helpers to notify parent when login succeeds ---
  notifyLoginSuccess(user) {
    if (this.props.onLogin) {
      this.props.onLogin(user);
    }
    if (this.props.setLoggedInUser) {
      this.props.setLoggedInUser(user);
    }
  }

  // ------------------ LOGIN HANDLERS ------------------

  handleLoginFieldChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLoginSubmit = (event) => {
    event.preventDefault();
    const { login_name, loginPassword } = this.state;

    if (!login_name || !loginPassword) {
      this.setState({ loginError: "Please enter both login name and password." });
      return;
    }

    axios
      .post("/admin/login", {
        login_name: login_name,
        password: loginPassword
      })
      .then((response) => {
        this.setState({
          loginError: "",
          loginPassword: ""
        });
        this.notifyLoginSuccess(response.data);
      })
      .catch((err) => {
        let msg = "Login failed.";
        if (err.response && typeof err.response.data === "string") {
          msg = err.response.data;
        }
        this.setState({ loginError: msg });
      });
  };

  // --------------- REGISTRATION HANDLERS ---------------

  handleRegFieldChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegisterSubmit = (event) => {
    event.preventDefault();

    const {
      reg_login_name,
      reg_password,
      reg_password2,
      reg_first_name,
      reg_last_name,
      reg_location,
      reg_description,
      reg_occupation
    } = this.state;

    if (!reg_login_name || !reg_first_name || !reg_last_name || !reg_password) {
      this.setState({
        regError: "login_name, first_name, last_name, and password are required.",
        regSuccess: ""
      });
      return;
    }

    if (reg_password !== reg_password2) {
      this.setState({
        regError: "Passwords do not match.",
        regSuccess: ""
      });
      return;
    }

    axios
      .post("/user", {
        login_name: reg_login_name,
        password: reg_password,
        first_name: reg_first_name,
        last_name: reg_last_name,
        location: reg_location,
        description: reg_description,
        occupation: reg_occupation
      })
      .then(() => {
        this.setState({
          regError: "",
          regSuccess: "Registration successful. You can now log in.",
          reg_login_name: "",
          reg_password: "",
          reg_password2: "",
          reg_first_name: "",
          reg_last_name: "",
          reg_location: "",
          reg_description: "",
          reg_occupation: ""
        });
      })
      .catch((err) => {
        let msg = "Registration failed.";
        if (err.response && typeof err.response.data === "string") {
          msg = err.response.data;
        }
        this.setState({
          regError: msg,
          regSuccess: ""
        });
      });
  };

  // ------------------------ RENDER ------------------------

  render() {
    const {
      login_name,
      loginPassword,
      loginError,
      reg_login_name,
      reg_password,
      reg_password2,
      reg_first_name,
      reg_last_name,
      reg_location,
      reg_description,
      reg_occupation,
      regError,
      regSuccess
    } = this.state;

    return (
      <div className="cs142-login-register">
        <div className="cs142-login-panel">
          <h2>Login</h2>
          <form onSubmit={this.handleLoginSubmit} className="cs142-form">
            <label className="cs142-form-row">
              <span className="cs142-label">Login name</span>
              <input
                type="text"
                name="login_name"
                value={login_name}
                onChange={this.handleLoginFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Password</span>
              <input
                type="password"
                name="loginPassword"
                value={loginPassword}
                onChange={this.handleLoginFieldChange}
              />
            </label>

            {loginError && (
              <div className="cs142-error">
                {loginError}
              </div>
            )}

            <button type="submit" className="cs142-button">
              Login
            </button>
          </form>
        </div>

        <div className="cs142-register-panel">
          <h2>Register</h2>
          <form onSubmit={this.handleRegisterSubmit} className="cs142-form">
            <label className="cs142-form-row">
              <span className="cs142-label">Login name*</span>
              <input
                type="text"
                name="reg_login_name"
                value={reg_login_name}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Password*</span>
              <input
                type="password"
                name="reg_password"
                value={reg_password}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Repeat password*</span>
              <input
                type="password"
                name="reg_password2"
                value={reg_password2}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">First name*</span>
              <input
                type="text"
                name="reg_first_name"
                value={reg_first_name}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Last name*</span>
              <input
                type="text"
                name="reg_last_name"
                value={reg_last_name}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Location</span>
              <input
                type="text"
                name="reg_location"
                value={reg_location}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Occupation</span>
              <input
                type="text"
                name="reg_occupation"
                value={reg_occupation}
                onChange={this.handleRegFieldChange}
              />
            </label>

            <label className="cs142-form-row">
              <span className="cs142-label">Description</span>
              <textarea
                name="reg_description"
                value={reg_description}
                onChange={this.handleRegFieldChange}
              />
            </label>

            {regError && (
              <div className="cs142-error">
                {regError}
              </div>
            )}
            {regSuccess && (
              <div className="cs142-success">
                {regSuccess}
              </div>
            )}

            <button type="submit" className="cs142-button">
              Register Me
            </button>
          </form>
        </div>
      </div>
    );
  }
}

LoginRegister.propTypes = {
  onLogin: PropTypes.func,
  setLoggedInUser: PropTypes.func
};

export default LoginRegister;

import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import UserCredentialsForm from "../components/UserCredentialsForm";
import Alert from "react-bootstrap/Alert";

class LoginScreen extends Component {
  state = {
    error: undefined,
  };
  componentDidMount = () => {};

  onSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/users/login", {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", result.data.user.username);
        localStorage.setItem("userId", result.data.user.id);
        window.location.assign("/");
      })
      .catch((error) => {
        this.setState({ error: "Username or password is incorrect" });
      });
  };

  render = () => {
    return (
      <div className="container-form">
        {this.state.error && (
          <Alert variant="danger">{this.state.error}</Alert>
        )}
        <h1>Log in</h1>
        <UserCredentialsForm
          error={this.state.error}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  };
}
export default LoginScreen;

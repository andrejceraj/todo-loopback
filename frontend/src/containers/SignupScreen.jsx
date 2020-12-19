import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import UserCredentialsForm from "../components/UserCredentialsForm";
import Alert from "react-bootstrap/Alert";

class SignupScreen extends Component {
  state = {
    error: undefined,
  };

  componentDidMount = () => {};

  onSubmit = (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    axiosInstance
      .post("/signup", {
        username: username,
        password: password,
      })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", result.data.user.username);
        localStorage.setItem("userId", result.data.user.id);
        window.location.assign("/");
      })
      .catch((error) => {
        this.setState({ error: "Username already exists" });
      });
  };

  render = () => {
    return (
      <div className="container-form">
        {this.state.error && (
          <Alert variant="danger">{this.state.error}</Alert>
        )}
        <h1>Sign up</h1>
        <UserCredentialsForm
          error={this.state.error}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  };
}
export default SignupScreen;

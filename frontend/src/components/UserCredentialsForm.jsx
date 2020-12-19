import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const UserCredentialsForm = (props) => {
  return (
    <Form onSubmit={(e) => props.onSubmit(e)}>
      <Form.Group>
        <Form.Label htmlFor="username">Username:</Form.Label>
        <Form.Control htmlSize="50" type="text" id="username" name="username" />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="password">Password:</Form.Label>
        <Form.Control
          htmlSize="50"
          type="password"
          id="password"
          name="password"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default UserCredentialsForm;

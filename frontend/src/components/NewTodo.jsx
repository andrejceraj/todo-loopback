import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const NewTodo = (props) => {
  const [inputMode, setInputMode] = useState(false);

  const handleCreateTodo = (e) => {
    e.preventDefault();
    setInputMode(false);
    const description = e.target.description.value;
    props.createTodo({ description: description, done: false });
  };

  return (
    <>
      {!inputMode && (
        <Button onClick={() => setInputMode(true)} variant="primary">
          Create task
        </Button>
      )}
      {inputMode && (
        <Form onSubmit={(e) => handleCreateTodo(e)}>
          <Form.Group>
            <Form.Control
              id="description"
              name="description"
              type="text"
              placeholder="New task"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button
            onClick={() => setInputMode(false)}
            variant="danger"
            type="canel"
          >
            Cancel
          </Button>
        </Form>
      )}
    </>
  );
};

export default NewTodo;

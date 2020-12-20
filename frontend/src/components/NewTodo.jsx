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
        <div className="d-flex justify-content-end mr-4 my-3" >
          <Button className="ml-2" onClick={() => setInputMode(true)} variant="primary">
            Create task
          </Button>
        </div>
      )}
      {inputMode && (
        <Form
          className="mb-3 p-2 d-flex justify-content-between align-items-center border bg-light rounded-5"
          onSubmit={(e) => handleCreateTodo(e)}
        >
          <Form.Group className="w-100">
            <Form.Control className="" id="description" name="description" type="text" placeholder="New task" />
          </Form.Group>
          <div style={{ minWidth: "180px" }}>
            <Button style={{ width: "70px" }} className="ml-2" size="sm" variant="primary" type="submit">
              Submit
            </Button>
            <Button
              style={{ width: "70px" }}
              className="ml-2"
              size="sm"
              onClick={() => setInputMode(false)}
              variant="danger"
              type="reset"
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default NewTodo;

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {formatDate} from '../utils/utils';

const Todo = (props) => {
  const [editMode, setEditMode] = useState(false);
  let todo = props.todo;
  const type = "checkbox";

  const changeDone = (todo) => {
    todo.done = !todo.done;
    props.editTodo(todo);
  };

  const editTodo = (e, todo) => {
    e.preventDefault();
    todo.description = e.target.description.value;
    setEditMode(false);
    props.editTodo(todo);
  };

  return (
    <Form
      onSubmit={(e) => editTodo(e, todo)}
      key={todo.id}
      className="mb-3 p-2 d-flex justify-content-between align-items-center border bg-light rounded-5"
    >
      <Form.Check type={type} id={`check-${todo.id}`}>
        <p className="p-0 m-0">{formatDate(todo.createdAt)}</p>
        <Form.Check.Input type={type} checked={todo.done} onChange={(e) => changeDone(todo)} />
        {!editMode && <Form.Check.Label>{todo.description}</Form.Check.Label>}
        {editMode && (
          <Form.Control type="text" name="description" defaultValue={todo.description}/>
        )}
      </Form.Check>
      <div style={{ minWidth: "180px" }}>
        {editMode && (
          <>
            <Button style={{ width: "70px" }} className="ml-2" size="sm" variant="primary" type="submit">
              Save
            </Button>
            <Button
              onClick={() => setEditMode(false)}
              style={{ width: "70px" }}
              className="ml-2"
              size="sm"
              variant="danger"
            >
              Cancel
            </Button>
          </>
        )}

        {!editMode && (
          <>
            <Button
              onClick={() => setEditMode(true)}
              style={{ width: "70px" }}
              className="ml-2"
              size="sm"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={() => props.deleteTodo(todo)}
              style={{ width: "70px" }}
              className="ml-2"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

export default Todo;

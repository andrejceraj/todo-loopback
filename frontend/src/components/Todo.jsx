import React from "react";
import Form from "react-bootstrap/Form";

const Todo = (props) => {
  let todo = props.todo;
  const type = "checkbox";


  return (
    <div key={props.id} className="mb-3">
      <Form.Check type={type} id={`check-${props.id}`}>
        <Form.Check.Input type={type} checked={todo.done} onChange={(e) => props.setTodoCompletion(todo.id)}/>
        <Form.Check.Label>{todo.description}</Form.Check.Label>
      </Form.Check>
    </div>
  );
};

export default Todo;

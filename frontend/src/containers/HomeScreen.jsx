import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import Todo from "../components/Todo";
import { getCurrentUser } from "../utils/utils";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import NewTodo from "../components/NewTodo";

class HomeScreen extends Component {
  state = {
    todos: [],
    filter: "all",
  };

  componentDidMount = () => {
    this.getUserTodos();
  };

  getUserTodos = () => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }
    axiosInstance.get("/users/" + user.id + "/todos").then((result) => {
      let todos = result.data;
      this.setState({ todos });
    });
  };

  setTodoCompletion = (todoId) => {
    let todos = this.state.todos;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === todoId) {
        todos[i].done = !todos[i].done;
        axiosInstance.patch("/todos/" + todos[i].id, { done: todos[i].done });
        break;
      }
    }
    this.setState({ todos });
  };

  filterTodos = (filter) => {
    this.setState({ filter });
  };

  showTodos = () => {
    const filter = this.state.filter;
    return this.state.todos.map((todo, i) => {
      if (
        (todo.done && ["all", "done"].includes(filter)) ||
        (!todo.done && ["all", "todo"].includes(filter))
      ) {
        return (
          <Todo todo={todo} setTodoCompletion={this.setTodoCompletion} id={i} />
        );
      } else {
        return null;
      }
    });
  };

  createTodo = (todo) => {
    axiosInstance.post("/todos", todo).then((result) => {
      let todos = this.state.todos;
      todos.push(result.data);
      this.setState({ todos });
    });
  };

  render = () => {
    const user = getCurrentUser();
    return (
      <div>
        {user && (
          <>
            <ButtonGroup size="md" className="mb-2">
              <Button
                onClick={() => this.filterTodos("all")}
                style={{ width: "100px" }}
                variant="primary"
              >
                All
              </Button>
              <Button
                onClick={() => this.filterTodos("todo")}
                style={{ width: "100px" }}
                variant="danger"
              >
                Todo
              </Button>
              <Button
                onClick={() => this.filterTodos("done")}
                style={{ width: "100px" }}
                variant="success"
              >
                Done
              </Button>
            </ButtonGroup>
            {this.showTodos()}
            {this.state.filter !== "done" && <NewTodo createTodo={this.createTodo} />}
          </>
        )}
        {!user && (
          <div className="container-buttons">
            <h2>Log in or sign up</h2>
            <br />
            <Button href="/login" variant="secondary" size="lg" block>
              Log in
            </Button>
            <Button href="/signup" variant="primary" size="lg" block>
              Sign up
            </Button>
          </div>
        )}
      </div>
    );
  };
}

export default HomeScreen;

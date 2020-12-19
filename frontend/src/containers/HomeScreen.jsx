import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import Todo from "../components/Todo";
import { getCurrentUser, getFilterFromQuery } from "../utils/utils";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import NewTodo from "../components/NewTodo";
import history from "../history";

class HomeScreen extends Component {
  state = {
    todos: [],
    filter: (getFilterFromQuery() || "all"),
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

  editTodo = (todo) => {
    let todos = this.state.todos;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === todo.id) {
        todos[i] = todo;
        axiosInstance.put("/todos/" + todos[i].id, todos[i]);
        break;
      }
    }
    this.setState({ todos });
  };

  filterTodos = (filter) => {
    history.push("?filter=" + filter);
    this.setState({ filter });
  };

  showTodos = () => {
    const filter = this.state.filter;
    let todos = this.state.todos.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    return todos.map((todo) => {
      if (
        (todo.done && ["all", "done"].includes(filter)) ||
        (!todo.done && ["all", "todo"].includes(filter))
      ) {
        return (
          <Todo todo={todo} editTodo={this.editTodo} deleteTodo={this.deleteTodo} />
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

  deleteTodo = (todo) => {
    axiosInstance.delete("/todos/" + todo.id).then(result => {
      let todos = this.state.todos;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === todo.id) {
          todos.splice(i, 1);
          break;
        }
      }
      this.setState({ todos });
    })
  }

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

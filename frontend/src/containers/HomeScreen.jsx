import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import Todo from "../components/Todo";
import { getCurrentUser, getFilterFromQuery } from "../utils/utils";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import NewTodo from "../components/NewTodo";
import history from "../history";

class HomeScreen extends Component {
  state = {
    todos: [],
    filter: getFilterFromQuery() || "all",
    search: "",
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
    let todos = this.state.todos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return todos
      .filter((todo) => {
        return todo.description.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      })
      .map((todo) => {
        if ((todo.done && ["all", "done"].includes(filter)) || (!todo.done && ["all", "todo"].includes(filter))) {
          return <Todo key={todo.id} todo={todo} editTodo={this.editTodo} deleteTodo={this.deleteTodo} />;
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
    axiosInstance.delete("/todos/" + todo.id).then((result) => {
      let todos = this.state.todos;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === todo.id) {
          todos.splice(i, 1);
          break;
        }
      }
      this.setState({ todos });
    });
  };

  render = () => {
    const user = getCurrentUser();
    return (
      <div>
        {user && (
          <>
          <h1 className="text-center">To-do list:</h1>
            <div className="d-flex justify-content-between mb-2">
              <div>
                <Button
                  className="mx-1"
                  onClick={() => this.filterTodos("all")}
                  style={{ width: "100px" }}
                  variant="primary"
                >
                  All
                </Button>
                <Button
                  className="mx-1"
                  onClick={() => this.filterTodos("todo")}
                  style={{ width: "100px" }}
                  variant="danger"
                >
                  Todo
                </Button>
                <Button
                  className="mx-1"
                  onClick={() => this.filterTodos("done")}
                  style={{ width: "100px" }}
                  variant="success"
                >
                  Done
                </Button>
              </div>
              <Form inline>
                <FormControl
                  onChange={(e) => this.setState({ search: e.target.value })}
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                />
              </Form>
            </div>
            {this.state.filter !== "done" && <NewTodo createTodo={this.createTodo} />}
            {this.showTodos()}
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

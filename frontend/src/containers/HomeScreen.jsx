import React, { Component } from "react";
import axiosInstance from "../api/AxiosInstance";
import Todo from "../components/Todo";
import { getCurrentUser } from "../utils/utils";
import Button from "react-bootstrap/Button";

class HomeScreen extends Component {
  state = {
    todos: [],
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
    for(let i = 0; i < todos.length; i++){
      if(todos[i].id === todoId){
        todos[i].done = !todos[i].done;
        axiosInstance.patch("/todos/" + todos[i].id, {done: todos[i].done});
        break;
      }
    }
    this.setState({todos});
  }

  render = () => {
    const user = getCurrentUser();
    return (
      <div>
        {user && (
          <>
            {this.state.todos.map((todo, i) => (
              <Todo todo={todo} id={i} setTodoCompletion={this.setTodoCompletion} />
            ))}
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

import React from "react";
import { getCurrentUser } from "../utils/utils";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {
  const user = getCurrentUser();
  return (
    <Navbar className="bg-light justify-content-between">
      <Navbar.Brand href="/">Todo</Navbar.Brand>
      <Nav className="mr-sm">
        {user && (
          <Nav.Item>
            <Nav.Link
              href="/"
              onClick={() => {
                localStorage.clear();
              }}
            >
              {" "}
              Logout
            </Nav.Link>
          </Nav.Item>
        )}
        {!user && (
          <>
            <Nav.Item>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/signup">Sign up</Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;

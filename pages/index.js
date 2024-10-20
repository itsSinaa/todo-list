import React, { useState, useEffect } from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { verifyToken } from "@/utils/auth";
import { connectToDB } from "@/utils/connections";
import { userModel } from "@/model/User";
import swal from "sweetalert";
import { useRouter } from "next/router";
import { todoModel } from "@/model/Todo";

function Todolist({ user, todos }) {
  const router = useRouter();

  const [isActiveInput, setIsActiveInput] = useState(false);
  const [allTodos, setAllTodos] = useState([...todos]);
  const [todoTitle, setTodoTilte] = useState("");

  const refetchTodo = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();

    if (res.ok) {
      setAllTodos(data);
    }
  };

  const logout = async (e) => {
    e.preventDefault();

    swal({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      buttons: ["no", "yes"],
    }).then((res) => {
      if (res) {
        fetch("/api/auth/signout").then((res) => {
          if (res.ok) {
            swal({
              title: "You have successfully logged out!",
              icon: "success",
              buttons: "ok",
            });
            router.replace("/signin");
          }
        });
      }
    });
  };

  const removeTodo = async (ID) => {
    fetch(`api/todos/${ID}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        refetchTodo();
      }
    });
  };

  const createTodo = async (e) => {
    e.preventDefault();
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todoTitle, userID: user._id }),
    }).then((res) => {
      if (res.ok) {
        refetchTodo();
        setTodoTilte("");
      }
    });
  };

  return (
    <>
      <h1>Next-Todos</h1>

      <div className="alert">
        <p>⚠ Please add a task first!</p>
      </div>

      <div className="container">
        <div
          className="form-container"
          style={{ display: isActiveInput ? "block" : "none" }}>
          <form onSubmit={createTodo} className="add-form">
            <input
              value={todoTitle}
              onChange={(e) => setTodoTilte(e.target.value)}
              id="input"
              type="text"
              placeholder="Type your To-Do works..."
            />
            <button type="submit" id="submit">
              ADD
            </button>
          </form>
        </div>
        <div className="head">
          <div className="date">
            <p>
              {user.firstname} - {user.lastname}
            </p>
          </div>
          <div className="add" onClick={() => setIsActiveInput(!isActiveInput)}>
            {isActiveInput ? (
              <FontAwesomeIcon icon={faMinus} />
            ) : (
              <svg
                width="2rem"
                height="2rem"
                viewBox="0 0 16 16"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                />
                <path
                  fillRule="evenodd"
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                />
              </svg>
            )}
          </div>
          <div onClick={logout} className="time">
            <a href="#">Logout</a>
          </div>
        </div>
        <div className="pad">
          <div id="todo">
            <ul id="tasksContainer">
              {allTodos?.map((todo, index) => {
                return (
                  <li key={index}>
                    <div className="list">
                      <p>{todo.title}</p>
                    </div>
                    <span
                      onClick={() => removeTodo(todo._id)}
                      className="delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await connectToDB();
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const verifiedToken = verifyToken(token);

  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const user = await userModel.findOne(
    {
      email: verifiedToken.email,
    },
    "firstname lastname"
  );

  const todos = await todoModel.find({
    userID: user._id,
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      todos: JSON.parse(JSON.stringify(todos)),
    },
  };
}

export default Todolist;

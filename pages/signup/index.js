import { useRouter } from "next/router";
import React, { useState } from "react";
import swal from "sweetalert";

function Index() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userInfo = { firstname, lastname, username, email, password };

  const register = async (e) => {
    e.preventDefault();

    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => {
        if (res.ok) {
          swal({
            title: "user registered successfully !!",
            icon: "success",
            buttons: "ok",
          });
        }

        router.replace("/");
      })
      .catch((err) => {
        swal({
          title: "unknown error !!",
          icon: "error",
          buttons: "ok",
        });
      })
      .finally(() => {
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
      });
  };

  return (
    <div className="box">
      <h1 align="center">SignUp Form</h1>
      <form role="form" method="post">
        <div className="inputBox">
          <input
            type="text"
            autoComplete="off"
            required
            onChange={(e) => setFirstname(e.target.value)}
            value={firstname}
          />
          <label>Firstname</label>
        </div>
        <div className="inputBox">
          <input
            type="text"
            autoComplete="off"
            required
            onChange={(e) => setLastname(e.target.value)}
            value={lastname}
          />
          <label>Lastname</label>
        </div>
        <div className="inputBox">
          <input
            type="text"
            autoComplete="off"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <label>Username</label>
        </div>
        <div className="inputBox">
          <input
            type="email"
            autoComplete="off"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label>Email</label>
        </div>
        <div className="inputBox">
          <input
            type="password"
            autoComplete="off"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <label>Password</label>
        </div>

        <input
          onClick={register}
          type="submit"
          className="register-btn"
          value="Sign Up"
        />
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;

  if(token){
    return{
      redirect : {
        destination : "/"
      }
    }
  }

  return {
    props: {},
  };
}

export default Index;

import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Index() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememeberMe, setRememeberMe] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password, rememeberMe }),
    })
      .then((res) => {
        if (res.ok) {
          swal({
            title: "successfully logged in",
            icon: "success",
            buttons: "ok",
          });

          router.replace("/");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIdentifier("");
        setPassword("");
        setRememeberMe(false);
      });
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form onSubmit={login} role="form" method="post">
        <div className="inputBox">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            type="text"
            autoComplete="off"
            required
          />
          <label>Username | Email</label>
        </div>
        <div className="inputBox">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <div
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            marginBottom: "20px",
            justifyContent: "center",
            marginTop: "-10px",
          }}>
          <input
            onChange={(e) => setRememeberMe(!rememeberMe)}
            value={rememeberMe}
            htmlid="checkbox"
            type="checkbox"
          />
          <label htmlFor="checkbox">remember me</label>
        </div>

        <input type="submit" value="login" className="register-btn" />
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;

  if (token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}

export default Index;

import React, { useState, useContext } from "react";
import Input from "../UI/input";
import Container from "../UI/container";
import Classes from "./users.module.css";
import axios from "axios";
import AuthContext from "../../store/context-api";

const UserPage = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const AuthCtx = useContext(AuthContext);

  const handleName = (e) => {
    setUsername(e.target.value);
  };

  const handleProfilePic = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const switchAuthHandler = () => {
    setIsLogin((prevState) => !prevState);
    setProfilePic("");
  };

  const handleUrlAxios = async (obj) => {
    if (isLogin) {
      let userLogin = await axios.post(
        "http://localhost:4000/api/v1/users/login",
        obj
      );
      // console.log("userLogindData>>", userLogin.data.message);
      // console.log("userLogindData>>", userLogin.data.data.accessToken);
      AuthCtx.login(userLogin.data.data.accessToken);
      alert(userLogin.data.message);
      return;
    } else {
      const formData = new FormData();
      formData.append("username", obj.username);
      formData.append("profilePic", obj.profilePic);
      formData.append("email", obj.email);
      formData.append("password", obj.password);
      let userRegister = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        formData
      );
      alert(userRegister.data.message);
      // console.log("userRegisterdData>>", userRegister.data.message);
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (email === "" || password === "") {
        alert("Submit all field");
      } else {
        let obj = {
          email,
          password,
        };
        // console.log("loggedValue", obj);
        handleUrlAxios(obj);
      }
    } else {
      if (
        username === "" ||
        email === "" ||
        password === "" ||
        profilePic === ""
      ) {
        alert("Submit all field");
      } else {
        let obj = {
          username,
          profilePic,
          email,
          password,
        };
        console.log("RegistredValue", obj);
        handleUrlAxios(obj);
      }
    }
  };

  return (
    <>
      <Container>
        <h3>{isLogin ? "Login" : "Sign Up"}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              label="Name"
              input={{
                type: "text",
                placeholder: "Enter your name",
                value: username,
                onChange: handleName,
              }}
            />
          )}

          {!isLogin && (
            <Input
              label="Profile Picture"
              input={{
                className: Classes.inputprofilePic,
                type: "file",
                onChange: handleProfilePic,
              }}
            />
          )}

          <Input
            label="Email"
            input={{
              type: "email",
              placeholder: "Enter your email",
              value: email,
              onChange: handleEmail,
            }}
          />

          <Input
            label="Password"
            input={{
              type: "password",
              placeholder: "Enter your password",
              value: password,
              onChange: handlePassword,
            }}
          />
          <button className={Classes.btn} type="submit">
            Submit
          </button>
          <button
            className={Classes.btn}
            type="button"
            onClick={switchAuthHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </form>
      </Container>
    </>
  );
};

export default UserPage;

import React, { useState, useContext } from "react";
import Input from "../../UI/input";
import Container from "../../UI/container";
import Classes from "../../user/users.module.css";
import axios from "axios";
import AuthContext from "../../../store/context-api";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  const AuthCtx = useContext(AuthContext);

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const handleOption1 = (e) => {
    setOption1(e.target.value);
  };

  const handleOption2 = (e) => {
    setOption2(e.target.value);
  };

  const handleOption3 = (e) => {
    setOption3(e.target.value);
  };

  const handleOption4 = (e) => {
    setOption4(e.target.value);
  };

  const handleUrlAxios = async (obj) => {
    const token = AuthCtx.token;
    const response = await axios.post(
      "http://localhost:4000/api/v1/polls/create",
      obj,
      { headers: { Authorization: token } }
    );
    // console.log("reponse>>", response.data.data.question);
    // console.log("reponse>>", response.data.data.options);
    alert(response.data.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      question === "" ||
      option1 === "" ||
      option2 === "" ||
      option3 === "" ||
      option4 === ""
    ) {
      alert("Submit all field");
    } else {
      let obj = {
        question,
        options: [option1, option2, option3, option4],
      };
      console.log("RegistredValue", obj);
      handleUrlAxios(obj);
    }
  };

  return (
    <>
      <Container>
        <h3>Create poll</h3>
        <form onSubmit={handleSubmit}>
          <Input
            label="Enter Question Here"
            input={{
              type: "text",
              style: { height: "4rem" },
              placeholder: "Enter your question",
              value: question,
              onChange: handleQuestion,
            }}
          />

          <Input
            label="Option 1"
            input={{
              type: "text",
              placeholder: "Enter your Option 1",
              value: option1,
              onChange: handleOption1,
            }}
          />

          <Input
            label="Option 2"
            input={{
              type: "text",
              placeholder: "Enter your Option 2",
              value: option2,
              onChange: handleOption2,
            }}
          />

          <Input
            label="Option 3"
            input={{
              type: "text",
              placeholder: "Enter your Option 3",
              value: option3,
              onChange: handleOption3,
            }}
          />

          <Input
            label="Option 4"
            input={{
              type: "text",
              placeholder: "Enter your Option 4",
              value: option4,
              onChange: handleOption4,
            }}
          />

          <button className={Classes.btn} type="submit">
            Create Poll
          </button>
        </form>
      </Container>
    </>
  );
};

export default CreatePoll;

import React, { useState } from "react";
import Container from "../../UI/container";
import classes from "./votepage.module.css";
import Input from "../../UI/input";

let ArryOfPoll = [
  {
    _id: 1,
    question: "which laptop are you using",
    options: ["Dell", "Apple", "Mc", "Linux"],
  },
  {
    _id: 2,
    question: "which Mobile are you using",
    options: ["Sunsung", "Iphone", "Redmi", "Nokia"],
  },
  {
    _id: 3,
    question: "which Pen are you using",
    options: ["Black", "Blue", "Red", "Yello"],
  },
  {
    _id: 4,
    question: "In which city are you",
    options: ["Mumbai", "Utter Pradech", "Hariyana", "Mp"],
  },
];

const VotePage = () => {
  const [count, setCount] = useState({});
  const [comment, setComment] = useState("");
  //   console.log("count>>>>", count);

  const onclickHandler = (pollId, option) => {
    setCount((prevCounts) => {
      const pollCounts = prevCounts[pollId] || {};
      return {
        ...prevCounts,
        [pollId]: {
          ...pollCounts,
          [option]: (pollCounts[option] || 0) + 1,
        },
      };
    });
  };

  const handleComments = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (eve) => {
    eve.preventDefault();
    console.log(comment);
  };

  return (
    <>
      <div>
        {ArryOfPoll.map((item) => (
          <Container key={item._id} className={classes.conatiner2}>
            <div>
              <h2>{item.question}</h2>
              <div className={classes.optionlist}>
                {item.options.map((option, index) => (
                  <button
                    key={index}
                    className={classes.options}
                    onClick={() => onclickHandler(item._id, option)}>
                    <span>{option}</span>
                    <span> {count[item._id]?.[option] || 0} </span>
                  </button>
                ))}
              </div>
            </div>
            {/* <Container>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Commnts"
                  input={{
                    type: "text",
                    placeholder: "Enter your comment",
                    value: comment,
                    onChange: handleComments,
                  }}
                />
                <button className={classes.btn} type="submit">
                  Submit
                </button>
              </form>
              <div>submit comments</div>
            </Container> */}
          </Container>
        ))}
      </div>
    </>
  );
};

export default VotePage;

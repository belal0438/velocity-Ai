import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import Container from "../../UI/container";
import classes from "./profile.module.css";
import AuthContext from "../../../store/context-api";

const ResultPage = () => {
  const [count, setCount] = useState({});
  const [ArryOfPoll, setArrayOfPoll] = useState([]);
  const AuthCtx = useContext(AuthContext);
  const token = AuthCtx.token;
  const socketRef = useRef(null);

  useEffect(() => {
    const getPollData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/polls/create",
          {
            headers: { Authorization: token },
          }
        );
        const pollData = await response.json();
        setArrayOfPoll(pollData.data);

        // Initialize count with initial poll data
        const initialCounts = {};
        pollData.data.forEach((poll) => {
          if (typeof poll.voteCounts === "object" && poll.voteCounts !== null) {
            initialCounts[poll._id] = poll.voteCounts;
          }
        });
        setCount(initialCounts);
        console.log("Initial counts:", initialCounts);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPollData();
  }, [token]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        query: { token },
      });

      socketRef.current.on("voteUpdate", ({ pollId, voteCounts }) => {
        console.log("voteUpdate event received:", { pollId, voteCounts });
        setCount((prevCounts) => ({
          ...prevCounts,
          [pollId]: voteCounts,
        }));
      });

      socketRef.current.on("voteError", ({ message }) => {
        console.error("Error:", message);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [token]);

  return (
    <div>
      {ArryOfPoll.map((item) => (
        <Container key={item._id} className={classes.conatiner2}>
          <div>
            <h2>{item.question}</h2>
            <div className={classes.optionlist}>
              {item.options.map((option, index) => (
                <div key={index} className={classes.optionItem}>
                  <span>{option}</span>
                  <span>{count[item._id]?.[option] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      ))}
    </div>
  );
};

export default ResultPage;

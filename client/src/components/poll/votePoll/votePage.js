import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import Container from "../../UI/container";
import CommentPage from "../comments/commentPage";
import classes from "./votepage.module.css";
import AuthContext from "../../../store/context-api";
import axios from "axios";

const VotePage = () => {
  const [count, setCount] = useState({});
  const [ArryOfPoll, setArrayOfPoll] = useState([]);
  const [commentpage, setCommentpage] = useState(false);
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
        // console.log("Initial counts:", initialCounts);
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
        // console.log("voteUpdate event received:");
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

  const onclickHandler = async (pollId, option) => {
    // Emit the vote event to the server using the persistent socket
    socketRef.current.emit("vote", { pollId, option });
    try {
      await axios.post(
        "http://localhost:4000/api/v1/votes",
        { pollId, option, userId: AuthCtx.userId },
        { headers: { Authorization: token } }
      );

      // Optimistically update the count
      setCount((prevCounts) => {
        const newCounts = { ...prevCounts };
        if (!newCounts[pollId]) {
          newCounts[pollId] = {};
        }
        if (!newCounts[pollId][option]) {
          newCounts[pollId][option] = 0;
        }
        newCounts[pollId][option] += 1;
        // console.log("Optimistic update:", newCounts);
        return newCounts;
      });
    } catch (error) {
      alert(error.response.data.message);
      // console.log("response.error>>>>>>", error.response.data.message);
    }
  };

  return (
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
                  <span>{count[item._id]?.[option] || 0}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            className={classes.btn}
            onClick={() => setCommentpage((prevstaet) => !prevstaet)}>
            comments
          </button>
          {commentpage && <CommentPage pollId={item._id} />}
        </Container>
      ))}
    </div>
  );
};

export default VotePage;

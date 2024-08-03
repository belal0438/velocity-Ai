import React, { useState, useContext, useEffect } from "react";
import Container from "../../UI/container";
import AuthContext from "../../../store/context-api";
import classes from "./comment.module.css";
import axios from "axios";

const CommentPage = (props) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const id = props.pollId;
  const AuthCtx = useContext(AuthContext);
  const token = AuthCtx.token;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const getresponse = await axios.get(
          `http://localhost:4000/api/v1/comments/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        // console.log("getresponse>>>", getresponse.data.data.comments);
        setComments(getresponse.data.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id, token]);

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    try {
      //   console.log(pollId, newComment);
      const obj = { content: newComment };

      const response = await axios.post(
        `http://localhost:4000/api/v1/comments/${id}`,
        obj,
        { headers: { Authorization: token } }
      );

      //   console.log("response>>>", response);
      if (response.status !== 201) {
        alert("somthing went wrong");
      }
      setNewComment("");
      const getresponse = await axios.get(
        `http://localhost:4000/api/v1/comments/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      //   console.log("getresponse>>>", getresponse.data.data.comments);
      setComments(getresponse.data.data.comments);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <Container>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment, index) => (
          <li className={classes.li} key={index}>
            <p className={classes.ptext}>{comment.text}</p>
            <p>
              <small>By {comment.user.username}</small>
            </p>
          </li>
        ))}
      </ul>
      <form onSubmit={submitCommentHandler}>
        <textarea
          className={classes.inputfield}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."></textarea>
        <button type="submit">Submit</button>
      </form>
    </Container>
  );
};

export default CommentPage;

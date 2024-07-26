// import React, { useState, useEffect, useContext } from "react";
// import Container from "../../UI/container";
// import classes from "./votepage.module.css";
// import Input from "../../UI/input";
// import axios from "axios";
// import AuthContext from "../../../store/context-api";

// const VotePage = () => {
//   const [count, setCount] = useState({});
//   const [comment, setComment] = useState("");
//   console.log("count>>>>", count);
//   const [ArryOfPoll, setArrayOfPoll] = useState([]);
//   const AuthCtx = useContext(AuthContext);
//   const token = AuthCtx.token;
//   useEffect(() => {
//     const getuserprofile = async () => {
//       const response = await axios.get(
//         "http://localhost:4000/api/v1/polls/create",
//         { headers: { Authorization: token } }
//       );
//       setArrayOfPoll(response.data.data);
//       // console.log("reponsepoll>>>>>", response.data.data[0].question);
//       // console.log("reponsepoll>>>>>", response.data.data[0].options);
//     };
//     getuserprofile();
//   }, [token]);

//   const onclickHandler = async (pollId, option) => {
//     const response = await axios.post(
//       "http://localhost:4000/api/v1/votes",
//       { pollId, option },
//       { headers: { Authorization: token } }
//     );
//     console.log("resposne>Vote>>>", response);
//     const voteCounts = response.data.voteCounts || [];
//     setCount((prevCounts) => ({
//       ...prevCounts,
//       [pollId]: response.data.voteCounts.reduce((acc, vote) => {
//         acc[vote.option] = vote.count;
//         return acc;
//       }, {}),
//     }));
//   };

//   const handleComments = (e) => {
//     setComment(e.target.value);
//   };

//   const handleSubmit = (eve) => {
//     eve.preventDefault();
//     console.log(comment);
//   };

//   return (
//     <>
//       <div>
//         {ArryOfPoll.map((item) => (
//           <Container key={item._id} className={classes.conatiner2}>
//             <div>
//               <h2>{item.question}</h2>
//               <div className={classes.optionlist}>
//                 {item.options.map((option, index) => (
//                   <button
//                     key={index}
//                     className={classes.options}
//                     onClick={() => onclickHandler(item._id, option)}>
//                     <span>{option}</span>
//                     <span> {count[item._id]?.[option] || 0} </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             {/* <Container>
//               <form onSubmit={handleSubmit}>
//                 <Input
//                   label="Commnts"
//                   input={{
//                     type: "text",
//                     placeholder: "Enter your comment",
//                     value: comment,
//                     onChange: handleComments,
//                   }}
//                 />
//                 <button className={classes.btn} type="submit">
//                   Submit
//                 </button>
//               </form>
//               <div>submit comments</div>
//             </Container> */}
//           </Container>
//         ))}
//       </div>
//     </>
//   );
// };

// export default VotePage;

import React, { useState, useEffect, useContext } from "react";
import Container from "../../UI/container";
import classes from "./votepage.module.css";
import Input from "../../UI/input";
import axios from "axios";
import AuthContext from "../../../store/context-api";

const VotePage = () => {
  const [count, setCount] = useState({});
  const [comment, setComment] = useState("");
  const [ArryOfPoll, setArrayOfPoll] = useState([]);
  const AuthCtx = useContext(AuthContext);
  const token = AuthCtx.token;

  useEffect(() => {
    const getuserprofile = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/v1/polls/create",
        { headers: { Authorization: token } }
      );
      setArrayOfPoll(response.data.data);
    };
    getuserprofile();
  }, [token]);

  const onclickHandler = async (pollId, option) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/votes",
        { pollId, option, userId: AuthCtx.userId },
        { headers: { Authorization: token } }
      );

      // console.log("response>>>", response.data.data);
      const voteCounts = response.data.data || [];

      setCount((prevCounts) => ({
        ...prevCounts,
        [pollId]: voteCounts.reduce((acc, vote) => {
          acc[vote.option] = vote.count;
          return acc;
        }, {}),
      }));
    } catch (error) {
      console.error(
        "Error voting:",
        error.response?.data?.message || error.message
      );
    }
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

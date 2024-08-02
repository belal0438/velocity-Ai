import React, { useEffect, useContext, useState } from "react";
import Container from "../../UI/container";
import classes from "./profile.module.css";
import axios from "axios";
import AuthContext from "../../../store/context-api";
import ResultPage from "./pollresultPage";

const ProfilePage = () => {
  const AuthCtx = useContext(AuthContext);
  const [profileName, setProfileName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const token = AuthCtx.token;
  useEffect(() => {
    const getuserprofile = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/v1/users/user-profile",
        { headers: { Authorization: token } }
      );
      // console.log("reponse>>>>>", response.data.data);
      setProfileName(response.data.data.username);
      setProfilePic(response.data.data.profilePicture);
    };
    getuserprofile();
  });

  return (
    <>
      <Container>
        <div>
          <img className={classes.Img} src={profilePic} alt="Error" />
        </div>
        <h4 className={classes.h4}>Name: {profileName}</h4>
      </Container>
      <ResultPage />
    </>
  );
};

export default ProfilePage;

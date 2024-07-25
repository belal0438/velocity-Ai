import React from "react";
import Container from "../../UI/container";
import classes from "./profile.module.css";

const ProfilePage = () => {
  return (
    <>
      <Container>
        <div>
          <img
            className={classes.Img}
            src="https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png"
            alt="Error"
          />
        </div>
        <h4 className={classes.h4}>Name: Mohd Belal</h4>
      </Container>
    </>
  );
};

export default ProfilePage;

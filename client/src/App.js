import React, { Suspense, lazy, useContext } from "react";
import "./App.css";
import MainHeader from "./components/headers/mainHeader";
// import UserPage from "./components/user/userPage";
// import CreatePoll from "./components/poll/creatPoll/createPoll";
// import VotePage from "./components/poll/votePoll/votePage";
// import ProfilePage from "./components/poll/profile/profilePage";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AuthContext from "./store/context-api";

const UserPage = lazy(() => import("./components/user/userPage"));
const CreatePoll = lazy(() => import("./components/poll/creatPoll/createPoll"));
const VotePage = lazy(() => import("./components/poll/votePoll/votePage"));
const ProfilePage = lazy(() => import("./components/poll/profile/profilePage"));

function App() {
  const AuthCtxt = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainHeader />}>
          {/* <Route index element={<ProfilePage />} /> */}
          <Route
            index
            element={
              AuthCtxt.isLoggedIn ? (
                <Suspense fallback={<p>Loading...</p>}>
                  <ProfilePage />
                </Suspense>
              ) : (
                <Navigate to="/user" />
              )
            }
          />

          {/* <Route path="user" element={<UserPage />} /> */}

          <Route
            path="user"
            element={
              !AuthCtxt.isLoggedIn ? (
                <Suspense fallback={<p>Loading...</p>}>
                  <UserPage />
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* <Route path="vote-poll" element={<VotePage />} /> */}
          <Route
            path="vote-poll"
            element={
              AuthCtxt.isLoggedIn ? (
                <Suspense fallback={<p>Loading...</p>}>
                  <VotePage />
                </Suspense>
              ) : (
                <Navigate to="/user" />
              )
            }
          />

          {/* <Route path="ceate-poll" element={<CreatePoll />} /> */}

          <Route
            path="ceate-poll"
            element={
              AuthCtxt.isLoggedIn ? (
                <Suspense fallback={<p>Loading...</p>}>
                  <CreatePoll />
                </Suspense>
              ) : (
                <Navigate to="/user" />
              )
            }
          />

          {/* <Route path="logout" element={<Users />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;

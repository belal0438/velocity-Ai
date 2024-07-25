import "./App.css";
import MainHeader from "./components/headers/mainHeader";
import UserPage from "./components/user/userPage";
import CreatePoll from "./components/poll/creatPoll/createPoll";
import VotePage from "./components/poll/votePoll/votePage";
import ProfilePage from "./components/poll/profile/profilePage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainHeader />}>
          <Route index element={<ProfilePage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="vote-poll" element={<VotePage />} />
          <Route path="ceate-poll" element={<CreatePoll />} />
          {/* <Route path="logout" element={<Users />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;

import React, { useState } from "react";
import Stomp from "stompjs";

import "./App.css";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import { AuthDetails } from "./components/Types";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authDetails, setAuthDetails] = useState<AuthDetails>({
    jwt: "",
    name: "",
  });
  const stompClient: Stomp.Client = Stomp.client(
    "wss://" + process.env.BASE_URL + "/ws"
  );

  if (!isLoggedIn) {
    return (
      <Login
        updateLoginStatus={(e: boolean) => setIsLoggedIn(e)}
        updateAuthDetails={(e: AuthDetails) => setAuthDetails(e)}
      ></Login>
    );
  }
  return (
    <>
      <ChatPage authDetails={authDetails} stompClient={stompClient}></ChatPage>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import Stomp from "stompjs";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import "./ChatPage.css";
import { AuthDetails, ConnectedUsers, Message } from "../components/Types";

const ChatPage: React.FC<{
  authDetails: AuthDetails;
  stompClient: Stomp.Client;
}> = ({ authDetails, stompClient }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [connectedUsersCount, setConnectedUsersCount] = useState<number>(0);
  const [connectedUsers, setConnectedusers] = useState<string[]>([]);
  const token = {
    Authorization: "Bearer " + authDetails.jwt,
  };

  useEffect(() => {
    stompClient.connect(token, () => {
      stompClient.subscribe("/topic/messages", (message) => {
        const receivedMessage: Message = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
      stompClient.subscribe("/topic/users", (users) => {
        const currentUsers: ConnectedUsers = JSON.parse(users.body);
        console.log(currentUsers);
        setConnectedUsersCount(currentUsers.count);
        setConnectedusers(currentUsers.usernames);
      });
    });
  }, []);

  const sendMessage = () => {
    if (stompClient && message.trim()) {
      const toSend: Message = { nickname: authDetails.name, content: message };
      stompClient.send("/app/chat", {}, JSON.stringify(toSend));
      setMessage("");
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <Container>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={9}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" className="chat-header">
                  Groupchat
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ flexGrow: 1 }}>
                <List
                  className="message-list"
                  style={{ overflowY: "auto", maxHeight: "80vh" }}
                >
                  {messages.map((msg, index) => (
                    <ListItem key={index} className="message-list-item">
                      <ListItemAvatar>
                        <Avatar style={{ backgroundColor: "#1e88e5" }}>
                          {msg.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <Paper
                        variant="outlined"
                        square
                        className="message-paper"
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              style={{ wordWrap: "break-word" }}
                            >
                              <strong>{msg.nickname}: </strong> {msg.content}
                            </Typography>
                          }
                        />
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" className="chat-header">
              Live Users: {connectedUsersCount}
            </Typography>
            <List>
              {connectedUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#1e88e5" }}>
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
      <Container
        className="message-bar"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ maxWidth: "800px", width: "100%", padding: "0 16px" }}
        >
          <Grid item xs={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              disabled={!message.trim()}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ChatPage;

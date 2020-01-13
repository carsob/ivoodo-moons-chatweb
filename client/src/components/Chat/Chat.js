import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import io from "socket.io-client";
import "./Chat.css";

const ENDPOINT = "http://localhost:5000";
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);

    const name = prompt("Introduce tu nickname");
    appendMessage(`${name} has ingresado`);
    socket.emit("new-user", name);

    socket.on("chat-message", (data) => {
      appendMessage(`${data.name}: ${data.message}`);
    });

    socket.on("user-connected", (name) => {
      appendMessage(`${name} En linea`);
    });

    socket.on("user-disconnected", (name) => {
      appendMessage(`${name} Fuera de linea`);
    });
  }, [ENDPOINT, name, room]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      appendMessage(`Yo: ${message}`);
      socket.emit("send-chat-message", message, () => setMessage(""));
    }
  };

  const appendMessage = (message) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    const messageContainer = document.getElementById("message-container");
    messageContainer.append(messageElement);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onTextKeyPress = (e) => {
    return e.key === "Enter" ? sendMessage(e) : null;
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col lg="10" className="p-1">
          <div id="message-container"></div>
          <Form id="send-container" onSubmit={(e) => onSubmit(e)}>
            <Form.Control
              id="message-input"
              type="text"
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
              onKeyPress={(e) => onTextKeyPress(e)}
            ></Form.Control>
            <Button id="send-button" variant="info" onClick={(e) => sendMessage(e)}>
              Enviar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;

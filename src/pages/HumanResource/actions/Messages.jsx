import React, { useEffect, useRef, useState } from "react";
import "./Massages.css";
import { BsSendFill } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";

const Messages = ({ actionOverlay, setActionOverlay, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${server}/messages/allMessages/${actionOverlay.candidate._id}`,
          {
            withCredentials: true,
          }
        );
        setMessages(response.data.messages);
        scrollToBottom();
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchMessages();
  }, [actionOverlay.candidate._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendNewMessage = async () => {
    try {
      const response = await axios.post(
        `${server}/messages/newMessage`,
        {
          senderName: user.name,
          senderId: user._id,
          message: newMessage,
          candidateId: actionOverlay.candidate._id,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setNewMessage("");
      // Refetch messages after sending a new one
      const updatedMessages = await axios.get(
        `${server}/messages/allMessages/${actionOverlay.candidate._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(updatedMessages.data.messages);
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groupedMessages, message) => {
      const date = new Date(message.time).toLocaleDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
      return groupedMessages;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-heading">
          <h3>{actionOverlay.action}</h3>
          <div>
            <p>{actionOverlay.candidate.name}</p>
            <p>{actionOverlay.candidate.email}</p>
          </div>
        </div>
        <hr className="border" />
        <div className="messages">
          {sortedDates.length === 0 ? (
            <div className="no-messages">
              <p>Start a new chat</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="date-wise-messages">
                <div className="date-header">{date}</div>
                {groupedMessages[date].map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === user._id ? "message-right" : "message-left"
                    }`}
                  >
                    <p>
                      <strong>{msg.senderName}</strong>
                    </p>
                    <div>
                      <p>{msg.message}</p>
                      <span>{new Date(msg.time).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="overlay-action-button overlay-action-button-2">
          <textarea
            placeholder="New text"
            cols={75}
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>
          <BsSendFill onClick={sendNewMessage} className="send-message-btn"/>
          <button1 className="close-message-btn" onClick={() => setActionOverlay({ visible: false })}>
            Close
          </button1>
        </div>
      </div>
    </div>
  );
};

export default Messages;

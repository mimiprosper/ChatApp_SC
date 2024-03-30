import React, { useState, useEffect } from "react";
import "./App.css";
const { ethers } = require("ethers");
import ChatABI from "./abi.json"; // Import the ABI of your Chat contract

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chatContract, setChatContract] = useState(null);
  // const [ensContract, setENSContract] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const CHAT_CONTRACT_ADDRESS = " 0x79764d464f9334671aB21C360Aa87DF9ae84BAe5";

  useEffect(() => {
    async function init() {
      // Initialize ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Get signer
      const signer = provider.getSigner();
      setSigner(signer);

      // Initialize contracts
      const chatContract = new ethers.Contract(
        CHAT_CONTRACT_ADDRESS,
        ChatABI,
        signer
      );
      setChatContract(chatContract);

      
    }

    if (window.ethereum) {
      init();
    } else {
      console.log("Please install MetaMask");
    }
  }, []);

  const sendMessage = async () => {
    if (!content || !receiver) {
      alert("Receiver address and message content are required");
      return;
    }

    try {
      // Send message
      await chatContract.sendMessage(receiver, content);

      // Clear input fields
      setReceiver("");
      setContent("");

      // Fetch updated chat history
      await getChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please check the console for details.");
    }
  };

  const getChatHistory = async () => {
    if (!signer || !provider) return;

    try {
      // Fetch chat history
      const userAddress = await signer.getAddress();
      const messages = await chatContract.getChatHistory(userAddress, receiver);
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      alert(
        "Error fetching chat history. Please check the console for details."
      );
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div>
        <label>Receiver Address:</label>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver Address"
        />
      </div>
      <div>
        <label>Message:</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your message"
        />
      </div>
      <button onClick={sendMessage}>Send Message</button>

      <h2>Chat History</h2>
      <div>
        {chatHistory.map((message, index) => (
          <div key={index}>
            <p>
              <strong>From:</strong> {message.sender}
            </p>
            <p>
              <strong>Content:</strong> {message.content}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

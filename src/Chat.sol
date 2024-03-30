// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ENS.sol";

contract Chat {
    ENS public ensContract;

    struct Message {
        address sender;
        address receiver;
        string content;
    }

    mapping(address => mapping(address => Message[])) public chatHistory;

    event MessageSent(address indexed sender, address indexed receiver, string content);

    constructor(address _ensAddress) {
        ensContract = ENS(_ensAddress);
    }

    function sendMessage(address _receiver, string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        (string memory senderName, ) = ensContract.getUserData(msg.sender);
        (string memory receiverName, ) = ensContract.getUserData(_receiver);

        require(bytes(senderName).length > 0, "Sender not registered");
        require(bytes(receiverName).length > 0, "Receiver not registered");

        chatHistory[msg.sender][_receiver].push(Message(msg.sender, _receiver, _content));
        emit MessageSent(msg.sender, _receiver, _content);
    }

    function getChatHistory(address _user1, address _user2) public view returns (Message[] memory) {
        return chatHistory[_user1][_user2];
    }
}
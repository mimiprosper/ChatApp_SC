// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract ENS {
    struct UserData {
        string name;
        string image;
    }

    mapping(address => UserData) public users;

    event UserRegistered(address indexed userAddress, string name, string image);

    function registerUser(string memory _name, string memory _image) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_image).length > 0, "Image cannot be empty");
        require(bytes(users[msg.sender].name).length == 0, "User already registered");

        users[msg.sender] = UserData(_name, _image);
        emit UserRegistered(msg.sender, _name, _image);
    }

    function getUserData(address _userAddress) public view returns (string memory, string memory) {
        return (users[_userAddress].name, users[_userAddress].image);
    }
}


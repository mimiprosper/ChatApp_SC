// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/Chat.sol";
import "../src/ENS.sol";

contract ChatDeployScript is Script {
    function setUp() public {}

    function run() public {

        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address account = vm.addr(privateKey);

        console.log("Account: ", account);

        vm.startBroadcast(privateKey);

        ENS ens = new ENS();
        Chat chat = new Chat(address(ens));

        console.log("Chat contract has been deployed to : ", address(chat));

        vm.stopBroadcast();
    }
}

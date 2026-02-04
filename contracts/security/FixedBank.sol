// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FixedBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "not enough");
        balances[msg.sender] -= amount; // fix: effects first
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "send failed");
    }

    receive() external payable {}
}

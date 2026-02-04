// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Vulnerable: interaction first, then state update
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "not enough");

        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "send failed");

        // BAD: state update after external call (reentrancy vulnerability)
        // Also avoids underflow reverts in Solidity 0.8+
        balances[msg.sender] = 0;
    }

    receive() external payable {}
}

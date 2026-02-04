// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Status { Registered, InTransit, Delivered }

    struct Item {
        string metadata;
        Status status;
        address owner;
        bool exists;
    }

    mapping(uint256 => Item) public items;

    event ItemRegistered(uint256 indexed id, address indexed owner, string metadata);
    event StatusUpdated(uint256 indexed id, Status status);

    function registerItem(uint256 id, string calldata metadata) external {
        require(!items[id].exists, "already exists");
        items[id] = Item(metadata, Status.Registered, msg.sender, true);
        emit ItemRegistered(id, msg.sender, metadata);
    }

    function updateStatus(uint256 id, Status newStatus) external {
        require(items[id].exists, "not found");
        require(items[id].owner == msg.sender, "not owner");
        require(uint256(newStatus) >= uint256(items[id].status), "cannot go back");
        items[id].status = newStatus;
        emit StatusUpdated(id, newStatus);
    }
}

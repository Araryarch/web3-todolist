// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITodoList {
    struct UserStats {
        uint256 tasksCreated;
        uint256 tasksDone;
        uint8 columnsBitmask;
        uint256 totalLabels;
    }
    function getUserStats(address user) external view returns (UserStats memory);
}

contract TodoNFT is ERC1155, Ownable {
    ITodoList public todoList;

    uint256 public constant BADGE_FIRST_TASK = 0;
    uint256 public constant BADGE_TEN_TASKS = 1;
    uint256 public constant BADGE_FIFTY_TASKS = 2;
    uint256 public constant BADGE_HUNDRED_TASKS = 3;
    uint256 public constant BADGE_TEN_DONE = 4;
    uint256 public constant BADGE_FIFTY_DONE = 5;
    uint256 public constant BADGE_ALL_COLUMNS = 6;
    uint256 public constant BADGE_LABEL_LOVER = 7;

    mapping(address => mapping(uint256 => bool)) public claimed;

    event BadgeClaimed(address indexed user, uint256 indexed badgeId);

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setTodoList(address _todoList) external onlyOwner {
        todoList = ITodoList(_todoList);
    }

    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    function claimBadge(uint256 badgeId) external {
        require(badgeId <= BADGE_LABEL_LOVER, "Invalid badge");
        require(!claimed[msg.sender][badgeId], "Already claimed");
        require(canClaim(msg.sender, badgeId), "Cannot claim");
        claimed[msg.sender][badgeId] = true;
        _mint(msg.sender, badgeId, 1, "");
        emit BadgeClaimed(msg.sender, badgeId);
    }

    function canClaim(address user, uint256 badgeId) public view returns (bool) {
        if (address(todoList) == address(0)) return false;
        ITodoList.UserStats memory stats = todoList.getUserStats(user);

        if (badgeId == BADGE_FIRST_TASK) return stats.tasksCreated >= 1;
        if (badgeId == BADGE_TEN_TASKS) return stats.tasksCreated >= 10;
        if (badgeId == BADGE_FIFTY_TASKS) return stats.tasksCreated >= 50;
        if (badgeId == BADGE_HUNDRED_TASKS) return stats.tasksCreated >= 100;
        if (badgeId == BADGE_TEN_DONE) return stats.tasksDone >= 10;
        if (badgeId == BADGE_FIFTY_DONE) return stats.tasksDone >= 50;
        if (badgeId == BADGE_ALL_COLUMNS) return stats.columnsBitmask == 0x0F;
        if (badgeId == BADGE_LABEL_LOVER) return stats.totalLabels >= 5;

        return false;
    }
}

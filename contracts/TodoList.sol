// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TodoList {
    struct SubTask {
        uint256 id;
        string title;
        bool completed;
    }

    struct Todo {
        uint256 id;
        string title;
        string description;
        uint8 priority; // 0=low, 1=medium, 2=high, 3=urgent
        uint8 column; // 0=backlog, 1=todo, 2=in-progress, 3=done
        string[] labels;
        uint256 dueDate;
        uint256 createdAt;
        bool exists;
    }

    uint256 private _nextId;
    mapping(address => mapping(uint256 => Todo)) private _todos;
    mapping(address => uint256[]) private _userTodoIds;
    mapping(uint256 => SubTask[]) private _todoSubtasks;

    event TodoCreated(uint256 indexed id, address indexed owner, string title);
    event TodoUpdated(uint256 indexed id, address indexed owner);
    event TodoDeleted(uint256 indexed id, address indexed owner);
    event TodoMoved(uint256 indexed id, uint8 newColumn);

    function createTodo(
        string calldata title,
        string calldata description,
        uint8 priority,
        uint8 column,
        string[] calldata labels,
        uint256 dueDate
    ) external {
        uint256 id = _nextId++;
        _todos[msg.sender][id] = Todo({
            id: id,
            title: title,
            description: description,
            priority: priority,
            column: column,
            labels: labels,
            dueDate: dueDate,
            createdAt: block.timestamp,
            exists: true
        });
        _userTodoIds[msg.sender].push(id);
        emit TodoCreated(id, msg.sender, title);
    }

    function updateTodo(
        uint256 id,
        string calldata title,
        string calldata description,
        uint8 priority,
        uint8 column,
        string[] calldata labels,
        uint256 dueDate
    ) external {
        require(_todos[msg.sender][id].exists, "Todo does not exist");
        Todo storage todo = _todos[msg.sender][id];
        todo.title = title;
        todo.description = description;
        todo.priority = priority;
        todo.column = column;
        todo.labels = labels;
        todo.dueDate = dueDate;
        emit TodoUpdated(id, msg.sender);
    }

    function deleteTodo(uint256 id) external {
        require(_todos[msg.sender][id].exists, "Todo does not exist");
        delete _todos[msg.sender][id];
        address owner = msg.sender;
        uint256[] storage ids = _userTodoIds[owner];
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }
        emit TodoDeleted(id, owner);
    }

    function moveTodo(uint256 id, uint8 newColumn) external {
        require(_todos[msg.sender][id].exists, "Todo does not exist");
        _todos[msg.sender][id].column = newColumn;
        emit TodoMoved(id, newColumn);
    }

    function getTodos(address user) external view returns (Todo[] memory) {
        uint256[] storage ids = _userTodoIds[user];
        uint256 count = ids.length;
        Todo[] memory result = new Todo[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = _todos[user][ids[i]];
        }
        return result;
    }

    function addSubTask(uint256 todoId, string calldata title) external {
        require(_todos[msg.sender][todoId].exists, "Todo does not exist");
        uint256 subId = _todoSubtasks[todoId].length;
        _todoSubtasks[todoId].push(SubTask(subId, title, false));
    }

    function toggleSubTask(uint256 todoId, uint256 subId) external {
        require(_todos[msg.sender][todoId].exists, "Todo does not exist");
        require(subId < _todoSubtasks[todoId].length, "Subtask not found");
        _todoSubtasks[todoId][subId].completed =
            !_todoSubtasks[todoId][subId].completed;
    }

    function getSubtasks(
        uint256 todoId
    ) external view returns (SubTask[] memory) {
        return _todoSubtasks[todoId];
    }
}

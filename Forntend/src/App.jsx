import { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit, FiSave } from "react-icons/fi";
import "./App.css";

const API_BASE = "https://to-do-list-mern-2hci.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    axios
      .get(API_BASE + "/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error fetching todos: ", err));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    axios
      .post(API_BASE + "/todos/add", { description: newTodo })
      .then((res) => {
        console.log(res.data);
        getTodos(); // Refresh list
        setNewTodo("");
      })
      .catch((err) => console.error("Error adding todo: ", err));
  };

  const deleteTodo = (id) => {
    axios
      .delete(API_BASE + "/todos/" + id)
      .then((res) => {
        console.log(res.data);
        getTodos(); // Refresh list
      })
      .catch((err) => console.error("Error deleting todo: ", err));
  };

  const toggleCompleted = (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    if (!todoToUpdate) return;

    axios
      .post(API_BASE + "/todos/update/" + id, {
        description: todoToUpdate.description,
        completed: !todoToUpdate.completed,
      })
      .then((res) => {
        console.log(res.data);
        getTodos(); // Refresh list
      })
      .catch((err) => console.error("Error updating todo: ", err));
  };

  const handleEditClick = (todo) => {
    setEditingTodoId(todo._id);
    setEditingTodoText(todo.description);
  };

  const handleSaveClick = (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    if (!todoToUpdate) return;

    axios
      .post(API_BASE + "/todos/update/" + id, {
        description: editingTodoText,
        completed: todoToUpdate.completed,
      })
      .then((res) => {
        console.log(res.data);
        setEditingTodoId(null);
        setEditingTodoText("");
        getTodos(); // Refresh list
      })
      .catch((err) => console.error("Error updating todo: ", err));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="app">
      <div className="header">
        <h1>Glossy To-Do</h1>
      </div>

      <form className="form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a new task..."
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              key={todo._id}
            >
              {editingTodoId === todo._id ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editingTodoText}
                  onChange={(e) => setEditingTodoText(e.target.value)}
                />
              ) : (
                <span
                  className="todo-item-text"
                  onClick={() => toggleCompleted(todo._id)}
                >
                  {todo.description}
                </span>
              )}
              <div className="buttons-wrapper">
                {editingTodoId === todo._id ? (
                  <button
                    className="icon-btn save-btn"
                    onClick={() => handleSaveClick(todo._id)}
                  >
                    <FiSave />
                  </button>
                ) : (
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => handleEditClick(todo)}
                  >
                    <FiEdit />
                  </button>
                )}
                <button
                  className="icon-btn delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

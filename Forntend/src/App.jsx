import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "https://to-do-list-mern-2hci.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    axios.get(API_BASE + '/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.error("Error fetching todos: ", err));
  }

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    axios.post(API_BASE + '/todos/add', { description: newTodo })
      .then(res => {
        console.log(res.data);
        getTodos(); // Refresh list
        setNewTodo("");
      })
      .catch(err => console.error("Error adding todo: ", err));
  }

  const deleteTodo = (id) => {
    axios.delete(API_BASE + '/todos/' + id)
      .then(res => {
        console.log(res.data);
        getTodos(); // Refresh list
      })
      .catch(err => console.error("Error deleting todo: ", err));
  }

  const toggleCompleted = (id) => {
    const todoToUpdate = todos.find(todo => todo._id === id);
    if (!todoToUpdate) return;

    axios.post(API_BASE + '/todos/update/' + id, { 
        description: todoToUpdate.description,
        completed: !todoToUpdate.completed 
      })
      .then(res => {
        console.log(res.data);
        getTodos(); // Refresh list
      })
      .catch(err => console.error("Error updating todo: ", err));
  }

  const handleEditClick = (todo) => {
    setEditingTodoId(todo._id);
    setEditingTodoText(todo.description);
  }

  const handleSaveClick = (id) => {
    const todoToUpdate = todos.find(todo => todo._id === id);
    if (!todoToUpdate) return;

    axios.post(API_BASE + '/todos/update/' + id, { 
        description: editingTodoText,
        completed: todoToUpdate.completed
      })
      .then(res => {
        console.log(res.data);
        setEditingTodoId(null);
        setEditingTodoText("");
        getTodos(); // Refresh list
      })
      .catch(err => console.error("Error updating todo: ", err));
  }

  return (
    <div className="app">
      <div className="header">
        <h1>My To-Do List</h1>
      </div>

      <form className="form" onSubmit={addTodo}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          onChange={e => setNewTodo(e.target.value)}
          value={newTodo}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="todo-list">
        {todos.length > 0 ? todos.map(todo => (
          <div className={`todo-item ${todo.completed ? "completed" : ""}`} key={todo._id}>
            {editingTodoId === todo._id ? (
              <input 
                type="text"
                className="edit-input"
                value={editingTodoText}
                onChange={(e) => setEditingTodoText(e.target.value)}
              />
            ) : (
              <span className="todo-item-text" onClick={() => toggleCompleted(todo._id)}>
                {todo.description}
              </span>
            )}
            <div className="buttons-wrapper">
              {editingTodoId === todo._id ? (
                <button className="save-btn" onClick={() => handleSaveClick(todo._id)}>Save</button>
              ) : (
                <button className="edit-btn" onClick={() => handleEditClick(todo)}>Edit</button>
              )}
              <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>
                &#x2715;
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;
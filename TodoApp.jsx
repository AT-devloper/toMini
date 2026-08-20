import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoApp.css";

const API_URL = "http://localhost:8080/api";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingText, setEditingText] = useState("");

  // Notification state
  const [alert, setAlert] = useState(""); // store alert message

  useEffect(() => {
    fetchTodos();
  }, []);

  // Show alert temporarily
  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 2000); // hide after 2 seconds
  };

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/get`);
      setTodos(response.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!title.trim() || !todoText.trim()) return alert("Please fill both Title and Todo fields!");
    try {
      await axios.post(`${API_URL}/save`, { title, todo: todoText });
      setTitle("");
      setTodoText("");
      fetchTodos();
      showAlert("✅ Todo saved successfully!");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/del/${id}`);
      fetchTodos();
      showAlert("🗑️ Todo deleted successfully!");
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Filter todos
  const filterTodos = async () => {
    try {
      const response = await axios.post(`${API_URL}/filter`, null, { params: { title: filter } });
      setTodos(response.data);
    } catch (err) {
      console.error("Error filtering todos:", err);
    }
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingText(todo.todo);
  };

  // Save edited todo
  const saveEdit = async (id) => {
    if (!editingTitle.trim() || !editingText.trim()) return alert("Please fill both Title and Todo fields!");
    try {
      await axios.put(`${API_URL}/update`, { title: editingTitle, todo: editingText }, { params: { title: editingTitle } });
      setEditingId(null);
      setEditingTitle("");
      setEditingText("");
      fetchTodos();
      showAlert("✏️ Todo updated successfully!");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="app-background">
      <div className="todo-container">
        {/* Alert Message */}
        {alert && <div className="alert">{alert}</div>}

        <h1>✨ Todo Lister</h1>

        {/* Add Todo Section */}
        <div className="section-group add-todo-group">
          <input
            type="text"
            placeholder="What's the Todo title?"
            className="todo-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Add details..."
            className="todo-input"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
          />
          <button onClick={addTodo} disabled={!title.trim() || !todoText.trim()} className="button button-add">
            Create Todo
          </button>
        </div>

        {/* Filter Section */}
        <div className="section-group">
          <input
            type="text"
            placeholder="Search by title..."
            className="todo-input filter-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="filter-button-wrapper">
            <button onClick={filterTodos} className="button button-filter">
              Filter List
            </button>
          </div>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {todos.map((t, index) => (
            <li key={t.id} className="todo-item">
              {editingId === t.id ? (
                <div className="todo-editing">
                  <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="todo-input" />
                  <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} className="todo-input" />
                  {editingTitle !== t.title || editingText !== t.todo ? (
                    <div className="todo-buttons">
                      <button onClick={() => saveEdit(t.id)} className="button button-save">Save</button>
                      <button onClick={() => setEditingId(null)} className="button button-cancel">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingId(null)} className="button button-cancel">Cancel</button>
                  )}
                </div>
              ) : (
                <div className="todo-content">
                  <span className="todo-index">#{index + 1}</span>
                  <div className="todo-text">
                    <strong>{t.title}</strong>
                    <p>{t.todo}</p>
                  </div>
                  <div className="todo-buttons">
                    <button onClick={() => startEditing(t)} className="button button-edit">Edit</button>
                    <button onClick={() => deleteTodo(t.id)} className="button button-delete">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

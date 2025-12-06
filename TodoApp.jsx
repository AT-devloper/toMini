import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoApp.css";

const API_URL = "http://localhost:8080/api";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/get`);
      setTodos(response.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!title.trim() || !todoText.trim()) {
      return alert("Please fill both Title and Todo fields!");
    }
    try {
      await axios.post(
        `${API_URL}/save`,
        { title, todo: todoText },
        { headers: { "Content-Type": "application/json" } }
      );
      setTitle("");
      setTodoText("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/del/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const filterTodos = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/filter`,
        null,
        { params: { title: filter } }
      );
      setTodos(response.data);
    } catch (err) {
      console.error("Error filtering todos:", err);
    }
  };

  return (
    <div className="app-background">
      <div className="todo-container">
        <h1>✨ Todo Lister </h1>

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
          <button
            onClick={addTodo}
            disabled={!title.trim() || !todoText.trim()}
            className="button button-add"
          >
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
            <button
              onClick={filterTodos}
              className="button button-filter"
            >
              Filter List
            </button>
          </div>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {todos.map((t, index) => (
            <li key={t.id} className="todo-item">
              <div className="todo-content">
                <span className="todo-index">#{index + 1}</span>
                <div className="todo-text">
                  <strong>{t.title}</strong>
                  <p>{t.todo}</p>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(t.id)}
                className="button button-delete"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Spring Boot backend

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("");

  // Fetch all todos from backend
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

 // Add a new todo
const addTodo = async () => {
  if (!title.trim() || !todoText.trim()) {
    alert("Please fill both Title and Todo fields!");
    return;
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


  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/del/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Filter todos by title
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
   <div
  style={{
    maxWidth: "600px",
    margin: "50px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    backgroundColor: "#fdfdfd",
    fontFamily: "Arial, sans-serif"
  }}
>
  <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Todo App</h1>

  {/* Add Todo */}
  <div style={{ marginBottom: "25px" }}>
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      style={{
        width: "95%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
    />
    <input
      type="text"
      placeholder="Todo"
      value={todoText}
      onChange={(e) => setTodoText(e.target.value)}
      style={{
        width: "95%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
    />
    <button
  onClick={addTodo}
  disabled={!title.trim() || !todoText.trim()}
  style={{
    width: "99%",
    padding: "12px",
    backgroundColor: !title.trim() || !todoText.trim() ? "#9e9e9e" : "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: !title.trim() || !todoText.trim() ? "not-allowed" : "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  }}
  onMouseEnter={(e) => {
    if (title.trim() && todoText.trim()) e.target.style.backgroundColor = "#45a049";
  }}
  onMouseLeave={(e) => {
    if (title.trim() && todoText.trim()) e.target.style.backgroundColor = "#4CAF50";
  }}
>
  Add Todo
</button>

  </div>

  {/* Filter */}
  <div style={{ marginBottom: "25px" }}>
    <input
      type="text"
      placeholder="Filter by title"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      style={{
        width: "95%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#2196F3")}
      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
    />
    <button
      onClick={filterTodos}
      style={{
        width: "99%",
        padding: "12px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#1976d2")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#2196F3")}
    >
      Filter
    </button>
  </div>

  {/* Todo List */}
<ul style={{ listStyle: "none", padding: 0 }}>
  {todos.map((t, index) => (
    <li
      key={t.id}
      style={{
        marginBottom: "12px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)")}
    >
      <span>
        <strong>{index + 1}. {t.title}:</strong> {t.todo}
      </span>
      <button
        onClick={() => deleteTodo(t.id)}
        style={{
          marginLeft: "10px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
      >
        Delete
      </button>
    </li>
  ))}
</ul>
</div>

  );
}

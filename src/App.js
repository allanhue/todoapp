import React, { useState, useEffect } from 'react';  
import './App.css';

function App() {
  // State to manage the input field
  const [task, setTask] = useState('');
  // State to manage the list of tasks
  const [tasks, setTasks] = useState([]);

  // Function to handle input change
  const handleInputChange = (event) => {
    setTask(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    if (!task.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    try {
      // Send a POST request to the backend
      const response = await fetch('http://localhost:5000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: task, description: '' }), // Add description if needed
      });

      if (response.ok) {
        const newTask = await response.json(); // Get the newly added task from the backend
        setTasks([...tasks, newTask]); // Update the tasks state
        setTask(''); // Clear the input field
        alert('Task added successfully!');
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the task');
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks/');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTasks();
  }, []);  // Empty dependency array to run this only once on mount

  return (
    <div className="App" id="main">
      <header className="text-2xl font-bold">TODO APP</header>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add your task here"
          className="border p-2 rounded"
          value={task}
          onChange={handleInputChange}
        />
        <br />
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-700 text-white p-2 rounded mt-2"
        >
          Save changes
        </button>
      </form>

      {/* Display the list of tasks */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="mt-2">
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

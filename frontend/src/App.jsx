import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
    .then((res) => res.json())
    .then(setTasks)
  }, []);

  const itemHinzufuegen = () => {

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title}),
    })      

      .then((res) => res.json())
      .then((neueAufgabe) => setTasks([...tasks, neueAufgabe]))

    setTitle("");
  }
  
  const itemLoeschen = (id_nummer) => {

    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })

      .then(() => { setTasks(tasks.filter(task => task.id !== id_nummer)); })

  }

  const toggleCompleted = (id_nummer, currentCompleted) => {

    fetch(`http://localhost:3050/update/${id_nummer}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ completed: !currentCompleted }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {setTasks(tasks.map((task) => task.id === id_nummer ? updatedTask : task));});
  };


  return (
    <>
      <h1>To-Do List</h1>
      <input className="task-input" value={title}  onChange={(e)=>setTitle(e.target.value)} />
      <button className="add-button" disabled={!title.trim()} onClick={itemHinzufuegen}>+</button>

      <ul>
        {
        tasks.map(({id, title, completed}) => (
          <li className="list-item" key={id}>
            <input className="checkbox" type="checkbox" checked={completed} on onChange={() => toggleCompleted(id, completed)} />
            <span className="task-title">{title}</span>
            <button className="delete-button" onClick={() => itemLoeschen(id)}>-</button>
          </li>
        ))
        }
      </ul>
    </>
  )
}

export default App
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
  const [course, setCourse] = useState('');
  const [progress, setProgress] = useState('');
  const [activityType, setActivityType] = useState('Theory'); // New state for activity type
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/progress')
      .then(response => response.json())
      .then(data => setProgressList(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ course, progress: Number(progress), activityType }) // Include activity type
    })
      .then(response => response.json())
      .then(data => {
        setProgressList([...progressList, data]);
        setCourse('');
        setProgress('');
      });
  };

  const data = {
    labels: progressList.map(item => item.date), // Use dates from your data
    datasets: [
      {
        label: 'Theory',
        data: progressList.filter(item => item.activityType === 'Theory').map(item => item.progress),
        borderColor: 'orange',
        fill: false,
      },
      {
        label: 'Practice',
        data: progressList.filter(item => item.activityType === 'Practice').map(item => item.progress),
        borderColor: 'blue',
        fill: false,
      }
    ],
  };

  return (
    <div className="App">
      <h1>Suivi de Progression des Cours</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du cours"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <input
          type="number"
          placeholder="Progression (%)"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
        >
          <option value="Theory">Theory</option>
          <option value="Practice">Practice</option>
        </select>
        <button type="submit">Ajouter Progression</button>
      </form>
      <Line data={data} />
    </div>
  );
}

export default App;

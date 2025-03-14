const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg')
require('dotenv').config()

const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.use(cors());                // Middleware
app.use(bodyParser.json());     // Middleware (wie ein Übersetzer)

app.post('/add', async (req, res) => {
    const result = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed',
         [req.body.title]
        );
    res.json(result.rows[0]);
});

app.get('/liste_abrufen', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM tasks'
    );
    res.json(result.rows);
});


app.delete('/delete/:id', async (req, res) => {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1',
         [req.params.id]
        );
    res.json({message: "Eingabe gelöscht"});
})

app.patch('/update/:id', async (req,res) => {
    console.log()
    const result = await pool.query(
        'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
         [req.body.completed, req.params.id]
        );
        console.log(result.rows[0])
        res.json(result.rows[0]);
});


app.listen(3050, "localhost", () => {
    console.log(`Server läuft unter http://localhost:3050`);
});
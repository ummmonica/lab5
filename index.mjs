import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

// setting up database connection pool
const pool = mysql.createPool({
    host: "y5s2h87f6ur56vae.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "x961annv2rwlrope",
    password: "yziygibqpk3q352o",
    database: "c5dhod81zi9fvecy",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', (req, res) => {
   res.render('index')
});

// just for testing connection in the beginning
app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

// index.ejs route for searching by keyword
app.get('/searchByKeyword', async (req, res) => {
    let userKeyword = req.query.keyword;
    let sql = 
        `SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE quote LIKE '%${userKeyword}%'`;
    const [rows] = await pool.query(sql);
    res.send(rows);
});

app.listen(3000, ()=>{
    console.log("Express server running");
});
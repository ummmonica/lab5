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

//routes !!!!
app.get('/', async (req, res) => {

    // searching by author (pulled from database)
    let authorsSql = `
        SELECT authorId, firstName, lastName
        FROM q_authors
        ORDER BY lastName`;
    const [authors] = await pool.query(authorsSql);

    // showing categories
    let categoriesSql = `
        SELECT DISTINCT category
        FROM q_quotes
        ORDER BY category`;
    const [categories] = await pool.query(categoriesSql);

    res.render("index",{
        authors: authors,
        categories: categories
    });
});

// // just for testing connection in the beginning
// app.get("/dbTest", async(req, res) => {
//    try {
//         const [rows] = await pool.query("SELECT CURDATE()");
//         res.send(rows);
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).send("Database error");
//     }
// });

// searching by keyword
app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `
        SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

// searching by author
app.get('/searchByAuthor', async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `
        SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE authorId = ?`;
    let sqlParams = [authorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

// route to get author info once name is clicked
app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `
        SELECT *
        FROM q_authors 
        WHERE authorId = ?`;
    
    // this section allows for display of results
    const [rows] = await pool.query(sql, [authorId]);
    res.json(rows);
});

// launch results based on category (alphabetical order)
app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;
    let sql = `
        SELECT authorId, firstName, lastName, quote, category
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE category = ?
        ORDER BY quote`;

    // this section allows for display of results
    let sqlParams = [category];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

// route to search by likes
app.get ('/searchByLikes', async (req, res) => {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;
    let sql = `
        SELECT quote, firstName, lastName, likes
        FROM q_authors 
        INNER JOIN q_quotes on q_authors.authorId = q_quotes.authorId
        WHERE likes BETWEEN ? and ?
        ORDER BY likes DESC`;

    // this section allows for display of results
    let sqlParams = [minLikes, maxLikes];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});


app.listen(3000, ()=>{
    console.log("Express server running");
});
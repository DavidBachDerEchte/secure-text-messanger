const express = require('./node_modules/express/index.js');
const mysql = require('./node_modules/mysql2/index.js');

const app = express();
const port = 3000;

// Middleware zum Parsen von JSON-Anfragen
app.use(express.json());

// Verbindung zur MySQL-Datenbank herstellen
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Dein MySQL-Benutzername
    password: 'STMDevSQL', // Dein MySQL-Passwort
    database: 'SecureTextMessager' // Name deiner Datenbank
});

// Verbindung zur Datenbank herstellen
connection.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// POST-Route zum Erstellen eines Benutzers
app.post('/createUser', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send({ error: 'Username is required' });
    }

    // Überprüfen, ob der Benutzername bereits in der Datenbank vorhanden ist
    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
    connection.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        if (results.length > 0) {
            // Benutzername bereits vorhanden, entsprechend behandeln
            return res.status(409).send({ message: 'User already exists' });
        } else {
            // Benutzername existiert nicht, einen neuen Eintrag erstellen
            const insertUserQuery = `INSERT INTO users (username) VALUES (?)`;

            connection.query(insertUserQuery, [username], (err, results) => {
                if (err) {
                    return res.status(500).send({ error: 'Error creating user' });
                }

                return res.status(201).send({ message: 'User created successfully' });
            });
        }
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

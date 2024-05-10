const express = require('./node_modules/express/index.js');
const mysql = require('mysql2');
const { json, urlencoded } = require('./node_modules/express/index.js');
const bodyParser = require("./node_modules/body-parser/index.js");

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'STMDevSQL',
    database: 'Chats'
});

let Chatcode = "28CR84";


app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

app.get('/getUsernames', (req, res) => {
    const getUsersQuery = `show TABLES;`;
    connection.query(getUsersQuery, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        if (results) {
            return res.send({message: "Users fetched successfully", users: results});
        }
    });
});

app.post('/insert', (req, res) => {
    let rightusername = JSON.stringify(req.body.username);
    let Inputchatcode = req.body.chatcode;

    if (rightusername === '') {
        return res.status(400).send({ error: 'Username is required' });
    }

    const checkUserQuery = `select * from ${Inputchatcode} where username = ?;`;
    connection.query(checkUserQuery, rightusername, (err, newresults) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        if (newresults.length > 0) {
            return res.send({ message: 'User already exists' });
        }

        const insertUserQuery = `INSERT INTO ${Inputchatcode} (username, messagesender, message, publicKey) VALUES ('${rightusername}', '', '', '');`;
        connection.query(insertUserQuery, rightusername, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Error creating user' });
            }
            return res.send({ message: 'User created successfully' });
        });
    });
});

app.post('/createChat', (req, res) => {
    let rightuser = JSON.stringify(req.body.username);

    let newChatcode = '';
    let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let a = 0; a < 6; a++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        newChatcode += characters.charAt(randomIndex);
    }

    if (rightuser === '') {
        return res.status(400).send({ error: 'Username is required' });
    }

    const checkTables = `show TABLES`;
    connection.query(checkTables, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        // Check if newChatcode exists
        const tableExists = results.some(result => result.Tables_in_Chats === newChatcode);

        if (tableExists) {
            return res.send({ message: 'Table already exists' });
        }

        const createTableQuery = `CREATE TABLE ${newChatcode} (username varchar(255), messagesender varchar(255), message varchar(2048), publicKey varchar(2048))`;
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            const newTableUsernameInput = `INSERT INTO ${newChatcode} (username, messagesender, message, publicKey) VALUES ('${rightuser}', '', '', '');`;
            connection.query(newTableUsernameInput, (err, results) => {
                if (err) {
                    return res.status(500).send({ error: 'Database error' });
                }
                return res.send({ code: `${newChatcode}` });
            })
        });
    });
});

app.post('/sendMessage', (req, res) => {
    let rightusername = JSON.stringify(req.body.sender);
    let rightmessage = JSON.stringify(req.body.message);
    let Inputchatcode = req.body.chatcode;

    if (rightusername === '') {
        return res.status(400).send({ error: 'Username is required' });
    }

    if (rightmessage === '') {
        return res.status(400).send({ error: 'Message is required' });
    }

    if (!Inputchatcode) {
        return res.status(400).json({ error: 'Chat code is required' });
    }

    // Insert message into database
    const insertQuery = `INSERT INTO ${Inputchatcode} (username, messagesender, message, publicKey) VALUES (?, ?, ?, ?)`;
    connection.query(insertQuery, ['', rightusername, rightmessage, ''], (err, results) => {
        if (err) {
            console.error('Error inserting message into database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ success: true });
    });
});

app.post('/getChatHistory', (req, res) => {
    let Inputchatcode = req.body.chatcode;

    if (!Inputchatcode) {
        return res.status(400).json({ error: 'Chat code is required' });
    }

    const selectQuery = `SELECT * FROM ${Inputchatcode}`;
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error selecting messages from database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.json({ results });
    });
})

app.post('/sendPublicKeys', (req, res) => {
    let Inputchatcode = req.body.chatcode;
    let username = req.body.username;
    let publickey = req.body.publicKeys;



    if (!Inputchatcode) {
        return res.status(400).json({ error: 'Chat code is required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    if (!publickey) {
        return res.status(400).json({ error: 'Public key is required' });
    }

    const insertQuery = `INSERT INTO ${Inputchatcode} (username, messagesender, message, publicKey) VALUES (?, ?, ?, ?)`;
    connection.query(insertQuery, [username, '', '', publickey], (err, results) => {
        if (err) {
            console.error('Error inserting public key into database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ results });
    })
})

app.post('/getPublicKeys', (req, res) => {
    let Inputchatcode = req.body.chatcode;
    let username = req.body.username;

    if (!Inputchatcode) {
        return res.status(400).json({ error: 'Chat code is required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const selectQuery = `SELECT username, publicKey FROM ${Inputchatcode} WHERE username = ?`;
    connection.query(selectQuery, [username], (err, results) => {
        if (err) {
            console.error('Error selecting public key from database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ results });
    })
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

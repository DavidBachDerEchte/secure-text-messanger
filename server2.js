const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto'); // Import crypto module
const {urlencoded} = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const {fix} = require("nodemailer-smtp-transport/.eslintrc");


const app = express();
const port = 3000;

// Encryption and decryption keys (should be securely stored in production)
const encryptionKey = process.env.ENCRYPT_KEY;
const key = crypto.createHash('sha256').update(String(encryptionKey)).digest('base64').substr(0, 32);

const loginEncryptionKey = process.env.LOGIN_ENCRYPT_KEY;
const loginKey = crypto.createHash('sha256').update(String(loginEncryptionKey)).digest('base64').substr(0, 32);

const rememberEncryptionKey = process.env.REMEMBER_ENCRYPT_KEY;
const rememberKey = crypto.createHash('sha256').update(String(rememberEncryptionKey)).digest('base64').substr(0, 32);

const connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
});

const transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
}));
app.use(bodyParser.json());
app.use(urlencoded({extended: true}));

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// Handle encryption
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

// Handle decryption
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


// Handle encryption
function loginencrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(loginKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

// Handle decryption
function logindecrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(loginKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Handle encryption
function rememberencrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(rememberKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

// Handle decryption
function rememberdecrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(rememberKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

process.on("exit", function () {
    console.log("Exiting...");

    // Restart the Node.js process
    require("child_process").spawn(process.argv[0], process.argv.slice(1), {
        detached: true,
        stdio: "inherit"
    });
});

setTimeout(() => {
    process.exit();
}, 720000);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// Route to insert a new user
app.post('/joinChat', (req, res) => {
    const {chatcode, UserID} = req.body;

    if (!UserID) {
        return res.status(400).json({error: 'UserID is required'});
    }

    if (!chatcode) {
        return res.status(400).json({error: 'Chatcode is required'});
    }


    const checkUserQuery = `SELECT *
                            FROM Usernames;`;
    connection.query(checkUserQuery, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({error: 'Database error'});
        }

        if (results.userID === UserID && results.chatID === chatcode) {
            return res.json({message: 'User already exists'});
        }

        const insertUserQuery = `UPDATE Usernames
                                 SET chatID = '${chatcode}'
                                 WHERE userID = \`${UserID}\`;`;
        connection.query(insertUserQuery, (err) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({error: 'Error creating user'});
            }

            const getUserQuery = `SELECT usernames
                                  FROM Usernames
                                  WHERE userID = \`${UserID}\`;`;
            connection.query(getUserQuery, (err, results) => {
                if (err) {
                    console.error('Error getting user:', err);
                    return res.status(500).json({error: 'Error getting user'});
                }

                let Usernamearray = JSON.parse(results[0].usernames)
                let returnedUsername = decrypt(Usernamearray);

                return res.json({message: 'User created successfully', username: returnedUsername});
            })
        });
    });
});

// Route to create a new chat
app.post('/createChat', (req, res) => {
    let UserID = req.body.UserID;
    let newChatcode = '';
    let characters = '0123456789ABCDEFGHIJKLMN OPQRSTUVWXYZ';

    for (let a = 0; a < 6; a++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        newChatcode += characters.charAt(randomIndex);
    }

    const checkTablesForCreate = `SHOW TABLES;`;
    connection.query(checkTablesForCreate, (err, results) => {
        if (err) {
            return res.status(500).send({error: 'Database not found'});
        }

        // Check if newChatcode exists
        const tableExists = results.some(result => result.Tables_in_david_db === newChatcode);

        if (tableExists) {
            return res.send({message: 'Table already exists'});
        }

        const createTableQuery = `CREATE TABLE ${newChatcode}
                                  (
                                      messagesender varchar(2048),
                                      message       varchar(2048)
                                  )`;
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                return res.status(500).send({error: 'Error creating Table'});
            }

            const createUserQuery = `UPDATE Usernames
                                     SET chatID = '${newChatcode}'
                                     WHERE userID = \`${UserID}\`;`;
            connection.query(createUserQuery, (err) => {
                if (err) {
                    return res.status(500).json({error: 'Error updating user'});
                }

                const getUsernamesQuery = `SELECT usernames
                                           FROM Usernames
                                           WHERE userID = \`${UserID}\`;`;
                connection.query(getUsernamesQuery, (err, results) => {
                    if (err) {
                        return res.status(500).json({error: 'Error getting usernames'});
                    }


                    let Usernamearray = JSON.parse(results[0].usernames);
                    let returnedUsername = decrypt(Usernamearray);

                    return res.send({code: `${newChatcode}`, usernames: returnedUsername});
                })
            })

        });
    });
});

// Route to send a message
app.post('/sendMessage', (req, res) => {
    let userID = req.body.userID;
    let encryptedMessage = encrypt(req.body.message);
    let Inputchatcode = req.body.chatcode;

    if (!userID) {
        return res.status(400).send({error: 'userID is required'});
    }

    if (!encryptedMessage) {
        return res.status(400).send({error: 'Message is required'});
    }

    if (!Inputchatcode) {
        return res.status(400).json({error: 'Chat code is required'});
    }

    const getUsernameQuery = `SELECT usernames
                              FROM Usernames
                              WHERE userID = \`${userID}\`;`;
    connection.query(getUsernameQuery, (err, results) => {
        if (err) {
            console.error('Error getting username:', err);
            return res.status(500).json({error: 'Database error'});
        }

        // Insert message into database
        const insertQuery = `INSERT INTO ${Inputchatcode} (messagesender, message)
                             VALUES ('${results}', '${JSON.stringify((encryptedMessage))}');`;
        connection.query(insertQuery, (err, results) => {
            if (err) {
                console.error('Error inserting message into database:', err);
                return res.status(500).json({error: 'Database error'});
            }
            return res.json({success: true});
        });
    })


});

// Route to get chat history
app.post('/getChatHistory', (req, res) => {
    let inputChatcode = req.body.chatcode;

    if (!inputChatcode) {
        return res.status(400).json({error: 'Chat code is required'});
    }

    const selectQuery = `SELECT *
                         FROM ${inputChatcode}`;
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error selecting messages from database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        let decryptedMessages = [];
        let sendBack;

        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            let decryptedMessageSender = result.messagesender;
            let decryptedMessage = result.message;


            if (i === results.length - 1) {
                sendBack = true;
            }

            // Check if both messagesender and message are empty, if so, skip this entry
            if (decryptedMessageSender === '' && decryptedMessage === '') {
                continue;
            }

            let senderarray = JSON.parse(decryptedMessageSender);
            let messagearray = JSON.parse(decryptedMessage);
            // Check if the decryptedMessageSender and decryptedMessage are not undefined or null
            if (decryptedMessageSender && decryptedMessage) {
                let sender = decrypt(senderarray);
                let message = decrypt(messagearray);
                console.log(`Sender: ${sender}, Message: ${message}`);
                decryptedMessages.push({sender: sender, message: message});
                console.log(decryptedMessages);

            } else {
                // Handle the case where either decryptedMessageSender or decryptedMessage is missing
                console.error('Invalid data retrieved from the database:', result);
                // You may choose to handle this differently, like logging an error or skipping this message
            }
        }

        if (sendBack === true) {
            return res.json({messages: decryptedMessages});
        }
    });
});

app.post('/createLogin', (req, res) => {
    let email = req.body.email;
    let username = encrypt(req.body.username);
    let password = req.body.password;
    const emailPattern = /^(?:(?:(?:\w+[+.-]?)*\w+)@(?:\w+([.-]?\w+)*\w+)\.\w{2,})$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./]).{10,}$/;

    let stop = false;

    if (!passwordPattern.test(password)) {
        console.log("Doesn't fit the requirements");
        return res.json({error: "Doesn't fit the requirements"});
    } else {
        password = loginencrypt(password);
    }

    if (!emailPattern.test(email)) {
        console.log("Doesn't fit the requirements");
        return res.json({error: "Doesn't fit the requirements"});
    } else {
        const checkUserQuery = `SELECT *
                                FROM Usernames;`;
        connection.query(checkUserQuery, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({error: 'Database error'});
            }

            for (let i = 0; i < results.length; i++) {
                if (decrypt(JSON.parse(results[i].emails)) === req.body.email) {
                    stop = true;
                    results = ["exists"];
                    return res.json({error: 'Email already exists'});
                }
            }

            if (!results.includes("exists")) {
                email = encrypt(email);

                let newUserID = '';
                let characters = '123456789';

                for (let a = 0; a < 6; a++) {
                    let randomIndex = Math.floor(Math.random() * characters.length);
                    newUserID += characters.charAt(randomIndex);
                }

                if (!email) {
                    return res.status(400).json({error: 'Email is required'});
                }

                if (!username) {
                    return res.status(400).json({error: 'Username is required'});
                }

                if (!password) {
                    return res.status(400).json({error: 'Password is required'});
                }


                // Insert message into database
                const loginQuery = `INSERT INTO Usernames (usernames, chatID, passwords, userID, emails, resetCode)
                                    VALUES ('${JSON.stringify(username)}', '', '${JSON.stringify((password))}',
                                            '${newUserID}',
                                            '${JSON.stringify(email)}', '');`;
                connection.query(loginQuery, (err, results) => {
                    if (err) {
                        console.error('Error inserting message into database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }

                    const createUserTable = `CREATE TABLE \`${newUserID}\`
                                             (
                                                 friendsID       VARCHAR(8),
                                                 friendsUsername VARCHAR(255),
                                                 username        VARCHAR(255),
                                                 friendsStatus   VARCHAR(255)
                                             );`
                    connection.query(createUserTable, (err, results) => {
                        if (err) {
                            console.error('Error creating user table:', err);
                            return res.status(500).json({error: 'Database error'});
                        }

                        const insertIntoUserTable = `INSERT INTO \`${newUserID}\` (friendsID, friendsUsername, username, friendsStatus)
                                                     VALUES ('', '', '${JSON.stringify(username)}', '');`
                        connection.query(insertIntoUserTable, (err, results) => {
                            if (err) {
                                console.error('Error inserting into user table:', err);
                                return res.status(500).json({error: 'Database error'});
                            }

                            return res.json({success: true, UserID: newUserID});
                        })

                    })

                });
            }
        });
    }
})

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let remember = req.body.remember;
    const emailPattern = /^(?:(?:(?:\w+[+.-]?)*\w+)@(?:\w+([.-]?\w+)*\w+)\.\w{2,})$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./]).{10,}$/;

    if (!emailPattern.test(email)) {
        return res.json({error: "Doesn't fit the requirements"});
    }

    if (!passwordPattern.test(password)) {
        return res.json({error: "Doesn't fit the requirements"});
    }

    if (!email) {
        return res.json({error: 'Email is required'});
    }

    if (!password) {
        return res.json({error: 'Password is required'});
    }

    const loginQuery = 'SELECT * FROM Usernames';

    connection.query(loginQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        let count = 0;
        for (let i = 0; i < results.length; i++) {
            let decryptedEmail = decrypt(JSON.parse(results[i].emails));
            let decryptedPassword = logindecrypt(JSON.parse(results[i].passwords));
            count++;

            if (remember) {
                let encryptedEmailRemember = JSON.stringify(rememberencrypt(decryptedEmail));
                let encryptedPasswordRemember = JSON.stringify(rememberencrypt(decryptedPassword));

                if (email === decryptedEmail && password === decryptedPassword) {
                    return res.json({
                        success: true,
                        UserID: results[i].userID,
                        rememberEmail: encryptedEmailRemember,
                        rememberPassword: encryptedPasswordRemember
                    });
                }
                if (count === results.length) {
                    if (email !== decryptedEmail) {
                        return res.json({error: "Email Doesn't fit the requirements"});
                    }
                    if (password !== decryptedPassword) {
                        return res.json({error: "Password Doesn't fit the requirements"});
                    }
                }
            }

            if (email === decryptedEmail && password === decryptedPassword) {
                return res.json({success: true, UserID: results[i].userID});
            }

            if (count === results.length) {
                if (email !== decryptedEmail) {
                    return res.json({error: "Email Doesn't fit the requirements"});
                }
                if (password !== decryptedPassword) {
                    return res.json({error: "Password Doesn't fit the requirements"});
                }
            }
        }
    });

});

app.post('/rememberLogin', (req, res) => {
    let rememberEmail = JSON.parse(req.body.rememberEmail);
    let rememberPassword = JSON.parse(req.body.rememberPassword);

    rememberEmail = rememberdecrypt(rememberEmail);
    rememberPassword = rememberdecrypt(rememberPassword);

    const rememberloginQuery = 'SELECT * FROM Usernames';
    connection.query(rememberloginQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({error: 'Database error'});
        }


        for (let i = 0; i < results.length; i++) {
            let decryptedEmail = decrypt(JSON.parse(results[i].emails));
            let decryptedPassword = logindecrypt(JSON.parse(results[i].passwords));


            if (rememberEmail === decryptedEmail && rememberPassword === decryptedPassword) {
                return res.json({success: true, UserID: results[i].userID});
            } else {
                return res.json({success: 'Invalid Email or password'});
            }
        }
    })
})

app.post('/resetPassword', (req, res) => {
    let Password = req.body.password;
    let resetCode = req.body.resetCode;

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./]).{10,}$/;
    const resetCodePattern = /^\d{8}$/;


    if (!passwordPattern.test(Password)) {
        return res.json({error: "New Password Doesn't fit the requirements"});
    }

    if (!resetCodePattern.test(resetCode)) {
        return res.json({error: "Reset Code Doesn't fit the requirements"});
    }

    if (!Password) {
        return res.json({error: 'New Password is required'});
    }

    if (!resetCode) {
        return res.json({error: 'Reset Code is required'});
    }

    const getEverythingQuery = `SELECT *
                                FROM Usernames
                                WHERE userID = \`${req.body.userID}\``;
    connection.query(getEverythingQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            let resetCodeDB = results[i].resetCode;
            let PasswordDB = logindecrypt(JSON.parse(results[i].passwords));

            if (resetCode !== resetCodeDB) {
                return res.json({error: 'Invalid Reset Code'});
            }

            if (Password === PasswordDB) {
                return res.json({error: 'You cannot use the same password as the old one'});
            }


            if (resetCode === resetCodeDB) {
                const updatePasswordQuery = `UPDATE Usernames
                                             SET passwords = ?,
                                                 resetCode = ?
                                             WHERE resetCode = '${resetCode}'`;
                connection.query(updatePasswordQuery, [JSON.stringify(loginencrypt(Password)), ''], (err) => {
                    if (err) {
                        console.error('Error updating the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }

                    return res.json({success: true});
                });
                break;
            }
        }
    });
});

app.post('/getUserData', (req, res) => {
    let userID = req.body.userID;

    if (!userID) {
        return res.json({error: 'User ID is required'});
    }

    const getUserDataQuery = `SELECT *
                              FROM \`${userID}\``;
    connection.query(getUserDataQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            let decryptedUser = decrypt(JSON.parse(results[i].username));
            return res.json({username: decryptedUser});
        }

    })
})

app.post('/sendResetCode', (req, res) => {
    let email = req.body.email;
    const emailPattern = /^(?:(?:(?:\w+[+.-]?)*\w+)@(?:\w+([.-]?\w+)*\w+)\.\w{2,})$/;

    let passwordResetCode = '';
    let characters = '0123456789';

    for (let a = 0; a < 8; a++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        passwordResetCode += characters.charAt(randomIndex);
    }

    if (!email) {
        return res.json({error: 'Email is required'});
    }

    if (!emailPattern.test(email)) {
        return res.json({error: "Email Doesn't fit the requirements"});
    }

    const getEmailAndAccountQuery = 'SELECT * FROM Usernames';
    connection.query(getEmailAndAccountQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({error: 'Database error'});
        }


        for (let i = 0; i < results.length; i++) {
            let decryptedEmail = decrypt(JSON.parse(results[i].emails));
            let username = decrypt(JSON.parse(results[i].usernames));
            if (email !== decryptedEmail) {
                return res.json({error: 'Invalid Email'});
            } else {

                const setResetCodeQuery = `UPDATE Usernames
                                           SET resetCode = '${passwordResetCode}'
                                           WHERE userID = \`${results[i].userID}\``;
                connection.query(setResetCodeQuery, (err) => {
                    if (err) {
                        console.error('Error updating the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }


                    const mailOptions = {
                        from: `Secure Text Messenger <kontakt@davidbach.eu>`,
                        to: email,
                        subject: 'Password Reset',
                        html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Password Reset</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                    color: #333333;
                                }
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background-color: #007bff;
                                    color: #ffffff;
                                    padding: 20px;
                                    text-align: center;
                                    font-size: 24px;
                                }
                                .content {
                                    padding: 20px;
                                }
                                .footer {
                                    background-color: #f4f4f4;
                                    text-align: center;
                                    padding: 10px;
                                    font-size: 12px;
                                    color: #777777;
                                }
                                .code {
                                    display: inline-block;
                                    background-color: #f0f0f0;
                                    padding: 10px 20px;
                                    margin: 20px 0;
                                    font-size: 20px;
                                    letter-spacing: 2px;
                                    color: #333333;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    Secure Password Messager
                                </div>
                                <div class="content">
                                    <p>Dear ${username},</p>
                                    <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                                    <div class="code">${passwordResetCode}</div>
                                    <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                                </div>
                                <div class="footer">© 2023 - 2024 David Bach. All rights reserved.</div>
                            </div>
                        </body>
                        </html>`
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.json({error: 'Error sending email'});
                        } else {
                            return res.json({success: true, userID: results[i].userID});
                        }
                    })
                })
            }
        }
    })
})

app.post('/addFriend', (req, res) => {
    let myuserID = req.body.myuserID;
    let friendID = req.body.friendIDinput;

    const friendIDPattern = /^[^\W_]+#(?:[1-9]{6})$/;

    if (!friendIDPattern.test(friendID)) {
        return res.json({error: 'Invalid Friend ID'});
    }

    let splitInput = friendID.split('#');
    let friendUsername = splitInput[0];
    let friendIDCode = splitInput[1];

    if (!myuserID) {
        return res.json({error: 'Invalid UserID'});
    }

    if (!friendID) {
        return res.json({error: 'Invalid Friend UserID'});
    }


    const getFriendfromMyTable = `SELECT *
                                  FROM \`${myuserID}\`;`;
    connection.query(getFriendfromMyTable, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            if (results[i].friendsID === friendIDCode) {
                return res.json({error: 'Friend already added'});
            } else {
                if (results[i].friendsID !== friendIDCode) {
                    const getFriendIDQuery = `SELECT *
                                              FROM Usernames;`;
                    connection.query(getFriendIDQuery, (err, results) => {
                        if (err) {
                            console.error('Error getting the database:', err);
                            return res.status(500).json({error: 'Database error'});
                        }

                        for (let i = 0; i < results.length; i++) {
                            if (results[i].userID === friendIDCode) {
                                if (decrypt(JSON.parse(results[i].usernames)) === friendUsername) {
                                    let friendEmail = decrypt(JSON.parse(results[i].emails));
                                    let senderusername = decrypt(JSON.parse(results[i].usernames));
                                    const friendStatus = 'Pending';
                                    let confirmationlink = `http://localhost:63342/secure-text-messanger-dev-node/html/getInfoViaUrl.html/?userID=${encodeURIComponent(myuserID)}&friendID=${encodeURIComponent(friendIDCode)}&senderusername=${encodeURIComponent(senderusername)}`
                                    const addFriendQuery = `INSERT INTO \`${myuserID}\` (friendsID, friendsUsername, username, friendsStatus)
                                                            VALUES (${friendIDCode},
                                                                    '${JSON.stringify(encrypt(friendUsername))}', '',
                                                                    'Pending');`;
                                    connection.query(addFriendQuery, (err, results) => {
                                        if (err) {
                                            console.error('Error adding friend:', err);
                                            return res.status(500).json({error: 'Database error'});
                                        }
                                    })

                                    const mailOptions = {
                                        from: `Secure Text Messenger <kontakt@davidbach.eu>`,
                                        to: friendEmail,
                                        subject: 'Friend Request',
                                        html: `
                                            <!DOCTYPE html>
                                            <html lang="en">
                                            <head>
                                                <meta charset="UTF-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                <title>Friend Request</title>
                                                <style>
                                                    body {
                                                        font-family: Arial, sans-serif;
                                                        background-color: #f4f4f4;
                                                        margin: 0;
                                                        padding: 0;
                                                        color: #333333;
                                                    }
                                                    .container {
                                                        width: 100%;
                                                        max-width: 600px;
                                                        margin: 0 auto;
                                                        background-color: #ffffff;
                                                        border-radius: 8px;
                                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                                        overflow: hidden;
                                                    }
                                                    .header {
                                                        background-color: #007bff;
                                                        color: #ffffff;
                                                        padding: 20px;
                                                        text-align: center;
                                                        font-size: 24px;
                                                    }
                                                    .content {
                                                        padding: 20px;
                                                    }
                                                    .footer {
                                                        background-color: #f4f4f4;
                                                        text-align: center;
                                                        padding: 10px;
                                                        font-size: 12px;
                                                        color: #777777;
                                                    }
                                                    .button {
                                                        background-color: #007bff;
                                                        color: #ffffff !important;
                                                        padding: 10px 20px;
                                                        border: none;
                                                        border-radius: 5px;
                                                        cursor: pointer;
                                                    }
                                                    a {
                                                        text-decoration: none;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="container">
                                                    <div class="header">
                                                        Friend Request
                                                    </div>
                                                    <div class="content">
                                                        <p>Dear ${friendUsername},</p>
                                                        <p>You have received a friend request. Please confirm the request by clicking the button below:</p>
                                                        <a class="button" href="${confirmationlink}" id="confirm">Confirm Request</a>
                                                        <p>If you did not send this request, you can ignore this email.</p>
                                                    </div>
                                                    <div class="footer">© 2023 - 2024 David Bach. All rights reserved.</div>
                                                </div>
                                            </body>
                                            </html>
                                            `
                                    }

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.log(error);
                                            return res.json({error: 'Error sending email'});
                                        } else {
                                            return res.json({
                                                success: true,
                                                userID: results[i].userID,
                                                friendUsername: friendUsername,
                                                friendstatus: friendStatus
                                            });
                                        }
                                    })
                                } else {
                                    return res.json({error: 'Invalid Friend Username'});
                                }
                            }
                        }

                    })
                }

            }

        }
    })
})

app.post('/getFriends', (req, res) => {
    let userID = req.body.userID;

    if (!userID) {
        return res.json({error: 'Invalid UserID'});
    }

    const getFriendQuery = `SELECT *
                            FROM \`${userID}\`;`;
    connection.query(getFriendQuery, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            if (results[i].friendsID) {
                results[i].friendsUsername = decrypt(JSON.parse(results[i].friendsUsername));
            }

            if (i === results.length - 1) {
                return res.json({friends: results});
            }
        }
    })
})

app.post('/acceptFriend', (req, res) => {
    let myuserID = req.body.myuserID;
    let senderUserID = req.body.senderUserID;
    let senderusername = req.body.senderusername;

    const getverifydata = `SELECT *
                           FROM Usernames;`;
    connection.query(getverifydata, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            let decryptedusername = decrypt(JSON.parse(results[i].usernames));
            let userID = results[i].userID;


            if (senderusername === decryptedusername && senderUserID === userID) {
                const myQuery = `SELECT *
                                 FROM \`${myuserID}\`;`;
                connection.query(myQuery, (err, results) => {
                    if (err) {
                        console.error('Error getting the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }
                    for (let j = 0; j < results.length; j++) {
                        if (results[j].friendsID !== senderUserID && results[j].friendsID !== '') {
                            const getFriendQuery = `UPDATE \`${senderUserID}\`
                                                    SET friendsStatus = 'Accepted'
                                                    WHERE friendsID = '${myuserID}';`;
                            connection.query(getFriendQuery, (err, results) => {
                                if (err) {
                                    console.error('Error getting the database:', err);
                                    return res.status(500).json({error: 'Database error'});
                                }

                                const setFriendInMyQuery = `INSERT INTO \`${myuserID}\` (friendsID, friendsUsername, username, friendsStatus)
                                                            VALUES ('${senderUserID}',
                                                                    '${JSON.stringify(encrypt(senderusername))}', '',
                                                                    'Accepted');`;
                                connection.query(setFriendInMyQuery, (err, results) => {
                                    if (err) {
                                        console.error('Error getting the database:', err);
                                        return res.status(500).json({error: 'Database error'});
                                    }

                                    return res.json({success: true});
                                })
                            })
                        } else {
                            return res.json({success: false});
                        }
                    }
                })
            }
        }
    })
})

app.post('/declineFriend', (req, res) => {
    let myuserID = req.body.myuserID;
    let senderUserID = req.body.senderUserID;
    let senderusername = req.body.senderusername;

    const getverifydata = `SELECT *
                           FROM Usernames;`;
    connection.query(getverifydata, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            let decryptedusername = decrypt(JSON.parse(results[i].usernames));
            let userID = results[i].userID;

            if (senderusername === decryptedusername && senderUserID === userID) {
                const FriendQuery = `SELECT *
                                     FROM \`${senderUserID}\`;`;
                connection.query(FriendQuery, (err, results) => {
                        if (err) {
                            console.error('Error getting the database:', err);
                            return res.status(500).json({error: 'Database error'});
                        }

                        for (let j = 0; j < results.length; j++) {
                            if (results[j].friendsID === myuserID && results[j].friendsID !== '') {
                                const removeFromFriendQuery = `DELETE
                                                               FROM \`${senderUserID}\`
                                                               WHERE friendsID = '${myuserID}';`;
                                connection.query(removeFromFriendQuery, (err, results) => {
                                    if (err) {
                                        console.error('Error getting the database:', err);
                                        return res.status(500).json({error: 'Database error'});
                                    }

                                    return res.json({success: true});
                                })
                            } else {
                                if (j === results.length - 1) {
                                    return res.json({success: false});
                                }
                            }
                        }
                    }
                )
            }
        }
    })
});

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
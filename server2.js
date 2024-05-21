const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto'); // Import crypto module
const {urlencoded} = require('express');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const {WebSocketServer} = require("ws");
// const {fix} = require("nodemailer-smtp-transport/.eslintrc");
const app = express();
const webSocketServer = require('ws').Server;

const port = 3000;

// Encryption and decryption keys (should be securely stored in production)
const encryptionKey = process.env.ENCRYPT_KEY;
const key = crypto.createHash('sha256').update(String(encryptionKey)).digest('base64').substr(0, 32);

const loginEncryptionKey = process.env.LOGIN_ENCRYPT_KEY;
const loginKey = crypto.createHash('sha256').update(String(loginEncryptionKey)).digest('base64').substr(0, 32);

const rememberEncryptionKey = process.env.REMEMBER_ENCRYPT_KEY;
const rememberKey = crypto.createHash('sha256').update(String(rememberEncryptionKey)).digest('base64').substr(0, 32);

const homepageencrytionkey = process.env.HOMEPAGE_ENCRYPT_KEY;
const HomepageKey = crypto.createHash('sha256').update(String(homepageencrytionkey)).digest('base64').substr(0, 32);

const chatencryptkey = process.env.CHAT_ENCRYPT_KEY;
const chatKey = crypto.createHash('sha256').update(String(chatencryptkey)).digest('base64').substr(0, 32);

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
app.use(express.json());
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

// Handle encryption
function chatencrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(chatKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

// Handle decryption
function chatdecrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(chatKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
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
                                                 friendsStatus   VARCHAR(255),
                                                 chats           VARCHAR(16)
                                             );`
                    connection.query(createUserTable, (err, results) => {
                        if (err) {
                            console.error('Error creating user table:', err);
                            return res.status(500).json({error: 'Database error'});
                        }

                        const insertIntoUserTable = `INSERT INTO \`${newUserID}\` (friendsID, friendsUsername, username, friendsStatus, chats)
                                                     VALUES ('', '', '${JSON.stringify(username)}', '', '');`
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

    if (friendIDCode === myuserID) {
        return res.json({error: 'You cannot add yourself as a friend'});
    } else {
        const getFriendfromMyTable = `SELECT *
                                      FROM \`${myuserID}\`;`;
        connection.query(getFriendfromMyTable, (err, results) => {
            if (err) {
                console.error('Error getting the database:', err);
                return res.status(500).json({error: 'Database error'});
            }

            for (let i = 0; i < results.length; i++) {
                if (results[i].friendsID === friendIDCode && results[i].friendsStatus !== '') {
                    // console.log("Friend already added");
                    return res.json({error: 'Friend already added'});
                }

                if (i === results.length - 1) {
                    if (results[i].friendsID !== friendIDCode && results[i].friendsID !== myuserID) {
                        let senderusername = decrypt(JSON.parse(results[i].username));

                        //console.log("Friend not added");
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
                                        const friendStatus = 'Pending';
                                        let confirmationlink = `http://localhost:63342/secure-text-messanger-dev-node/html/getInfoViaUrl.html?userID=${encodeURIComponent(myuserID)}&friendID=${encodeURIComponent(friendIDCode)}&senderusername=${encodeURIComponent(senderusername)}`
                                        const addFriendQuery = `INSERT INTO \`${myuserID}\` (friendsID, friendsUsername, username, friendsStatus, chats)
                                                                VALUES (${friendIDCode},
                                                                        '${JSON.stringify(encrypt(friendUsername))}',
                                                                        '',
                                                                        'Pending',
                                                                        '');`;
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
    }
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
    let {myuserID, senderUserID, senderusername} = req.body;

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
                                 FROM \`${senderUserID}\`;`;
                connection.query(myQuery, (err, results) => {
                    if (err) {
                        console.error('Error getting the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }
                    for (let j = 0; j < results.length; j++) {

                        if (j === results.length - 1) {
                            if (results[j].friendsID === myuserID && results[j].friendsID !== '') {
                                const getFriendQuery = `UPDATE \`${senderUserID}\`
                                                        SET friendsStatus = 'Accepted'
                                                        WHERE friendsID = '${myuserID}';`;
                                connection.query(getFriendQuery, (err, results) => {
                                    if (err) {
                                        console.error('Error getting the database:', err);
                                        return res.status(500).json({error: 'Database error'});
                                    }

                                    const setFriendInMyQuery = `INSERT INTO \`${myuserID}\` (friendsID, friendsUsername, username, friendsStatus, chats)
                                                                VALUES ('${senderUserID}',
                                                                        '${JSON.stringify(encrypt(senderusername))}',
                                                                        '',
                                                                        'Accepted',
                                                                        '');`;
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
                const myQuery = `SELECT *
                                 FROM \`${senderUserID}\`;`;
                connection.query(myQuery, (err, results) => {
                    if (err) {
                        console.error('Error getting the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }
                    for (let j = 0; j < results.length; j++) {

                        if (j === results.length - 1) {
                            console.log(results[j].friendsID === myuserID && results[j].friendsID !== '');
                            if (results[j].friendsID === myuserID && results[j].friendsID !== '') {
                                const getFriendQuery = `UPDATE \`${senderUserID}\`
                                                        SET friendsStatus = 'Accepted'
                                                        WHERE friendsID = '${myuserID}';`;
                                connection.query(getFriendQuery, (err, results) => {
                                    if (err) {
                                        console.error('Error getting the database:', err);
                                        return res.status(500).json({error: 'Database error'});
                                    }


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
                                })
                            } else {
                                return res.json({success: false});
                            }
                        }
                    }
                })
            }
        }
    })
});

app.post('/deleteFriend', (req, res) => {

    let {myuserID, friendID, friendUsername} = req.body;

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

            if (friendUsername === decryptedusername && friendID === userID) {
                const myQuery = `SELECT *
                                 FROM \`${myuserID}\`;`;
                connection.query(myQuery, (err, results) => {
                    if (err) {
                        console.error('Error getting the database:', err);
                        return res.status(500).json({error: 'Database error'});
                    }
                    for (let j = 0; j < results.length; j++) {

                        if (j === results.length - 1) {
                            if (results[j].friendsID === friendID) {
                                const deleteFriendQuery = `DELETE
                                                           FROM \`${myuserID}\`
                                                           WHERE friendsID = '${friendID}';`;
                                connection.query(deleteFriendQuery, (err, results) => {
                                    if (err) {
                                        console.error('Error getting the database:', err);
                                        return res.status(500).json({error: 'Database error'});
                                    }

                                    const removeFromFriendQuery = `DELETE
                                                                   FROM \`${friendID}\`
                                                                   WHERE friendsID = '${myuserID}';`;
                                    connection.query(removeFromFriendQuery, (err, results) => {
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
                    }
                })
            }
        }
    })
})

app.post('/createorgetchat', (req, res) => {
    let {myuserID, friendName, friendID} = req.body;

    const getChatsfromMe = `SELECT *
                            FROM \`${myuserID}\`;`;
    connection.query(getChatsfromMe, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        for (let i = 0; i < results.length; i++) {
            if (results[i].friendsID === friendID && results[i].friendsID !== '') {
                if (results[i].friendsID === friendID && results[i].chats !== '') {
                    return res.json({success: 'Connecting...', results: encrypt(results[i].chats)});
                } else {
                    let chatCode = '';
                    let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                    for (let a = 0; a < 12; a++) {
                        let randomIndex = Math.floor(Math.random() * characters.length);
                        chatCode += characters.charAt(randomIndex);
                    }

                    const createnewchatTable = `CREATE TABLE ${chatCode}
                                                (
                                                    message  VARCHAR(2048),
                                                    username VARCHAR(1024)
                                                );`;
                    connection.query(createnewchatTable, (err, results) => {
                        if (err) {
                            console.error('Error getting the database:', err);
                            return res.status(500).json({error: 'Database error'});
                        }

                        const addChattomyAccount = `SELECT *
                                                    FROM \`${myuserID}\`;`;
                        connection.query(addChattomyAccount, (err, results) => {
                            if (err) {
                                console.error('Error getting the database:', err);
                                return res.status(500).json({error: 'Database error'});
                            }

                            for (let j = 0; j < results.length; j++) {
                                if (results[j].friendsID === friendID) {
                                    const addInto = `UPDATE \`${myuserID}\`
                                                     SET chats = '${chatCode}'
                                                     WHERE friendsID = '${friendID}';`;
                                    connection.query(addInto, (err, results) => {
                                        if (err) {
                                            console.error('Error getting the database:', err);
                                            return res.status(500).json({error: 'Database error'});
                                        }

                                        const addToFriendsAccount = `SELECT *
                                                                     FROM \`${friendID}\`;`;
                                        connection.query(addToFriendsAccount, (err, results) => {
                                            if (err) {
                                                console.error('Error getting the database:', err);
                                                return res.status(500).json({error: 'Database error'});
                                            }

                                            for (let k = 0; k < results.length; k++) {
                                                if (results[k].friendsID === myuserID) {
                                                    const addInto = `UPDATE \`${friendID}\`
                                                                     SET chats = '${chatCode}'
                                                                     WHERE friendsID = '${myuserID}';`;
                                                    connection.query(addInto, (err, results) => {
                                                        if (err) {
                                                            console.error('Error getting the database:', err);
                                                            return res.status(500).json({error: 'Database error'});
                                                        }

                                                        return res.json({success: 'Connecting...', results: encrypt(chatCode)});
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    })
                }
            }
        }
    })
})

app.post('/getChat', (req, res) => {
    let {myuserID, chatCode} = req.body;
    chatCode = decrypt(chatCode);

    const getChatContent = `SELECT *
                            FROM \`${chatCode}\`;`;
    connection.query(getChatContent, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        if (results.length > 0) {
            let message = [];
            let userid = [];
            for (let j = 0; j < results.length; j++) {
                message.push(chatdecrypt(JSON.parse(results[j].message)));
                userid.push(results[j].username);

                if (j === results.length - 1) {
                    return res.json({
                        success: true,
                        message: message,
                        userid: userid,
                        myuserID: myuserID,
                        index: j + 1,
                        chatCode: encrypt(chatCode)
                    });
                }
            }
        } else {
            return res.json({success: 'Pending', chatCode: encrypt(chatCode)});
        }
    })
});

app.post('/sendMessage', (req, res) => {
    let {myuserID, message, chatCode, friendID, friendName} = req.body;
    chatCode = decrypt(chatCode);

    if (!message) {
        return res.json({error: 'Not Message received'});
    }

    const messagePattern = /[<>"'|{}\[\]\/!]/;

    if (messagePattern.test(message)) {
        return res.json({error: 'Message contains invalid characters'});
    }

    const addMessage = `INSERT INTO \`${chatCode}\` (message, username)
                        VALUES ('${JSON.stringify(chatencrypt(message))}',
                                '${myuserID}');`;
    connection.query(addMessage, (err, results) => {
        if (err) {
            console.error('Error getting the database:', err);
            return res.status(500).json({error: 'Database error'});
        }

        const getContnt = `SELECT *
                           FROM \`${chatCode}\`;`;
        connection.query(getContnt, (err, results) => {
            if (err) {
                console.error('Error getting the database:', err);
                return res.status(500).json({error: 'Database error'});
            }

            let message = [];
            let userid = [];
            for (let j = 0; j < results.length; j++) {
                message.push(chatdecrypt(JSON.parse(results[j].message)));
                userid.push(results[j].username);

                if (j === results.length - 1) {
                    return res.json({
                        success: true,
                        message: message,
                        userid: userid,
                        myuserID: myuserID,
                        index: j + 1,
                        chatCode: encrypt(chatCode)
                    });
                }
            }
        })
    })
});

const wss = new WebSocketServer({port: 8000});
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        wss.broadcast(message);
    })
});

wss.broadcast = (message) => {
    wss.clients.forEach(client => {
        client.send(message.toString('utf-8'));
    })
}


app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
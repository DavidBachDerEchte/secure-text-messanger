const mysql = require("mysql");

class CreateChat {

    constructor() {

        this.createTable();
    }

    createTable() {
        const mysql = require('mysql');

        // Create a connection to the MySQL database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'mpa',
            password: 'mpa',
            database: 'SecureTextMessager'
        });

        // Connect to the database
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }

            console.log('Connected to MySQL database');
        });

        // SQL query to create a table
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            message VARCHAR(255) NOT NULL
          )
        `;

        // Execute the SQL query to create the table
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating table: ' + err.stack);
                return;
            }

            console.log('Table created successfully');
        });

        // Close the connection
        connection.end();

    }
}

export {CreateChat}
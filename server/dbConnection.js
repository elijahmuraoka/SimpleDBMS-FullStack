const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

let instance = null;

class DBConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT,
            dateStrings: "date",
        });
    }

    static getInstance() {
        return instance ? instance : new DBConnection();
    }

    connectDB() {
        this.connection.connect((err) => {
            if (err) {
                console.error("Error Connecting to DB: " + err.stack);
            } else {
                console.log(
                    "Connected to DB as id " + this.connection.threadId
                );
            }
        });
    }

    async getAllData() {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user ORDER BY user_id;";
                this.connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewName(name) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO user (name) VALUES (?);";
                this.connection.query(query, name, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId);
                    }
                });
            });
            const dateAdded = await new Promise((resolve, reject) => {
                const query =
                    "SELECT date_added FROM user ORDER BY date_added DESC;";
                this.connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            // console.log(dateAdded[0].date_added);
            // console.log(insertId);
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded[0].date_added,
            };
        } catch (err) {
            console.log(err);
        }
    }

    async deleteByID(id) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "DELETE FROM user WHERE user_id = (?)";
                this.connection.query(query, id, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getUserByName(name) {
        name = name + "%";
        console.log("Getting user: " + name);
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE name LIKE (?);";
                this.connection.query(query, name, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    async updateUser(newName, id) {
        try {
            await new Promise((resolve, reject) => {
                const query = "UPDATE user SET name = (?) WHERE user_id = (?);";
                this.connection.query(query, [newName, id], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            return {
                name: newName,
                id: id,
            };
        } catch (err) {
            console.log("Broken: " + err.message);
        }
    }
}

module.exports = DBConnection;

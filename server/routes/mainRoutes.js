const express = require("express");
const Router = express.Router;
const router = new Router();
const DBConnection = require("../dbConnection");
const db = DBConnection.getInstance();

// home
router.get("/", (req, res) => {
    res.send("Hello, this is the home page");
});

// create
router.post("/insert", (req, res) => {
    console.log("[TEST POST]");
    const { name } = req.body;
    const result = db.insertNewName(name);
    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err.message));
});

// read
router.get("/getAll", (req, res) => {
    console.log("[TEST GET ALL]");
    const result = db.getAllData();

    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err.message));
});

// update
router.put("/update/:id", (req, res) => {
    console.log("[TEST UPDATE]");
    const newName = req.body.name;
    const id = req.body.id;
    const result = db.updateUser(newName, id);
    result
        .then((data) => {
            res.json({ success: true, name: data.name, id: data.id });
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// delete
router.delete("/delete/:id", (req, res) => {
    console.log("[TEST DELETE]");
    const { id } = req.params;
    const result = db.deleteByID(id);

    result
        .then((data) => res.json({ success: true }))
        .catch((err) => console.log(err.message));
});

// search
router.get("/get/:name", (req, res) => {
    console.log("[TEST SEARCH]");
    const { name } = req.params;
    const result = db.getUserByName(name);

    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err));
});

module.exports.router = router;

const express = require('express');
const fs = require('fs');
const router = express.Router();

router.route('/:username').get((req, res, next) => {
    let users;
    fs.readFile('./server/users.json', (err, data) => {
        if (err) throw err;
        users = JSON.parse(data);
        const userFound = users.filter(i => i.username == req.params.username);
        if (userFound.length == 0)
            console.log("user not found")
        else {
            res.send(userFound[0]);
        }
        next();
    });

})

router.route('/').post((req, res, next) => {
})

router.route('/:username').put((req, res, next) => {
})

router.route('/:username').delete((req, res, next) => {
})

module.exports = router
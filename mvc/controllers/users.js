const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const registerUser = function({ body }, res) {

    if (!Object.values(body).every((val) => val)) {
        return res.send({ message: "All fields are required." })
    }

    if (body.password !== body.password_confirm) {
        return res.send({ message: "Passwords don't match." })
    }

    const user = new User();
    user.firstname = body.first_name.trim();
    user.lastname = body.last_name.trim();
    user.email = body.email.trim();
    user.setPassword(body.password);

    user.save((err, newUser) => {
        if (err) {
            if(err.errmsg && err.errmsg.includes("duplicate key error") && err.errmsg.includes("email")) {
                return res.json({ message: "The provided email is already registered."} );
            }
            return res.json({ message: "Something went wrong." });
        } else {
            res.status(201).json({ message: "Created User", user: newUser })
        }
    })
}

const loginUser = function(req, res) {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(404).json(err)
        }
        if (user) {
            return res.status(201).json({ message: "Logged In." })
        } else {
            return res.status(401).json(info)
        }
    })(req,res)
}

module.exports = {
    registerUser,
    loginUser
}
const client = require('../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// exports.userData = (req, res) => {
//     let Email = "";
//     let flag = 0;
//     for (let i = 0; i < req.email.length; i++) {
//         if (i < 2) Email += req.email[i];
//         else if (req.email[i] === '@') {
//             Email += req.email[i];
//             flag = 1;
//         } else if (flag === 1) Email += req.email[i];
//         else Email += '*';
//     }
//     res.status(200).json({
//         message: "User Data Reterived Successfully",
//         name: req.name,
//         email: Email,
//     });
// }

exports.userInfo = (req, res) => {
    client.query(`SELECT id,email,name,likes,followercount,postmade,followingcount,about,profilephoto FROM users WHERE username = '${req.body.username}';`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (req.body.userId != data.rows[0].id) {
                res.status(400).json({ message: "Invalid Profile URL" });
            }
            res.status(200).json({
                message: "Fetched succesfully",
                userData: data.rows[0],
            });
        }
    })
}


exports.updateName = (req, res) => {
    const userName = req.body.name;
    const userPassword = req.body.password;
    client.query(`SELECT * FROM users WHERE email = '${req.email}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.rows[0].password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid Password", });
                    } else {
                        client.query(`UPDATE users SET name='${userName}' WHERE email='${req.email}'`, err => {
                            if (err) {
                                res.status(500).json({ message: "Internal Server Error", });
                            } else {
                                const token = jwt.sign({
                                        userId: req.userId,
                                        name: userName,
                                        username: req.username,
                                        email: req.email,
                                    },
                                    process.env.SECRET_KEY, { expiresIn: '30d' }
                                );
                                res.status(200).json({
                                    message: "Name Updated successfully",
                                    userToken: token,
                                });
                            }
                        })
                    }
                }
            });
        }
    })
}

exports.updatePassword = (req, res) => {
    const userNewPassword = req.body.newPassword;
    const userPassword = req.body.password;
    client.query(`SELECT * FROM users WHERE id = '${req.userId}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.rows[0].password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid password", });
                    } else {
                        bcrypt.hash(userNewPassword, 10, (err, hash) => {
                            if (err) {
                                console.log(`Error occured in hashing password\n ${err}`);
                                res.status(500).json({ message: 'Internal Server Error Please Try Again', });
                            } else {
                                client.query(`UPDATE users SET password='${hash}' WHERE id='${req.userId}'`, err => {
                                    if (err) {
                                        res.status(500).json({ message: "Internal Server Error", });
                                    } else {
                                        res.status(200).json({
                                            message: "Password Updated successfully",
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    })
}
exports.updateProfilePhoto = (req, res) => {
    const profilePhoto = req.body.profilePhoto;
    client.query(`UPDATE users SET profilephoto='${profilePhoto}' WHERE id='${req.userId}'`, err => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            res.status(200).json({
                message: "Photo Updated",
            });
        }
    })
}

exports.updateAbout = (req, res) => {

    const userPassword = req.body.password;
    const userAbout = req.body.about;

    client.query(`SELECT * FROM users WHERE email = '${req.email}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.rows[0].password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid Password", });
                    } else {
                        client.query(`UPDATE users SET about='${userAbout}' WHERE email='${req.email}'`, err => {
                            if (err) {
                                res.status(500).json({ message: "Internal Server Error", });
                            } else {
                                res.status(200).json({
                                    message: "About Updated successfully",
                                });
                            }
                        })
                    }
                }
            });
        }
    })
}
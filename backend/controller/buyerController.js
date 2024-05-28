const { Book } = require('../model/user.model');
const { sequelize } = require('../database');

const viewBook = async (req, res) => {
    let book = await Book.findAll({});
    let msg = ""
    for (let i = 0; i < book.length; i++) {
        msg += `${book[i]["dataValues"]["title"]}
        `
    }
    res.send(msg)
}
const viewDetails = async (req, res) => {
    try {
        let keys = Object.keys(req.body);
        let values = {}
        for (let i = 0; i < keys.length; i++) {
            values[keys[i]] = req.body[keys[i]];
        }
        const books = await Book.findAll({ where: values });
        if (books.length !== 0) {
            let msg = ""
            for (let i = 0; i < books.length; i++) {
                msg += `{
                            title : ${books[i]["dataValues"]["title"]},
                            author : ${books[i]["dataValues"]["author"]},
                            published_date : ${books[i]["dataValues"]["published_date"]},
                            price : ${books[i]["dataValues"]["price"]},
                    },
                            `
            }
            res.status(200).send(msg);
        }
        else {
            res.status(400).send("No Book Found..");
        }
    }
    catch {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { viewBook, viewDetails };
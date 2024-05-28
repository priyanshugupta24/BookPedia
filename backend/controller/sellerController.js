const fs = require("fs");
const csv = require('csv-parser');
const dotenv = require('dotenv').config();
const { Book } = require('../model/user.model');
const { sequelize } = require('../database');

const processRowSingle = async (toInsertInBulk) => {
    let failedCnt = 0;
    for (let i = 0; i < toInsertInBulk.length; i++) {
        try {
            const row = toInsertInBulk[i];
            await Book.create(row);
        } catch (error) {
            console.log("Error inserting single row", error);
            failedCnt++;
        }
    }
    return failedCnt;
};

const readCsv = async (res, pathForCsv, fallbackValues, id) => {
    const batchSize = 5;
    let toInsertInBulk = [];
    let currentSizeOfBatch = 0;
    let successCnt = 0;
    let failureCnt = 0;

    try {
        const readStream = fs.createReadStream(pathForCsv)
            .pipe(csv())
            .on('data', (row) => {
                const dataToPush = {};
                const rowKeys = Object.keys(row);
                for (let i = 0; i < rowKeys.length; i++) {
                    if (row[rowKeys[i]].trim() === "") {
                        dataToPush[rowKeys[i]] = fallbackValues[rowKeys[i]] || null;
                    } else {
                        dataToPush[rowKeys[i]] = row[rowKeys[i]].trim();
                    }
                }
                dataToPush["user_id"] = id;
                toInsertInBulk.push(dataToPush);
                currentSizeOfBatch++;

                if (currentSizeOfBatch >= batchSize) {
                    readStream.pause();
                    bulkInsertHandler();
                }
            })
            .on('end', () => {
                if (toInsertInBulk.length > 0) {
                    bulkInsertHandler(true);
                }
            })
            .on("error", (e) => {
                console.log("Error reading CSV", e);
            });

        const bulkInsertHandler = async (isEnd = false) => {
            try {
                await Book.bulkCreate(toInsertInBulk, { validate: true });
                successCnt += toInsertInBulk.length;
            } catch (error) {
                console.log("Bulk insert error, trying single row insert");
                const tempFailedCnt = await processRowSingle(toInsertInBulk);
                failureCnt += tempFailedCnt;
                successCnt += toInsertInBulk.length - tempFailedCnt;
            } finally {
                toInsertInBulk = [];
                currentSizeOfBatch = 0;
                if (!isEnd) readStream.resume();
                else {
                    console.log("Number of files successfully processed:", successCnt);
                    console.log("Number of files unsuccessfully processed:", failureCnt);
                    res.status(200).json({ msg: `Number of files successfully processed: ${successCnt}, Number of files unsuccessfully processed: ${failureCnt}` });
                }
            }
        };

    } catch (error) {
        console.log("Error processing file", error);
    }
};

const uploadCsv = async (req, res) => {
    try {
        const input = req.body;
        const id = req.user.id;
        const is_seller = req.user.is_seller;
        const fallbackKeys = Object.keys(input);
        const fallbackValues = {};
        if(is_seller){
            for (let i = 0; i < fallbackKeys.length; i++) {
                const title = fallbackKeys[i];
                if (title.startsWith("fallback_")) fallbackValues[title.split("_")[1]] = input[title];
            }
    
            if (fs.existsSync(req.body.pathForCsv)) {
                console.log('File exists. Proceeding with operations.');
                await sequelize.authenticate();
                console.log('Connection has been established successfully.');
                await readCsv(res, req.body.pathForCsv, fallbackValues, id);
            } else {
                console.log('File does not exist. Please check the path.');
                res.status(400).json({ msg: "File does not exist. Please check the path." });
            }
        }
        else{
            res.status(400).json({ msg: "Only Seller Can Add Into DB" });
        }
    } catch (error) {
        res.status(400).json({ msg: "There has been an error", error: error });
    }
};
const viewBook = async(req,res) => {
    try{
        const id = req.user.id;
        let  keys = Object.keys(req.body);
        let values = {}
        for(let i=0;i<keys.length;i++){
            values[keys[i]] = req.body[keys[i]];
        }
        values["user_id"] = id;
        console.log(values)
        const books = await Book.findAll({ where : values });
        if(books.length !== 0){
            let msg = ""
            for(let i=0;i<books.length;i++){
                msg +=  `{
                                id : ${books[i]["dataValues"]["id"]},
                                title : ${books[i]["dataValues"]["title"]},
                                author : ${books[i]["dataValues"]["author"]},
                                published_date : ${books[i]["dataValues"]["published_date"]},
                                price : ${books[i]["dataValues"]["price"]},
                                user_id : ${books[i]["dataValues"]["user_id"]},
                },
                        `  
            }
            res.status(200).send(msg);
        }
        else{
            res.status(400).send("No Book Found..")
        }
    }
    catch{
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const viewAllBooks = async (req, res) => {
    try {
        const id = req.user.id;
        const books = await Book.findAll({ where: { user_id: id } });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const editBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const getId = req.body.id;
        const dataToBeChanged = req.body.data;
        let msg =  'Failed for : '
        for(let i=0;i<getId.length;i++){
            let  book = await Book.findAll({ where: { user_id: userId,id:getId[i] } });
            if(book.length == 0){
                msg += `id ${getId[i]},`
                continue;
            }
            let  { id,title,author,published_date,price } = book[0]["dataValues"];
            const dataIndi = {id,title,author,published_date,price}
            const dataKeys = Object.keys(dataToBeChanged[i]);
            for(let j=0;j<dataKeys.length;j++){
                dataIndi[dataKeys[j]] = dataToBeChanged[i][dataKeys[j]]
            }
            const updated = await Book.update(
                dataIndi,
                {where: { user_id: userId,id:getId[i] }}
            );
        }
        res.status(200).json(`${msg}`);
    } catch (error) {
        console.error('Error Updating books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const getId = req.body.id;
        let msg =  'Failed for : '
        let msg2 = "Success for : "
        for(let i=0;i<getId.length;i++){
            console.log(userId,getId[i])
            const deleted = await Book.destroy({ where: { user_id: userId, id: getId[i] } });
            if (deleted) {
                msg2 += `id ${getId[i]},`
            } else {
                msg += `id ${getId[i]},`
            }
        }
        res.status(200).json(`${msg} and ${msg2}`);
    } catch (error) {
        console.error('Error Updating books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { viewAllBooks, editBooks, deleteBooks, uploadCsv,viewBook }
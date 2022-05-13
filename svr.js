import express from 'express';
import * as db from './database.js';

const app = express();
app.use(express.static('client'));

let counter = 1
let wordUpdated;

setInterval(updateCounter, 86400000)

function updateCounter(){
    wordUpdated = counter
    counter = counter + 1
}

async function getTodaysWord(req, res) {
    res.json(await db.getWord(counter));
}

async function checkWord(req, res){
    res.json(await db.getEvaluation(req.body.msg, counter))
}

async function checkWordUpdate(req, res){
    if 
}

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
        .catch((e) => next(e || new Error()));
    };
}

app.get('/checkUpdate', express.json(), asyncWrap(checkWordUpdate()));
app.post('/checkWord', express.json(), asyncWrap(checkWord));
app.get('/todaysWord', asyncWrap(getTodaysWord));
app.listen(8080);
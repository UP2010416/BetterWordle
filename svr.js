import express from 'express';
import * as words from './database.js';

const app = express();
app.use(express.static('client'));


/* async function checkWord(req, res){
    let word = req.body
    console.log(word)
    const response = await fetch ("https://dictionary-dot-sse-2020.nw.r.appspot.com/"+req.body)
    if(response.ok){
        res.json(response)
    } else {
        res.status(404).send('Word is not valid')
    }
}

app.post('/validword', express.text(), checkWord) */

app.listen(8080);
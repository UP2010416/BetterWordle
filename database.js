import sqlite from 'sqlite';

const dbConn = init();

async function init() {
  const db = await sqlite.open('./database.sqlite', { verbose: true });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

export async function getWord(counter) {
  const db = await dbConn;
  return db.get('SELECT * FROM Words WHERE id = ?', counter);
}

export async function getEvaluation(word, counter){
  const db = await dbConn;
  const obj = await db.get('SELECT * FROM Words WHERE id = ?', counter)
  let todaysWord = obj["word"]
  let evaluationArray=[]
  for(let i = 0;i<word.length;i++){
    const letter = word.charAt(i)
    if(!todaysWord.includes(letter)){
      evaluationArray.push(["rgb(58, 58, 60)","absent"])
    } else if (letter === todaysWord.charAt(i)){
      evaluationArray.push(["rgb(83, 141, 78)","correct"])
    } else {
      evaluationArray.push(["rgb(181, 159, 59)","present"])
    }
  }
  return evaluationArray
}





/* const isCorrect = todaysWord.includes(letter)
  if(!isCorrect){
    return ["rgb(58, 58, 60)","absent"]
  }
  const isInCorrectPosition = letter === todaysWord.charAt(index)
  if(isInCorrectPosition){
    return ["rgb(83, 141, 78)","correct"]
  }

  return ["rgb(181, 159, 59)","present"] */

/* function populateTable(db){
  let csvPromise = getCSV()
  csvPromise.then(function(result){
    for(let i =0;i<result.length;i++){
      let unit = result[i]
      db.run("INSERT INTO Words (id, word) VALUES ($id, $word)",{
        $id : unit.id,
        $word: unit.word
      })
    }
  })
} */

/* function getCSV(){
  const fileLocation = 'words.csv'
  return new Promise(function(resolve,reject){
    fs.readFile(fileLocation, "utf8", function(err, data){
      if (err){
        reject(err)
      } else {
        let lines = data.split('\n')
        let columns = []
        let words = [];
        for(let i = 0;i<lines.length;i++){
          let line = lines[i]
          let columns = line.split(',')
          let id = columns[0]
          let word = columns[1]
          words.push({
            "id": id,
            "word": word
          })
        }
        resolve(words)
      }
    })
  })
} */
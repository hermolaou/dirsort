/*
    Glory to God in the highest
    =============================

    extension to search internet in VSCode.
*/

const path = require('path');
const fs = require('fs');
const readline = require('readline-sync');

const chantsdir='d:/песнопения/несмотренное'
const livesdir='d:/документы/Жития святых'
const patristicdir='d:/документы/Творения святых отцов'

const directoryPath = livesdir // chantsdir;
var nameWords={},  files=[], dirs=[]

//проверка всех пдф. убрать пустые пдф размером 127 кб. скрытые файлы с точкой.
//avoid too long file names. check and shorten.

checkdir(directoryPath)

function checkdir(directoryPath)
{
    const direntries=fs.readdirSync(directoryPath, {withFileTypes:true});

    direntries.forEach(function (direntry) {
       
        if(direntry.isFile())
        {   
            files.push(direntry.name)
        } else if (direntry.isDirectory()) {
            dirs.push(direntry.name)
            //checkdir(path.join(directoryPath, direntry.name));
        }

        const name=path.basename(direntry.name, path.extname(direntry.name))

        const words=name.match(/[^\d\s\-_\(\)\.]{4,}/gm);  //improve if you can so endings can vary
        
        if(!words) return
        words.forEach(function(word){
            nameWords[word]=(nameWords[word] || 0) +1;
        });
       
    })
            
}

const wordsSorted = Object.keys(nameWords).filter(a=> nameWords[a]>3).sort(function(a,b){
    return nameWords[b]-nameWords[a]})


for (key of wordsSorted){
    //look for folders and files that have

    console.log(key, nameWords[key])

    console.log(dirs.filter(dir=>dir.match(key.substr(0,key.length-2))))
    console.log(files.filter(file=>file.match(key)))

    const firstdir=dirs.filter(dir=>dir.match(key.substr(0,key.length-2)))[0];
    
    const todo = readline.question(`a) move to folder ${key}\nb) move to folder ${firstdir}\nc)move to folder you type\nother key) skip\n`);

    switch(todo)
    {
        case 'a':
            var newpath=key
            break

        case 'b':
            var newpath=firstdir
            break

        case 'c':
            var newpath = readline.question("Folder name: ");

        default:
            return
    }

    files.filter(file=>file.match(key)).forEach(function(file) {
        console.log(`fs.rename(${file}, ${newpath})`)
    }) 
      
}
  



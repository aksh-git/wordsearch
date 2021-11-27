console.log("welcome to word Puzzle");
//vars
let board = document.getElementById("board");
let message = document.getElementById("alert-txt");
let grids = document.getElementsByClassName("grid-item");
let scoreboard  = document.getElementById("scoreboard");
//grid-item
let totalGrid = 25;
let wordLength = 9;
let alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z"];
let words = ["HELLO","WORLD","AKASH","WORDS","GAME"];
let pWords = new Set();
let guessedWords = new Set();
let greets = ["Bravo !!","You Got it.!","Awosome","Gotcha!!!","Yippee","Hooray"]
let pFinalWords;
//API- URL
const APIURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//animations
function slideUp() {
    var elem = document.getElementById("alert-bar");
    elem.style.transition = "all 0.4s ease-in-out";
    elem.style.height = "0px";
    message.innerHTML = "";
    elem.style.opacity=0;
}
function slideDown(msg) {
    var elem = document.getElementById("alert-bar");
    elem.style.opacity=1;
    elem.style.transition = "all 0.4s ease-in-out";
    elem.style.height = "50px";
    message.innerHTML = msg;
    setTimeout(() => {
        slideUp();
    }, 1500);
}

//basic functions
clearBoard = function(){
    board.value = "";
    let elem = document.getElementsByClassName("grid-item");
    var i;
    for (i=0;i<elem.length;i++) {
        elem[i].style.background = "none";
        elem[i].style.color = "#f9f9f9";
    }
}

showScoreBoard = function(){
    if(scoreboard.style.opacity==1){
        scoreboard.style.opacity=0;
    }else{
        scoreboard.style.opacity=1;
    }
}

// API CALL
async function checkForWordOnline(word) {
	const response = await fetch(APIURL+word);
	const raw_data = await response.json();
    let wordCount = document.getElementById("sb-head-value");
    if(!response.ok){
        slideDown("Word Not Found");
        clearBoard();
    }else{
        if(raw_data.length>0){
            guessedWords.add(word);
            slideDown("Word Found"+" "+greets[Math.floor(Math.random()*greets.length)]);
            newElement(word);
            wordCount.innerHTML = "Words Found : "+guessedWords.size;
            console.log(guessedWords);
            clearBoard();
        }
        else{
            clearBoard();
        }
    }
}  

checkPuzzle = function(){
    let i=0;
    for(i=0;i<totalGrid;++i){
        let insertItemGrid = document.getElementById("grid-item-"+i);
        if(insertItemGrid.value==="undefined"){ 
            let rGrid = Math.floor(Math.random() * totalGrid);
            insertItemGrid.innerHTML = alphabets[rGrid];
            insertItemGrid.value = alphabets[rGrid];
        }
    }
}


displayPuzzle = function(){
    let i = 0;
    while(i<totalGrid){
        let rGrid = Math.floor(Math.random() * totalGrid);
        let insertItemGrid = document.getElementById("grid-item-"+i);
        if(insertItemGrid.value==="1"){
            insertItemGrid.innerHTML = pFinalWords[rGrid];
            insertItemGrid.value = pFinalWords[rGrid];
            ++i;
        }
    }
    checkPuzzle();
}

resetPuzzle = function(){
    let i = 0;
    let wordItem = document.querySelectorAll("li");
    while(i<totalGrid){
        let insertItemGrid = document.getElementById("grid-item-"+i);
        insertItemGrid.innerHTML = i+1;
        insertItemGrid.value = "1";
        ++i;
    }
    wordItem.forEach((witem)=>{
        witem.parentElement.removeChild(witem);
    });
    createPuzzle();
    clearBoard();
}

createPuzzle = function(){
    words.map((word)=>{
        let i = 0;
        for(i;i<word.length;++i){
            pWords.add(word[i]);
        }
    });
    if(pWords.size<totalGrid){
        while(pWords.size<totalGrid){
            let rWord = alphabets[Math.floor(Math.random()*26)];
            if(!pWords.has(rWord)){
                pWords.add(rWord);
            }else{
                continue;
            }
        }
    }
    pFinalWords = Array.from(pWords);
    displayPuzzle();
}

checkForWord = function(userword){
    if(board.value.length>2){
        if(guessedWords.has(userword)){
            slideDown("Already Found!!");
            clearBoard();
        }else{
           slideDown("Checking for word");
           checkForWordOnline(userword);
        }
    }else{
        slideDown("Minimum select 3");
    } 
}

function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("board").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
      alert("You must write something!");
    } else {
      document.getElementById("word-list").appendChild(li);
    }
    document.getElementById("board").value = "";
}

handleClick = function(val,e){
    if(val==="clear"){
        clearBoard();
    }else if(val==="showWords"){
        showScoreBoard();
    }else if(val==="reset"){
        resetPuzzle();
    }else if(val==="submit"){   
        checkForWord(board.value);
    }else if(val==="showWords"){
        
    }else{
        if(board.value.length<wordLength){
            if(e.style.background.includes("rgb(153, 230, 153)")){
                e.style.background="none";
                e.style.color="#f9f9f9";
                board.value = board.value.replace(val,"");
            }else{
                board.value += val;
                e.style.background="#99e699";
                e.style.color="limegreen";
            }
            if(e.style.background.includes("rgb(153, 230, 153)") && board.value.length>=wordLength){
                e.style.background="none";
                e.style.color="#f9f9f9";
                board.value = board.value.replace(val,"");
            }
        }
    }
}

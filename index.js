console.log("welcome to word Puzzle");
//vars
let board = document.getElementById("board");
let message = document.getElementById("alert-txt");
let grids = document.getElementsByClassName("grid-item");
let scoreboard  = document.getElementById("scoreboard");
//grid-item
let totalGrid = 25;
let alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z"];
let words = ["HELLO","WORLD","AKASH","WORDS","GAME"];
let pWords = new Set();
let guessedWords = new Set();
let greets = ["Bravo !!","You Got it.!","Awosome","Gotcha!!!","Yippee","Hooray"]
let pFinalWords;
//API- key
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
    for (i = 0; i < elem.length; i++) {
        elem[i].style.backgroundColor = "#d5d5d5";
    }
}

// API CALL
async function checkForWordOnline(word) {
	// Ajax call
	const response = await fetch(APIURL+word);
	const raw_data = await response.json();
    if(!response.ok){
        slideDown("Word Not Found");
        clearBoard();
    }else{
        if(raw_data.length>0){
            guessedWords.add(word);
            slideDown("Word Found"+" "+greets[Math.floor(Math.random()*greets.length)]);
            newElement(word);
            clearBoard();
        }
        else{
            clearBoard();
            console.log(raw_data);
        }
    }
}  

displayPuzzle = function(){
    //let minGrids = pWords.size;
    let i = 0;
    while(i<totalGrid){
        let rGrid = Math.floor(Math.random() * totalGrid);
        let insertItemGrid = document.getElementById("grid-item-"+i);
        if(insertItemGrid.value==="1"){
            insertItemGrid.innerHTML = pFinalWords[rGrid];
            insertItemGrid.value = pFinalWords[rGrid];
            ++i;
        }else{
            continue
        }
    }
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
    //var span = document.createElement("SPAN");
    //var txt = document.createTextNode("\u00D7");
    //span.className = "close";
    //span.appendChild(txt);
    //li.appendChild(span);
  
    //for (i = 0; i < close.length; i++) {
    //  close[i].onclick = function() {
    //    var div = this.parentElement;
    //    div.style.display = "none";
    //  }
    //}
    scoreboard.style.opacity=1;
}

handleClick = function(val,e){
    if(val==="clear"){
        clearBoard();
    }
    else if(val==="create"){
        createPuzzle();
    }else if(val==="submit"){   
        checkForWord(board.value);
    }else{
        if(board.value.length<8){
            if(e.style.background.includes("limegreen")){
                e.style.background="";
                board.value = board.value.replace(val,"");
            }else{
                board.value += val;
                e.style.background="limegreen";
            }
        }
    }
}

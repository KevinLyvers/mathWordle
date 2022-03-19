/*
  TODOs
    customize amount of letters and guesses
      Highest Num
      Number of letters
      Number of guesses

    Seed for same values
      Way to easily get it
      
    HTML title
*/

squareSize = -1; ///globals
amountOfLetters = 6
amountOfGuesses = 5

highestNum = 100;

guessNumber = -1;
guessString = "";

guesses = 0;

mainArray = []
colorArray = []

inputString = ""

displayIntroBool = 1;

function setup() {
  url = getURL();
  
  if(url.indexOf("seed=")!=-1){
     seedIn = url.substring(url.indexOf("seed=")+5,url.indexOf("seed=")+9);
     randomSeed(seedIn);
     }
  else{
    seedIn = int(random(9999));
    for(let i=str(seedIn).length;i<4;i++){
      seedIn = "0" + seedIn;
    }
    
    randomSeed(seedIn);
  }
  
  createCanvas(windowWidth, windowHeight);
  
  
  squareSizeHor = ((windowWidth)/amountOfLetters)-20;
  squareSizeVert = ((windowHeight/2)/amountOfGuesses)-20;
  
  squareSize = min(squareSizeHor, squareSizeVert);

  squareTextSize = squareSize*.8;
  textSize(squareTextSize);
  
  guessString = getAnswerEq();
  guessNumber=(solveEq(guessString));
  
  console.log(guessString);
  
  let letterString = ""
  let colorString = ""
  for(let j=0;j<amountOfLetters;j++){
      letterString = letterString + " ";
      colorString = colorString + "b";
    }
  
  for(let i=0;i<amountOfGuesses;i++){
    append(mainArray,letterString);
    append(colorArray,colorString);
  }
}

function displayHead(){
  fill(0);
  rect(0, 0, width, 60);
  textSize(40);
  fill(255);
  text("Mathdle", width/2-textWidth("Mathdle")/2, 50);
}

function displayIntro(){
  fill(170);
  rect(width/5, height/5-20, 3*width/5, 3*height/5);
  textSize(20);
  fill(255);
  let writeText = "It's like Wordle for Math\nType in numbers and +-*/ to create an equation that adds to the number at the bottom. Greens mean right character in the right place and yellow means right character but wrong place. We solve simply left to right. No PEMDAS.\n\nClick any button to continue";
  text(writeText, width/5+20, height/5+20, 3*width/5-20, 3*height/5-20);
}

function displayVerts(){
  textSize(squareTextSize);
  let y = 80;
  for(let i=0;i<amountOfGuesses;i++){
    displayRowSquares(mainArray[i],y, i);
    y = y + squareSize + 20;
  }
}

function displayRowSquares(s,y,rowNumber){
  let x = (windowWidth/2) - (squareSize+10)*(amountOfLetters*.5);
  for(let i=0;i<amountOfLetters;i++){
    charSquare(x, y, s.substring(i,i+1),rowNumber, i)
    x= x + squareSize + 10;
  }
}

function charSquare(x, y, letter,rowNumber, colNumber){
  
  
  fill(getColor(rowNumber,colNumber));
  square(x, y, squareSize); //x,y, side length
  fill(0,0,0);
  text(letter, x+(squareSize*.25), y+(squareSize*.8));//decimal 4 format
}

function charGuessSquare(){
  let x = (windowWidth/2) - (squareSize+10)*(amountOfLetters*.5);
  for(let i=0;i<amountOfLetters;i++){
    charSquare(x, bottomOne, inputString.substring(i,i+1),-1,-1)
    x= x + squareSize + 10;
  }
}

function getColor(rowNumber,colNumber){
  if(rowNumber==-1)
    return color(255,255,255);
  
  let letter = colorArray[rowNumber].substring(colNumber,colNumber+1);
  
  if(letter=="g")
    return color(0,255,0);
  if(letter=="r")
    return color(255,0,0);
  if(letter=="y")
    return color(255,255,0);
  else
    return color(220,220,220);
    
}

function solveEq(inputString){
  let ops = "+-/*"
  splitUp = []
  splitPoint = 0;
  for(let i=0;i<amountOfLetters;i++){
    if(ops.indexOf(inputString.substring(i,i+1))!=-1){
      append(splitUp,inputString.substring(splitPoint,i));
      append(splitUp,inputString.substring(i,i+1));
      splitPoint = i+1;
    }
  }
  append(splitUp,inputString.substring(splitPoint,amountOfLetters));
  ///["10", "/", "2", "*", "5"]

  while(splitUp.length>1){
      let num1 = parseInt(splitUp[0]);
      let num2 = parseInt(splitUp[2]);
      let out = 0;

      if(splitUp[1]==="+")
        out = num1 + num2;
      if(splitUp[1]==="-")
        out = num1 - num2;
      if(splitUp[1]==="*")
        out = num1 * num2;
      if(splitUp[1]==="/"){
        if(parseInt(num1 / num2)!= (num1/num2))
           return false;
           
        out = num1 / num2;
      }
      
     splitUp.shift();
     splitUp.shift();
     splitUp.shift();
    
     splitUp.unshift(out);
  }  
  return splitUp[0];
}

function getAnswerEq(){
  while(true){
  allowed = "1234567890-+/*";
  
  let testString = "";
  
  for(let i=0;i<amountOfLetters;i++){
    testString = testString + allowed[int(random(0,14))];
    console.log()
    ///testString = testString + allowed[Math.floor(Math.random() * 14) + 0];
  }
  if(checkInput(testString, true) && solveEq(testString)<highestNum && solveEq(testString)>0)
    return testString;
}
}

function wordlePart(inputString){
  let guessStringCopy = guessString;
  
  for(let i=0;i<amountOfLetters;i++){
    if(guessStringCopy.substring(i,i+1)===inputString.substring(i,i+1)){///green
      colorArray[guesses] = colorArray[guesses].substring(0,i) + "g" + colorArray[guesses].substring(i+1,amountOfLetters);
      inputString = inputString.substring(0,i) + "k" + inputString.substring(i+1);
      guessStringCopy = guessStringCopy.substring(0,i) + "t" + guessString.substring(i+1);
    }
  }
  
  for(let i=0;i<amountOfLetters;i++){
    if(guessStringCopy.indexOf(inputString.substring(i,i+1))!=-1){///yellow
        tempNum = guessStringCopy.indexOf(inputString.substring(i,i+1));
        colorArray[guesses] = colorArray[guesses].substring(0,i) + "y" + colorArray[guesses].substring(i+1,amountOfLetters);
        inputString = inputString.substring(0,i) + "k" + inputString.substring(i+1);
        guessStringCopy = guessStringCopy.substring(0,tempNum) + "t" + guessStringCopy.substring(tempNum+1);
      }
  }
  
  for(let i=0;i<amountOfLetters;i++){
    if("1234567890/+-*".indexOf(inputString.substring(i,i+1))!=-1)
      colorArray[guesses] = colorArray[guesses].substring(0,i) + "r" + colorArray[guesses].substring(i+1,amountOfLetters);
  }
}

function win(){
  if(guesses>0){
  for(let i=0;i<amountOfLetters;i++){
    if(colorArray[guesses-1].substring(i,i+1)!=="g")
    return false;
  }
  return true;
  }
  return false;
}

function loss(){
  for(let i=0;i<amountOfLetters;i++){
    if(colorArray[amountOfGuesses-1].substring(i,i+1)!=="g" && guesses==amountOfGuesses)
    return true;
  }
  return false;
}

function checkInput(inputString, first=false){
  let allowed = "1234567890+-*/";
  let ops = "+-/*"
  
  if(ops.indexOf(inputString.substring(0,1))!=-1)
    return false;
  
  if(inputString.substring(0,1)==="0")
     return false;

  
  for(let i=0;i<amountOfLetters;i++){
   if(allowed.indexOf(inputString.substring(i,i+1))==-1)
     return false;
    
   if(ops.indexOf(inputString.substring(i,i+1))!=-1 && ops.indexOf(inputString.substring(i+1,i+2))!=-1)
     return false;
  
  if(ops.indexOf(inputString.substring(i,i+1))!=-1 && inputString.substring(i+1,i+2)==="0")
     return false;
  }
  
  if(solveEq(inputString)!=guessNumber && first==false)
    return false;
  
  return true
}
function keyTyped() {
  if(keyCode !== ENTER && inputString.length<amountOfLetters){
    if("1234567890+-/*".indexOf(key)!=-1)
    inputString = inputString + key;
  }
}
function keyPressed() {
  displayIntroBool = 0;
  
  if(keyCode === BACKSPACE){
    inputString = inputString.substring(0,inputString.length-1)
  }
  
  if(keyCode === ENTER){
    if(inputString.length==amountOfLetters && checkInput(inputString)){
      mainArray[guesses] = inputString;
      wordlePart(inputString);
      
      guesses = guesses + 1;
      inputString = ""
    }
  }
}

function mouseClicked() {
  displayIntroBool = 0;
  if (win() || loss()){
    window.location.reload();
  }
}


function draw() {
  background(240);
  displayHead();
  
  bottomOne = windowHeight*7/8;
  
  displayVerts();
  
  charGuessSquare();
  
  textSize(14);
  text("Seed: " + seedIn,width-textWidth("Seed: " + seedIn)-5,height-5);
  
  if(win()){
    textSize(100);
    fill(color(255,0,0));
    text("WINNER", width/2-textWidth("WINNER")/2, bottomOne - squareSize - 60);
    textSize(20);
    text("click anywhere to play again", width/2-textWidth("click anywhere to play again")/2, bottomOne - squareSize + 25);
  }
  else if(loss()){
    textSize(100);
    fill(color(255,0,0));
    text("LOSER", width/2-textWidth("LOSER")/2, bottomOne - squareSize - 20);
    text(guessString, width/2-textWidth(guessString)/2, bottomOne - squareSize - 120);
    textSize(20);
    text("click anywhere to retry", width/2-textWidth("click anywhere to retry")/2, bottomOne - squareSize + 25);
    
  }
    else{
      textSize(40);
      text(guessNumber, (windowWidth/2)-20, bottomOne - squareSize - 20);
  }
  
  if(displayIntroBool)
    displayIntro();
}
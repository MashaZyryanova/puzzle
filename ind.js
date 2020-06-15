var value=3;
var img;
var canvas;
var stage;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
var _mouse;
const PUZZLE_HOVER_TINT = 'blue';
 
function Start() {
 // document.createElement('img').
 img = new Image();
 img.addEventListener('load',onImage,false);
 img.src = "car1.jpg";
}

function onImage() {
 _pieceWidth = Math.floor(img.width / value)
 _pieceHeight = Math.floor(img.height / value)
 _puzzleWidth = _pieceWidth * value;
 _puzzleHeight = _pieceHeight * value;
 setCanvas();
 initPuzzle();
}

const button = document.querySelector("#puzzle");
button.addEventListener('click', Level);

 function Level(){
    //  if(document.querySelector('#level').value) {
    //     value = document.querySelector('#level').value;
    //  }
     if(document.querySelector('#levels')) {
         
        e = document.querySelector('#levels');
        console.log(e);
        value = e.options[e.selectedIndex].value;
     }
   else {
       value=3;
   }
   console.log (value);
   onImage();

 }

function setCanvas(){
 canvas = document.getElementById('canvas');
 stage =  canvas.getContext('2d');
 canvas.width = _puzzleWidth;
 canvas.height = _puzzleHeight;
 canvas.style.border = "2px solid #05386B";
}

function initPuzzle(){
 _pieces = [];
 _mouse = {x:0,y:0};
 _currentPiece = null;
 _currentDropPiece = null;
 stage.drawImage(img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
 buildPieces();
}

// get each piece x and y coordinates
//creates pices array and shuffles it on button click
function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    // value multiply by value give number of piece in an image 
    //store these pieces in pieces array
    for(i = 0;i < value * value;i++){
        //each piece object had two coordinates (4 values)
        piece = {};
        //the end coordinate of each piece becomes the start coordinate of the next piece
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        //increment xPos by the width of the piece
        xPos += _pieceWidth;
        //if reaches the end of the puzzle, move to the next 'row'
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
        console.log(piece.sx+','+ piece.sy);
        //console.log(piece.xPos+','+ piece.yPos);
    }
   
    const button = document.querySelector("#puzzle");
    button.addEventListener('click', shufflePuzzle);
}

function shufflePuzzle(){
    //console.log(_pieces);
    _pieces = shuffleArray(_pieces);
    stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
}

function shuffleArray(o){
 for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
 return o;
}

function onPuzzleClick(e){
    console.log(e);
    console.log(e.target);//canvas is firing the event
    if(e.layerX || e.layerX == 0){
     //console.log(_mouse);
     _mouse.x = e.layerX - canvas.offsetLeft;
     _mouse.y = e.layerY - canvas.offsetTop;
     
    }
    else if(e.offsetX || e.offsetX == 0){
     _mouse.x = e.offsetX - canvas.offsetLeft;
     _mouse.y = e.offsetY - canvas.offsetTop;
     //console.log(_mouse);
    }

        _currentPiece = checkPieceClicked();
        if(_currentPiece != null){
            stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
            stage.save();
            stage.globalAlpha = .9;
            stage.drawImage(img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
            stage.restore();
            document.onmousemove = updatePuzzle;
            document.onmouseup = pieceDropped;
        }
}

function checkPieceClicked(){
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            console.log("outside the puzzle borders");
        }
        else{
            console.log("===============================current piece =====================")
            console.log(piece);
            return piece;
        }
    }
    return null;
}

function updatePuzzle(e){
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - canvas.offsetLeft;
        _mouse.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - canvas.offsetLeft;
        _mouse.y = e.offsetY - canvas.offsetTop;
    }
 stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
 var i;
 var piece;
 for(i = 0;i < _pieces.length;i++){
     piece = _pieces[i];
     if(piece == _currentPiece){
         continue;
     }
     stage.drawImage(img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
     stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
     if(_currentDropPiece == null){
         if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
             //NOT OVER
         }
         else{
             _currentDropPiece = piece;
             stage.save();
             stage.globalAlpha = .4;
             stage.fillStyle = PUZZLE_HOVER_TINT;
             stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
             stage.restore();
         }
     }
 }
 stage.save();
 stage.globalAlpha = .6;
 stage.drawImage(img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
 stage.restore();
 stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function pieceDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
    stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        stage.drawImage(img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }



    if(gameWin){
        setTimeout(gameOver,500);
    }
}



function congrats(msg){
    stage.globalAlpha = .4;
    stage.fillRect(0,_puzzleHeight - 940,_puzzleWidth,240);
    stage.fillStyle = "#05386B";
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "150px Arial";
    stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight-800);
}

function gameOver(){
    console.log("Congratulations");
    document.querySelector('#win').innerHTML = "Congratulations! Click to play again.";
    //congrats("Congratulations!");
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}
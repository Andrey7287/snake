//options
var newGame = {
  elem: 'matrix',
  //rows: 15,
  //cells: 15,
  //level: 3
}; 

function Game(obj){

  this._options = obj ? obj : {};
  if(this._options.level) {
    this._options.level = this._options.level - 1;
    this._options.levelOrigin = this._options.level;
  };
  this.startNewGame = function(){
   
    var tableField = document.querySelector('.table-field');
    if(!tableField){
      
      if( !this._options.rows ) { this._options.rows = 20 };
      if( !this._options.cells ) { this._options.cells = 20 };
      
      this.createField();
      
    };
    
    if( !this._options.level ) { 
      this._options.level = 1 
    } else {
      this._options.level += 1;
    };
    
    
    this.createTarget();
    this.createStartPoint();
    this.createWalls();
    this.setSpeed();
    
    var info = this._options.table.querySelector('.table-info');
    info.innerHTML = "Level: " + this._options.level;
   
    document.body.onkeydown = this.start.bind(this);
  };
  
};

Game.prototype.createField = function(){
  
  var elem = this._options.elem ? document.getElementById(this._options.elem) :
                                 document.body;
  var tpl = document.getElementById('field-template').innerHTML;
  var makeField = _.template(tpl);
  var field = document.createElement('table');
  
  field.className = 'table-field';
  field.innerHTML = makeField(this._options);
  this._options.table = field;
  
  elem.appendChild(field);
};

Game.prototype.createTarget = function(){
  
  var table = this._options.table;
  var currentTarget = table.querySelector('.table-field__item--target');
  if(currentTarget){
    currentTarget.classList.remove('table-field__item--target');
  }
  var randomCell = this.getRandomCell();
  randomCell.classList.add('table-field__item--target');
  
  this._options.target = randomCell;
};

Game.prototype.createStartPoint = function(){
  
  var table = this._options.table;
  var activeCell = table.querySelector('.table-field__item--active');
  if(activeCell) {
    activeCell.classList.remove('table-field__item--active');
  };
  table.rows[0].cells[0].classList.add('table-field__item--active');
  
  this._options.activeCell = table.rows[0].cells[0];
};

Game.prototype.createWalls = function(){
  
  var oldWalls = this._options.table.querySelectorAll('td');
  Array.prototype.forEach.call(oldWalls, function(td){
    td.classList.remove('table-field__item--wall');  
  });
  
  var level = this._options.level;
  for ( var walls = 3 * level; walls > 0; walls--){
    
    do {
      var cell = this.getRandomCell();
    } while ( cell.classList.contains('table-field__item--wall') ||
              cell.classList.contains('table-field__item--target')
            );
    cell.classList.add('table-field__item--wall');
    
  };
  
};

Game.prototype.getRandomCell = function(){
  
  var table = this._options.table;
  
  do {
    var tr = Math.round( -0.5 + Math.random() * (this._options.rows));// случайное от 0 до cells - 1
    var td = Math.round( -0.5 + Math.random() * (this._options.cells));
  } while ( tr === td && tr === 0 );
  
  return table.rows[tr].cells[td];
  
};

Game.prototype.setSpeed = function(){
  
  var speed = 1000;
  
  if(this._options.level === 1){
    this._options.speed = speed;
    return;
  };
  for ( var i = this._options.level; i > 1; i--){
    speed = speed / 1.5;
  };

  this._options.speed = parseInt(speed);
};

Game.prototype.start = function(e){

  switch (e.keyCode) {
  
    case 37 : //LEFT
    this.moveLeft();
    break;
    
    case 38 : //UP
    this.moveUp();
    break;
    
    case 39 : //RIGHT
    this.moveRight();
    break;
    
    case 40 : //DOWN
    this.moveDown();
  };
  
};

Game.prototype.moveLeft = function(){
  
  clearInterval(this._options.idInterval);
  
  var prev = this._options.activeCell;
  var next = prev.previousElementSibling;
  
  var checker = this.checkTarget(next, prev);
  
  if(checker){
    this.startNewGame();
    return;
  };
  this._options.idInterval = setTimeout(this.moveLeft.bind(this), this._options.speed);
  
};
Game.prototype.moveUp = function(){
  
  clearInterval(this._options.idInterval);
  
  var prev = this._options.activeCell;
  var parent = prev.parentNode;
  var index = Array.prototype.indexOf.call(parent.children, prev);
  if(!parent.previousElementSibling) { 
    alert('Game Over!');
    this._options.level = this._options.levelOrigin || 0;
    this.startNewGame();
    return;
  };
  var next = parent.previousElementSibling.children[index];
  
  var checker = this.checkTarget(next, prev);
  
  if(checker){
    this.startNewGame();
    return;
  };
  this._options.idInterval = setTimeout(this.moveUp.bind(this), this._options.speed);
  
};
Game.prototype.moveRight = function(){
  
  clearInterval(this._options.idInterval);
  
  var prev = this._options.activeCell;
  var next = prev.nextElementSibling;
  
  var checker = this.checkTarget(next, prev);
  
  if(checker){
    this.startNewGame();
    return;
  };
  this._options.idInterval = setTimeout(this.moveRight.bind(this), this._options.speed);
  
};
Game.prototype.moveDown = function(){
  
  clearInterval(this._options.idInterval);
  
  var prev = this._options.activeCell;
  var parent = prev.parentNode;
  var index = Array.prototype.indexOf.call(parent.children, prev);
  if(!parent.nextElementSibling) {
    alert('Game Over!');
    this._options.level = this._options.levelOrigin || 0;
    this.startNewGame();
    return;
  };
  var next = parent.nextElementSibling.children[index];
  
  var checker = this.checkTarget(next, prev);

  if(checker){
    this.startNewGame();
    return;
  };
  this._options.idInterval = setTimeout(this.moveDown.bind(this), this._options.speed);
};

Game.prototype.checkTarget = function(next, prev){
  if (!next){
    alert('Game Over!');
    this._options.level = this._options.levelOrigin || 0;
    return true;
  };
  if (next === this._options.target) {
    alert('You WIN!');
    return true;
  };
  if ( next.classList.contains('table-field__item--wall') ) {
    alert('Game Over!');
    this._options.level = this._options.levelOrigin || 0;
    return true;
  };
  this.toggleClass(next, prev);
  return false;
};

Game.prototype.toggleClass = function(next, prev){
  prev.classList.remove('table-field__item--active');
  next.classList.add('table-field__item--active');
  this._options.activeCell = next;  
};

var game = new Game(newGame);
game.startNewGame();
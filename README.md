# snake

Constructor Game initial new game in variable. For exampale: 

var game = new Game();

By default it makes new field with size 20 x 20  in the body of HTML document.
Available following options:

elem - id of html element which will be included game field.
rows - number of rows.
cells - number of cells.
level - start level.

For exampale:

var game = new Game({
  elem: 'matrix',
  rows: 20,
  cells: 20,
  level: 3
});

For start script : 

game.startNewGame();

Use arrow keys for moving snake. Try to get red square. 
Gud luck!

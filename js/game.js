const COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var intervalRender;
var score;
var current;
var currentX, currentY;
var freezed;
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];

function newShape() {
    var id = Math.floor( Math.random() * shapes.length );

    current = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shapes[ id ][ i ] != 'undefined' && shapes[ id ][ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    freezed = false;
    currentX = 5;
    currentY = 0;
}

function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    else {
        freezeShape();
        valid(0, 1);
        clearLines();
        if (lose) {
            clearInterval( interval );
            clearInterval( intervalRender );
            return false;
        }
        newShape();
    }
}

function freezeShape() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
}

function rotate(current) {
    var newCurrent = [];
    for (var y = 0; y < 4; ++y) {
        newCurrent[y] = [];
        for (var x = 0; x < 4; ++x) {
            newCurrent[y][x] = current[3 - x][y];
        }
    }
    return newCurrent;
}

function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
            clearInterval(interval);
            interval = setInterval(tick, 1200 / (score++ + 2));
            document.getElementById("score").innerHTML = 'Score: ' + score*100;
        }
    }
}

function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
        case 'drop':
            while( valid(0, 1) ) {
                ++currentY;
            }
            tick();
            break;
    }
}

function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY == 1 && freezed) {
                        lose = true; 
                        document.getElementById('playbutton').disabled = false;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function startTheGame() {
    lose = false;
    score = 0;
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
    newShape();
    intervalRender = setInterval(render, 30);
    interval = setInterval(tick, 600);
    document.getElementById("score").innerHTML = 'Score: 0';
    document.getElementById("playbutton").disabled = true;
}

var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
const W = 300, H = 600;
const BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var color;
var colors = [document.getElementById("cyan"),
              document.getElementById("pink"),
              document.getElementById("yellow"),
              document.getElementById("green"),
              document.getElementById("brown"),
              document.getElementById("blue"),
              document.getElementById("red")];

function drawBlock(img, x, y) {
    ctx.drawImage(img, BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
}

function render() {
    ctx.clearRect( 0, 0, W, H );

    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                color = colors[ board[ y ][ x ] - 1 ];
                drawBlock( color, x, y );
            }
        }
    }

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                color = colors[ current[ y ][ x ] - 1 ];
                drawBlock( color, currentX + x, currentY + y );
            }
        }
    }
}

var canvas;
var grid_size;
var maxVerticalLines;
var numHorizontalLines;
var bgMode;
var strokeMode;
var bgChanged;

// 0: small, 1: large
var responsiveMode;
var minWidth = 600;
var h = 1024;

// glitch variables
var mouseMovedCounter, mouseMovedFlag, maxMouseMovedCounter;
var xOffset, yOffset, maxOffset, offset;
var prevTop, prevBottom, prevLeft, prevRight;

$(window).load(function() {
  $('#hide-all').css('display', 'block');
});

function setup() {
  if( windowWidth <= minWidth ) {
    responsiveMode = 0;
    maxVerticalLines = 5;
    numHorizontalLines = 27;
  } else {
    responsiveMode = 1;
    maxVerticalLines = 15;
    numHorizontalLines = 36;
  }
  grid_size = windowWidth / maxVerticalLines;
  h = grid_size * numHorizontalLines;
  canvas = createCanvas(windowWidth, h);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  $(function() {
    var $body = $(document);
    $body.bind('scroll', function() {
      // "Disable" the horizontal scroll.
      if ($body.scrollLeft() !== 0) {
        $body.scrollLeft(0);
      }
    });
  });
  $('.title-fluid').bind('mouseover', onHoverFluid).bind('mouseout', onLeaveFluid);
  // document.getElementById('vid').onclick = () => { document.getElementById('vid').play(); }
  bgMode = 0;
  strokeMode = 255;
  bgChanged = false;
  mouseMovedFlag = 0;
  mouseMovedCounter = 0;
  maxMouseMovedCounter = 25; // number of glitch ticks
  maxOffset = 1.2;
  offset = maxOffset;
  prevTop = 0;
  prevBottom = 0;
  prevLeft = 0;
  prevRight = 0;
  strokeWeight(0.5);
  background(bgMode);
  stroke(strokeMode);
}

function draw() {
  background(bgMode);
  stroke(strokeMode);

  // get neighboring 4 lines based on mouse location
  var top = grid_size * Math.floor(mouseY / grid_size); // 0
  var bottom = top + grid_size + 3; // 1
  var left = grid_size * Math.floor(mouseX / grid_size); // 2
  var right = left + grid_size + 3; // 3

  // check if neighboring lines change
  if(top === prevTop && bottom == prevBottom && left == prevLeft && right == prevRight) {
    // turn on glitch if neighboring lines dont change (mouse stays)
    if(mouseMovedFlag == 0) mouseMovedFlag = 1;
    if(mouseMovedFlag == 1) {
      if(mouseMovedCounter < maxMouseMovedCounter) {
        mouseMovedCounter++;
        offset = map(mouseMovedCounter, 0, maxMouseMovedCounter, maxOffset, 0);
      }
    }
  } else {
    // reset all if neighboring lines change
    mouseMovedFlag = 0;
    mouseMovedCounter = 0;
    offset = maxOffset;
  }

  // draw vertical lines
  for(var x = grid_size; x < windowWidth; x+=grid_size) {
    if( responsiveMode == 1 ) {
      if (x > grid_size * 9 + 1 && x < grid_size * 14 - 1) {
        line(x, 0, x, grid_size);
        if(x > grid_size * 11 - 1 && x < grid_size * 14 - 1) line(x, 14.5 * grid_size, x, grid_size * 15);
        else line( x, 14 * grid_size, x, 15* grid_size);
        line(x, grid_size * 33, x, h);
      } else if (x >= grid_size && x <= grid_size * 3) {
        line(x, 0, x, h - grid_size);
      } else {
        line(x, 0, x, h);
      }
    } else if (responsiveMode == 0) {
      if(x == grid_size * 2) {
        line(x, 0, x, grid_size * 2);
        line(x, grid_size * 10.5, x, grid_size * 11);
        line(x, grid_size * 20, x, h - grid_size * 2);
      } else if (x == grid_size) {
        line(x, 0, x, h - grid_size * 2);
      } else if (x >= grid_size * 3 && x < windowWidth) {
        line(x, 0, x, grid_size * 2);
        line(x, grid_size * 10.5, x, grid_size * 11);
        line(x, grid_size * 20, x, h);
      } else {
        line(x, 0, x, h);
      }
    }
  }

  // draw horizontal lines
  for(var y = grid_size; y < h; y+=grid_size) {
    if(responsiveMode == 1) {
      if( (y > grid_size && y <= grid_size * 5) || (y >= grid_size * 19 + 1 && y <= grid_size * 21 - 1) || (y >= grid_size * 25 + 1 && y <= grid_size * 27 - 1) || (y >= grid_size * 31 + 1 && y <= grid_size * 33 - 1) ) {
        line(0, y, grid_size * 9, y);
        line(grid_size * 14, y, windowWidth, y);
      } else {
        line(0, y, windowWidth, y);
      }
    } else if (responsiveMode == 0) {
      if(y > grid_size * 2 && y <= grid_size * 7) {
        line(0, y, grid_size, y);
      } else if ( y > (h - grid_size) - 1) {
        line(grid_size * 3, y, windowWidth, y);
      } else {
        line(0, y, windowWidth, y);
      }
    }
  }

  if(mouseMovedFlag == 1 && mouseMovedCounter < maxMouseMovedCounter) {
    // avoid blank spaces
    if( ( responsiveMode == 1 && ( (left >= grid_size * 9 && right <= grid_size * 15 && top >= grid_size && bottom <= grid_size * (numHorizontalLines - 2)) ||
        (left >= 0 && right <= grid_size * 5 && top >= (numHorizontalLines-1) * grid_size) ) )  ||
        ( responsiveMode == 0 && ((left >= grid_size && right < windowWidth + 10 && top >= grid_size * 2 && bottom <= grid_size * 21) || left >= 0 && right <= grid_size * 3 + 10 && top >= (numHorizontalLines - 2) * grid_size))
      )
      return;

    // clear mouse area on canvas
    fill(bgMode);
    stroke(bgMode);
    rect(left-1, top-1, grid_size+2, grid_size+2);

    // draw glitch
    stroke(strokeMode);
    xOffset = 0;
    yOffset = 0;
    for(var x = left; x <= right; x += grid_size) {
      for(var y = top; y < bottom; y ++) {
        if(int(random(0, 10)) == 1) {
          xOffset += random(-offset, offset);
        }
        point(x + xOffset, y);
      }
    }
    for(var y = top; y <= bottom; y+= grid_size) {
      for(var x = left; x < right; x++) {
        if(int(random(0, 10)) == 1) {
          yOffset += random(-offset, offset);
        }
        point(x, y + yOffset);
      }
    }
  }

  // store previous neighboring lines if change
  if(mouseMovedFlag == 0){
    prevTop = top;
    prevBottom = bottom;
    prevLeft = left;
    prevRight = right;
  }
}

function onHoverFluid() {
  bgMode = 255;
  strokeMode = 0;
  $('.title-fluid').css( {
                            'color': '#FFF',
                            '-webkit-text-stroke': ' #000 0.5px'
                          } );
  $('.text').css('color', "#000");
  $('.title-motion').css('color', "#000");
  $('#large-logo').attr('src', '../../assets/img/large-dark-logo.png');
  // $('.white-space').css('background-color', '#FFF');
}

function onLeaveFluid() {
  bgMode = 0;
  strokeMode = 255;
  $('.title-fluid').css('-webkit-text-stroke', '0px');
  $('.text').css('color', "#FFF");
  $('.title-motion').css('color', "#FFF");
  $('#large-logo').attr('src', '../../assets/img/large-light-logo.png');
  // $('.white-space').css('background-color', '#000');
}

function windowResized() {
  if( windowWidth <= minWidth ) {
    responsiveMode = 0;
    maxVerticalLines = 5;
    numHorizontalLines = 27;
  } else {
    responsiveMode = 1;
    maxVerticalLines = 15;
    numHorizontalLines = 36;
  }
  grid_size = windowWidth / maxVerticalLines;
  h = grid_size * numHorizontalLines;
  resizeCanvas(windowWidth, h);
}

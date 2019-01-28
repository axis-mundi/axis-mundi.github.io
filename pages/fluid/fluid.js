var canvas;
var grid_size;
var maxVerticalLines;
var numHorizontalLines;
var bgMode;
var strokeMode;
var bgChanged;
var vidPlaying = false;

// 0: small, 1: large
var responsiveMode;
var minWidth = 600;
var h = 1024;

// background gradient variables
var color, colorIndex;
var colorLimX, colorLimY;
var secondaryColors;

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
  var gifs = $('.gif');
  gifs.each(function(index) {
    $(this).attr('src', $(this).attr('data-src'));
  });
  $('.title-motion').bind('mouseover', onHoverMotion).bind('mouseout', onLeaveMotion);

  // handles start and end of video
  var vid = document.getElementById('vid');

  if(isMobile()) {
    vid.setAttribute('src', '../../assets/vid/fluid-sm.mp4');
    document.getElementById('vid-placeholder').setAttribute('src', '../../assets/img/vid-fluid-sm.png');
    vid.addEventListener('playing', function() {
      $('#play-btn').css('visibility', 'hidden');
      vidPlaying = true;
    });
    vid.addEventListener('pause', function() {
      $('#pause-btn').css('visibility', 'hidden');
      $('#play-btn').css('visibility', 'visible');
      vidPlaying = false;
    });
    vid.addEventListener('ended', function() {
      $('#vid-placeholder').css('z-index', '2');
      $('#play-btn').css('visibility', 'visible');
    });
    $('#vid-wrapper').click(function() {
      if(vidPlaying) {
        vid.pause();
      } else {
        vid.play();
        $('#vid-placeholder').css('z-index', '-1');
      }
    });
  } else {
    vid.addEventListener('playing', function() {
      $('#play-btn').css('visibility', 'hidden');
      vidPlaying = true;
    });
    vid.addEventListener('pause', function() {
      $('#pause-btn').css('visibility', 'hidden');
      vidPlaying = false;
    });
    vid.addEventListener('ended', function() {
      $('#vid-placeholder').css('z-index', '2');
      $('#play-btn').css('visibility', 'visible');
    });
    $('#play-btn').click(function() {
      vid.play();
      $('#vid-placeholder').css('z-index', '-1');
    });
    $('#pause-btn').click(function() {
      vid.pause();
    });
    $('#vid-wrapper').bind('mouseover', () => {
      if(vidPlaying) {
        $('#pause-btn').css('visibility', 'visible');
      } else {
        $('#play-btn').css('visibility', 'visible');
      }
    });
    $('#vid-wrapper').bind('mouseout', () => {
      $('#pause-btn').css('visibility', 'hidden');
      $('#play-btn').css('visibility', 'hidden');
    });
    if(windowWidth <= minWidth) {
      $('#vid').css({
                        'height': '60vw',
                        'width' : 'auto'
                    });
      $('#vid-placeholder').css({
                                    'height': '60vw',
                                    'width' : 'auto'
                                });
    } else {
      $('#vid').css({
                        'width': '93.3333vw',
                        'height' : 'auto'
                    });
      $('#vid-placeholder').css({
                                    'width': '93.3333vw',
                                    'height' : 'auto'
                                });
    }
  }

  bgMode = 255;
  strokeMode = 0;
  bgChanged = false;
  secondaryColors = [color(119, 210, 175),
                      color(104, 140, 90),
                      color(167, 195, 140),
                      color(246, 231, 204),
                      color(220, 151, 137)];
  colorIndex = random(5);
  color = secondaryColors[int(colorIndex)];
  if(responsiveMode == 1) {
    colorLimX = windowWidth / grid_size / 2;
    colorLimY = windowHeight / grid_size / 2;
  } else if (responsiveMode == 0) {
    colorLimX = windowWidth / grid_size;
    colorLimY = windowHeight / grid_size;
  }
  strokeWeight(0.8);
  background(bgMode);
  stroke(strokeMode);
}

function draw() {
  background(bgMode);
  // stroke(strokeMode);

  // draw vertical lines
  for(var x = grid_size; x < windowWidth; x+=grid_size) {
    var dist = abs(x - mouseX) / grid_size;
    var alpha = dist / colorLimX * (-255) + 255;
    if(dist < colorLimX - 1) stroke(red(color), green(color), blue(color), alpha);
    else stroke(200);
    if( responsiveMode == 1 ) {
      if (x > grid_size * 9 + 1 && x < grid_size * 14 - 1) {
        line(x, 0, x, grid_size);
        line( x, 14 * grid_size, x, 15* grid_size);
        line(x, grid_size * 33, x, h);
      } else if (x >= grid_size && x <= grid_size * 3) {
        line(x, 0, x, h - grid_size);
      } else {
        line(x, 0, x, h);
      }
    }
    else if (responsiveMode == 0) {
      if(x == grid_size * 2) {
        line(x, 0, x, grid_size * 2);
        line(x, grid_size * 10, x, grid_size * 11);
        line(x, grid_size * 20, x, h - grid_size * 2);
      } else if (x == grid_size) {
        line(x, 0, x, h - grid_size * 2);
      } else if (x >= grid_size * 3 && x < windowWidth) {
        line(x, 0, x, grid_size * 2);
        line(x, grid_size * 10, x, grid_size * 11);
        line(x, grid_size * 20, x, h);
      } else {
        line(x, 0, x, h);
      }
    }
  }


  // draw horiziontal lines
  for(var y = grid_size; y < h; y+=grid_size) {
    if(responsiveMode == 1) {
      var dist = abs(y - mouseY) / grid_size;
      var alpha = dist / colorLimY * (-255) + 255;
      if(dist < colorLimY - 1) stroke(red(color), green(color), blue(color), alpha);
      else stroke(200);
      if( (y > grid_size && y <= grid_size * 5) || (y >= grid_size * 19 + 1 && y <= grid_size * 21 - 1) || (y >= grid_size * 25 + 1 && y <= grid_size * 27 - 1) || (y >= grid_size * 31 + 1 && y <= grid_size * 33 - 1) ) {
        line(0, y, grid_size * 9, y);
        line(grid_size * 14, y, windowWidth, y);
      } else {
        line(0, y, windowWidth, y);
      }
    }
    else if (responsiveMode == 0) {
      if(y > grid_size * 2 && y <= grid_size * 7) {
        line(0, y, grid_size, y);
      } else if ( y > (h - grid_size) - 1) {
        line(grid_size * 3, y, windowWidth, y);
      } else {
        line(0, y, windowWidth, y);
      }
    }
  }
}

function onHoverMotion() {
  bgMode = 49;
  strokeMode = 255;
  $('.title-motion').css( {
                            'color': '#313131',
                            '-webkit-text-stroke': ' #FFF 0.5px'
                          } );
  $('.text').css('color', '#FFF');
  $('.title-fluid').css('color', '#FFF');
  $('#large-logo').attr('src', '../../assets/img/large-light-logo.png');
  // $('.white-space').css('background-color', '#000');
}

function onLeaveMotion() {
  bgMode = 255;
  strokeMode = 0;
  $('.title-motion').css('-webkit-text-stroke', '0px');
  $('.text').css('color', '#000');
  $('.title-fluid').css('color', '#000');
  $('#large-logo').attr('src', '../../assets/img/large-dark-logo.png');
  // $('.white-space').css('background-color', '#FFF');
}

function windowResized() {
  if( windowWidth <= minWidth ) {
    responsiveMode = 0;
    maxVerticalLines = 5;
    numHorizontalLines = 27;
    colorLimX = windowWidth / grid_size;
    colorLimY = windowHeight / grid_size;
  } else {
    responsiveMode = 1;
    maxVerticalLines = 15;
    numHorizontalLines = 36;
    colorLimX = windowWidth / grid_size / 2;
    colorLimY = windowHeight / grid_size / 2;
  }
  grid_size = windowWidth / maxVerticalLines;
  h = grid_size * numHorizontalLines;
  colorLimY = windowHeight / grid_size / 2;
  resizeCanvas(windowWidth, h);
  if(!isMobile()) {
    if(windowWidth <= minWidth) {
      $('#vid').css({
                        'height': '60vw',
                        'width' : 'auto'
                    });
      $('#vid-placeholder').css({
                                    'height': '60vw',
                                    'width' : 'auto'
                                });
    } else {
      $('#vid').css({
                        'width': '93.3333vw',
                        'height' : 'auto'
                    });
      $('#vid-placeholder').css({
                                    'width': '93.3333vw',
                                    'height' : 'auto'
                                });
    }
  }
}

function isMobile() {
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile()){
        return true;
    }else{
        return false;
    }
}

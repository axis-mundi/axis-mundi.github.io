// Background variables
var canvas;
var grid_size;
var maxVerticalLines;
var numHorizontalLines;
var bgMode;
var strokeMode;
var bgChanged;
var responsiveMode; // 0: small, 1: large
var mobileWidth = 600; // mobile size

function setup()
{
  if( windowWidth <= mobileWidth ) {
    responsiveMode = 0;
    maxVerticalLines = 5;
  } else {
    responsiveMode = 1;
    maxVerticalLines = 15;
  }
  grid_size = windowWidth / maxVerticalLines;
  if(responsiveMode == 1 ) {
    numHorizontalLines = 24 + Math.floor(windowHeight / grid_size);
  } else if (responsiveMode == 0) {
    numHorizontalLines = 32 + Math.floor(windowHeight / grid_size);
  }
  h = grid_size * numHorizontalLines;  // 31 is the number of horizontal lines
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
  $('.title-motion').bind('mouseover', onHoverMotion).bind('mouseout', onLeaveMotion);
  $('.title-fluid').bind('mouseover', onHoverFluid).bind('mouseout', onLeaveFluid);
  $('div.home').not('a').bind('click', scrollToAbout);
  $('.home-btn').bind('click', scrollToHome);
  bgMode = 255;
  strokeMode = 0;
  bgChanged = false;
  strokeWeight(0.5);
  background(bgMode);
  stroke(strokeMode);
  if(responsiveMode == 1) $('#space-between-title-and-copyright').addClass('space-' + (Math.floor(windowHeight / grid_size) - 5));
  else if (responsiveMode == 0 ) $('#space-between-title-and-copyright').addClass('space-sm-' + (Math.floor(windowHeight / grid_size) - 5));
}

function draw()
{
  background(bgMode);
  stroke(strokeMode);
  var dividerTop = $('#divider').offset().top;

  // draw vertical lines
  for(var x = grid_size; x < windowWidth-1; x+=grid_size) {
    if( responsiveMode == 1 ) {
      if (x >= grid_size && x < grid_size * 3) {
        line(x, 0, x, (Math.floor(windowHeight / grid_size) - 1) * grid_size);
        line(x, Math.floor(windowHeight / grid_size) * grid_size, x, (numHorizontalLines-1)* grid_size);
        line(x, numHorizontalLines * grid_size, x, h);
      } else if (x == grid_size * 3){
        line(x, 0, x, (Math.floor(windowHeight / grid_size) - 1) * grid_size);
        line(x, Math.floor(windowHeight / grid_size) * grid_size, x, dividerTop + grid_size * 8);
        line(x, dividerTop + grid_size * 13, x, (numHorizontalLines-1)*grid_size);
        line(x, numHorizontalLines * grid_size, x, h);
      } else if(x >= grid_size * 4 && x <= grid_size * 7 - 1) {
        line(x, 0, x, dividerTop + grid_size * 8);
        line(x, dividerTop + grid_size * 13, x, h);
      } else if( x > grid_size * 9 + 1 && x <= grid_size * 13 + 1 ){
        line(x, 0, x, dividerTop + grid_size * 2);
        line(x, dividerTop + grid_size * 7, x, dividerTop + grid_size * 8);
        if(x > grid_size * 13 - 1) line(x, dividerTop + grid_size * 19, x, h);
        else line(x, dividerTop + grid_size * 19.5, x, h);
      } else {
        line(x, 0, x, h);
      }
    } else if ( responsiveMode == 0 ) {
      if( x == grid_size * 1) {
        line(x, 0, x, (Math.floor(windowHeight / grid_size) - 1) * grid_size);
        line(x, (Math.floor(windowHeight / grid_size) + 1) * grid_size, x, (numHorizontalLines - 2) * grid_size);
      } else if ( x == grid_size * 2 ) {
        line(x, 0, x, (Math.floor(windowHeight / grid_size) - 1) * grid_size);
        line(x, (Math.floor(windowHeight / grid_size) + 1) * grid_size, x, dividerTop + grid_size * 3);
        line(x, dividerTop + grid_size * 8, x, dividerTop + grid_size * 9);
        line(x, dividerTop + grid_size * 14, x, dividerTop + grid_size * 15);
        line(x, dividerTop + grid_size * 23, x, (numHorizontalLines - 2) * grid_size);
      } else if ( x >= grid_size * 3 && x < windowWidth ) {
        line(x, 0, x, dividerTop + grid_size * 3);
        line(x, dividerTop + grid_size * 8, x, dividerTop + grid_size * 9);
        line(x, dividerTop + grid_size * 14, x, dividerTop + grid_size * 15);
        line(x, dividerTop + grid_size * 23, x, h);
      } else {
        line(x, 0, x, h);
      }
    }
  }

  // draw horizontal lines
  for(var y = grid_size; y < h; y+=grid_size) {
    if(responsiveMode == 1) {
      if(y > dividerTop + grid_size * 2 + 1 && y < dividerTop + grid_size * 7) {
        line(0, y, grid_size * 9, y);
        line(grid_size * 14, y, grid_size * 15, y);
      } else if (y > dividerTop + grid_size * 8 + 1 && y < dividerTop + grid_size * 13) {
        line(0, y, grid_size * 2, y);
        line(grid_size * 7, y, grid_size * 9, y);
        line(grid_size * 14, y, grid_size * 15, y);
      } else {
        line(0, y, windowWidth, y);
      }
    } else if (responsiveMode == 0 ) {
      if( (y > Math.floor(windowHeight / grid_size) * grid_size - 1 && y < (Math.floor(windowHeight / grid_size) + 1) * grid_size - 1) ||
          (y > (numHorizontalLines - 2) * grid_size + 1))
      {
        line(grid_size * 3, y, windowWidth, y);
      } else if ( (y >= dividerTop + grid_size * 4 && y < dividerTop + grid_size * 8 ) ||
                  (y >= dividerTop + grid_size * 10 && y < dividerTop + grid_size * 14) ||
                  (y >= dividerTop + grid_size * 16 && y < dividerTop + grid_size * 20)
                )
      {
        line(0, y, grid_size, y);
      } else {
        line(0, y, windowWidth, y);
      }
    }
  }
}

function onHoverFluid() {
  bgMode = 255;
  strokeMode = 0;
  $('.title-fluid').css({
                          'color': '#FFF',
                          'webkit-text-stroke': '#000 0.5px'
                        });

  // TO ADD: ratio to place img-fluid based on width
  if(windowWidth > 1175) {
    $('#img-fluid').css('left', '66.666667vw');
  } else if (windowWidth <= 480) {
    $('#img-fluid').css('left', '40vw');
  } else if (windowWidth < 940) {
    $('#img-fluid').css('left', '53.333333vw');
  } else {
    $('#img-fluid').css('left', '60vw');
  }

  if( windowWidth <= 480 ) {
    $('#img-fluid').css('height', grid_size * 4 + 'px');
  } else {
    $('#img-fluid').css('height', Math.floor(windowHeight / grid_size) *grid_size + 'px');
  }
  $('#img-fluid').removeClass('hide').addClass('show');
}

function onHoverMotion() {
  bgMode = 0;
  strokeMode = 255;
  $('#logo').attr('src', '../../assets/img/small-light-logo.png');
  $("#large-logo").attr('src', '../../assets/img/large-light-logo.png');
  $('.title-fluid').css('color', '#FFF');
  $('.title-motion').css({
                            'color': '#000',
                            'webkit-text-stroke': '#FFF 0.5px'
                        });

  // TO ADD: ratio to place img-motion based on width
  if(windowWidth > 1106) {
    $('#img-motion').css('width', ( grid_size * 9 ) + 'px');
  } else if (windowWidth <= 480) {
    $('#img-motion').css('height', ( grid_size * 3 ) + 'px');
  } else {
    $('#img-motion').css('height', (windowHeight - grid_size * 3) + 'px');
  }
  $('#img-motion').removeClass('hide').addClass('show');

  $('.text').css('color', '#FFF');
  $('.about .title').not('.title-motion').css('color', '#FFF');
}

function onLeaveFluid() {
  bgMode = 255;
  strokeMode = 0;
  $('.title-fluid').css({
                            'color': '#000',
                            'webkit-text-stroke': '0px'
                        });
  $('.title-motion').css('color', '#000');
  $('#img-fluid').removeClass('show').addClass('hide');
}

function onLeaveMotion() {
  bgMode = 255;
  strokeMode = 0;
  $('#logo').attr('src', '../../assets/img/small-dark-logo.png');
  $('#large-logo').attr('src', '../../assets/img/large-dark-logo.png');
  $('.title-fluid').css('color', 'black');
  $('.title-motion').css('webkit-text-stroke', '0px');
  $('#img-motion').removeClass('show').addClass('hide');
  $('.text').css('color', '#000');
  $('.about .title').not('.title-motion').css('color', '#000');
}

function scrollToHome () {
  $('html, body').animate( {scrollTop: 0}, 1000);
}

function scrollToAbout () {
  $('html, body').animate({scrollTop: $('#divider').offset().top + grid_size }, 1000);
}

function windowResized() {
  grid_size = windowWidth / maxVerticalLines;
  if(responsiveMode == 1 ) {
    numHorizontalLines = 24 + Math.floor(windowHeight / grid_size);
  } else if (responsiveMode == 0) {
    numHorizontalLines = 32 + Math.floor(windowHeight / grid_size);
  }
  h = grid_size * numHorizontalLines;
  resizeCanvas(windowWidth, h);
  if( windowWidth <= mobileWidth ) {
    responsiveMode = 0;
    maxVerticalLines = 5;
  } else {
    responsiveMode = 1;
    maxVerticalLines = 15;
  }
  if(responsiveMode == 1) $('#space-between-title-and-copyright').removeClass( (index, className) => {
    return (className.match (/(^|\s)space-\S+/g) || []).join(' ');
  }).addClass('space-' + (Math.floor(windowHeight / grid_size) - 5));
  else if (responsiveMode == 0 ) $('#space-between-title-and-copyright').removeClass( (index, className) => {
    return (className.match (/(^|\s)space-sm-\S+/g) || []).join(' ');
  }).addClass('space-sm-' + (Math.floor(windowHeight / grid_size) - 5));

}

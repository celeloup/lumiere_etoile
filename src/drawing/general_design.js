// COLORS
var dark_blue = "#0f2032";
var light_blue = "#93A1AD";
var white = "#fdedd7";
var medium_blue = "#405569";
var other_light_blue = "#7d8a91";
var blue_color = "#29488d";
var brown = "#9e4b28";
var light_brown = "#dbc4af";

var background_color = dark_blue;
var ECLIPTIC_COLOR = brown;
var EQUATOR_COLOR = light_brown;
var background_circle = white;
var stars_color = dark_blue;
var print_element = brown;
var constellation_color = medium_blue;
var line_color = light_brown;

var star_sizes = [8, 5, 4];

function draw_design() {
  var r = mapsize / 2;
  strokeCap(SQUARE);

  strokeWeight(2);
  stroke(white);
  noFill();

  strokeWeight(4);
  circle(0, 0, r * 2 + 12); // outside ring

  let r2 = r + 13;
  let cx = 0;
  let cy = 0;
  let s2 = r + 20;
  strokeWeight(1);
  stroke(light_brown);
  let angle, x, y, x2, y2;

  // ring of short sticks
  for (let a = 0; a < 360; a += 1) {
    if (a % 15 == 0) continue;
    angle = radians(a);
    x = cx + cos(angle) * r2;
    y = cy + sin(angle) * r2;
    x2 = cx + cos(angle) * s2;
    y2 = cy + sin(angle) * s2;
    line(x, y, x2, y2);
  }

  // ring of long sticks
  strokeWeight(2);
  stroke(white);
  s2 += 4;
  for (let a = 0; a < 360; a += 15) {
    angle = radians(a);
    x = cx + cos(angle) * r2;
    y = cy + sin(angle) * r2;
    x2 = cx + cos(angle) * s2;
    y2 = cy + sin(angle) * s2;
    line(x, y, x2, y2);
  }
  cardinal();
}

function placecardinal(angle, letter, xdecal, ydecal) {
  angle = radians(angle);
  var x = cos(angle) * (mapsize / 2 + 30);
  var y = sin(angle) * (mapsize / 2 + 30);
  text(letter, x + xdecal, y + ydecal);
}

function cardinal() {
  noStroke();
  fill(white);

  textSize(18);
  placecardinal(270, "N", -6, 0);
  placecardinal(0, "O", 0, 6);
  placecardinal(90, "S", -6, 12);
  placecardinal(180, "E", -12, 6);

  textSize(10);
  placecardinal(45, "SO", 0, 6);
  placecardinal(135, "SE", -12, 6);
  placecardinal(225, "NE", -12, 0);
  placecardinal(315, "NO", 0, 0);
}

function draw_sun(sun_x, sun_y) {
  strokeCap(ROUND);
  var sun_size = 9;

  // Background circle to erase what's underneath
  stroke(white);
  fill(white);

  circle(sun_x - 0.4, sun_y - 0.4, sun_size * 2 + 8);

  // Thick long lines background
  strokeWeight(5);
  let angle, x, y, x1, y1;
  for (let a = 0; a < 360; a += 15) {
    if (a % 45 == 0) {
      angle = radians(a);
      x = sun_x - 0.9 + cos(angle) * (sun_size + 4);
      y = sun_y - 0.9 + sin(angle) * (sun_size + 4);
      x1 = sun_x - 0.9 + cos(angle) * (sun_size + 12);
      y1 = sun_y - 0.9 + sin(angle) * (sun_size + 12);
      line(x, y, x1, y1);
    }
  }

  strokeWeight(1.2);
  fill(brown);
  stroke(brown);

  // Middle circle
  circle(sun_x - 0.4, sun_y - 0.4, sun_size * 2);

  for (let a = 0; a < 360; a += 15) {
    let angle = radians(a);
    let x = sun_x - 0.5 + cos(angle) * (sun_size + 2);
    let y = sun_y - 0.5 + sin(angle) * (sun_size + 2);
    // inner point
    line(x, y, x, y);
    x = sun_x - 0.5 + cos(angle) * (sun_size + 4);
    y = sun_y - 0.5 + sin(angle) * (sun_size + 4);
    if (a % 45 == 0) {
      var line_size = 10;
      var x2 = sun_x - 0.5 + cos(angle) * (sun_size + 12);
      var y2 = sun_y - 0.5 + sin(angle) * (sun_size + 12);
      // outer point
      line(x2, y2, x2, y2);
    } else var line_size = 6;
    let x1 = sun_x - 0.5 + cos(angle) * (sun_size + line_size);
    let y1 = sun_y - 0.5 + sin(angle) * (sun_size + line_size);
    // line
    line(x, y, x1, y1);
  }
}

function draw_star(star_x, star_y, mag, radius) {
  fill(stars_color);
  noStroke();
  let r = -1;
  r = map(mag, 2.0, 6.0, 3.5, 0.8);
  if (radius == -1) radius = r;
  circle(star_x, star_y, radius * 2);
}

function find_star(hip, cons) {
  var i = 0;
  while (i < map_data.stars.length) {
    if (map_data.stars[i])
      if (map_data.stars[i].hip == hip) {
        return i;
      }
    i++;
  }
  return -1;
}

function draw_constellations() {
  var len = Object.keys(const_data).length;
  for (var i = 0; i < len; i++) {
    var k = 0;
    var j = 0;
    while (k < const_data[i].lines) {
      var s1 =
        map_data.stars[
          find_star(const_data[i].hip[j], const_data[i].constellation)
        ];
      var s2 =
        map_data.stars[
          find_star(const_data[i].hip[j + 1], const_data[i].constellation)
        ];
      if (s1 && s2) {
        d1 = Math.sqrt((0 - s1.x) ** 2 + (0 - s1.y) ** 2);
        d2 = Math.sqrt((0 - s2.x) ** 2 + (0 - s2.y) ** 2);
        if (!(d1 > mapsize / 2 && d2 > mapsize / 2)) {
          // thicker background
          strokeWeight(3);
          stroke(white);
          line(s1.x, s1.y, s2.x, s2.y);

          // actual constellation line
          strokeWeight(1);
          stroke(constellation_color);
          line(s1.x, s1.y, s2.x, s2.y);
        }
      }
      k++;
      j += 2;
    }
  }
}

function on_map(point) {
  var d = Math.sqrt((point.x - 0) ** 2 + (point.y - 0) ** 2);
  if (d > mapsize / 2) return 0;
  return 1;
}

function vertical_line(points, stroke_color, reverse) {
  var visible = 0;
  for (var i = 0; i < points.length; i++) {
    if (on_map(points[i])) visible++;
  }
  if (visible < 5) return;
  stroke(stroke_color);
  strokeWeight(1.2);
  noFill();
  beginShape();
  if (reverse) points = points.reverse();
  var step = 3;
  for (var i = 0; i < points.length; i += step) {
    if (points[i + step]) {
      var d = Math.sqrt(
        (points[i + step].x - points[i].x) ** 2 +
          (points[i + step].y - points[i].y) ** 2
      );
      if (d > mapsize / 2) break;
    }
    curveVertex(points[i].x, points[i].y);
  }
  endShape();
}

function horizontal_line(points, stroke_color, type) {
  var minx,
    miny = (minx = 99999),
    maxx,
    maxy = (maxx = -99999);
  var point1, point2, point3, point4;
  var visible = 0;
  var step = 4;

  // Get the four highest and lowest point
  for (var i = 0; i < points.length; i++) {
    //left
    if ((minx = Math.min(minx, points[i].x)) == points[i].x) point1 = points[i];
    //right
    if ((maxx = Math.max(maxx, points[i].x)) == points[i].x) point3 = points[i];
    //top
    if ((miny = Math.min(miny, points[i].y)) == points[i].y) point2 = points[i];
    //bottom
    if ((maxy = Math.max(maxy, points[i].y)) == points[i].y) point4 = points[i];
    if (on_map(points[i])) visible++;
  }

  // If not enought point not visible, don't draw line
  if (visible < 5) return;

  stroke(stroke_color);
  if (type == 1) strokeWeight(1.2);
  else if (type == 2) strokeWeight(2.2);
  else strokeWeight(3);

  noFill();

  // If all 4 points on map, draw and ellipse
  if (on_map(point1) && on_map(point2) && on_map(point3) && on_map(point4))
    ellipse(
      0,
      (point4.y + point2.y) / 2,
      point3.x - point1.x,
      point4.y - point2.y
    );
  else {
    // Rotate the list so that it start either at the top or bottom
    // depending on its location
    var to_rotate;
    if (on_map(point2)) to_rotate = point4;
    else to_rotate = point2;
    if (type == 2) to_rotate = point2;
    while (points[0] != to_rotate) points.push(points.shift());

    // Determine the first and last point of the line visible on the map
    var first = -1;
    var last = points.length;
    i = 0;
    while (i < points.length && !on_map(points[i])) i++;
    first = i;
    while (i < points.length && on_map(points[i])) i++;
    last = i;
    // console.log(first, last);

    beginShape();
    if (first > 5) first = first - 5;
    if (last < 85) last = last + 5;
    if (type == 2 || type == 3) {
      first = 0;
      last = points.length;
      // console.log(first, last);
    }

    for (var i = first; i < last; i += step) {
      curveVertex(points[i].x, points[i].y);
    }
    curveVertex(points[last - 1].x, points[last - 1].y);
    endShape();
  }
}

function clean_bg() {
  noFill();
  stroke(background_color);
  strokeWeight(350);
  circle(0, 0, mapsize + 350);
  strokeWeight(1);
  fill(background_color);
  rect(-canvas_width / 2, canvas_height / 2 - 100, canvas_width, 500);
}

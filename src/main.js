// VARIABLES
var canvas_width = 840;
var canvas_height = 840;
var mapsize = 630;
var map_location = 420;

var stars_json;
var observation_data;
var const_data;
var timezones;
var map_data;
var grid;
var test;

// Preloading the JSON data
function preload() {
  stars_json = loadJSON("./data/stars_data.json");
  const_data = loadJSON("./data/const.json");
  timezones = loadJSON("./data/timezones.json");
}

function setup() {
  noLoop();
  var canvas = createCanvas(canvas_width, canvas_height);
  document
    .getElementById("canvas_div")
    .appendChild(document.getElementById("defaultCanvas0"));
  curveDetail(5);
  init_form();
  set_observation_data();
  init_map_data();
}

function draw() {
  compute_all();
  background(dark_blue);
  push();
  translate(width / 2, map_location);

  draw_map(viewing_mode);
  if (document.getElementById("design").checked == true) draw_design();
  draw_planets("normal");
  pop();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    move_longitude(-1);
  } else if (keyCode === RIGHT_ARROW) {
    move_longitude(1);
  } else if (keyCode === UP_ARROW) {
    move_latitude(-1);
  } else if (keyCode === DOWN_ARROW) {
    move_latitude(1);
  }
}

function switch_colors(color) {
  if (color == "white") {
    stars_color = dark_blue;
    background_circle = white;
    print_element = medium_blue;
  } else {
    stars_color = white;
    background_circle = dark_blue;
    print_element = light_blue;
  }
}

function sort_position(a, b) {
  return b.x - a.x || a.y - b.y;
}

function get_dist(a, b) {
  let y = b.x - a.x;
  let x = b.y - a.y;

  return Math.sqrt(x * x + y * y);
}

function get_visible_stars(max_draw, max_size, min_size) {
  var visible_stars = [];
  var drawn = 0;
  for (var i = 0; i < map_data.stars.length; i++) {
    if (map_data.stars[i].height > 0 && drawn < max_draw) {
      r = map(map_data.stars[i].magnitude, 2.0, 6.0, max_size, min_size);
      map_data.stars[i].r = r;
      visible_stars.push(map_data.stars[i]);
      drawn++;
    }
  }
  console.log("Visible stars = ", drawn);
  return visible_stars;
}

function draw_map(mode) {
  // COLOR

  // BACKGROUND MAP
  fill(background_circle);
  noStroke();
  circle(0, 0, mapsize);

  // GRID
  if (document.getElementById("display_grid").checked == true) {
    if (document.getElementById("horizontal_grid").checked == true)
      for (var i = 0; i < grid.length; i++)
        horizontal_line(grid[i], line_color, 1);

    if (document.getElementById("vertical_grid").checked == true)
      for (var i = 0; i < test.length; i++)
        vertical_line(test[i], line_color, observation_data.latitude > 0);
  }
  // EQUATOR
  if (document.getElementById("display_equator").checked == true)
    horizontal_line(map_data.equator, EQUATOR_COLOR, 3);
  // ECLIPTIC
  if (document.getElementById("display_ecliptic").checked == true)
    horizontal_line(map_data.ecliptic, ECLIPTIC_COLOR, 2);

  // CONSTELLATIONS
  if (document.getElementById("display_const").checked == true)
    draw_constellations();

  clean_bg();

  // STARS
  var drawn = 0;
  if (
    document.getElementById("display_stars").checked == true &&
    mode == "view"
  )
    for (var i = 0; i < map_data.stars.length; i++) {
      if (map_data.stars[i].height > 0) {
        draw_star(
          map_data.stars[i].x,
          map_data.stars[i].y,
          map_data.stars[i].magnitude,
          map_data.stars[i].r
        );
        drawn++;
        // Write star name
        // if (map_data.stars[i].name != null) {
        //   textSize(8);
        //   text(
        //     map_data.stars[i].name,
        //     map_data.stars[i].x + 5,
        //     map_data.stars[i].y + 5
        //   );
        // }
      }
    }
}

function draw_planets() {
  // SUN
  if (
    document.getElementById("display_all_planets").checked == true &&
    document.getElementById("display_sun").checked == true &&
    map_data.sun.height > 0
  )
    draw_sun(map_data.sun.x, map_data.sun.y);

  //PLANETS
  if (document.getElementById("display_all_planets").checked == true)
    for (var i = 0; i < map_data.planets.length; i++) {
      var planet = map_data.planets[i];
      if (
        document.getElementById(planet.name).checked == true &&
        planet.height > 0
      )
        draw_planet(
          planet.x,
          planet.y,
          planet.name,
          planet.offsetX,
          planet.offsetY
        );
    }

  // MOON
  if (
    document.getElementById("display_all_planets").checked == true &&
    document.getElementById("display_moon").checked == true &&
    map_data.moon.height > 0
  )
    draw_moon(map_data.moon.x, map_data.moon.y, map_data.moon.phase);
}

function draw_grid(longitude, latitude, sideral_time) {
  var grid = [];

  for (var j = -1.4; j < 1.5708; j += 0.2) {
    var line = [];
    if (j == 0) console.log("middle");
    for (var i = 0; i < 180; i += 2) {
      var angle = (i / 90.0) * Math.PI;
      var point = new CelestialPoint();
      point.rightAscension = angle;
      point.declination = j;
      set_horizontal_position(point, longitude, latitude, sideral_time);
      set_screen_position(point);
      line.push(point);
    }
    grid.push(line);
  }
  return grid;
}

function vertical_grid(longitude, latitude, sideral_time) {
  var grid = [];

  for (var i = 0; i < 180; i += 10) {
    var line = [];
    for (var j = -1.5; j < 1.5708; j += 0.1) {
      var angle = (i / 90.0) * Math.PI;
      var point = new CelestialPoint();
      point.rightAscension = angle;
      point.declination = j;
      set_horizontal_position(point, longitude, latitude, sideral_time);
      set_screen_position(point);
      line.push(point);
    }
    grid.push(line);
  }
  return grid;
}

function compute_all() {
  //GENERAL
  map_data.sideralTime = compute_sideral_time(map_data.observationData);
  var julian_time = compute_julian_time(map_data.observationData);
  var longitude = -to_radians(map_data.observationData.longitude);
  var latitude = to_radians(map_data.observationData.latitude);
  var eclipticObliquity = compute_mean_ecliptic_obliquity(julian_time);

  //STARS
  for (var i = 0; i < map_data.stars.length; i++) {
    set_horizontal_position(
      map_data.stars[i],
      longitude,
      latitude,
      map_data.sideralTime
    );
    set_screen_position(map_data.stars[i]);
  }
  set_sun(map_data.sun, julian_time, longitude, latitude, map_data.sideralTime);
  set_moon(
    map_data.moon,
    julian_time,
    longitude,
    latitude,
    eclipticObliquity,
    map_data.sideralTime
  );
  moon_phase(
    map_data.moon,
    map_data.observationData.day,
    map_data.observationData.month,
    map_data.observationData.year
  );
  set_ecliptic_equator(
    map_data.ecliptic,
    map_data.equator,
    eclipticObliquity,
    longitude,
    latitude,
    map_data.sideralTime
  );
  set_planets(
    map_data.planets,
    julian_time,
    longitude,
    latitude,
    eclipticObliquity,
    map_data.sideralTime
  );
  grid = draw_grid(longitude, latitude, map_data.sideralTime);
  test = vertical_grid(longitude, latitude, map_data.sideralTime);
}

let moon_size = 15;

function draw_moon(moonx, moony, phase) {
  // design source : https://editor.p5js.org/brantschen/sketches/bGH-klhrY
  let x = moonx;
  let y = moony;

  noStroke();
  strokeWeight(1.5);
  fill(white);
  ellipse(x, y, moon_size + 7.5, moon_size + 7.5);
  noErase();

  //   var unicode_moon;
  if (phase <= 0.0625 || phase > 0.9375) {
    new_moon(x, y);
    // unicode_moon = "\uD83C\uDF11";
  } else if (phase <= 0.1875) {
    waxing_crescent(x, y);
    // unicode_moon = "\uD83C\uDF12";
  } else if (phase <= 0.3125) {
    first_quarter(x, y);
    // unicode_moon = "\uD83C\uDF13";
  } else if (phase <= 0.4375) {
    waxing_gibbous(x, y);
    // unicode_moon = "\uD83C\uDF14";
  } else if (phase <= 0.5625) {
    full_moon(x, y);
    // unicode_moon = "\uD83C\uDF15";
  } else if (phase <= 0.6875) {
    waning_gibbous(x, y);
    // unicode_moon = "\uD83C\uDF16";
  } else if (phase <= 0.8125) {
    last_quarter(x, y);
    // unicode_moon = "\uD83C\uDF17";
  } else if (phase <= 0.9375) {
    waning_crescent(x, y);
    // unicode_moon = "\uD83C\uDF18";
  }
  // console.log(unicode_moon);
}

function new_moon(x, y) {
  // -------------------------- NEW MOON
  stroke(brown);
  fill(white);
  ellipse(x, y, moon_size + 4, moon_size + 4);
  ellipse(x, y, moon_size, moon_size);
}

function waxing_crescent(x, y) {
  // ----------------------------- WAXING CRESCENT
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  noStroke();
  arc(x, y, moon_size + 4, moon_size + 4, HALF_PI, PI + HALF_PI);
  stroke(brown);
  noFill();
  ellipse(x, y, moon_size + 4, moon_size + 4);
  fill(white);
  noStroke();
  ellipse(x, y, moon_size / 2, moon_size);
}

function first_quarter(x, y) {
  // ----------------------------- FIRST QUARTER
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  noStroke();
  arc(x, y, moon_size + 4, moon_size + 4, HALF_PI, PI + HALF_PI);
  stroke(brown);
  noFill();
  ellipse(x, y, moon_size + 4, moon_size + 4);
}

function waxing_gibbous(x, y) {
  // ----------------------------- WAXING GIBBOUS
  noStroke();
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  arc(x, y, moon_size + 4, moon_size + 4, HALF_PI, PI + HALF_PI);
  stroke(brown);
  noFill(); //moon_size + 4
  ellipse(x, y, moon_size + 4, moon_size + 4);
  fill(brown);
  noStroke();
  arc(
    x,
    y,
    moon_size / 2,
    moon_size,
    PI / 2 - QUARTER_PI,
    -PI / 2 + QUARTER_PI
  );
}

function full_moon(x, y) {
  // ----------------------------- FULL MOON

  noFill();
  stroke(brown);
  ellipse(x, y, moon_size + 4, moon_size + 4);
  fill(brown);
  ellipse(x, y, moon_size - 0.5, moon_size - 0.5);
}

function waning_gibbous(x, y) {
  // ----------------------------- WANING GIBBOUS
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  noStroke();
  fill(white);
  arc(x, y, moon_size + 4, moon_size + 4, PI + HALF_PI, HALF_PI);
  stroke(brown);
  noFill();
  ellipse(x, y, moon_size + 4, moon_size + 4);
  fill(brown);
  noStroke();
  arc(
    x,
    y,
    moon_size / 2,
    moon_size,
    -PI / 2 - QUARTER_PI,
    PI / 2 + QUARTER_PI
  );
}

function last_quarter(x, y) {
  // ----------------------------- LAST QUARTER
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  noStroke();
  fill(white);
  arc(x, y, moon_size + 4, moon_size + 4, PI + HALF_PI, HALF_PI);
  stroke(brown);
  noFill();
  ellipse(x, y, moon_size + 4, moon_size + 4);
}

function waning_crescent(x, y) {
  // ----------------------------- WANING CRESCENT
  fill(brown);
  ellipse(x, y, moon_size, moon_size);
  fill(white);
  noStroke();
  arc(x, y, moon_size + 4, moon_size + 4, PI + HALF_PI, HALF_PI);
  stroke(brown);
  noFill();
  ellipse(x, y, moon_size + 4, moon_size + 4);
  fill(white);
  noStroke();
  ellipse(x, y, moon_size / 2, moon_size);
}

function old_moon_design(moonx, moony, mag, sweep) {
  var posx = moonx;
  var posy = moony;
  var radius = 10;
  stroke(print_element);
  strokeWeight(1);
  fill(print_element);
  circle(posx, posy, radius * 2);
  fill(white);
  if (sweep[1] == 1)
    arc(posx, posy, radius * 2, radius * 2, PI / 2, (3 * PI) / 2);
  else arc(posx, posy, radius * 2, radius * 2, -PI / 2, (3 * -PI) / 2);
  if (sweep[0] == sweep[1]) fill(white);
  else fill(print_element);
  if (sweep[0] == 0) arc(posx, posy, mag, radius * 2, PI / 2, (3 * PI) / 2);
  else arc(posx, posy, mag, radius * 2, -PI / 2, (3 * -PI) / 2);
}

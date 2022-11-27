function planet_point(x, y) {
  noStroke();
  fill(white);
  circle(x, y, 6.5 * 2);
  fill(print_element);
  circle(x, y, 5 * 2);
  noErase();
}

function draw_planet(planet_x, planet_y, planet_name, offsetX, offsetY) {
  strokeCap(ROUND);

  // Positioning
  planet_point(planet_x, planet_y);
  planet_x += offsetX;
  planet_y += offsetY;

  let size;

  switch (planet_name) {
    case "Mars":
      size = 3.5; // offsetx 13 / -15, 1

      // ---- Symbol (background)
      stroke(white);
      fill(background_circle);
      strokeWeight(5);
      mars_symbol(planet_x, planet_y, size);

      // ---- Symbol (actual)
      stroke(print_element);
      strokeWeight(1.5);
      fill(background_circle);
      mars_symbol(planet_x, planet_y, size);

      break;

    case "Mercury":
      size = 4; // offsetx 12 / -12, 1

      // ---- Symbol (background)
      stroke(white);
      fill(background_circle);
      strokeWeight(5);
      mercury_symbol(planet_x, planet_y, size);

      // ---- Symbol (actual)
      stroke(print_element);
      strokeWeight(1.5);
      fill(background_circle);
      mercury_symbol(planet_x, planet_y, size);

      break;

    case "Venus":
      size = 4; // offsetx 12 / -12, 1

      // ---- Symbol (background)
      stroke(white);
      fill(background_circle);
      strokeWeight(5);
      venus_symbol(planet_x, planet_y, size);

      // ---- Symbol (actual)
      stroke(print_element);
      strokeWeight(1.5);
      fill(background_circle);
      venus_symbol(planet_x, planet_y, size);

      break;

    case "Saturn":
      // offsetx 12 / -14, 1

      // ---- Symbol (background)
      stroke(white);
      fill(background_circle);
      strokeWeight(5);
      saturn_symbol(planet_x, planet_y);

      // ---- Symbol (actual)
      stroke(print_element);
      strokeWeight(1.5);
      fill(background_circle);
      saturn_symbol(planet_x, planet_y);

      break;

    case "Jupiter":
      // offsetx 12 / -14, 1

      // ---- Symbol (background)
      stroke(white);
      fill(background_circle);
      strokeWeight(5);
      jupiter_symbol(planet_x, planet_y);

      // ---- Symbol (actual)
      stroke(print_element);
      strokeWeight(1.5);
      fill(background_circle);
      jupiter_symbol(planet_x, planet_y);

      break;
  }
  noStroke();
}

function mars_symbol(x, y, size) {
  line(x - 2, y + 1, x + (size + 2), y - (size + 3)); // diagonal
  line(x + (size + 2.5), y - (size + 3), x + (size - 4), y - (size + 3)); // horizontal
  line(x + (size + 2.5), y - (size + 3), x + (size + 2.5), y - (size - 3)); // vertical
  circle(x - 2, y + 1, size * 2 + 1);
}

function venus_symbol(x, y, size) {
  line(x, y, x, y + 7); // vertical
  line(x - 3, y + 4, x + 3, y + 4); // horizontal
  circle(x, y - 3, size * 2 + 1);
}

function mercury_symbol(x, y, size) {
  line(x, y, x, y + 7);
  line(x - 2.5, y + 4, x + 2.5, y + 4);
  arc(x, y - 10, 7, 6, 0, PI);
  circle(x, y - 3, size * 2);
}

function jupiter_symbol(x, y) {
  line(x + 5, y - 7, x + 5, y + 7);
  line(x - 4.5, y + 4, x + 7, y + 4);
  arc(x - 4, y - 4, 12, 15, 0, PI / 2);
  arc(x - 1, y - 4, 6, 6, PI - QUARTER_PI, 0);
}

function saturn_symbol(x, y) {
  line(x - 4, y - 11, x - 4, y + 3); // straight line down
  line(x - 6, y - 9, x - 1, y - 9); // straight line accross
  arc(x - 0.6, y - 4, 6.6, 5, PI, 0); // top arc
  arc(x - 0.8, y - 4, 7, 14, 0 + 0.3, PI / 2 - 0.3);
  line(x + 1, y + 2, x + 0.4, y + 3);
  arc(x + 1, y + 5, 3, 3, 0 + QUARTER_PI / 2, PI + 0.5);
}

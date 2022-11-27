// -------- TIME -------- //

function compute_julian_day_zero(day, month, year) {
  var param_a;
  var param_b;
  var param_y;
  var M;
  if (month > 2) {
    param_y = year;
    M = month;
  } else {
    param_y = year - 1;
    M = month + 12;
  }
  param_a = floor((param_y * 1.0) / 100.0);
  param_b = 2 - param_a + floor((param_a * 1.0) / 4.0);
  return (
    floor(365.25 * param_y) +
    floor(30.60001 * (M + 1)) +
    1.0 * day +
    1720994.5 +
    1.0 * param_b
  );
}

function compute_sideral_time(observation_data) {
  var julian_day_zero = compute_julian_day_zero(
    observation_data.day,
    observation_data.month,
    observation_data.year
  );
  var time_difference = observation_data.daylightSavingTime
    ? observation_data.timeZone + 1.0
    : observation_data.timeZone;

  // Work out the sidereal time at 0 h UT at Greenwich
  var sideral_time = (julian_day_zero - 2415020.0) / 36525.0;
  sideral_time =
    0.276919398 +
    100.0021359 * sideral_time +
    0.000001075 * sideral_time * sideral_time;
  sideral_time = 24.0 * (sideral_time - floor(sideral_time));

  // We have to take into account the time of the day
  var paramS =
    observation_data.hours -
    time_difference +
    observation_data.minutes / 60.0 +
    observation_data.seconds / 3600.0;
  sideral_time = sideral_time + 1.002737908 * paramS;
  sideral_time = (sideral_time / 12.0) * PI;

  return sideral_time;
}

function compute_julian_time(observation_data) {
  var julian_time;
  var julian_day;
  var julian_day_zero;
  var time_difference;

  time_difference = observation_data.daylightSavingTime
    ? observation_data.timeZone + 1.0
    : observation_data.timeZone;
  julian_day_zero = compute_julian_day_zero(
    observation_data.day,
    observation_data.month,
    observation_data.year
  );
  julian_day =
    julian_day_zero +
    (1.0 / 24.0) *
      (observation_data.hours -
        time_difference +
        observation_data.minutes / 60.0 +
        observation_data.seconds / 3600.0);
  julian_time = (julian_day - 2415020.0) / 36525.0;
  return julian_time;
}

// --------- COMPUTATION -------- //
/**
 * Compute the mean obliquity of the ecliptic : page 56
 */
function compute_mean_ecliptic_obliquity(julian_time) {
  return to_radians(
    23.452294 -
      0.0130125 * julian_time -
      0.00000164 * julian_time * julian_time +
      0.000000503 * julian_time * julian_time * julian_time
  );
}

function set_planets(
  planets,
  julian_time,
  longitude,
  latitude,
  ecliptic_obliquity,
  sideral_time
) {
  var sun_true_longitude = computeSunTrueLongitude(julian_time);
  var sun_distance = computeSunDistance(julian_time);
  for (var i = 0; i < planets.length; i++) {
    // Work out planetary planets[i] : page 71
    var planetaryLongitude = reduce_amplitude(
      planets[i].longitude[0] +
        planets[i].longitude[1] * julian_time +
        planets[i].longitude[2] * julian_time * julian_time +
        planets[i].longitude[3] * julian_time * julian_time * julian_time
    );
    var excentricity =
      planets[i].excentricity[0] +
      planets[i].excentricity[1] * julian_time +
      planets[i].excentricity[2] * julian_time * julian_time +
      planets[i].excentricity[3] * julian_time * julian_time * julian_time;
    var inclination =
      planets[i].inclination[0] +
      planets[i].inclination[1] * julian_time +
      planets[i].inclination[2] * julian_time * julian_time +
      planets[i].inclination[3] * julian_time * julian_time * julian_time;
    var node =
      planets[i].node[0] +
      planets[i].node[1] * julian_time +
      planets[i].node[2] * julian_time * julian_time +
      planets[i].node[3] * julian_time * julian_time * julian_time;
    var orbitAxis = planets[i].orbitAxis;
    var meanAnomaly = reduce_amplitude(
      planets[i].meanAnomaly[0] +
        planets[i].meanAnomaly[1] * julian_time +
        planets[i].meanAnomaly[2] * julian_time * julian_time
    );
    // Loop to solve Kepler's equation E = M + e sin E : page 67
    var excentricAnomaly = meanAnomaly;
    for (var j = 0; j < 10; j++) {
      excentricAnomaly = meanAnomaly + excentricity * sin(excentricAnomaly);
    }
    // Heliocentric coordinates : page 78
    var trueAnomaly =
      2 *
      atan(
        sqrt((1 + excentricity) / (1 - excentricity)) *
          tan(excentricAnomaly / 2)
      );
    var planetSunDistance =
      orbitAxis * (1 - excentricity * cos(excentricAnomaly));
    var latitudeArgument =
      planetaryLongitude + trueAnomaly - meanAnomaly - node;
    var douDiff = atan(cos(inclination) * tan(latitudeArgument));
    if (cos(latitudeArgument) < 0) {
      douDiff = douDiff + PI;
    }
    var heliocentricLongitude = douDiff + node;
    var heliocentricLatitude = asin(sin(latitudeArgument) * sin(inclination));
    // Geocentric coordinates : page 78
    var N =
      planetSunDistance *
      cos(heliocentricLatitude) *
      sin(heliocentricLongitude - sun_true_longitude);
    var D =
      planetSunDistance *
        cos(heliocentricLatitude) *
        cos(heliocentricLongitude - sun_true_longitude) +
      sun_distance;
    var douDiff = atan(N / D);
    if (D < 0) {
      douDiff = douDiff + PI;
    }
    var geocentricLongitude = douDiff + sun_true_longitude;
    var planetEarthDistance = sqrt(
      N * N +
        D * D +
        planetSunDistance *
          planetSunDistance *
          sin(heliocentricLatitude) *
          sin(heliocentricLatitude)
    );
    var geocentricLatitude = asin(
      (planetSunDistance * sin(heliocentricLatitude)) / planetEarthDistance
    );

    //equatorial position
    planets[i].rightAscension = eclipticToRightAscension(
      geocentricLongitude,
      geocentricLatitude,
      ecliptic_obliquity
    );
    planets[i].declination = eclipticToDeclination(
      geocentricLongitude,
      geocentricLatitude,
      ecliptic_obliquity
    );
    //horizontal position
    set_horizontal_position(planets[i], longitude, latitude, sideral_time);
    set_screen_position(planets[i]);
  }
}

function set_ecliptic_equator(
  ecliptic,
  equator,
  ecliptic_obliquity,
  longitude,
  latitude,
  sideral_time
) {
  for (var i = 0; i < ecliptic.length; i++) {
    //step 2 degrees
    var angle = (i / 90.0) * Math.PI;
    //ECLIPTIC
    ecliptic[i] = new CelestialPoint();
    ecliptic[i].rightAscension = eclipticToRightAscension(
      angle,
      0.0,
      ecliptic_obliquity
    );
    ecliptic[i].declination = eclipticToDeclination(
      angle,
      0.0,
      ecliptic_obliquity
    );
    set_horizontal_position(ecliptic[i], longitude, latitude, sideral_time);
    set_screen_position(ecliptic[i]);
    //EQUATOR
    equator[i] = new CelestialPoint();
    equator[i].rightAscension = angle;
    equator[i].declination = 0.0;
    set_horizontal_position(equator[i], longitude, latitude, sideral_time);
    set_screen_position(equator[i]);
  }
}

function set_horizontal_position(
  sky_object,
  longitude,
  latitude,
  sideral_time
) {
  var angle_horaire_local =
    sideral_time - longitude - sky_object.rightAscension;
  var int_d =
    Math.cos(angle_horaire_local) * Math.sin(latitude) -
    Math.tan(sky_object.declination) * Math.cos(latitude);
  sky_object.azimuth = Math.atan(Math.sin(angle_horaire_local) / int_d);
  if (int_d < 0.0) {
    sky_object.azimuth = sky_object.azimuth + Math.PI;
  }
  sky_object.height = Math.asin(
    Math.sin(latitude) * Math.sin(sky_object.declination) +
      Math.cos(latitude) *
        Math.cos(sky_object.declination) *
        Math.cos(angle_horaire_local)
  );
}

function set_screen_position(sky_object) {
  var bounded_x =
    Math.sin(sky_object.azimuth) * (1.0 - (sky_object.height / Math.PI) * 2.0);
  var bounded_y =
    Math.cos(sky_object.azimuth) * (1.0 - (sky_object.height / Math.PI) * 2.0);
  sky_object.x = Math.round((mapsize / 2) * bounded_x);
  sky_object.y = Math.round((mapsize / 2) * bounded_y);
}

// ------ CONVERSIONS ------ //

/**
 * Turn ecliptic coordinates into a right ascension in radians : page 32
 */
function eclipticToRightAscension(
  eclipticLongitude,
  eclipticLatitude,
  eclipticObliquity
) {
  var rightAscension = atan(
    (sin(eclipticLongitude) * cos(eclipticObliquity) -
      tan(eclipticLatitude) * sin(eclipticObliquity)) /
      cos(eclipticLongitude)
  );

  if (cos(eclipticLongitude) < 0) {
    rightAscension = rightAscension + PI;
  }

  return rightAscension;
}

/**
 * Turn ecliptic coordinates into a declination in radians : page 32
 */
function eclipticToDeclination(
  eclipticLongitude,
  eclipticLatitude,
  eclipticObliquity
) {
  return asin(
    sin(eclipticLatitude) * cos(eclipticObliquity) +
      cos(eclipticLatitude) * sin(eclipticObliquity) * sin(eclipticLongitude)
  );
}

/**
 * Reduce the amplitude of any angle
 */
function reduce_amplitude(input) {
  var integerPart = floor(input / 2 / PI);
  return input - 2 * PI * integerPart;
}

function to_radians(degrees) {
  return (degrees * PI) / 180.0;
}

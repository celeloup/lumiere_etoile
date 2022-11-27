// -------------- SUN ----------------- //

function set_sun(sun, julian_time, longitude, latitude, sideral_time) {
  var mean_ecliptic_obliquity = compute_mean_ecliptic_obliquity(julian_time);
  var ecliptic_obliquity_for_sun_apparent_position =
    mean_ecliptic_obliquity +
    to_radians(0.00256 * cos(to_radians(259.18 - 1934.142 * julian_time)));
  var sun_true_longitude = computeSunTrueLongitude(julian_time);
  var apparent_sun_true_longitude = computeSunApparentLongitude(
    sun_true_longitude,
    julian_time
  );
  sun.rightAscension = eclipticToRightAscension(
    apparent_sun_true_longitude,
    0.0,
    ecliptic_obliquity_for_sun_apparent_position
  );
  sun.declination = eclipticToDeclination(
    apparent_sun_true_longitude,
    0.0,
    ecliptic_obliquity_for_sun_apparent_position
  );
  set_horizontal_position(sun, longitude, latitude, sideral_time);
  set_screen_position(sun);
}

/**
 * Compute the mean longitude of the sun in radians : page 55
 */
function compute_sun_mean_longitude(julian_time) {
  return reduce_amplitude(
    to_radians(
      279.69668 +
        36000.76892 * julian_time +
        0.0003025 * julian_time * julian_time
    )
  );
}

/**
 * Compute the mean anomaly of the sun in radians : page 55
 */
function computeSunMeanAnomaly(julian_time) {
  return reduce_amplitude(
    to_radians(
      358.47583 +
        35999.04975 * julian_time -
        0.00015 * julian_time * julian_time -
        0.0000033 * julian_time * julian_time * julian_time
    )
  );
}

/**
 * Compute the excentricity of the Earth's orbit : page 55
 */
function computeEarthOrbitExcentricity(julian_time) {
  return (
    0.01675104 -
    0.0000418 * julian_time -
    0.000000126 * julian_time * julian_time
  );
}

/**
 * Compute the equation of the centre of the sun in radians : page 55
 */
function computeSunCentreEquation(julian_time, sunMeanAnomaly) {
  return to_radians(
    sin(sunMeanAnomaly) *
      (1.91946 -
        0.004789 * julian_time -
        0.000014 * julian_time * julian_time) +
      (0.020094 - 0.0001 * julian_time) * sin(2.0 * sunMeanAnomaly) +
      0.000293 * sin(3.0 * sunMeanAnomaly)
  );
}

/**
 * Compute the true longitude of the sun in radians : page 56
 */
function computeSunTrueLongitude(julian_time) {
  var sunMeanAnomaly = computeSunMeanAnomaly(julian_time);
  var sunCentreEquation = computeSunCentreEquation(julian_time, sunMeanAnomaly);
  return compute_sun_mean_longitude(julian_time) + sunCentreEquation;
}

/**
 * Compute the true longitude of the sun : page 56
 */
function computeSunDistanceFromAnomaly(earthOrbitExcentricity, sunTrueAnomaly) {
  return (
    (1.0000002 * (1.0 - earthOrbitExcentricity * earthOrbitExcentricity)) /
    (1.0 + earthOrbitExcentricity * cos(sunTrueAnomaly))
  );
}

/**
 * Compute the distance of the sun : page 56 = R
 */
function computeSunDistance(julian_time) {
  var sunMeanAnomaly = computeSunMeanAnomaly(julian_time);
  var sunCentreEquation = computeSunCentreEquation(julian_time, sunMeanAnomaly);
  var sunTrueAnomaly = sunMeanAnomaly + sunCentreEquation;
  var earthOrbitExcentricity = computeEarthOrbitExcentricity(julian_time);
  return computeSunDistanceFromAnomaly(earthOrbitExcentricity, sunTrueAnomaly);
}

/**
 * Compute the apparent true longitude of the sun in radians : page 56
 */
function computeSunApparentLongitude(sunTrueLongitude, julian_time) {
  var paramOmega = reduce_amplitude(
    to_radians(259.18 - 1934.142 * julian_time)
  );

  return sunTrueLongitude - to_radians(0.00569 + 0.00479 * sin(paramOmega));
}

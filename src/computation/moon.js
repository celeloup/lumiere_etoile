// -------------- MOON ----------- //

function set_moon(
  moon,
  julian_time,
  longitude,
  latitude,
  ecliptic_obliquity,
  sideral_time
) {
  var geocentricCoordinates =
    computeMoonGeocentricEclipticCoordinates(julian_time);

  var moonGeocentricLongitude = geocentricCoordinates[0];
  var moonGeocentricLatitude = geocentricCoordinates[1];
  var moonParallax = geocentricCoordinates[2];
  var geocentricMoonRightAscension = eclipticToRightAscension(
    moonGeocentricLongitude,
    moonGeocentricLatitude,
    ecliptic_obliquity
  );
  var geocentricMoonDeclination = eclipticToDeclination(
    moonGeocentricLongitude,
    moonGeocentricLatitude,
    ecliptic_obliquity
  );
  // We assume a height of zero
  var topocentricMoonCoordinates = computeTopocentricCoordinates(
    geocentricMoonRightAscension,
    geocentricMoonDeclination,
    moonParallax,
    longitude,
    latitude,
    0.0,
    ecliptic_obliquity,
    sideral_time
  );
  moon.rightAscension = topocentricMoonCoordinates[0];
  moon.declination = topocentricMoonCoordinates[1];
  set_horizontal_position(moon, longitude, latitude, sideral_time);
  set_screen_position(moon);
}

/**
 * Compute the geocentric ecliptic coordinates of the moon : page 105
 */
function computeMoonGeocentricEclipticCoordinates(julianTime) {
  var LP = reduce_amplitude(
    to_radians(
      270.434164 +
        481267.8831 * julianTime -
        0.001133 * julianTime * julianTime +
        0.0000019 * julianTime * julianTime * julianTime
    )
  );

  var M = reduce_amplitude(
    to_radians(
      358.475833 +
        35999.0498 * julianTime -
        0.00015 * julianTime * julianTime -
        0.0000033 * julianTime * julianTime * julianTime
    )
  );

  var MP = reduce_amplitude(
    to_radians(
      296.104608 +
        477198.8491 * julianTime +
        0.009192 * julianTime * julianTime +
        0.0000144 * julianTime * julianTime * julianTime
    )
  );

  var D = reduce_amplitude(
    to_radians(
      350.737486 +
        445267.1142 * julianTime -
        0.001436 * julianTime * julianTime +
        0.0000019 * julianTime * julianTime * julianTime
    )
  );

  var F = reduce_amplitude(
    to_radians(
      11.250889 +
        483202.0251 * julianTime -
        0.003211 * julianTime * julianTime -
        0.0000003 * julianTime * julianTime * julianTime
    )
  );

  var OM = reduce_amplitude(
    to_radians(
      259.183275 -
        1934.142 * julianTime +
        0.002078 * julianTime * julianTime +
        0.0000022 * julianTime * julianTime * julianTime
    )
  );

  // Additive terms

  LP += to_radians(0.000233 * sin(to_radians(51.2 + 20.2 * julianTime)));
  M -= to_radians(0.001778 * sin(to_radians(51.2 + 20.2 * julianTime)));
  MP += to_radians(0.000817 * sin(to_radians(51.2 + 20.2 * julianTime)));
  D += to_radians(0.002011 * sin(to_radians(51.2 + 20.2 * julianTime)));

  LP += to_radians(
    0.003964 *
      sin(
        to_radians(
          346.56 + 132.87 * julianTime - 0.0091731 * julianTime * julianTime
        )
      )
  );
  MP += to_radians(
    0.003964 *
      sin(
        to_radians(
          346.56 + 132.87 * julianTime - 0.0091731 * julianTime * julianTime
        )
      )
  );
  D += to_radians(
    0.003964 *
      sin(
        to_radians(
          346.56 + 132.87 * julianTime - 0.0091731 * julianTime * julianTime
        )
      )
  );
  F += to_radians(
    0.003964 *
      sin(
        to_radians(
          346.56 + 132.87 * julianTime - 0.0091731 * julianTime * julianTime
        )
      )
  );

  LP += to_radians(0.001964 * sin(OM));
  MP += to_radians(0.002541 * sin(OM));
  LP += to_radians(0.001964 * sin(OM));
  F -= to_radians(0.024691 * sin(OM));
  F -= to_radians(0.004328 * sin(OM + to_radians(275.05 - 2.3 * julianTime)));

  // And finally

  var e = 1.0 - 0.002495 * julianTime - 0.00000752 * julianTime * julianTime;

  var moonGeocentricLongitude =
    LP +
    to_radians(
      6.28875 * sin(MP) +
        1.274018 * sin(2.0 * D - MP) +
        0.658309 * sin(2.0 * D) +
        0.213616 * sin(2.0 * MP) -
        0.185596 * sin(M) * e -
        0.114336 * sin(2.0 * F) +
        0.058793 * sin(2.0 * D - 2.0 * MP) +
        0.057212 * sin(2.0 * D - M - MP) * e +
        0.05332 * sin(2.0 * D + MP) +
        0.045874 * sin(2.0 * D - M) * e +
        0.041024 * sin(MP - M) * e -
        0.034718 * sin(D) -
        0.030465 * sin(M + MP) * e +
        0.015326 * sin(2.0 * D - 2.0 * F) -
        0.012528 * sin(2.0 * F + MP) -
        0.01098 * sin(2.0 * F - MP) +
        0.010674 * sin(4.0 * D - MP) +
        0.010034 * sin(3.0 * MP) +
        0.008548 * sin(4.0 * D - 2.0 * MP) -
        0.00791 * sin(M - MP + 2.0 * D) * e -
        0.006783 * sin(2.0 * D + M) * e +
        0.005162 * sin(MP - D) +
        0.005 * sin(M + D) * e +
        0.004049 * sin(MP - M + 2.0 * D) * e +
        0.003996 * sin(2.0 * MP + 2.0 * D) +
        0.003862 * sin(4.0 * D) +
        0.003665 * sin(2.0 * D - 3.0 * MP) +
        0.002695 * sin(2.0 * MP - M) * e +
        0.002602 * sin(MP - 2.0 * F - 2.0 * D) +
        0.002396 * sin(2.0 * D - M - 2.0 * MP) * e -
        0.002349 * sin(MP + D) +
        0.002249 * sin(2.0 * D - 2.0 * M) * e * e -
        0.002125 * sin(2.0 * MP + 2.0 * M) * e -
        0.002079 * sin(2.0 * M) * e * e +
        0.002059 * sin(2.0 * D - MP - 2.0 * M) * e * e -
        0.001773 * sin(MP + 2.0 * D - 2.0 * F) -
        0.001595 * sin(2.0 * F + 2.0 * D) +
        0.00122 * sin(4.0 * D - M - MP) * e -
        0.00111 * sin(2.0 * MP + 2.0 * F) +
        0.000892 * sin(MP - 3.0 * D) -
        0.000811 * sin(M + MP + 2.0 * D) * e +
        0.000761 * sin(4.0 * D - M - 2.0 * MP) * e +
        0.000717 * sin(MP - 2.0 * M) * e * e +
        0.000704 * sin(MP - 2.0 * M - 2.0 * D) * e * e +
        0.000693 * sin(M - 2.0 * MP + 2.0 * D) * e +
        0.000598 * sin(2.0 * D - M - 2.0 * F) * e +
        0.00055 * sin(MP + 4.0 * D) +
        0.000538 * sin(4.0 * MP) +
        0.000521 * sin(4.0 * D - M) * e +
        0.000486 * sin(2.0 * MP - D)
    );

  var B = to_radians(
    5.128189 * sin(F) +
      0.280606 * sin(MP + F) +
      0.277693 * sin(MP - F) +
      0.173238 * sin(2.0 * D - F) +
      0.055413 * sin(2.0 * D + F - MP) +
      0.046272 * sin(2.0 * D - F - MP) +
      0.032573 * sin(2.0 * D + F) +
      0.017198 * sin(2.0 * MP + F) +
      0.009267 * sin(2.0 * D + MP - F) +
      0.008823 * sin(2.0 * MP - F) +
      0.008247 * sin(2.0 * D - M - F) * e +
      0.004323 * sin(2.0 * D - F - 2.0 * MP) +
      0.0042 * sin(2.0 * D + F + MP) +
      0.003372 * sin(F - M - 2.0 * D) * e +
      0.002472 * sin(2.0 * D + F - M - MP) * e +
      0.002222 * sin(2.0 * D + F - M) * e +
      0.002072 * sin(2.0 * D - F - M - MP) * e +
      0.001877 * sin(F - M + MP) * e +
      0.001828 * sin(4.0 * D - F - MP) -
      0.001803 * sin(F + M) * e -
      0.00175 * sin(3.0 * F) +
      0.00157 * sin(MP - M - F) * e -
      0.001487 * sin(F + D) -
      0.001481 * sin(F + M + MP) * e +
      0.001417 * sin(F - M - MP) * e +
      0.00135 * sin(F - M) * e +
      0.00133 * sin(F - D) +
      0.001106 * sin(F + 3.0 * MP) +
      0.00102 * sin(4.0 * D - F) +
      0.000833 * sin(F + 4.0 * D - MP) +
      0.000781 * sin(MP - 3.0 * F) +
      0.00067 * sin(F + 4.0 * D - 2.0 * MP) +
      0.000606 * sin(2.0 * D - 3.0 * F) +
      0.000597 * sin(2.0 * D + 2.0 * MP - F) +
      0.000492 * sin(2.0 * D + MP - M - F) * e +
      0.00045 * sin(2.0 * MP - F - 2.0 * D) +
      0.000439 * sin(3.0 * MP - F) +
      0.000423 * sin(F + 2.0 * D + 2.0 * MP) +
      0.000422 * sin(2.0 * D - F - 3.0 * MP) -
      0.000367 * sin(M + F + 2.0 * D - MP) * e -
      0.000353 * sin(M + F + 2.0 * D) * e +
      0.000331 * sin(F + 4.0 * D) +
      0.000317 * sin(2.0 * D + F - M + MP) * e +
      0.000306 * sin(2.0 * D - 2.0 * M - F) * e * e -
      0.000283 * sin(MP + 3.0 * F)
  );

  var om1 = 0.0004664 * cos(OM);
  var om2 = 0.0000754 * cos(OM + to_radians(275.05 - 2.3 * julianTime));

  var moonGeocentricLatitude = B * (1 - om1 - om2);

  var moonParallax = to_radians(
    0.950724 +
      0.051818 * cos(MP) +
      0.009531 * cos(2.0 * D - MP) +
      0.007843 * cos(2.0 * D) +
      0.002824 * cos(2.0 * MP) +
      0.000857 * cos(2.0 * D + MP) +
      0.000533 * cos(2.0 * D - M) * e +
      0.000401 * cos(2.0 * D - M - MP) * e +
      0.00032 * cos(MP - M) * e -
      0.000271 * cos(D) -
      0.000264 * cos(M + MP) * e -
      0.000198 * cos(2.0 * F - MP) +
      0.000173 * cos(3.0 * MP) +
      0.000167 * cos(4.0 * D - MP) -
      0.000111 * cos(M) * e +
      0.000103 * cos(3.0 * D - 2.0 * MP) -
      0.000084 * cos(2.0 * MP - 2.0 * D) -
      0.000083 * cos(2.0 * D + M) * e +
      0.000079 * cos(2.0 * D + 2.0 * MP) +
      0.000072 * cos(4.0 * D) +
      0.000064 * cos(2.0 * D - M + MP) * e -
      0.000063 * cos(2.0 * D + M - MP) * e +
      0.000041 * cos(M + D) * e +
      0.000035 * cos(2.0 * MP - M) * e -
      0.000033 * cos(3.0 * MP - 2.0 * D) -
      0.00003 * cos(MP + D) -
      0.000029 * cos(2.0 * F - 2.0 * D) -
      0.000029 * cos(2.0 * MP + M) * e +
      0.000026 * cos(2.0 * D - 2.0 * M) * e * e -
      0.000023 * cos(2.0 * F - 2.0 * D + MP) +
      0.000019 * cos(4.0 * D - M - MP) * e
  );

  return [moonGeocentricLongitude, moonGeocentricLatitude, moonParallax];
}

/**
 * Compute the topocentric coordinates : page 97
 */
function computeTopocentricCoordinates(
  geocentricRightAscension,
  geocentricDeclination,
  parallax,
  longitude,
  latitude,
  height,
  siderealTime
) {
  var geocentricCoordinates = computeGeocentricCoordinates(latitude, height);

  var rhoCosPhiPrime = geocentricCoordinates[0];
  var rhoSinPhiPrime = geocentricCoordinates[1];

  var localHourAngle = siderealTime - longitude - geocentricRightAscension;

  var deltaRA = atan(
    (-rhoCosPhiPrime * sin(parallax) * sin(localHourAngle)) /
      (cos(geocentricDeclination) -
        rhoCosPhiPrime * sin(parallax) * cos(localHourAngle))
  );

  var topocentricRightAscension = geocentricRightAscension + deltaRA;

  var topocentricDeclination = atan(
    (cos(deltaRA) *
      (sin(geocentricDeclination) - rhoSinPhiPrime * sin(parallax))) /
      (cos(geocentricDeclination) -
        rhoCosPhiPrime * sin(parallax) * cos(localHourAngle))
  );

  return [topocentricRightAscension, topocentricDeclination];
}

/**
 * Compute the geocentric coordinates of an observer : page 25
 */
function computeGeocentricCoordinates(latitude, height) {
  var paramU = atan(0.99664719 * tan(latitude));
  var rhoSinPhiPrime =
    0.99664719 * sin(paramU) + (height / 6378140) * sin(latitude);
  var rhoCosPhiPrime = cos(paramU) + (height / 6378140) * cos(latitude);

  return [rhoCosPhiPrime, rhoSinPhiPrime];
}

function computeMoonPhase(sun_dec, sun_ra, moon_dec, moon_ra) {
  var cos_psi =
    sin(sun_dec) * sin(moon_dec) +
    cos(sun_dec) * cos(moon_dec) * cos(sun_ra - moon_ra);
  var cos_i = -cos_psi;
  var k = (1.0 + cos_i) / 2.0;
  console.log("k =", k);
  return k;
}

//https://github.com/tingletech/moon-phase
function moon_day(day, month, year) {
  var GetFrac = function (fr) {
    return fr - Math.floor(fr);
  };
  var thisJD = compute_julian_day_zero(day, month, year);
  var degToRad = 3.14159265 / 180;
  var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
  K0 = Math.floor((year - 1900) * 12.3685);
  T = (year - 1899.5) / 100;
  T2 = T * T;
  T3 = T * T * T;
  J0 = 2415020 + 29 * K0;
  F0 =
    0.0001178 * T2 -
    0.000000155 * T3 +
    (0.75933 + 0.53058868 * K0) -
    (0.000837 * T + 0.000335 * T2);
  M0 =
    360 * GetFrac(K0 * 0.08084821133) +
    359.2242 -
    0.0000333 * T2 -
    0.00000347 * T3;
  M1 =
    360 * GetFrac(K0 * 0.07171366128) +
    306.0253 +
    0.0107306 * T2 +
    0.00001236 * T3;
  B1 =
    360 * GetFrac(K0 * 0.08519585128) +
    21.2964 -
    0.0016528 * T2 -
    0.00000239 * T3;
  var phase = 0;
  var jday = 0;
  while (jday < thisJD) {
    var F = F0 + 1.530588 * phase;
    var M5 = (M0 + phase * 29.10535608) * degToRad;
    var M6 = (M1 + phase * 385.81691806) * degToRad;
    var B6 = (B1 + phase * 390.67050646) * degToRad;
    F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
    F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
    F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
    F += 0.0021 * Math.sin(2 * M5) + 0.001 * Math.sin(2 * B6 - M6);
    F += 0.5 / 1440;
    oldJ = jday;
    jday = J0 + 28 * phase + Math.floor(F);
    phase++;
  }

  // 29.53059 days per lunar month
  return (thisJD - oldJ) / 29.53059;
}

function moon_phase(moon, day, month, year) {
  var phase = moon_day(day, month, year);
  var sweep = [];
  var mag;
  // the "sweep-flag" and the direction of movement change every quarter moon
  // zero and one are both new moon; 0.50 is full moon
  if (phase <= 0.25) {
    sweep = [1, 0];
    mag = 20 - 20 * phase * 4;
  } else if (phase <= 0.5) {
    sweep = [0, 0];
    mag = 20 * (phase - 0.25) * 4;
  } else if (phase <= 0.75) {
    sweep = [1, 1];
    mag = 20 - 20 * (phase - 0.5) * 4;
  } else if (phase <= 1) {
    sweep = [0, 1];
    mag = 20 * (phase - 0.75) * 4;
  } else {
    exit;
  }
  // var unicode_moon;
  // if (phase <= 0.0625 || phase > 0.9375) {
  //     unicode_moon = "\uD83C\uDF11";
  // } else if (phase <= 0.1875) {
  //     unicode_moon = "\uD83C\uDF12";
  // } else if (phase <= 0.3125) {
  //     unicode_moon = "\uD83C\uDF13";
  // } else if (phase <= 0.4375) {
  //     unicode_moon = "\uD83C\uDF14";
  // } else if (phase <= 0.5625) {
  //     unicode_moon = "\uD83C\uDF15";
  // } else if (phase <= 0.6875) {
  //     unicode_moon = "\uD83C\uDF16";
  // } else if (phase <= 0.8125) {
  //     unicode_moon = "\uD83C\uDF17";
  // } else if (phase <= 0.9375) {
  //     unicode_moon = "\uD83C\uDF18";
  // }
  // console.log(unicode_moon);
  moon.mag = mag;
  moon.sweep = sweep;
  moon.phase = phase;
}

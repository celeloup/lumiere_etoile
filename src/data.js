function init_map_data() {
  var stars = get_stars_data();
  var sun = new Sun();
  var moon = new Moon();
  var planets = get_planet_data();
  var ecliptic = new Array(180);
  var equator = new Array(180);
  var observationData = observation_data;
  var sideralTime = compute_sideral_time(observation_data);
  map_data = new MapData(
    stars,
    sun,
    moon,
    planets,
    ecliptic,
    equator,
    observationData,
    sideralTime
  );
}

function compare_mag(a, b) {
  return a.magnitude - b.magnitude;
}

function get_stars_data() {
  var len = Object.keys(stars_json).length;
  var j = 0;
  var stars_data = new Array();
  var mag_max = -99999;
  var mag_min = 9999;
  for (var i = 0; i < len; i++) {
    if (parseFloat(stars_json[i].Vmag) < 6.0) {
      var ra = stars_json[i].RAhms.split(" ");
      var de = stars_json[i].DEdms.split(" ");
      stars_data[j] = new Star(
        trim(stars_json[i].HIP),
        stars_json[i].Name, //starName
        stars_json[i].Cst, //constellationName
        ra[0],
        ra[1],
        ra[2],
        de[0],
        de[1],
        de[2],
        parseFloat(stars_json[i].Vmag)
      );
      if (stars_data[j].magnitude > mag_max) mag_max = stars_data[j].magnitude;
      if (stars_data[j].magnitude < mag_min) mag_min = stars_data[j].magnitude;
      j++;
    }
  }
  // Sort by magnitude
  stars_data.sort(compare_mag);
  console.log("Number of stars in set :", stars_data.length);
  console.log(
    "Maximum magnitude : ",
    mag_max,
    "; Minimum magnitude : ",
    mag_min
  );
  return stars_data;
}

function get_planet_data() {
  var planet_data = new Array();
  planet_data[0] = new Planet(
    "Mercury",
    102.27938,
    149472.51529,
    0.000007,
    178.179078,
    149474.07078,
    3.011e-4,
    0,
    2.0561421e-1,
    2.046e-5,
    -3e-8,
    0,
    7.002881,
    1.8608e-3,
    -1.83e-5,
    0,
    28.753753,
    0.3702806,
    0.0001208,
    0,
    47.145944,
    1.1852083,
    1.739e-4,
    0,
    0.3870986
  );
  planet_data[1] = new Planet(
    "Venus",
    212.60322,
    58517.80387,
    0.001286,
    342.767053,
    58519.21191,
    3.097e-4,
    0,
    6.82069e-3,
    -4.774e-5,
    9.1e-8,
    0,
    3.393631,
    1.0058e-3,
    -1e-6,
    0,
    54.384186,
    0.5081861,
    -0.0013864,
    0,
    75.779647,
    8.9985e-1,
    4.1e-4,
    0,
    0.7233316
  );
  planet_data[2] = new Planet(
    "Mars",
    319.51913,
    19139.85475,
    0.000181,
    293.737334,
    19141.69551,
    3.107e-4,
    0,
    9.33129e-2,
    9.2064e-5,
    -7.7e-8,
    0,
    1.850333,
    -6.75e-4,
    1.26e-5,
    0,
    285.431761,
    1.0697667,
    0.0001313,
    0.00000414,
    48.786442,
    7.709917e-1,
    -1.4e-6,
    -5.33e-6,
    1.5236883
  );
  planet_data[3] = new Planet(
    "Jupiter",
    225.32833,
    3034.69202,
    -0.000722,
    238.049257,
    3036.301986,
    3.347e-4,
    -1.65e-6,
    4.833475e-2,
    1.6418e-4,
    -4.676e-7,
    -1.7e-9,
    1.308736,
    -5.6961e-3,
    3.9e-6,
    0,
    273.277558,
    0.5994317,
    0.00070405,
    0.00000508,
    99.443414,
    1.01053,
    3.5222e-4,
    -8.51e-6,
    5.202561
  );
  planet_data[4] = new Planet(
    "Saturn",
    175.46622,
    1221.55147,
    -0.000502,
    266.564377,
    1223.509884,
    3.245e-4,
    -5.8e-6,
    5.589232e-2,
    -3.455e-4,
    -7.28e-7,
    7.4e-10,
    2.492519,
    -3.9189e-3,
    -1.549e-5,
    4e-8,
    338.3078,
    1.0852207,
    0.00097854,
    0.00000992,
    112.790414,
    8.731951e-1,
    -1.5218e-4,
    -5.31e-6,
    9.554747
  );
  return planet_data;
}

// https://zestedesavoir.com/billets/3638/calculer-le-jour-de-la-semaine-de-nimporte-quelle-date/#1-la-methode
function is_daylight_saving_time(d, m, y) {
  if (y < 1900) alert("Daylight saving: year before 1900, will be wrong !");
  var _m = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];

  // limites de la zone d'heure d'été
  var last_mars_sunday =
    31 - ((31 + (y - 1900) + Math.floor((y - 1900) / 4) + _m[3 - 1]) % 7);
  var last_october_sunday =
    31 - ((31 + (y - 1900) + Math.floor((y - 1900) / 4) + _m[10 - 1]) % 7);
  if (
    m < 3 ||
    m > 10 ||
    (m == 3 && d < last_mars_sunday) ||
    (m == 10 && d > last_october_sunday)
  )
    return false;
  else return true;
}

function set_observation_data(saving = 1) {
  var date = split(document.getElementById("date_input").value, "-");
  var day = parseInt(date[2]);
  var month = parseInt(date[1]);
  var year = parseInt(date[0]);
  var time = split(document.getElementById("time_input").value, ":");
  var hours = parseInt(time[0]);
  var minutes = parseInt(time[1]);
  var seconds = parseInt(time[2]);

  if (saving == 0)
    var daylightSavingTime = document.getElementById(
      "daylight_saving_time_input"
    ).checked;
  else var daylightSavingTime = is_daylight_saving_time(day, month, year);
  document.getElementById("daylight_saving_time_input").checked =
    daylightSavingTime;

  var longitude = parseFloat(document.getElementById("longitude_input").value);
  var latitude = parseFloat(document.getElementById("latitude_input").value);
  var timeZone = parseFloat(document.getElementById("timezone_input").value);
  if (observation_data) {
    observation_data.day = day;
    observation_data.month = month;
    observation_data.year = year;
    observation_data.hours = hours;
    observation_data.minutes = minutes;
    observation_data.seconds = seconds;
    observation_data.daylightSavingTime = daylightSavingTime;
    observation_data.longitude = longitude;
    observation_data.latitude = latitude;
    observation_data.timeZone = timeZone;
    draw();
  } else {
    observation_data = new ObservationData(
      day,
      month,
      year,
      hours,
      minutes,
      seconds,
      timeZone,
      daylightSavingTime,
      longitude,
      latitude,
      timeZone
    );
  }
}

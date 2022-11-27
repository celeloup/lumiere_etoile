var interface = [
  { id: "daylight_saving_time_input", type: "check", value: true },
  { id: "address_input", type: "value", value: "Type here" },
  { id: "longitude_input", type: "value", value: "2.75" },
  { id: "latitude_input", type: "value", value: "48.866669" },
  { id: "timezone_input", type: "value", value: "+1" },

  { id: "display_ecliptic", type: "check", value: true },
  { id: "display_equator", type: "check", value: true },
  { id: "display_grid", type: "check", value: true },
  { id: "vertical_grid", type: "check", value: true },
  { id: "horizontal_grid", type: "check", value: true },

  { id: "display_stars", type: "check", value: true },
  { id: "display_const", type: "check", value: true },

  { id: "display_all_planets", type: "check", value: true },
  { id: "display_sun", type: "check", value: true },
  { id: "display_moon", type: "check", value: true },
  { id: "Mercury", type: "check", value: true },
  { id: "Mars", type: "check", value: true },
  { id: "Venus", type: "check", value: true },
  { id: "Jupiter", type: "check", value: true },
  { id: "Saturn", type: "check", value: true },

  //   { id: "all_design", type: "check", value: true },
  //   { id: "clean", type: "check", value: true },
  { id: "design", type: "check", value: true },
];

var viewing_mode = "view";

// Gets current time and date
function set_date_time_now(refresh) {
  var date_today =
    year() +
    "-" +
    (month() >= 10 ? month() : "0" + month()) +
    "-" +
    (day() >= 10 ? day() : "0" + day());
  // let date_today = "2020-09-12";
  document.getElementById("date_input").value = date_today;
  var time_now =
    (hour() >= 10 ? hour() : "0" + hour()) +
    ":" +
    (minute() >= 10 ? minute() : "0" + minute()) +
    ":" +
    (second() >= 10 ? second() : "0" + second());
  // let time_now = "22:18:00";
  document.getElementById("time_input").value = time_now;
  //   console.log(date_today, time_now);
  if (refresh) set_observation_data();
}

// Initialise the form parameters with default values
function init_form() {
  set_date_time_now(0);
  for (var i = 0; i < interface.length; i++) {
    var elem = interface[i];
    if (elem.type == "check")
      document.getElementById(elem.id).checked = elem.value;
    else document.getElementById(elem.id).value = elem.value;
  }
}

function update_address() {
  var place = encodeURI(document.getElementById("address_input").value);
  var requestOptions = {
    method: "GET",
  };

  if (place)
    fetch(
      "https://api.geoapify.com/v1/geocode/search?text=" +
        place +
        "&lang=fr&format=json&apiKey=" +
        config.GEOAPI_KEY,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.results);
        var r = result.results[0];
        document.getElementById("address_input").value = [
          r.city + ",",
          r.postcode,
          r.country,
        ].join(" ");
        document.getElementById("longitude_input").value = r.lon.toString();
        document.getElementById("latitude_input").value = r.lat.toString();
        var utc = timezones[r.country_code.toUpperCase()];
        document.getElementById("timezone_input").value =
          utc > 0 ? "+" + utc : utc;
        // console.log(utc);
        set_observation_data();
      })
      .catch((error) => console.log("error", error));
}

function move_longitude(dir) {
  var val = parseInt(document.getElementById("step_globe_move").value) * dir;
  var longitude = parseFloat(document.getElementById("longitude_input").value);
  if (longitude + val < -180 || longitude + val > 180) return;
  else {
    document.getElementById("longitude_input").value = (
      longitude + val
    ).toString();
    set_observation_data();
  }
}

//check if longitude is a number and if between -180 and 180
function update_longitude() {
  var new_long = parseFloat(document.getElementById("longitude_input").value);
  if (isNaN(new_long)) alert("Longitude entered is not a number !");
  else if (new_long < -180 || new_long > 180)
    alert("Wrong longitude value. Must be between -180 and 180.");
  else set_observation_data();
}

function move_latitude(dir) {
  var val = parseInt(document.getElementById("step_globe_move").value) * dir;
  var latitude = parseFloat(document.getElementById("latitude_input").value);
  if (latitude + val < -90 || latitude + val > 90) return;
  else {
    document.getElementById("latitude_input").value = (
      latitude + val
    ).toString();
    set_observation_data();
  }
}

//check if latitude is a number and between -90 and 90
function update_latitude() {
  var new_lat = parseFloat(document.getElementById("latitude_input").value);
  if (isNaN(new_lat)) alert("Latitude entered is not a number !");
  else if (new_lat < -90 || new_lat > 90)
    alert("Wrong latitude value. Must be between -90 and 90.");
  else set_observation_data();
}

//check if timezone is a number and between -15 and 16
function update_timezone() {
  var new_timezone = parseFloat(
    document.getElementById("timezone_input").value
  );
  if (isNaN(new_timezone)) alert("Timezone entered is not a number !");
  else if (new_timezone < -15 || new_timezone > 16)
    lert("Wrong timezone value. Must be between -15 and 16.");
  else set_observation_data();
}

// TOGGLE FIELDSET
function toggle(element, content) {
  document.getElementById(content).classList.toggle("hide");
  var class_i = element.children[0].classList[1];
  if (class_i == "fa-chevron-down") {
    element.children[0].classList.add("fa-chevron-right");
    element.children[0].classList.remove("fa-chevron-down");
  } else {
    element.children[0].classList.add("fa-chevron-down");
    element.children[0].classList.remove("fa-chevron-right");
  }
}

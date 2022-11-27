function ObservationData(day, month, year, hours, minutes, seconds, timeZone,
	daylightSavingTime, longitude, latitude, timeZone)
{
	this.day = day;
	this.month = month;
	this.year = year;
	this.hours = hours;
	this.minutes = minutes;
	this.seconds = seconds;
	this.daylightSavingTime = daylightSavingTime;

	this.longitude = longitude;
	this.latitude = latitude;

	this.timeZone = timeZone;
}

function MapData(stars, sun, moon, planets, ecliptic, equator, observationData, sideralTime)
{
	this.stars = stars;
	this.sun = sun;
	this.moon = moon;
	this.planets = planets;
	this.ecliptic = ecliptic;
	this.equator = equator;
	this.observationData = observationData;
	this.sideralTime = sideralTime;
}

function Star(hip, starName, constellationName, raH, raM, raS, decD, decM, decS, magnitude) {

	this.hip = hip;
	this.rightAscension = Math.PI / 12.0 * (parseFloat(raH) + parseFloat(raM) / 60.0 + parseFloat(raS) / 3600.0);
	if (decD.substring(0, 1) == "-") {
		this.declination = Math.PI / 180.0 * (parseFloat(decD) - parseFloat(decM) / 60.0 - parseFloat(decS) / 3600.0);
	} else {
		this.declination = Math.PI / 180.0 * (parseFloat(decD) + parseFloat(decM) / 60.0 + parseFloat(decS) / 3600.0);
	}
	this.magnitude = magnitude;
	this.name = starName;
	this.constellation = constellationName;

	this.azimuth = 0;
	this.height = 0;

	this.x = null;
	this.y = null;

	this.r = -1;
}

function Planet(name, meanAnomaly0, meanAnomaly1, meanAnomaly2, longitude0, longitude1, longitude2,
		longitude3, excentricity0, excentricity1, excentricity2, excentricity3, inclination0, inclination1,
		inclination2, inclination3, perihelion0, perihelion1, perihelion2, perihelion3, node0, node1, node2, node3,
		orbitAxis)
{
	this.name = name;
	this.longitude = [ DEG_TO_RAD * longitude0, DEG_TO_RAD * longitude1, DEG_TO_RAD * longitude2,
			DEG_TO_RAD * longitude3 ];
	this.excentricity = [ excentricity0, excentricity1, excentricity2, excentricity3 ];
	this.inclination = [ DEG_TO_RAD * inclination0, DEG_TO_RAD * inclination1, DEG_TO_RAD * inclination2,
			DEG_TO_RAD * inclination3 ];
	this.perihelion = [ DEG_TO_RAD * perihelion0, DEG_TO_RAD * perihelion1, DEG_TO_RAD * perihelion2,
			DEG_TO_RAD * perihelion3 ];
	this.node = [ DEG_TO_RAD * node0, DEG_TO_RAD * node1, DEG_TO_RAD * node2, DEG_TO_RAD * node3 ];
	this.meanAnomaly = [ DEG_TO_RAD * meanAnomaly0, DEG_TO_RAD * meanAnomaly1, DEG_TO_RAD * meanAnomaly2 ];
	this.orbitAxis = orbitAxis;
	
	this.rightAscension = 0;
	this.declination = 0;
	
	this.azimuth = 0;
	this.height = 0;
	
	this.x = 0;
	this.y = 0;

	this.offsetX = 12;
	this.offsetY = 1;
}

function Sun()
{
	this.name = "sun";
	
	this.rightAscension = 0;
	this.declination = 0;
	
	this.azimth = 0;
	this.height = 0;
	
	this.x = 0;
	this.y = 0;
}

function Moon()
{
	this.name = "moon";
	
	this.rightAscension = 0;
	this.declination = 0;
	
	this.azimth = 0;
	this.height = 0;
	
	this.x = 0;
	this.y = 0;

	this.mag = 0;
	this.sweep = [];
	this.phase = 0;
}

function CelestialPoint()
{
	this.rightAscension = 0;
	this.declination = 0;

	this.azimuth = 0;
	this.height = 0;

	this.x = 0;
	this.y = 0;
}
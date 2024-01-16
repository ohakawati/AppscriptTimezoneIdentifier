function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var cityColumn = 4; // Column D (4th column) for city names
  var timezoneColumn = 6; // Column F (6th column) for timezone abbreviations

  if (sheet.getName() === "Sheet1" && range.getColumn() === cityColumn) {
    var city = range.getValue();
    var state = ""; // Get state if applicable
    var country = ""; // Get country if applicable
    var timezone = getTimezone(city, state, country);
    
    // Populate the timezone abbreviation in the 6th column (F) in the same row
    sheet.getRange(range.getRow(), timezoneColumn).setValue(timezone);
  }
}

function getTimezone(city, state, country) {
  var geocodingUrl;
  
  if (country === "USA") {
    // For U.S. cities, include city, state, and country
    geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city + ", " + state + ", " + country) + "your key";
  } else if (country === "Canada") {
    // For Canadian cities, include city and country
    geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city + ", " + country) + "your key";
  } else {
    // For other countries, include only city and country
    geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city + ", " + country) + "your key";
  }

  var geocodingResponse = UrlFetchApp.fetch(geocodingUrl);
  var geocodingData = JSON.parse(geocodingResponse.getContentText());

  if (geocodingData.status === "OK") {
    var location = geocodingData.results[0].geometry.location;
    var timestamp = Math.floor(new Date().getTime() / 1000); // Current timestamp in seconds
    var timezoneApiUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=" + location.lat + "," + location.lng + "&timestamp=" + timestamp + "your key";
    var timezoneResponse = UrlFetchApp.fetch(timezoneApiUrl);
    var timezoneData = JSON.parse(timezoneResponse.getContentText());

    if (timezoneData.status === "OK") {
      return timezoneData.timeZoneName; // Returns the time zone abbreviation
    }
  }

  return "Unknown Time Zone";
}
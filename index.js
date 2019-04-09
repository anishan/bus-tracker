function update() {
  // send post request
  var xhr = new XMLHttpRequest();
  let url = 'https://api-v3.mbta.com/predictions?filter[stop]=284'
  xhr.open('GET', url);
  xhr.onload = function () {
    // do something to response
    // console.log("sent request");
    console.log(this.responseText);
    updateBus("time-11-downtown", this.responseText);
  };
  xhr.send()

}

function updateBus(routeID, dataString){
  // get predicted time
  let dataJSON = JSON.parse(dataString);
  let datetime = dataJSON["data"][0]["attributes"]["arrival_time"];
  let time = datetime.substring(11,19);
  let arrival_hours = parseInt(time.substring(0,2));
  let arrival_min = parseInt(time.substring(3,5));
  console.log(dataJSON);
  console.log(arrival_hours + ":" + arrival_min);

  // get current time
  let d = new Date();
  let current_hours = d.getHours();
  let current_min = d.getMinutes();

  // get minutes remaining
  let minutes_remaining = 60*(arrival_hours-current_hours) + (arrival_min-current_min);
  console.log(minutes_remaining);

  $('#'+routeID).html(minutes_remaining);

}

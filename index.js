let STOPS = [{"route":"11", "div_id":"time-11-downtown", "stop_id":284, "dir_id":1},
             {"route":"11", "div_id":"time-11-bayview", "stop_id":151, "dir_id":0},
             {"route":"9", "div_id":"time-9-citypoint", "stop_id":151, "dir_id":0},
             {"route":"10", "div_id":"time-10-citypoint", "stop_id":13, "dir_id":0},
             {"route":"77", "div_id":"time-77-harvard", "stop_id":2268, "dir_id":1},
             {"route":"77", "div_id":"time-77-arlington", "stop_id":20761, "dir_id":0},
]

function update() {
  for (let s = 0; s < STOPS.length; s++){
    let routeID = STOPS[s]["route"];
    let stopID = STOPS[s]["stop_id"];
    let divID = STOPS[s]["div_id"]
    let dirID = STOPS[s]["dir_id"]

    // send post request
    var xhr = new XMLHttpRequest();
    let url = 'https://api-v3.mbta.com/predictions?filter[stop]='+stopID
    xhr.open('GET', url);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);
      updateBus(routeID, dirID, this.responseText, divID);
    };
    xhr.send()
  }

}

function updateBus(routeID, dirID, dataString, divID){
  let dataJSON = JSON.parse(dataString);
  // let formattedTimeString = "";
  let times = [];

  for (let i = 0; i < dataJSON["data"].length; i++) {
    let dataRoute = dataJSON["data"][i]["relationships"]["route"]["data"]["id"];
    let dataDir = dataJSON["data"][i]["attributes"]["direction_id"];
    if (dataRoute == routeID && dataDir == dirID) {
      // get predicted time
      let datetime = dataJSON["data"][i]["attributes"]["arrival_time"];
      if (datetime == null){
        datetime = dataJSON["data"][i]["attributes"]["departure_time"];
      }
      console.log(datetime);
      let arrivalTime = new Date(datetime);
      
      // get current time
      let currentTime = new Date();

      // get minutes remaining
      let millis_remaining = arrivalTime.getTime()-currentTime.getTime();
      let minutes_remaining = Math.round(millis_remaining/60000);

      times.push(minutes_remaining);
    }
  }

  // create the time string
  times.sort(function(a, b){return a - b});
  times = times.slice(0,Math.min(4, times.length));
  let formattedTimeString = times.toString();
  formattedTimeString =  formattedTimeString.replace(/,/g, ', ');

  // create the time page element
  $('#'+divID).html("<h3>" + formattedTimeString + "</h3>")

}

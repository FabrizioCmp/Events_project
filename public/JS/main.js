const eventEl = document.getElementById('event')

events = [
    "raduno",
    "party",
    "rinfresco",
    "incontro",
    "concerto",
    "appuntamento",
    "evento"
]

let eventNumber = 0

function changeEvent(){
  eventEl.textContent = events[eventNumber++]
  if (eventNumber == events.length) {
    eventNumber = 0
  }
}

//setInterval(changeEvent, 1000)
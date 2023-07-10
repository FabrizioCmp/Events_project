const eventEl = document.getElementById('event')

events = [
    "raduno",
    "party",
    "meeting",
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

function validatePassword(event){
  let pswd = document.getElementById("password").value
  let confirmPswd = document.getElementById("confirm").value

  const form = getElementById("register_form")


}

setInterval(changeEvent, 3000)
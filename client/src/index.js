const BASE_URL = "http://localhost:3000";
const peopleSelectElement = document.querySelector("#questions_people-options");
const questionSubmitBtn = document.getElementById("questionBtn");
const accusationSubmitBtn = document.getElementById("accusationBtn");
const questionForm = document.getElementById("questionForm");
const roomInfoContainer = document.getElementById("room-info");
const hintBtn = document.getElementById("hint-btn");
const hintP = document.getElementById("hint");
const roundCountElement = document.getElementById("rounds");
const questionAskedInRound = document.getElementById("numOfQuestionsInRound");

//  accusations elements
const accusationsForm = document.getElementById("accusation-form");
const personSelectElement = document.getElementById(
  "accusation_people-options"
);
const roomsSelectElement = document.getElementById("rooms_options");
const weaponSelectElement = document.getElementById("weapon_options");
const numberOfAccusationsElement = document.getElementById("numOfAccusations");
const accusationResultElement = document.getElementById("accusations-result");

// general
let rounds = 1;
let numOfQuestionsInRound = 0;
let numberOfAccusations = 0;
const maxNumberOfAccusations = 3;

function initGameData() {
  roundCountElement.innerText = "Round: 1";
  questionAskedInRound.innerText = "Number of question asked: 0";
  numberOfAccusationsElement.innerText = "Number of accusations: 0";

  getPeople();
  getRooms();
  getWeapons();
}

initGameData();

hintBtn.addEventListener("click", getHint);

function handleQuestionSubmit(e) {
  e.preventDefault();
  handleCount();
  let isTogether;
  const formData = new FormData(questionForm);

  //   get the data from that was entered from the form
  const formValues = Object.fromEntries(formData.entries());
  const hour = formValues.question_hour;

  //   get the person id that was chosen from the list in the form
  const personId =
    peopleSelectElement.options[peopleSelectElement.selectedIndex].getAttribute(
      "personId"
    );

  const roomIdPromise = fetch(`${BASE_URL}/question/${personId}`, {
    method: "POST",
    body: JSON.stringify({
      hour,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  roomIdPromise.then((data) => {
    data.json().then((roomId) => {
      const room_id = roomId.msg;
      console.log(room_id);

      // get the room which the victim was in

      if (personId !== "12") {
        const victimRoomPromise = fetch(`${BASE_URL}/question/12`, {
          method: "POST",
          body: JSON.stringify({
            hour,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((victimRoomData) => {
          victimRoomData.json().then((victimRoom) => {
            if (victimRoom.msg === room_id) {
              isTogether = true;
            } else {
              isTogether = false;
            }
          });
        });
      }

      /* 
    get room details for the room
    which the person was in it at the hour
    was chosen by the user
    */
      const itemsAtThatRoomPromise = fetch(`${BASE_URL}/room/${room_id}`);
      itemsAtThatRoomPromise.then((data) => {
        data.json().then((roomData) => {
          console.log(roomData);
          roomInfoContainer.innerHTML = `
            
            <h3 id="room-details">Room Details</h3>
            <p id="room-name"><strong>Room name:</strong> ${
              roomData.room.room_name
            }</p>
            <p class="room-desc"><strong>Description:</strong> ${
              roomData.room.description
            }</p>
            <p class="room-size"><strong>Room size (square meters):</strong> ${
              roomData.room.size_sqm
            }</p>
            <div class="room-items-container">
            <p><strong>Room items:</strong></p>
            <ul class="room-items">
            ${roomData.room.general_items
              .map((item) => {
                return `<li class="room-item">${item}</li>`;
              })
              .join("")}
            </ul>
            ${
              personId !== "12"
                ? `
                <p class="isTogether">
                  ${
                    isTogether
                      ? "The victim was in the same room with this person at this hour"
                      : "The victim was not in the same room at this hour"
                  }
                </p>
              `
                : ""
            }
            </div>
            
            `;
        });
      });
    });
  });
}

function getPeople() {
  const peopleRes = fetch(`${BASE_URL}/people`);
  const peopleData = peopleRes.then((res) => {
    return res.json();
  });

  peopleData.then((people) => {
    people.forEach((person) => {
      const option = document.createElement("option");
      option.value = person.name;
      option.setAttribute("personId", person.id);
      option.innerText = person.name;
      const personOption = option.cloneNode(true);
      peopleSelectElement.appendChild(option);
      personSelectElement.appendChild(personOption);
    });
  });
}

function handleCount() {
  if (numOfQuestionsInRound < 5) {
    numOfQuestionsInRound++;
  } else {
    numOfQuestionsInRound = 0;
    rounds++;
  }

  roundCountElement.innerText = `Round: ${rounds}`;
  questionAskedInRound.innerText = `Number of question asked: ${numOfQuestionsInRound}`;
}

function getRooms() {
  const roomsRes = fetch(`${BASE_URL}/rooms`);
  const roomsData = roomsRes.then((res) => {
    return res.json();
  });

  roomsData.then((rooms) => {
    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.id;
      option.innerText = room.room_name;
      roomsSelectElement.appendChild(option);
    });
  });
}

function getWeapons() {
  const weaponsRes = fetch(`${BASE_URL}/weapons`);
  const weaponsData = weaponsRes.then((res) => {
    return res.json();
  });

  weaponsData.then((weapons) => {
    weapons.forEach((weapon) => {
      const option = document.createElement("option");
      option.value = weapon.name;
      option.innerText = weapon.name;
      option.setAttribute("weaponId", weapon.id);
      weaponSelectElement.appendChild(option);
    });
  });
}

function handleAccusationSubmit(e) {
  e.preventDefault();

  const formData = new FormData(accusationsForm);

  //   get the data from that was entered from the form
  const formValues = Object.fromEntries(formData.entries());

  const hour = `${formValues.accusation_hour}:00`;
  const personId =
    personSelectElement.options[personSelectElement.selectedIndex].getAttribute(
      "personId"
    );
  const weaponId =
    weaponSelectElement.options[weaponSelectElement.selectedIndex].getAttribute(
      "weaponId"
    );
  const roomId = formValues.room;

  fetch(`${BASE_URL}/solve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      person: personId,
      weapon: weaponId,
      room: roomId,
      hour,
    }),
  }).then((res) => {
    res.json().then((accustationResult) => {
      const isFound = accustationResult.msg;
      if (isFound) {
        finishGame(isFound);
      } else {
        if (numberOfAccusations < 3) {
          numberOfAccusations++;
          numberOfAccusationsElement.innerText = `Number of accusations: ${numberOfAccusations}`;
          finishGame(isFound);
        } else {
          numberOfAccusationsElement.innerText = `Number of accusations: ${numberOfAccusations}`;

          finishGame(isFound);
        }
      }
    });
  });
}

function finishGame(isFound) {
  if (isFound) {
    accusationResultElement.innerHTML = `<p>Result: <strong>You have found the murderer!</strong></p>`;
    accusationResultElement.classList.add("found");
  } else if (numberOfAccusations === 3) {
    accusationResultElement.innerHTML = `
    <p>Result: <strong>This is not the murderer try again!</strong></p>
    <h4>Game Over!</h4>
    `;
    accusationSubmitBtn.setAttribute("disabled", true);
    questionSubmitBtn.setAttribute("disabled", true);
  } else {
    accusationResultElement.innerHTML = `<p>Result: <strong>This is not the murderer try again!<strong></p>`;
  }
}

function getHint() {
  fetch(`${BASE_URL}/hint`).then((res) => {
    res.json().then((hint) => {
      hintP.innerText = hint.hint;
    });
  });
}

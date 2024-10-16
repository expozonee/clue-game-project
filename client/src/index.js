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
const questionHoursSelectElement = document.getElementById("question_hour");

//  accusations elements
const accusationsForm = document.getElementById("accusation-form");
const personSelectElement = document.getElementById(
  "accusation_people-options"
);
const accusationHoursSelectElement = document.getElementById("accusation_hour");

const roomsSelectElement = document.getElementById("rooms_options");
const weaponSelectElement = document.getElementById("weapon_options");
const numberOfAccusationsElement = document.getElementById("numOfAccusations");
const accusationResultElement = document.getElementById("accusations-result");

// general
let rounds = 1;
let numOfQuestionsInRound = 0;
let numberOfAccusations = 0;
const maxNumberOfAccusations = 3;
const allSelectItems = document.querySelectorAll("select");

document.addEventListener("DOMContentLoaded", () => {
  const playAudio = () => {
    document.getElementById("horror-audio").play();
    document.removeEventListener("click", playAudio);
  };
  document.addEventListener("click", playAudio);
});

function initGameData() {
  roundCountElement.innerText = "Round: 1";
  questionAskedInRound.innerText = "Number of question asked: 0";
  numberOfAccusationsElement.innerText = "Number of accusations: 0";

  getPeople();
  getRooms();
  getWeapons();
  getHours();
}

initGameData();

function createDisabledOption(type) {
  const disabledOption = document.createElement("option");
  disabledOption.value = "none";
  disabledOption.innerText = `-- Select a ${type} --`;
  disabledOption.setAttribute("disabled", true);
  disabledOption.setAttribute("selected", true);
  return disabledOption;
}

function createErrorMsgElement() {
  const errorH5 = document.createElement("h5");
  errorH5.classList.add("error");
  errorH5.textContent = "One or more of the fields is missing!";
  return errorH5;
}

hintBtn.addEventListener("click", () => {
  getHint();
  hintBtn.setAttribute("disabled", true);
});

allSelectItems.forEach((selectElement) => {
  selectElement.addEventListener("change", () => {
    if (selectElement.classList.contains("missing-field")) {
      selectElement.classList.remove("missing-field");
    }
  });
});

function handleQuestionSubmit(e) {
  e.preventDefault();
  let isTogether;
  const formData = new FormData(questionForm);

  //   get the data from that was entered from the form
  const formValues = Object.fromEntries(formData.entries());
  const hour = formValues.question_hour;
  const questionsContainer = document.getElementById("questions");
  const existingError = questionsContainer.querySelector(".error");

  if (peopleSelectElement.selectedIndex === 0) {
    peopleSelectElement.classList.add("missing-field");
  }
  if (!hour) {
    questionHoursSelectElement.classList.add("missing-field");
  }

  if (!hour || peopleSelectElement.selectedIndex === 0) {
    const errorH5 = createErrorMsgElement();

    if (existingError) {
      questionsContainer.removeChild(existingError);
    }
    questionsContainer.appendChild(errorH5);
    return;
  }

  if (existingError) {
    questionsContainer.removeChild(existingError);
  }

  handleCount();

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
    const disabledOption = createDisabledOption("person");
    const personDisabledOption = disabledOption.cloneNode(true);
    peopleSelectElement.appendChild(disabledOption);
    personSelectElement.appendChild(personDisabledOption);

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
    const disabledOption = createDisabledOption("room");
    roomsSelectElement.appendChild(disabledOption);

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
    const disabledOption = createDisabledOption("weapon");
    weaponSelectElement.appendChild(disabledOption);

    weapons.forEach((weapon) => {
      const option = document.createElement("option");
      option.value = weapon.name;
      option.innerText = weapon.name;
      option.setAttribute("weaponId", weapon.id);
      weaponSelectElement.appendChild(option);
    });
  });
}

function getHours() {
  const disabledOption = createDisabledOption("hour");
  const accusationDisabledOption = disabledOption.cloneNode(true);
  questionHoursSelectElement.appendChild(disabledOption);
  accusationHoursSelectElement.appendChild(accusationDisabledOption);

  for (let i = 0; i < 24; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    const accusationHourOption = option.cloneNode(true);
    questionHoursSelectElement.appendChild(option);
    accusationHoursSelectElement.appendChild(accusationHourOption);
  }
}

function handleAccusationSubmit(e) {
  e.preventDefault();
  const accusationContainer = document.getElementById("accusations");
  const existingError = accusationContainer.querySelector(".error");

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

  if (!formValues.accusation_hour) {
    accusationHoursSelectElement.classList.add("missing-field");
  }
  if (!personId) {
    personSelectElement.classList.add("missing-field");
  }
  if (!weaponId) {
    weaponSelectElement.classList.add("missing-field");
  }
  if (!roomId) {
    roomsSelectElement.classList.add("missing-field");
  }

  if (!formValues.accusation_hour || !personId || !weaponId || !roomId) {
    const errorH5 = createErrorMsgElement();
    if (existingError) {
      accusationContainer.removeChild(existingError);
    }
    accusationContainer.appendChild(errorH5);
    return;
  }

  if (existingError) {
    accusationContainer.removeChild(existingError);
  }

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
      if (numberOfAccusations < 3) {
        numberOfAccusations++;
        numberOfAccusationsElement.innerText = `Number of accusations: ${numberOfAccusations}`;
      } else {
        numberOfAccusationsElement.innerText = `Number of accusations: ${numberOfAccusations}`;
      }

      finishGame(isFound);
    });
  });
}

function finishGame(isFound) {
  const detailsRes = fetch(`${BASE_URL}/details`).then((res) => {
    return res.json();
  });

  detailsRes.then((details) => {
    if (isFound) {
      accusationResultElement.innerHTML = `<p>Result: <strong>You have found the murderer!</strong></p>`;
      accusationResultElement.classList.add("found");
      accusationSubmitBtn.setAttribute("disabled", true);
      questionSubmitBtn.setAttribute("disabled", true);
    } else if (numberOfAccusations === 3) {
      accusationResultElement.innerHTML = `
      <p>Result: <strong>This is not the murderer try again!</strong></p>
      <h4 class="game-over">Game Over!</h4>
      <section class="details-container">
      <h5 class="murder-details">Murder details:</h5>
      <p class"details"><strong>Murderer:</strong> ${details.murderer.name}</p>
      <p class"details"><strong>Room:</strong> ${details.room.room_name}</p>
      <p class"details"><strong>Weapon:</strong> ${details.weapon.name}</p>
      <p class"details"><strong>Time of crime:</strong> ${details.time}</p>
      </section>
      `;
      accusationSubmitBtn.setAttribute("disabled", true);
      questionSubmitBtn.setAttribute("disabled", true);
    } else {
      accusationResultElement.innerHTML = `<p>Result: <strong>This is not the murderer try again!<strong></p>`;
    }
  });
}

function getHint() {
  fetch(`${BASE_URL}/hint`).then((res) => {
    res.json().then((hint) => {
      hintP.innerText = hint.hint;
    });
  });
}

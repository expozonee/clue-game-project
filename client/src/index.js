const BASE_URL = "http://localhost:3000";
const peopleSelectElement = document.querySelector("#questions_people-options");
const questionSubmitBtn = document.getElementById("questionBtn");
const accusationSubmitBtn = document.getElementById("accusationBtn");
const questionForm = document.getElementById("questionForm");
const roomInfoContainer = document.getElementById("room-info");
const hintBtn = document.getElementById("hint-btn");
const hintP = document.getElementById("hint");
const questionAskedInRound = document.getElementById("numOfQuestionsInRound");

function initGameData() {
  getPeople();
}

initGameData();

questionSubmitBtn.addEventListener("click", () => {
  //   const person = document.getElementById;
});

function handleQuestionSubmit(e) {
  e.preventDefault();
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
    console.log(people);
    people.forEach((person) => {
      const option = document.createElement("option");
      option.value = person.name;
      option.setAttribute("personId", person.id);

      option.innerText = person.name;

      peopleSelectElement.appendChild(option);
    });
  });
}

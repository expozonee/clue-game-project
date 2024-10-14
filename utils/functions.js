const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
  const filepath = path.join(__dirname, "../", "data", filename);
  const data = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(data);
};

const people = loadData("people.json");
const rooms = loadData("rooms.json");
const weapons = loadData("weapons.json");

let murderDetails = {};
let peopleHoursRoom = {};

// Function to select a random element from an array
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Function to select a random hour from 0 to 23
const getRandomHour = () => Math.floor(Math.random() * 24);

const getLoadedData = (data) => {
  switch (data) {
    case "people":
      return people;
    case "rooms":
      return rooms;
    case "weapons":
      return weapons;
    case "murderDetails":
      return murderDetails;
    case "peopleHoursRoom":
      return peopleHoursRoom;
  }
};

// Function to generate the murder details
const generateMurderDetails = () => {
  let selectedPerson = getRandomElement(people);
  while (selectedPerson.id === 12) {
    selectedPerson = getRandomElement(people);
  }
  const selectedRoom = getRandomElement(rooms);
  const selectedWeapon = getRandomElement(weapons);
  const selectedHour = getRandomHour();

  murderDetails = {
    murderer: selectedPerson,
    room: selectedRoom,
    weapon: selectedWeapon,
    time: `${selectedHour}:00`,
  };
  return murderDetails;
};

function populatePeopleHoursRoom() {
  people.forEach((person) => {
    peopleHoursRoom[person.id] = {};
    for (let i = 0; i < 24; i++) {
      if (
        (person.id === murderDetails.murderer.id || person.id === 12) &&
        `${i}:00` === murderDetails.time
      ) {
        peopleHoursRoom[person.id][i] = murderDetails.room.id;
      } else {
        peopleHoursRoom[person.id][i] = getRandomElement(rooms).id;
      }
    }
  });
}

function shuffleArray(array) {
  // Create a copy of the array to avoid mutating the original array
  const shuffledArray = array.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and randomIndex
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }

  return shuffledArray;
}

function populateRoomWeapons() {
  rooms.forEach((room) => {
    if (room.id === murderDetails.room.id) {
      room.general_items.push(murderDetails.weapon.name);
    }
    const totalWeapons = Math.floor(Math.random() * 4 + 1);
    for (let i = 0; i < totalWeapons; i++) {
      room.general_items.push(getRandomElement(weapons).name);
    }
    room.general_items = shuffleArray(room.general_items);
  });
}

const getHintTimeRange = () => {
  const murderHour = parseInt(murderDetails.time.split(":")[0]);
  const startOffset = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
  let startHour = murderHour - startOffset;
  if (startHour < 0) {
    startHour += 24;
  }
  const endHour = (startHour + 4) % 24;

  return {
    hint: `The murder happened between ${startHour}:00 and ${endHour}:00.`,
  };
};

function initGame() {
  generateMurderDetails();
  populateRoomWeapons();
  populatePeopleHoursRoom();
}

module.exports = {
  initGame,
  getHintTimeRange,
  getLoadedData,
};

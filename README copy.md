# CLUE GAME

## General Instructions

We will create a version of the “Clue” game. In this game, a murder has occurred, and your task is to find the culprit and murder details in the shortest number of rounds. 

The murder consists of the following details:
- **Murderer**
- **Room**
- **Hour**
- **Weapon**

Your tools to uncover the murder details involve questioning suspects. You can:
- Check which room a person was in at a specific hour.
- Find out which tools were in that room.
- Check if the victim was present in the room at the same time.

If a suspect was with the victim in the same room, and the room had one of the available weapons, there’s a good chance these are the correct murder details.

Additionally, once per game, you can get a hint: a range of hours within which the murder took place. You can ask as many questions as you like, but only 5 questions per round. After asking 5 questions, 1 is added to the round total, and the question count resets to 0.

I have provided the backend code (details regarding the available functionality can be found in the README), and data about the people, rooms, and weapons.

## Game Flow

When you start the server:
- Murder details are generated randomly from the available people, rooms, and weapons.
- A schedule is created for each person, detailing where they were at each hour of the day.
- The game ensures the murderer was in the correct room and that the weapon was in the correct room.

The rest of the game tasks take place on the client side. You need to support the following functionalities:

### 1. Get a Hint
- Clicking a button will send a request to the `/hint` endpoint.
- Display the results in the UI.

### 2. Ask a Question
- From a dropdown list, select one of the available people (retrieve using `/people` endpoint).
- Select an hour (input, focus only on the hour, not minutes).
- Clicking a button will send a request to `/question/:personId` with the hour included in the request body.
- Use the room ID from the response to send another request to `/room/:roomId` to get the list of items inside the room.
- Additionally, send a request for the victim (ID: 12) at the same hour to check if the victim was in the same room.
- Display the results in the UI, showing whether the victim was in the same room or not.
- After each request, increment the total number of questions. If the count exceeds 5, reset it to 0 and add 1 to the total number of rounds.

### 3. Make an Accusation
- Only 3 accusations can be made.
- In the UI:
  - Select a person (retrieve all people using the `/people` endpoint).
  - Select a room (retrieve all rooms using the `/rooms` endpoint).
  - Select an hour.
  - Select a weapon (retrieve all weapons using the `/weapons` endpoint).
  - Clicking a button will send the data to the `/solve` endpoint.
- Show the results in the UI:
  - If the result is `true`, you win! Display the murderer's name, description, room name, weapon details, reason for the murder (can be found in the victim’s details via `/person/:personId`), and the total number of rounds.
  - If the result is `false`, increment the total accusations number and show a message.
  - If the number of accusations exceeds 3, you lose. Display a losing message in the UI.

## UI Requirements

- **Title**
- **Rounds number**
- **Questions asked in the current round**

### Question Section
- A **hint button** and a place to display the hint message.
- A form with:
  - Dropdown list of people to select from.
  - Input to select an hour.
  - A button to submit the form.
- A place to show the question result:
  - `Person <name> was in room <name> at hour <hour>. Inside the room: <items>. The victim was <in the same room || in another room>.`

### Accusation Section
- Number of accusations made so far.
- A place to display accusation results.
- Dropdown lists to select:
  - Person (from all available people).
  - Room (from all available rooms).
  - Weapon (from all available weapons).
  - Input to select an hour.
- A button to submit the accusation.

## Provided Code

The backend code can be found in this repo - clone or fork it:
1. `cd` into the repo and run `npm install`.
2. Start the server by running `npm start` or `node server.js`.

### Files included:
- **server.js**: The server file.
- **utils**: Folder hosting utility functions.
- **functions.js**: Functions used to generate and run the game.
- **data**: Folder with JSON files containing people, rooms, and weapons data.
- **README**: Contains detailed information about the server and functions.

### Client Folder:
You can put your frontend code here, or use another location.

## Possible Extras
- Add styles.
- Add animations and music/videos.
- Add images for each character (use AI to generate based on character descriptions).
- Add more complexity (e.g., more hours, more players).
- Add any other features you can think of.

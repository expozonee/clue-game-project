const express = require("express");
const fns = require("./utils/functions.js");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.get("/people/:personId", (req, res) => {
  const people = fns.getLoadedData("people");
  for (const person of people) {
    if (person.id === req.personId) {
      res.json({ person });
      return;
    }
  }
  res.json({ person: false });
  return;
});

app.get("/people", (req, res) => {
  const people = fns.getLoadedData("people");
  res.json(people);
});

app.get("/rooms", (req, res) => {
  const rooms = fns.getLoadedData("rooms");
  res.json(rooms);
});
app.get("/room/:roomId", (req, res) => {
  const rooms = fns.getLoadedData("rooms");

  for (const room of rooms) {
    if (room.id == req.params.roomId) {
      res.json({ room });
      return;
    }
  }
  res.json({ room: false });
  return;
});

app.get("/weapons", (req, res) => {
  const weapons = fns.getLoadedData("weapons");
  res.json(weapons);
});

app.get("/hint", (req, res) => {
  const hint = fns.getHintTimeRange();
  res.json(hint);
});

app.post("/question/:personId", (req, res) => {
  const hour = req.body.hour;
  const peopleHoursRoom = fns.getLoadedData("peopleHoursRoom");
  res.json({ msg: peopleHoursRoom[req.params.personId][hour] });
});

app.get("/details", (req, res) => {
  const details = fns.getLoadedData("murderDetails");
  res.json(details);
});

app.post("/solve", (req, res) => {
  const { person, weapon, room, hour } = req.body;
  const murderDetails = fns.getLoadedData("murderDetails");
  if (
    murderDetails.murderer.id === person &&
    murderDetails.weapon.id === weapon &&
    murderDetails.room.id === room &&
    murderDetails.time === hour
  ) {
    res.json({ msg: true });
  } else {
    res.json({ msg: false });
  }
});

app.listen(port, () => {
  fns.initGame();
  console.log(`Server running on http://localhost:${port}`);
});

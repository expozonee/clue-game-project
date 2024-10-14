## Utility Functions (./utils/functions.js)

### loadData(filename)
- **Description:** Loads JSON data from a file in the '../data' directory.
- **Input:** 
  - `filename` (string): Name of the JSON file to load
- **Return Type:** object (parsed JSON data)

### getRandomElement(array)
- **Description:** Selects a random element from an array.
- **Input:**
  - `array` (array): The array to select from
- **Return Type:** any (type of array elements)

### getRandomHour()
- **Description:** Generates a random hour between 0 and 23.
- **Input:** None
- **Return Type:** number (0-23)

### getLoadedData(data)
- **Description:** Retrieves pre-loaded data of a specified type.
- **Input:** 
  - `data` (string): The type of data to retrieve ("people", "rooms", "weapons", "murderDetails", "peopleHoursRoom")
- **Return Type:** array or object (depending on the data type)
- **Note:** There's a bug in this function where it always returns `people` for "rooms" and "weapons" cases.

### generateMurderDetails()
- **Description:** Generates random murder details, excluding person with id 12 as the murderer.
- **Input:** None
- **Return Type:** object (murder details including murderer, room, weapon, and time)

### populatePeopleHoursRoom()
- **Description:** Populates the `peopleHoursRoom` object with random room assignments for each person for each hour, ensuring the murderer and person with id 12 are in the murder room at the murder time.
- **Input:** None
- **Return Type:** void

### shuffleArray(array)
- **Description:** Creates a shuffled copy of the input array.
- **Input:**
  - `array` (array): The array to shuffle
- **Return Type:** array (new shuffled array)

### populateRoomWeapons()
- **Description:** Adds weapons to each room's `general_items`, including the murder weapon in the murder room, and 1-4 random weapons in each room.
- **Input:** None
- **Return Type:** void

### getHintTimeRange()
- **Description:** Generates a hint about the time range of the murder, providing a 4-hour window that includes the actual murder time.
- **Input:** None
- **Return Type:** object { hint: string }

### initGame()
- **Description:** Initializes the game by generating murder details, populating room weapons, and setting up people's locations.
- **Input:** None
- **Return Type:** void

## Notes
- The server uses these utility functions from `./utils/functions.js`
- Data is loaded from JSON files in a '../data' directory
- The game state (murder details, people's locations, room contents) is randomized each time `initGame()` is called
- Person with id 12 is never the murderer but is always in the murder room at the time of the murder
- The time hint provides a 4-hour window that includes the actual murder time


##### server documentation:
# Express Server API Documentation

## Base URL
`http://localhost:3000`

## Endpoints

### 1. Get Person by ID
- **URL:** `/people/:personId`
- **Method:** GET
- **URL Params:** 
  - `personId` (required): The ID of the person to retrieve
- **Success Response:** `{ person: [person object] }` if found, `{ person: false }` if not found
- **Notes:**
  - Uses `fns.getLoadedData("people")` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/people/1')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 2. Get All People
- **URL:** `/people`
- **Method:** GET
- **Success Response:** Array of all people objects
- **Notes:**
  - Uses `fns.loadData('people')` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/people')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 3. Get All Rooms
- **URL:** `/rooms`
- **Method:** GET
- **Success Response:** Array of all room objects
- **Notes:**
  - Uses `fns.loadData('rooms')` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/rooms')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 4. Get Room by ID
- **URL:** `/room/:roomId`
- **Method:** GET
- **URL Params:**
  - `roomId` (required): The ID of the room to retrieve
- **Success Response:** `{ room: [room object] }` if found, `{ room: false }` if not found
- **Notes:**
  - Uses `fns.getLoadedData("rooms")` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/room/1')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 5. Get All Weapons
- **URL:** `/weapons`
- **Method:** GET
- **Success Response:** Array of all weapon objects
- **Notes:**
  - Uses `fns.getLoadedData('weapons')` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/weapons')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 6. Get Hint
- **URL:** `/hint`
- **Method:** GET
- **Success Response:** Hint object
- **Notes:**
  - Uses `fns.getHintTimeRange()` to retrieve hint data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/hint')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 7. Question Person
- **URL:** `/question/:personId`
- **Method:** POST
- **URL Params:**
  - `personId` (required): The ID of the person to question
- **Body:**
  - `hour` (required): The hour to query about
- **Success Response:** `{ msg: [room information for the specified person and hour] }`
- **Notes:**
  - Uses `fns.getLoadedData("peopleHoursRoom")` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/question/1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hour: 14 }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 8. Get Murder Details
- **URL:** `/details`
- **Method:** GET
- **Success Response:** Murder details object
- **Notes:**
  - Uses `fns.getLoadedData("murderDetails")` to retrieve data
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/details')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

### 9. Solve Murder
- **URL:** `/solve`
- **Method:** POST
- **Body:**
  ```json
  {
    "person": "[person id]",
    "weapon": "[weapon id]",
    "room": "[room id]",
    "hour": "[hour of murder]"
  }
  ```
- **Success Response:** `{ msg: true }` if the solution is correct, `{ msg: false }` if incorrect
- **Notes:**
  - Compares the provided solution with the actual murder details
- **Usage Example:**
  ```javascript
  fetch('http://localhost:3000/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      person: '1',
      weapon: '2',
      room: '3',
      hour: 15
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  ```

## Server Initialization
- The server runs on port 3000
- On startup, it calls `fns.initGame()` to initialize the game state

## Notes
- The server uses various utility functions from `./utils/functions.js`


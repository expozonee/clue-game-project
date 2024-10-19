# CLUE GAME

## Welcome to the Clue Game!

In this thrilling mystery game, a murder has taken place, and it’s your mission to uncover the details of the crime. You need to find out who the murderer is, which room the murder occurred in, the hour it happened, and what weapon was used. Your goal is to solve the mystery in the fewest rounds possible!

### What You Need to Discover
- **Murderer**
- **Room**
- **Hour**
- **Weapon**

### How to Gather Information
- **Question Suspects:** You will interrogate various suspects to find out where they were at specific times and which weapons were available in each room.
- **Check Victim's Location:** You must confirm if the victim was in the same room as a suspect at the time of the murder.
- **Get a Hint:** Use your one-time hint to request a range of hours that might include the murder hour.

### Asking Questions
You can ask as many questions as you like, but remember you can only ask **5 questions per round**. After you reach this limit, your round will automatically increment, and you can start asking questions again.

## How the Game Works

### Starting the Game
Once you start:
1. The game will randomly generate the details of the murder from the available characters, rooms, and weapons.
2. Each suspect will have a schedule showing their whereabouts at each hour of the day.
3. The murderer will be positioned in the correct room with the appropriate weapon.

### Actions You Can Take

1. **Get a Hint:**
   - Click the hint button to receive a clue about the range of hours for the murder.
   - This hint will be displayed for you to use strategically.

2. **Ask a Question:**
   - Select a suspect from the dropdown list.
   - Choose an hour using the input field.
   - Submit your question to find out where the suspect was and what items were in the room at that time.
   - You’ll also check if the victim was in the same room during that hour.
   - Results will be displayed, indicating whether the victim was present.

3. **Make an Accusation:**
   - You have **3 chances** to make an accusation.
   - Choose a suspect, room, weapon, and hour from the dropdowns.
   - Submit your accusation.
   - If correct, you’ll see details of the murderer, including their name, the room, the weapon, and the motive for the crime.
   - If incorrect, you’ll receive a message, and your total accusations will increase. If you exceed 3 accusations, you lose the game!

## Ready to Play?
To start your sleuthing adventure, clone or fork the repository and run the following commands in your terminal:

```bash
cd clue-game-project
npm install
npm run start

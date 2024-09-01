const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const WIN = "You've found the carrot. You've won the game!";                    // customise message when player wins
const LOST = "You've dropped into the hole. You've lost the game.";             // customise message when player lose
const OUT = "You've moved out of the filed. You've lost the game.";             // customise message when player is out of bounds (lose)
const QUIT = "Thank you. You quit the game";                                    // customise message when player quits

// MAP  PERCENTAGE                                                               
const PERCENT = .2;                                                             // % of holes for the map

// x and y coordinates assignment
// let x = 0;
// let y = 0;
// let previousX = 0;
// let previousY = 0;

class Field{

    // create the constructor
    constructor(field = [[]]) {
        this.field = field;                                                     // this.field is a property of the class Field 
        this.gamePlay = false;                                                  // when the game is instantiated, the gamePlay is false
        this.x = 0;                                                             // now, player's x location is tracked locally
        this.y = 0;                                                             // now, player's y location is tracked locally
        this.previousX = 0;                                                     // now, player's previousX location is tracked locally
        this.previousY = 0;                                                     // now, player's previousY location is tracked locally
    }

    static welcomeMsg(msg) {                                                    // static Method to show game's welcome message
        console.log(msg);
    }

    static selectMapSize(direction) {                                           // allow user to select the number of rows and columns between 4 - 20
        let selection = true;
        let inputSelection = 0;
    
        while (selection) {
            inputSelection = prompt(`Please enter the number of ${direction} between 4 - 20 for the field: `);
            if (inputSelection <= 3 || inputSelection > 20 || isNaN(inputSelection)) {
                console.log(`Invalid ${direction} selection, please try again.`);
            } else {
                selection = false;
                return inputSelection;
            }
        } 
    }

    static generateField(rows, cols, percentage) {                              // static method that generates and return a 2D map
        const map = [[]];

        for (let i = 0; i < rows; i++) {                                        // create the map with 8 rows
            map[i] = [];                                                        // each row will have 5 cols
            for (let j = 0; j < cols; j++) {
                map[i][j] = Math.random() > percentage ? GRASS : HOLE;          // per col in each row, we generate grass(80%)/hole(20%)
                
            }
        }
        return map;
    }

    printField() {                                                               // print the game field (used to update during gameplay)       
        this.field.forEach(element => {
            console.log(element.join(""));
        })
    }

    updateGame(input) {                                                          // Refer to details in the method's codeblock

      const userInput = String(input).toLowerCase();

        this.previousX = this.x;                                                 // row coordinate to replace player and grass
        this.previousY = this.y;                                                 // column coordinate to replace player and grass
       
        // user select up
        if (userInput === "u") {
            this.x = this.x - 1;
        }
        // user select down
        if (userInput === "d") {       
            this.x = this.x + 1;
        }
        // user select left
        if (userInput === "l") {
            this.y = this.y - 1;
        }
        // user select right
        if (userInput === "r") {
            this.y = this.y + 1;
        }
         /*  
        if the user exits out of the field
        end the game - set the gamePlay = false;
        inform the user that he step OUT of the game
        */
        if (this.x < 0 || this.x > ROWS-1 || this.y < 0 || this.y > COLS-1) {
            console.log(OUT);
            this.endGame();
        }
        /*   
        if the user arrives at the carrot
        end the game - set gamePlay = false;
        inform the user that he WIN the game 
        */
        if (this.field[this.x][this.y] === CARROT) {
            console.log(WIN);
            this.endGame();
        }
        /* 
        if the user arrives at the hole
        end the game - set the gamePlay = false;
        inform the user that he LOST the game
        */
        if (this.field[this.x][this.y] === HOLE) {
            console.log(LOST);
            this.endGame();
        }
        /*  
        if the user ends the game
        end the game - set the gamePlay = false;
        inform the user that he QUIT the game
        */
        if (userInput === "q") {
            this.quitGame();
        }
        /* 
        otherwise, move player on the map: field[rowindex][colindex] = CARROT;
        update the display to show the user had moved to the new area on map
        ask for player's next move as well 
        */
        this.field[this.x][this.y] = PLAYER;
        this.field[this.previousX][this.previousY] = GRASS;
    }

    plantCarrot() {
        //plant the carrot by randomizing the X and Y location in the form of variables
        const X = Math.floor(Math.random() * (ROWS - 1)) + 1;
        const Y = Math.floor(Math.random() * (COLS - 1)) + 1;   
        this.field[X][Y] = CARROT;
    }

    startGame() {      

        this.gamePlay = true;                                                   // set this.gamePlay = true to keep the game running
        this.field[0][0] = PLAYER;                                              // at the start of the game, we insert the player;
        this.plantCarrot();                                                     // plant the carrot manually, or use a Method

        while(this.gamePlay){                                                   // while the gamePlay is happening                                          

            this.printField();                                                  // show the map each time a move is requested

            let flagInvalid = false;                                            // flag to check if any invalid input is entered
            console.log("(u)p, (d)own, (l)eft, (r)ight, (q)uit");               // provide instruction for player to move
            const input = prompt("Which way: ");                                // obtain the user's direction (up, down, left right, quit)

            switch (input.toLowerCase()) {                                      // acknowledging the user's input
                case "u":
                    console.log("You move UP.");
                    break;
                case "d":
                    console.log("You move DOWN.");
                    break;
                case "l":
                    console.log("You move LEFT.");
                    break;
                case "r":
                    console.log("You move RIGHT.");
                    break;
                case "q":
                    break;
                default:
                    console.log("Invalid move.");
                    flagInvalid = !flagInvalid;
                    break;
            }

            if(!flagInvalid) {                                                  // only if flagInvalid is false, then update game
                this.updateGame(input);
            }

        }

    }

    endGame() {                                                                  
        this.gamePlay = false;                                                  // set property gamePlay to false
        process.exit();                                                         // end the Node app
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }

}

// Instantiate a new instance of Field Class
const ROWS = Number(Field.selectMapSize('rows'));                               // initialize the game map rows (user's selection)
const COLS = Number(Field.selectMapSize('cols'));                               // initialize the game map columns (user's selection)

const createField = Field.generateField(ROWS, COLS, PERCENT);                   // call Field's class static method to generate 2D field
const gameField = new Field(createField);

Field.welcomeMsg("Welcome to Find The Carrot Game!\n**************************************************");

gameField.startGame();
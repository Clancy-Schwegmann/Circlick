console.log("game script loaded");

//Keep track of current game state.
type game_states = "main_menu" | "game";

//set initial state.
let current_state:game_states = "game";

function SetState(state: game_states)
{
    current_state = state;
}

//Check if state element exists, and update the content inside if it does.
function UpdateDisplay() {
const el = document.getElementById("state");
    if(el){
        el.textContent = "State: " + current_state;
    }
}

SetState("game");
UpdateDisplay();
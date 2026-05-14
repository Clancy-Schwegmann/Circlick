//Keep track of current game state.
type game_states = "main_menu" | "game";

//set initial state.
let current_state:game_states = "game";

function SetState(state: game_states)
{
    current_state = state;
}

SetState("game");


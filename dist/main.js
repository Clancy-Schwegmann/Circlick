"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//set initial state.
let current_state = "game";
function SetState(state) {
    current_state = state;
}
//Check if state element exists, and update the content inside if it does.
function UpdateDisplay() {
    const el = document.getElementById("state");
    if (el) {
        el.textContent = "State: " + current_state;
    }
}
SetState("game");
UpdateDisplay();
//# sourceMappingURL=main.js.map
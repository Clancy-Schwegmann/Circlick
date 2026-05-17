

/*      GAME SETTINGS       */


console.log("game script loaded");

const game = document.getElementById("game") as HTMLCanvasElement;

const ctx = game.getContext("2d");

type game_states = "main_menu" | "game" | "end_game"; //store game states

let current_state:game_states = "game"; //set initial game state.

//Set game state
//params: main_menu, game
function SetState(state: game_states)
{
    current_state = state;
}

SetState("game");

//keep track of mouse position
type mouse_pos = {
    x:number,
    y:number
}

//initial position
let mouse:mouse_pos = {
    x:0,
    y:0
}

//game score
let score = 0;

let game_timer = 30; //time for each run - in seconds
const max_time = game_timer; //used with the time bar display
let last_time = performance.now();


/*      GAME LOOP       */


//get mouse position at runtime
document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

//store target as type
type target = {
    x:number;
    y:number;
    radius:number;
}

//store each target in array.
let targets: target[] = [];

function SpawnTarget(){
    const radius = 20;

    //make sure we don't spawn out of bounds.
    const x = Math.random() * (game.width - radius * 2) + radius;
    const y = Math.random() * (game.height - radius * 2) + radius;

    targets.push({
        x:x,
        y:y,
        radius:radius
    });
}

//Updates game window based on browser width and height.
function ResizeGame() {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
}

window.addEventListener("resize", () => {
    ResizeGame();
})

//Render targets.
function RenderGame(){
    if (!ctx) return; //if we can't render at all, don't bother tryin'

    //clear screen every frame
    ctx.clearRect(0, 0, game.width, game.height);

    //draw score text if we already scored.
    /*
    if (score)
    {
        ctx.fillStyle = "black";
        ctx.font = "24px Inter"
        ctx.fillText(score.toString(), 20, 20)
    }
    */

    //draw me some circles
    for(const target of targets){
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//Runs every frame
function GameLoop(current_time: number){
    //
    const delta_time = (current_time - last_time) / 1000;
    last_time = current_time

    //Update timer every second
    if(game_timer > 0)
        game_timer -= delta_time;

    RenderGame();
    requestAnimationFrame(GameLoop);
}


//Update mouse position relative to canvas window.
document.addEventListener("mousemove", (event) => {
    //get canvas size
    const rect = game.getBoundingClientRect();
  
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

//Get distance of mouse from center of circle (collision detection)
function IsTargetClicked(target_x: number, target_y: number, radius: number): boolean {
    const hit_padding = 5; //increase circle radius by this amount for hit detection.
    const dx = mouse.x - target_x;
    const dy = mouse.y - target_y;

    const hit_radius = radius + hit_padding;
  
    return (dx * dx + dy * dy) <= (hit_radius * hit_radius);
}

//loop through each target, delete if clicked.
window.addEventListener("click", () => {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (!target) continue; //check if target exists.
    
        //If clicked, remove and add to score.
        if (IsTargetClicked(target.x, target.y, target.radius)) {
          targets.splice(i, 1);
          score += 100;
          break; //make sure we only remove 1 per click.
        }
    }
});



ResizeGame();

SpawnTarget();
SpawnTarget();
SpawnTarget();

requestAnimationFrame(GameLoop);


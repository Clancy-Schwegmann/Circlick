

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

//useful for ui/debug areas
type rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};


//speaking of debug
function GetSpawnArea(): rect {
    return {
        x: 40,
        y: 80,
        width: game.width - 120,
        height: game.height - 120
    };
}

//game score
let score = 0;

let game_timer = 5; //time for each run - in seconds
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
    const spawn_area = GetSpawnArea();

    const x = (spawn_area.x + radius + Math.random() * (spawn_area.width - radius * 2));

    const y = (spawn_area.y + radius + Math.random() * (spawn_area.height - radius * 2));

    targets.push({
        x:x,
        y:y,
        radius:radius
    });
}

//spawn a bunch of targets (between 3 and 8)
function SpawnTargetSet(): void {
    const range_start = 3;
    const range_end = 8;
    const target_count = Math.floor(Math.random() * (range_end - range_start + 1)) + range_start;
    for (let i = 0; i < target_count; i++) {
        SpawnTarget();
    }
}

//Updates game window based on browser width and height.
function ResizeGame() {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
}

window.addEventListener("resize", () => {
    ResizeGame();
})

function DrawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number){
    if (!ctx) return;
    ctx.beginPath();
  
    ctx.moveTo(x + radius, y);
  
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
  
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
  
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
  
    ctx.closePath();
}

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

    //draw timer bar
    const min_fill_percent = 0.04;

    const time_percent = Math.max(0,game_timer / max_time);

    const timer_bar_width = 300;
    const timer_bar_height = 20;

    const x = (game.width / 2) - (timer_bar_width / 2);
    const bar_y = 20;

    const fill_width = timer_bar_width * time_percent;

    ctx.fillStyle = "white";
    DrawRoundedRect(x, bar_y, timer_bar_width, timer_bar_height, 10);
    ctx.fill();

    if (fill_width > 12) {
        ctx.fillStyle = "darkblue";
        DrawRoundedRect(x, bar_y, fill_width, timer_bar_height, 10);
        ctx.fill();
    }

    ctx.strokeStyle = "black";
    DrawRoundedRect(x, bar_y, timer_bar_width, timer_bar_height, 10);
    ctx.stroke();


    const spawn_area = GetSpawnArea();
    //prepare to draw spawning area
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.strokeRect(
    spawn_area.x,
    spawn_area.y,
    spawn_area.width,
    spawn_area.height
    );
    

    //draw me some circles
    for(const target of targets){
        ctx.beginPath();
        ctx.fillStyle = "limegreen";
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

    //make sure we don't go below 0
    if (game_timer < 0) {
        game_timer = 0;
    }

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
          //if we clicked em all, spawn some more
          if(targets.length === 0)
            SpawnTargetSet();
          break; //make sure we only remove 1 per click.
        }
    }
});



ResizeGame();
console.log(targets);

SpawnTargetSet();

requestAnimationFrame(GameLoop);


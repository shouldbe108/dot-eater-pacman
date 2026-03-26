// Maze layout as 2D array: 0=empty, 1=wall, 2=dot, 3=player start (only ONE 3 now).
const layout = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,1,1,2,2,2,1,2,2,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,1,2,2,2,1,2,2,2,1,2,2,1],
  [1,1,2,1,1,1,0,0,0,1,1,1,2,1,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,1,2,2,2,2,2,2,2,1,2,2,1],
  [1,2,1,1,2,1,1,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],  /* FIXED: Last 3 → 2 (was extra player). */
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const rows = layout.length;  // Number of rows (15).
const cols = layout[0].length;  // Number of columns (15).
const gameEl = document.getElementById("game");  // Reference to grid container.
const statusEl = document.getElementById("status");  // Reference to status text.

let cells = [];  // 2D array to store cell DOM elements.
let playerPos = { row: 0, col: 0 };  // Tracks player's current row/col.
let remainingDots = 0;  // Counts uneaten dots.

// Builds the maze grid by looping through layout array.
function buildGrid() {
  gameEl.innerHTML = "";  // Clears existing grid.
  cells = [];  // Resets cells array.
  remainingDots = 0;  // Resets dot count.

  for (let r = 0; r < rows; r++) {  // Loops over each row.
    cells[r] = [];  // Initializes row in cells array.
    for (let c = 0; c < cols; c++) {  // Loops over each column in row.
      const cell = document.createElement("div");  // Creates new <div> for cell.
      cell.classList.add("cell");  // Adds base "cell" class for sizing.

      const value = layout[r][c];  // Gets tile type from layout.
      if (value === 1) {
        cell.classList.add("wall");  // Adds wall class (blue).
      } else if (value === 2) {
        cell.classList.add("dot");  // Adds dot class (white dot).
        remainingDots++;  // Increments dot counter.
      } else if (value === 3) {
        playerPos = { row: r, col: c };  // Sets player start position.
        cell.classList.add("player");  // Adds player class (yellow circle).
      }

      gameEl.appendChild(cell);  // Adds cell to grid container.
      cells[r][c] = cell;  // Stores cell reference in 2D array.
    }
  }
  updateStatus();  // Updates status after building.
}

// Updates status text with remaining dots or win message.
function updateStatus() {
  if (remainingDots === 0) {
    statusEl.textContent = "All dots eaten! Refresh to play again.";
  } else {
    statusEl.textContent = "Dots left: " + remainingDots;
  }
}

// Moves player by delta row/col if valid (no wall/out-of-bounds).
function movePlayer(dr, dc) {
  if (remainingDots === 0) return;  // Prevents moves after win.

  const newRow = playerPos.row + dr;  // Calculates new row.
  const newCol = playerPos.col + dc;  // Calculates new column.

  if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
    return;  // Ignores out-of-bounds moves.
  }
  if (layout[newRow][newCol] === 1) {
    return;  // Ignores wall moves.
  }

  cells[playerPos.row][playerPos.col].classList.remove("player");  // Removes player from old cell.

  if (cells[newRow][newCol].classList.contains("dot")) {  // Checks if landing on dot.
    cells[newRow][newCol].classList.remove("dot");  // Removes dot class.
    remainingDots--;  // Decrements counter.
  }

  playerPos = { row: newRow, col: newCol };  // Updates position.
  cells[newRow][newCol].classList.add("player");  // Adds player to new cell.
  updateStatus();  // Refreshes status.
}

// Listens for arrow key presses and calls movePlayer accordingly.
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer(-1, 0);  // Up: decrease row.
      break;
    case "ArrowDown":
      movePlayer(1, 0);  // Down: increase row.
      break;
    case "ArrowLeft":
      movePlayer(0, -1);  // Left: decrease col.
      break;
    case "ArrowRight":
      movePlayer(0, 1);  // Right: increase col.
      break;
  }
});

// Initializes game on page load.
buildGrid();

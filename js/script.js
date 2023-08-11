rows = 5;
cols = 5;
var grid = new Array(rows);
directions = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];
colors = ["b", "w"];
// make an array with arrow characters for each direction
arrows = {
    "n": "↑",
    "e": "→",
    "s": "↓",
    "w": "←",
    "ne": "↗",
    "nw": "↖",
    "se": "↘",
    "sw": "↙"
};
var correct_row;
var correct_col;
var start_row;
var start_col;
var visited;
var path_length;
// make a 2 dimensional array
function randomize_grid() {
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            // pick a random color and direction repeatedly until a valid combination is found
            // a valid combination is one that does not have a black arrow pointing outside the grid
            // or a white arrow pointing pointing outside the grid 2 cells away
            do {
                var color = colors[Math.floor(Math.random() * colors.length)];
                var direction = directions[Math.floor(Math.random() * directions.length)];
                var scale_factor = color == "b" ? 1 : 2;
                var next_row = i;
                var next_col = j;
                if (direction.includes("n")) {
                    next_row -= scale_factor;
                }
                if (direction.includes("s")) {
                    next_row += scale_factor;
                }
                if (direction.includes("e")) {
                    next_col += scale_factor;
                }
                if (direction.includes("w")) {
                    next_col -= scale_factor;
                }
            } while (next_row < 0 || next_row >= rows || next_col < 0 || next_col >= cols);
            grid[i][j] = {
                color: color,
                direction: direction
            };
        }
    }
    path_length = 0;
    c = 0;
    do {
        c++;
        create_path();
    } while (path_length < 10 && c < 30);
}

function convert_rowcol_to_letternumber(row, col) {
    var letter = String.fromCharCode(65 + col);
    return letter + "" + (row + 1);
}

function create_path() {
    // pick a random starting point
    start_row = Math.floor(Math.random() * rows);
    start_col = Math.floor(Math.random() * cols);
    document.getElementById("start").innerHTML = "Start: " +
                    convert_rowcol_to_letternumber(start_row, start_col);
    path_length = 0;

    // follow the arrows until a point is reached that is already visited
    var current_row = start_row;
    var current_col = start_col;
    visited = new Array(rows);
    for (var i = 0; i < rows; i++) {
        visited[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            visited[i][j] = false;
        }
    }
    visited[current_row][current_col] = true;
    while (true) {
        // get the direction of the current cell
        var direction = grid[current_row][current_col].direction;
        // get the row and column of the next cell
        var next_row = current_row;
        var next_col = current_col;
        // set scale factor to 1 if black, 2 if white
        var scale_factor = grid[current_row][current_col].color == "b" ? 1 : 2;
        if (direction.includes("n")) {
            next_row -= scale_factor;
        }
        if (direction.includes("s")) {
            next_row += scale_factor;
        }
        if (direction.includes("e")) {
            next_col += scale_factor;
        }
        if (direction.includes("w")) {
            next_col -= scale_factor;
        }
        
        // check if the next cell is visited
        if (visited[next_row][next_col]) {
            // if it is, stop
            console.log(convert_rowcol_to_letternumber(current_row, current_col) + "=>" +
                        convert_rowcol_to_letternumber(next_row, next_col));
            correct_col = next_col;
            correct_row = next_row;
            path_length++;
            break;
        } else {
            // if not, set the current cell to the next cell
            console.log(convert_rowcol_to_letternumber(current_row, current_col) + "=>" +
                        convert_rowcol_to_letternumber(next_row, next_col));
            current_row = next_row;
            current_col = next_col;
            visited[current_row][current_col] = true;
            path_length++;
        }
    }
}

var input = document.getElementById("answer_input");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        check_answer();
    }
});

function check_answer() {
    var answer = input.value;
    // convert correct row and col to letter and number
    var answer_row = String.fromCharCode(64 + parseInt(answer[0]));
    var answer_col = parseInt(answer[1]);
    res_label = document.getElementById("result");
    correct_answer = convert_rowcol_to_letternumber(correct_row, correct_col);
    res_label.innerHTML = "Answer: " + correct_answer;
    res_label.hidden = false;
    reset_button = document.getElementById("reset");
    reset_button.hidden = false;
    if (answer.toUpperCase() == correct_answer.toUpperCase()) {
        // set to green
        res_label.style.color = "green";
    } else {
        // set to red
        res_label.style.color = "red";
    }
    // signal all visited cells
    for (var i = 0; i < visited.length; i++) {
        for (var j = 0; j < visited[0].length; j++) {
            if (visited[i][j]) {
                var cell = document.getElementById(convert_rowcol_to_letternumber(i, j));
                cell.style.backgroundColor = "#88ddff";
            }
        }
    }
    // highlight start
    var cell = document.getElementById(convert_rowcol_to_letternumber(start_row, start_col));
    cell.style.backgroundColor = "#0062ff";
    // highlight the correct answer
    var cell = document.getElementById(correct_answer);
    cell.style.backgroundColor = "#984cf0";
    
}

function setup_board() {
    // populate the board div with the grid
    var board = document.getElementById("board");
    // set the style of the board to a gridlayout with the correct number of rows and columns
    board.style.gridTemplateColumns = "repeat(" + (cols + 2) + ", 1fr)";
    board.style.gridTemplateRows = "repeat(" + (rows + 2) + ", 1fr)";
    // set width and height of the board
    // set a scale factor
    var scale = 70;
    board.style.width = (cols + 2) * scale + "px";
    board.style.height = (rows + 2) * scale + "px";

    // loop through the grid and add a div for each cell
    for (var i = 0; i < (grid.length + 2) * (grid[0].length + 2); i++) {
        var cell = document.createElement("div");
        cell.classList.add("cell");
        // get the row and column of the cell
        var row = Math.floor(i / (grid[0].length + 2));
        var col = i % (grid[0].length + 2);

        // if row is 0, add a letter header, if col is 0, add a number header
        if (row == 0 && col > 0 && col < grid[0].length + 1) {
            cell.innerHTML = String.fromCharCode(64 + col);
        } else if (col == 0 && row > 0 && row < grid.length + 1) {
            cell.innerHTML = row;
        } else if (col == 0 && row == 0) {
            cell.innerHTML = " ";
        } else if (
            row == grid.length + 1 || col == grid[0].length + 1) {
            cell.innerHTML = " ";
        } else { 
            cell.innerHTML = arrows[grid[row-1][col-1].direction];
            cell.id=convert_rowcol_to_letternumber(row-1, col-1);
            cell.classList.add("arrow")
            cell.classList.add(grid[row-1][col-1].color);
            // set correct color
            cell.style.color = grid[row-1][col-1].color == "b" ? "black" : "white";
        }
        board.appendChild(cell);
    }
    res_label = document.getElementById("result");
    res_label.hidden = true;
    reset_button = document.getElementById("reset");
    reset_button.hidden = true;
    input = document.getElementById("answer_input");
    input.value = "";
    width_input = document.getElementById("width");
    width_input.value = cols;
    height_input = document.getElementById("height");
    height_input.value = rows;
}

function change_size() {
    width_input = document.getElementById("width");
    height_input = document.getElementById("height");
    cols = parseInt(width_input.value);
    rows = parseInt(height_input.value);
    reset_board();
}

function reset_board() {
    // clear the board div
    var board = document.getElementById("board");
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    // clear the grid
    grid = new Array(rows);
    // randomize the grid
    randomize_grid();
    // setup the board again
    setup_board();
}

// run this when the page loads
window.onload = function () {
    randomize_grid();
    setup_board();
}
    
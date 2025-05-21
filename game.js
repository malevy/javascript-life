
const ROW_COUNT = 30;
const COL_COUNT = 50;
const RECT_HEIGHT_PX = 10;
const RECT_WIDTH_PX = 10;
const GENERATION_LIFETIME_MS = 100;

const board = document.getElementById('board');
const neighborOffsets = [
    { r: -1, c: -1 }, // above left
    { r: -1, c: 0 }, // above
    { r: -1, c: 1 }, // above right
    { r: 0, c: -1 }, // left
    { r: 0, c: 1 }, // right
    { r: 1, c: -1 }, // below left
    { r: 1, c: 0 }, // below
    { r: 1, c: 1 }, // below right
]

let population = [];

function buildRandomPopulation() {
    for (let i = 0; i < ROW_COUNT; i++) {
        const row = []
        for (let j = 0; j < COL_COUNT; j++) {
            row.push(Math.random() > 0.7);
        }
        population.push(row);
    }
}

function buildBoard() {
    const board = document.getElementById('board');
    board.height = ROW_COUNT * RECT_HEIGHT_PX;
    board.width = COL_COUNT * RECT_WIDTH_PX;
}

function renderPopulation() {
    const board = document.getElementById('board');
    const canvas = board.getContext('2d');
    canvas.clearRect(0, 0, board.width, board.height);
    canvas.fillStyle = 'black';
    for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
            if (population[r][c]) {
                canvas.fillRect(c * RECT_WIDTH_PX, r * RECT_HEIGHT_PX, RECT_WIDTH_PX, RECT_HEIGHT_PX);
            }
        }
    }
}

function countLiveNeighbors(cellRow, cellCol) {
    let liveNeighbors = 0;
    neighborOffsets.forEach(({ r, c }) => {
        const neighborRow = cellRow + r;
        const neighborCol = cellCol + c;
        if (neighborRow >= 0 && neighborRow < ROW_COUNT && neighborCol >= 0 && neighborCol < COL_COUNT) {
            liveNeighbors += population[neighborRow][neighborCol] ? 1 : 0;
        }
    })

    return liveNeighbors;
}

function evolve() {
    const nextGeneration = [];
    for (let r = 0; r < ROW_COUNT; r++) {
        const row = [];

        for (let c = 0; c < COL_COUNT; c++) {
            const liveNeighbors = countLiveNeighbors(r, c);
            const cell = population[r][c];

            // any live cell with fewer than two live neighbors DIES as if by under-population
            if (cell && liveNeighbors < 2) row.push(false);

            // any live cell with two or three live neighbor LIVES
            else if (cell && (liveNeighbors === 2 || liveNeighbors === 3)) row.push(true);

            // any live cell with more than three live neighbors DIES as if by over-population
            else if (cell && liveNeighbors > 3) row.push(false);

            // any dead cell with exactly three live neighbors LIVES, as if by reproduction
            else if (!cell && liveNeighbors === 3) row.push(true);

            // carry the cell forward
            else row.push(cell);
        }

        nextGeneration.push(row);
    }

    population = nextGeneration;
}

document.addEventListener('DOMContentLoaded', () => {
    buildBoard();
    buildRandomPopulation();
    renderPopulation();
    setInterval(() => {
        evolve();
        renderPopulation();
    }, GENERATION_LIFETIME_MS);
});

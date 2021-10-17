const COLORS = ["#fff", "#1b1b1b", "#051df5", "#f51b05", "#006738", "#f6be00"];
// const BACKGROUND_COLORS = ["#d4c7b4", "#fff", "#f4f2ee", "#d5b089", "#d6d6d6"];
// const PRIMARY_COLORS = ["#feab02", "#ec3833", "#1c751c", "#292a46"];

const PIXEL_COUNT = 150;
const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 450;
const SCALE = CANVAS_WIDTH / PIXEL_COUNT;

const s = function(p) {
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  p.draw = () => {
    p.noLoop();

    const seed = Math.random();

    const colorSet = [Math.floor(seed * 1000000) % COLORS.length];

    let seedMod = 1;
    while (colorSet.length < 3) {
      seedMod++;
      const randomIndex =
        Math.floor(seed * ((829328 * seedMod) % 3294)) % COLORS.length;
      if (!colorSet.includes(randomIndex)) {
        colorSet.push(randomIndex);
      }
    }

    // const backgroundColor = BACKGROUND_COLORS[Math.floor(seed * 1000000) % BACKGROUND_COLORS.length];
    // const primaryColor = PRIMARY_COLORS[Math.floor(seed * 1000000) % PRIMARY_COLORS.length];
    // const secondaryColor = PRIMARY_COLORS[Math.floor((seed << 5) * 1234567) % PRIMARY_COLORS.length];
    const backgroundColor = COLORS[colorSet[0]];
    const primaryColor = COLORS[colorSet[1]];
    const secondaryColor = COLORS[colorSet[2]];

    p.scale(SCALE);
    p.background(backgroundColor);

    const pattern = Math.floor(seed * 1000000) % 2;

    if (pattern === 0) {
      const START_X = 7;
      const START_Y = 7;
      const WIDTH = 16;
      const GAP = 14;

      drawRows(p, primaryColor, START_Y, WIDTH, GAP);
      drawColumns(p, primaryColor, START_X, WIDTH, GAP);
    } else if (pattern === 1) {
      const START_Y = 5;
      const WIDTH = 16;
      const GAP = 14;
      const WIDTH_SMALL = 2;
      const WIDTH_MEDIUM = 4;

      // draw fat rows
      drawRows(p, primaryColor, START_Y, WIDTH, GAP);
      // draw skinny rows
      drawRows(
        p,
        primaryColor,
        WIDTH + GAP - WIDTH_SMALL - 1,
        WIDTH_SMALL,
        WIDTH + GAP - WIDTH_SMALL,
      );
      // draw skinny columns
      drawColumns(p, secondaryColor, 2, WIDTH_SMALL, 34, true);
      // draw skinny columns inner (left)
      drawColumns(p, secondaryColor, 2 + 10 + 6, WIDTH_SMALL, 34, true);
      // draw skinny columns inner (right)
      drawColumns(p, secondaryColor, 2 + 10 + 6 + 4, WIDTH_SMALL, 34, true);
      // draw medium columns (left)
      drawColumns(p, primaryColor, 2 + 10, WIDTH_MEDIUM, 32, true);
      // draw medium columns (right)
      drawColumns(p, primaryColor, 2 + 10 + 14, WIDTH_MEDIUM, 32, true);
    }
  };
};

function drawRows(p, color, start, width, gap, invert) {
  for (
    let lineNum = 0;
    lineNum < CANVAS_HEIGHT / SCALE / (width + gap);
    lineNum++
  ) {
    checkeredLine(
      p,
      color,
      start + lineNum * (width + gap),
      width,
      true,
      invert
    );
  }
}

function drawColumns(p, color, start, width, gap, invert) {
  for (
    let lineNum = 0;
    lineNum < CANVAS_WIDTH / SCALE / (width + gap);
    lineNum++
  ) {
    checkeredLine(
      p,
      color,
      start + lineNum * (width + gap),
      width,
      false,
      invert
    );
  }
}

function checkeredLine(p, color, start, rowWidth, isRow, invert) {
  p.stroke(color);
  if (isRow) {
    for (let row = 0; row < rowWidth; row++) {
      for (
        let px = row % 2 ? (invert ? 0 : 1) : invert ? 1 : 0;
        px < CANVAS_WIDTH / SCALE;
        px += 2
      ) {
        p.point(px, start + row);
      }
    }
  } else {
    for (let column = 0; column < rowWidth; column++) {
      for (
        let px = column % 2 ? (invert ? 1 : 0) : invert ? 0 : 1;
        px < CANVAS_WIDTH / SCALE;
        px += 2
      ) {
        p.point(start + column, px);
      }
    }
  }
}

const numTiles = 20;
window.onload = () => {
  for (let i = 0; i < numTiles; i++) {
    const div = document.createElement("div");
    div.setAttribute("id", `c${i + 1}`);
    div.setAttribute("class", "tile");
    document.getElementById("container").appendChild(div);
    new p5(s, `c${i + 1}`);
  }
};

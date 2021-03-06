// const COLORS = ["#fff", "#1b1b1b", "#051df5", "#f51b05", "#006738", "#f6be00"];
// const BACKGROUND_COLORS = ["#d4c7b4", "#fff", "#f4f2ee", "#d5b089", "#d6d6d6"];
// const PRIMARY_COLORS = ["#feab02", "#ec3833", "#1c751c", "#292a46"];

const PIXEL_COUNT = 150;
const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 450;
const SCALE = CANVAS_WIDTH / PIXEL_COUNT;

const NUM_PATTERNS = 3;
const PATTERN_WEIGHTING = [0.15, 0.3, 0.5, 0.7, 0.9, 1];

const s = function (p) {
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  p.draw = () => {
    p.noLoop();

    const seed = Math.random();

    const inputText = document.getElementById("colors").value;
    const inputColors = inputText.split(",");

    const colorSet = [Math.floor(seed * 1000000) % inputColors.length];

    let seedMod = 1;
    while (colorSet.length < 4) {
      seedMod++;
      const randomIndex =
        Math.floor(seed * ((829328 * seedMod) % 3294)) % inputColors.length;
      if (!colorSet.includes(randomIndex)) {
        colorSet.push(randomIndex);
      }
    }

    // const backgroundColor = BACKGROUND_COLORS[Math.floor(seed * 1000000) % BACKGROUND_COLORS.length];
    // const primaryColor = PRIMARY_COLORS[Math.floor(seed * 1000000) % PRIMARY_COLORS.length];
    // const secondaryColor = PRIMARY_COLORS[Math.floor((seed << 5) * 1234567) % PRIMARY_COLORS.length];
    const backgroundColor = inputColors[colorSet[0]];
    const primaryColor = inputColors[colorSet[1]];
    const secondaryColor = inputColors[colorSet[2]];
    const tertiaryColor = inputColors[colorSet[3]];

    p.scale(SCALE);
    p.background(backgroundColor);

    let pattern;
    PATTERN_WEIGHTING.some((weight, i) => {
      console.log({ seed, weight, i });
      console.log(seed < weight);
      if (seed < weight) {
        pattern = i;
        return true;
      }
    });

    if (pattern === 0) {
      const START_X = 7;
      const START_Y = 7;
      const WIDTH = 16;
      const GAP = 14;

      drawRows(p, primaryColor, START_Y, WIDTH, GAP);
      drawColumns(p, primaryColor, START_X, WIDTH, GAP);
    } else if (pattern === 1) {
      const START_X = 1;
      const START_Y = 1;
      const WIDTH = 8;
      const GAP = 6;

      drawRows(p, primaryColor, START_Y, WIDTH, GAP);
      drawColumns(p, primaryColor, START_X, WIDTH, GAP);
    } else if (pattern === 2) {
      const START_X = 1;
      const START_Y = 1;
      const WIDTH = 2;
      const GAP = 14;

      // primary rows
      drawRows(p, primaryColor, START_Y, WIDTH, GAP);
      // secondary rows
      drawRows(p, secondaryColor, START_Y + 8, WIDTH, GAP);
      // primary columns
      drawColumns(p, primaryColor, START_X, WIDTH, GAP);
      // secondary columns
      drawColumns(p, secondaryColor, START_X + 8, WIDTH, GAP);
    } else if (pattern === 3) {
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
        WIDTH + GAP - WIDTH_SMALL
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
    } else if (pattern === 4) {
      const WIDTH_SMALL = 2;
      const WIDTH_MEDIUM = 4;
      const WIDTH = 16;
      const WIDTH_LARGE = 18;

      // draw skinny rows
      drawRows(p, primaryColor, 2, WIDTH_SMALL, 72 - WIDTH_SMALL);
      // draw fat rows (top)
      drawRows(p, primaryColor, 20, WIDTH_LARGE, 72 - WIDTH_LARGE);
      // draw fat rows (bottom)
      drawRows(p, primaryColor, 40, WIDTH_LARGE, 72 - WIDTH_LARGE);

      // draw fat columns
      drawColumns(p, secondaryColor, 19, WIDTH, 48 - WIDTH, true);
      // draw medium columns (left)
      drawColumns(p, tertiaryColor, 43, WIDTH_MEDIUM, 48 - WIDTH_MEDIUM, true);
      // draw medium columns (middle)
      drawColumns(p, secondaryColor, 1, WIDTH_MEDIUM, 48 - WIDTH_MEDIUM, true);
      // draw medium columns (right)
      drawColumns(p, tertiaryColor, 7, WIDTH_MEDIUM, 48 - WIDTH_MEDIUM, true);
    } else if (pattern === 5) {
      for (let i = 0; i < PIXEL_COUNT / 8 + 1; i++) {
        drawHoundstoothColumn(p, primaryColor, i * 8 - 4);
      }
    }
    p.textSize(10);
    p.fill(0);
    p.stroke("#fff");
    p.text(`#${pattern + 1}`, 137, 148);
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

function drawHoundstoothColumn(p, primaryColor, startX) {
  p.stroke(primaryColor);
  p.fill(primaryColor);

  for (let i = 0; i < PIXEL_COUNT / 8; i++) {
    const startY = i * 8 - 2;
    // top wing
    p.point(startX, startY);
    p.point(startX, startY + 1);
    p.point(startX - 1, startY + 1);
    p.point(startX - 1, startY + 2);
    p.point(startX - 2, startY + 2);
    p.point(startX - 2, startY + 3);
    p.point(startX - 3, startY + 3);

    // body
    p.rect(startX - 3, startY + 4, 3, 3);

    // bottom left wing
    p.point(startX - 3, startY + 8);
    p.point(startX - 4, startY + 7);
    p.point(startX - 4, startY + 6);
    p.point(startX - 5, startY + 7);

    // right wing
    p.point(startX + 1, startY + 5);
    p.point(startX + 2, startY + 5);
    p.point(startX + 2, startY + 4);
    p.point(startX + 3, startY + 4);
    p.point(startX + 1, startY + 6);
  }
}

const numTiles = 30;
const instances = [];
window.onload = () => {
  for (let i = 0; i < numTiles; i++) {
    const div = document.createElement("div");
    div.setAttribute("id", `c${i + 1}`);
    div.setAttribute("class", "tile");
    document.getElementById("container").appendChild(div);
    instances.push(new p5(s, `c${i + 1}`));
  }
  window.scrollTo(0, 0);
};

const generate = () => {
  instances.forEach((inst) => inst.redraw());
};

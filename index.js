const { parse } = require("@babel/parser");

// TODO: remove this and add it somewhere and convert the whole thing to an argument.
const fixture = "console.log('// hello'); // hello\nvar a = 1; /* \n boohoo */";

const ast = parse(fixture);

const { comments } = ast;

const chunkSize = 2;

const commentsPositions = comments.map(({ start, end }) => ({ start, end }));
const commentsPositionsLength = commentsPositions.length;

// Create an array of breakpoints between comments and code
let chunkBoundaries = commentsPositions.reduce(
  (acc, { start, end }) => [...acc, start, end],
  []
);

if (chunkBoundaries[0] !== 0) {
  chunkBoundaries = [0, ...chunkBoundaries];
}

if (chunkBoundaries[chunkBoundaries.length - 1] !== fixture.length) {
  chunkBoundaries = [...chunkBoundaries, fixture.length - 1];
}

// Split the breakpoints into positions of chunks.
let chunkStartEndPairs = [];

for (let i = 0; i < chunkBoundaries.length; i++) {
  chunkStartEndPairs.push(chunkBoundaries.slice(i, i + 2));
}

// Drop the last one if it points to the end of the source.
if (
  chunkStartEndPairs[chunkStartEndPairs.length - 1].length === 1 &&
  chunkStartEndPairs[chunkStartEndPairs.length - 1][0] === fixture.length
) {
  chunkStartEndPairs = chunkStartEndPairs.slice(
    0,
    chunkStartEndPairs.length - 1
  );
}

// Extract the actual code along with the positions and the order.
const chunkedSource = chunkStartEndPairs.map((pos, i) => {
  const [x, y] = pos;
  return { pos, i, source: fixture.slice(x, y) };
});

// Figure out whether it's code or a comment
const annotatedChunks = chunkedSource.map(block => {
  const [x, y] = block.pos;
  let type = "code";

  if (commentsPositions.find(({ start, end }) => start === x && end === y)) {
    type = "comment";
  }

  return { ...block, type };
});

// Further work:
//
//  - We need to match the comments with their corresponding code piece
//  - Consecutive comments are threated as the same comment

console.log(annotatedChunks);

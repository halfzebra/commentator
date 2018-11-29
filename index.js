const { parse } = require('@babel/parser')
const fixture = 'console.log(\'// hello\'); // hello\nvar a = 1; /* \n boohoo */'

const ast = parse(
  fixture
)

const { comments } = ast;

const chunkSize = 2;

const commentsPositions = comments.map(({ start, end }) => ({ start, end }))
const commentsPositionsLength = commentsPositions.length;

let chunkBoundaries = commentsPositions.reduce((acc, { start, end }) => [...acc, start, end], []);

if (chunkBoundaries[0] !== 0) {
  chunkBoundaries = [0, ...chunkBoundaries]
}

if (chunkBoundaries[chunkBoundaries.length - 1 ] !== fixture.length) {
  chunkBoundaries = [...chunkBoundaries, fixture.length - 1 ]
}

const chunkStartEndPairs = []

for (let i = 0; i < chunkBoundaries.length; i++) {
  chunkStartEndPairs.push(chunkBoundaries.slice(i, i + 2))
}

console.log(chunkStartEndPairs)
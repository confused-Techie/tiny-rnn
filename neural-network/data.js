const utils = require("./utils.js");

// Simple AND Gate dataset
const andGate = {
  data: [
    { inputs: [0,0], outputs: [0] },
    { inputs: [0,1], outputs: [0] },
    { inputs: [1,0], outputs: [0] },
    { inputs: [1,1], outputs: [1] }
  ],
  test: [
    { input: [0,0], expected: [0] },
    { input: [0,1], expected: [0] },
    { input: [1,0], expected: [0] },
    { input: [1,1], expected: [1] }
  ]
};

// Magic Button, only 3 is valid
const magicButton = {
  data: [
    { inputs: [0,0,0,0], outputs: [0] },
    { inputs: [1,0,0,0], outputs: [0] },
    { inputs: [0,1,0,0], outputs: [0] },
    { inputs: [0,0,1,0], outputs: [1] },
    { inputs: [0,0,0,1], outputs: [0] }
  ],
  test: [
    { input: [0,0,0,0], expected: [0] },
    { input: [1,0,0,0], expected: [0] },
    { input: [0,0,0,1], expected: [0] },
    { input: [1,1,0,0], expected: [0] },
    { input: [1,1,1,1], expected: [1] },
    { input: [0,0,1,0], expected: [1] }
  ]
};

// Not really sentiment analysis, but sorta
const findBad = {
  data: [
    { inputs: utils.flatOneOfKEncode("bad"), outputs: [1] },
    { inputs: utils.flatOneOfKEncode("good"), outputs: [0] },
    { inputs: utils.flatOneOfKEncode("happy"), outputs: [0] },
    { inputs: utils.flatOneOfKEncode("badder"), outputs: [1] },
    { inputs: utils.flatOneOfKEncode("baddy"), outputs: [1] },
    { inputs: utils.flatOneOfKEncode("badmitton"), outputs: [0] }
  ],
  test: [
    { input: utils.flatOneOfKEncode("good"), expected: [0] },
    { input: utils.flatOneOfKEncode("batter"), expected: [0] },
    { input: utils.flatOneOfKEncode("bad"), expected: [1] }
  ]
};

const findBadText = {
  data: [
    { inputs: utils.flatAlphabetEncode("bad"), outputs: [1] },
    { inputs: utils.flatAlphabetEncode("tad"), outputs: [0] },
    { inputs: utils.flatAlphabetEncode("had"), outputs: [0] },
    { inputs: utils.flatAlphabetEncode("mad"), outputs: [0] },
    { inputs: utils.flatAlphabetEncode("sad"), outputs: [0] },
    { inputs: utils.flatAlphabetEncode("fad"), outputs: [0] }
  ],
  test: [
    { input: utils.flatAlphabetEncode("lad"), expected: [0] },
    { input: utils.flatAlphabetEncode("wag"), expected: [0] },
    { input: utils.flatAlphabetEncode("bad"), expected: [1] }
  ]
};

module.exports = {
  andGate,
  magicButton,
  findBad,
  findBadText,
};

// This is the generic handler, taking actual user input, and orcastrating
// the process

async function main(input) {
  let inputVector = OneHot(input);

  let outputVectorCollection = [];

  for (let i = 0; i < STEPS; i++) {
    let tmpOutputVector =
  }

  return inputVector;
}

class RNN {
  constructor(input) {
    this.STEPS = 1;

    this.hiddenVector;
    this.runOutputVectorCollection = [];
    this.vector = input;

  }

  run() {
    // Manages the run cycle of the actual steps which consist of the network.
    let workingInput = this.vector;
    let output = null;

    for (let i = 0; i < this.STEPS; i++) {
      let output = this.step(workingInput);

      this.runOutputVectorCollection.push(output);
      workingInput = output;

    }

    return output;
  }

  step(vectors) {
    // An individual run that should return a modified output vector
    let h = [];

    for (let i = 0; i < vectors.length; i++) {
      h[i] =
    }

  }

  dot(a, b) {
    // WARNING: This may not support 2d arrays
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  }

}

function OneHot(input) {
  // This should convert our input into a 1-of-k encoded vector
  // assuming input is a valid string
  let inputArray = Array.from(input);
  let out = [];

  for (let i = 0; i < inputArray.length; i++) {
    let tmp = new Array(inputArray.length).fill(0);
    tmp[i] = 1;
    out.push(tmp);
  }

  return out;
}

module.exports = main;

// This is the generic handler, taking actual user input, and orcastrating
// the process

async function main(input) {
  let inputVector = OneHot(input);
  console.log("input vector below");
  console.log(inputVector);

  let rnn = new RNN(inputVector, input);

  let res = rnn.run();

  return inputVector;
}

class RNN {
  constructor(input, text) {
    this.STEPS = 1;

    this.hiddenSize = 100; // size of hidden layer of neurons?

    this.hiddenVector;
    this.W_hh = this.randomShape(this.hiddenSize, this.hiddenSize, 0.01);
    this.W_xh = this.randomShape(this.hiddenSize, text.length, 0.01);
    this.W_hy = this.randomShape(text.length, this.hiddenSize, 0.01);
    this.runOutputVectorCollection = [];
    this.vector = input;
  }

  run() {
    // Manages the run cycle of the actual steps which consist of the network.
    let workingInput = this.vector;
    let output = null;

    for (let i = 0; i < this.STEPS; i++) {
      output = this.step(workingInput);
      console.log(output);
      this.runOutputVectorCollection.push(output);
      workingInput = output;

    }

    return output;
  }

  step(vectors) {
    // An individual run that should return a modified output vector
    //let h = [];

    // f = Forget Gate
    // C = Candidate Layer (A NN with Tanh)
    // I = Input Gate
    // O = Output Gate
    // H = Hidden state (a vector)
    // C = Memory State (a vector)

    //let cS = this.hiddenVector[-]
    //for (let i = 0; i < vectors.length; i++) {
      //console.log(`Dot: ${this.dot(this.W_hh, vectors[i])}`)
      //console.log(`Current Vector: ${vectors[i]}`)
      //this.hiddenVector[i] = this.tanh(this.addSingle(this.dot(this.W_hh, this.hiddenVector[i]), this.dot(this.W_xh, vectors[i])));
      //console.log(this.hiddenVector[i]);

      //let y = this.dot(this.W_hy, this.hiddenVector[i]);
      //console.log(y);
    //}

    //for (let i = 0; i < vectors.length; i++) {
      //console.log(`dot: ${this.dot(this.W_xh, vectors)[0]}`);
      //this.hiddenVector = this.tanh(this.dot(this.W_hh, this.hiddenVector) + this.dot(this.W_xh, vectors));
      //console.log(this.hiddenVector);
      //console.log("done hidden");
      //let y = this.dot(this.W_hy, this.hiddenVector);
      //return y;
    //}
    //return 0;
    this.hiddenVector = [];

    for (let i = 0; i < vectors.length; i++) {
      console.log(`step: Receiving: ${vectors[i]}`);
      this.hiddenVector[i] = [];
      for (let y = 0; y < vectors[i].length; y++) {
        let historyVector = (i === 0) ? new Array(vectors[i].length).fill(0) : this.hiddenVector[i-1];
        //let historyVector = this.hiddenVector[i-1] ?? new Array(vectors[i].length).fill(0);
        // We will initialize an empty array, since we may not have a previous history
        //let dot1 = this.dot(this.W_hh[i], historyVector);
        let dot1 = this.dot(historyVector, this.W_hh[i]);
        console.log("dot1");
        console.log(dot1);
        let dot2 = this.dot(this.W_xh[i], vectors[i]);
        console.log("dot2");
        console.log(dot2);
        //let dots = this.addSingle(dot1, dot2);
        let dots = dot1 + dot2;
        let vector = this.tanh(dots);

        this.hiddenVector[i][y] = vector;

        //this.hiddenVector[i] = this.tanh(this.addSingle(this.dot(this.W_hh[i], this.hiddenVector[i-1]), this.dot(this.W_xh[i], vectors[i])));
        console.log(`Hidden Vector: ${i}: ${this.hiddenVector[i]}`);
      }

    }
    console.log("now our y");
    console.log(this.hiddenVector, this.W_hy);
    return this.dot(this.hiddenVector, this.W_hy);

  }

  dot(a, b) {
    // Attempted short implementation of NumPy Dot()
    if (typeof a === "number" && typeof b === "number") {
      // Scalar handling
      return a * b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {

      if (Array.isArray(a[0]) && Array.isArray(b[0])) {
        let aNumRows = a.length, aNumCols = a[0].length;
        let bNumRows = b.length, bNumCols = b[0].length;
        let m = new Array(aNumRows);

        for (let r = 0; r < aNumRows; ++r) {
          m[r] = new Array(bNumCols);
          for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;
            for (let i = 0; i < aNumCols; ++i) {
              m[r][c] += a[r][i] * b[i][c];
            }
          }
        }

        return m;
      }

      return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    }
  }

  tanh(m) {
    // tanh nonlinearity
    if (typeof m === "number") {
      let res = Math.tanh(m);
      // The nonlinearity aspect squashes activations to 1/-1
      if (res > 0) {
        return 1;
      } else if (res < 0) {
        return -1;
      }
      //return Math.tanh(m);
    }
    console.log("no tanh handling for");
    console.log(m);
  }

  addMulti(a, b) {
    let aNumRows = a.length, aNumCols = a[0].length;
    let bNumRows = b.length, bNumCols = b[0].length;
    let m = new Array(aNumRows);

    for (let r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols);
      for (let c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;
        for (let i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] + b[i][c];
        }
      }
    }
    return m;
  }

  addSingle(a, b) {
    console.log("addSingle A");
    console.log(a);
    console.log("addSingle B");
    console.log(b);
    // Since when we operate on non-existant history we don't want to fail
    // we will instead preform a copy
    if (typeof a === "undefined") {
      return b;
    }
    if (typeof b === "undefined") {
      return a;
    }

    let aNumRows = a.length;
    let bNumRows = b.length;
    let m = new Array(aNumRows);

    for (let r = 0; r < aNumRows; ++r) {
      m[r] = a[r] + b[r];
    }

    return m;
  }

  randomShape(rows, cols, max) {
    // Similar to numpy.random.randn
    // Generates vectors according to the shape provided.
    let out = [];

    for (let i = 0; i < rows; i++) {
      out[i] = [];
      for (let y = 0; y < cols; y++) {
        out[i][y] = Math.random() * max;
      }
    }

    return out;
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

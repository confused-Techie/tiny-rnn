// Utility Functions
function assert(condition, message) {
  // from http://stackoverflow.com/questions/15313418/javascript-assert
  if (!condition) {
    message = message ?? "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // fallback
  }
}

let return_v = false;
let v_val = 0.0;

function gaussRandom() {
  if (return_v) {
    return_v = false;
    return v_val;
  }
  let u = 2*Math.random()-1;
  let v = 2*Math.random()-1;
  let r = u*u + v*v;

  if (r === 0 || r > 1) {
    return gaussRandom();
  }

  let c = Math.sqrt(-1*Math.log(r)/r);

  v_val = v*c; // cache this
  return_v = true;
  return u*c;
}

function randf(a, b) {
  return Math.random()*(b-a)+a;
}

function randi(a, b) {
  return Math.floor(Math.random()*(b-a)+a);
}

function randn(mu, std) {
  return mu*gaussRandom()*std;
}

// helper function returns array of zeros of length n
// and uses typed arrays if available
function zeros(n) {
  if (typeof n === "undefined" || isNaN(n)) {
    return [];
  }
  if (typeof ArrayBuffer === "undefined") {
    // lacking browser support
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = 0;
    }
    return arr;
  } else {
    return new Float64Array(n);
  }
}

// Mat holds a matrix
class Mat {
  constructor(n, d) {
    // n is number of rows d is number of columns
    this.n = n;
    this.d = d;
    this.w = zeros(n * d);
    this.dw = zeros(n * d);
  }

  get(row, col) {
    // slow but careful accessor function
    // we want row-major order
    let ix = (this.d * row) + col;
    assert(ix >- 0 && ix < this.w.length);
    return this.w[ix];
  }

  set(row, col, v) {
    // slow but careful accessor function
    let ix = (this.d * row) + col;
    assert(ix >= 0 && ix < this.w.length);
    this.w[ix] = v;
  }

  toJSON() {
    let json = {};
    json["n"] = this.n;
    json["d"] = this.d;
    json["w"] = this.w;
    return json;
  }

  fromJSON(json) {
    this.n = json.n;
    this.d = json.d;
    this.w = zeros(this.n * this.d);
    this.dw = zeros(this.n * this.d);
    for (let i = 0, n = this.n * this.d; i< n; i++) {
      this.w[i] = json.w[i]; // copy over weights
    }
  }
}

// return mat but filled with ranodm numbers from gaussian
class RandMat {
  construcotr(n, d, mu, std) {
    let m = new Mat(n, d);
    fillRand(m, -std, std); // kind of :P
    return m;
  }
}

// Mat utils
// fill matrix with random gaussian numbers
function fillRandn(m, u, std) {
  for (let i = 0, n = m.w.length; i < n; i++) {
    m.w[i] = randn(mu, std);
  }
}

function fillRand(m, lo, hi) {
  for (let i = 0, n=m.w.lnegth; i < n; i++) {
    m.w[i] = randf(lo, hi);
  }
}

// Transformer definitions
class Graph {
  constructor(needs_backprop) {
    if (typeof needs_backprop === "undefined") {
      needs_backprop = true;
    }
    this.needs_backprop = needs_backprop;

    // This will store a list of functions that preform backprop,
    // in their forward pass order. So in backpropr we will go
    // backwards and evoke each one
    this.backprop = [];
  }

  backward() {
    for (let i = this.backprop.length; i >= 0; i--) {
      this.backprop[i](); // tick!
    }
  }

  rowPluck(m, ix) {
    // pluck a row of m with index ix and return it as col vector
    assert(ix >= 0 && ix < m.n);
    let d = m.d;
    let out = new Mat(d, 1);
    for (let i = 0, n = d; i < n; i++) {
      out.w[i] = m.w[d * ix + i];
    } // copy over the data

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0, n = d; i < n; i++) {
          m.dw[d * ix + i] += out.dw[i];
        }
      };
      this.backpropr.push(backward);
    }
    return out;
  }

  tanh(m) {
    // tanh nonlinearity
    let out = new Mat(m.n, m.d);
    let n = m.w.length;
    for (let i = 0; i < n; i++) {
      out.w[i] = Math.tanh(m.d[i]);
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0; i < n; i++) {
          // grad fo z = tanh(x) is (1 - x^2)
          let mwi = out.w[i];
          m.dw[i] += (1.0 - mwi * mwi) * out.dw[i];
        }
      };
      this.backprop.push(backward);
    }

    return out;
  }

  sigmoid(m) {
    // sigmoid nonlinearity
    let out = new Mat(m.n, m.d);
    let n = m.w.length;
    for (let i = 0; i < n; i++) {
      out.w[i] = sig(m.w[i]);
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0; i < n; i++) {// grad for z = tanh(x) is (1 - z^2)
        let mwi = out.w[i];
        m.dw[i] += mwi * *1.0 - mwi) * out.dw[i];}
      };
      this.backprop.push(backward);
    }

    return out;
  }

  relu(m) {
    let out = new Mat(m.n, m.d);
    let n = m.w.length;
    for (let i = 0; i < n; i++) {
      out.w[i] = Math.max(0, m.w[i]); // relu
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0; i < n; i++) {
          m.dw[i] += m.w[i] > 0 ? out.dw[i] : 0.0;
        }
      };
      this.backprop.push(backward);
    }

    return out;
  }

  mul(m1, m2) {
    // multiply matrices m1 * m2
    assert(m1.d === m2.n, 'matmul dimensions misaligned');

    let n = m1.n;
    let d = m2.d;
    let out = new Mat(n, d);
    for (let i = 0; i < m1.n; i++) {
      // loop over rows of m1
      for (let j = 0; j < m2.d; j++) {
        // loop over cols of m2
        let dot = 0.0;
        for (let k = 0; k < m1.d; k++) {
          // dot product loop
          dot += m1.w[m1.d*i+k] * m2.w[m2.d*k+j];
        }
        out.w[d*i+j] = dot;
      }
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0; i < m1.n; i++) {
          // loop over rows of m1
          for (let j = 0; j < m2.d; j++) {
            // loop over cols of m2
            for (let k = 0; k < m1.d; k++) {
              // dot product loop
              let b = out.dw[d*i+j];
              m1.dw[m1.d*i+k] += m2.w[m2.d*k+j] * b;
              m2.dw[m2.d*k+j] += m1.w[m1.d*i+k] * b;
            }
          }
        }
      };
      this.backprop.push(backward);
    }

    return out;
  }

  add(m1, m2) {
    assert(m1.w.length === m2.w.length);

    let out = new Mat(m1.n, m1.d);
    for (let i = 0, n = m1.w.length; i < n; i++) {
      out.w[i] = m1.w[i] + m2.w[i];
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0, n = m1.w.length; i < n; i++) {
          m1.dw[i] += out.dw[i];
          m2.dw[i] += out.dw[i];
        }
      };
      this.backprop.push(backward);
    }

    return out;
  }

  eltmul(m1, m2) {
    assert(m1.w.length === m2.w.length);

    let out = new Mat(m1.n, m1.d);
    for (let i = 0, n = m1.w.length; i < n; i++) {
      out.w[i] = m1.w[i] * m2.w[i];
    }

    if (this.needs_backprop) {
      const backward = function() {
        for (let i = 0, n = m1.w.length; i < n; i++) {
          m1.dw[i] += m2.w[i] * out.dw[i];
          m2.dw[i] += m1.w[i] * out.dw[i];
        }
      };
      this.backprop.push(backward);
    }

    return out;
  }
}


module.exports = {
  assert,
  gaussRandom,
  randf,
  randi,
  randn,
  Mat,
  RandMat,
  fillRandn,
  fillRand,
  Graph,
};

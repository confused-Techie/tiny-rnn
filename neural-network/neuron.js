const uid = require("cuid");

class Neuron {
  constructor(bias) {
    this.id = uid(); // Neuron ID
    this.bias = bias === undefined ? Math.random() * 2 - 1 : bias;

    // Incoming connections
    this.incoming = {
      targets: {}, // New Map()
      weights: {} // new Map()
    };

    // Outgoing Connections
    this.outgoing = {
      targets: {},
      weights: {}
    };

    this._output; // f'(x)
    this.output; // f(x)
    this.error; // E'(f(x))
    this._error; // E(f(x))
  }

  connect(neuron, weight) {
    this.outgoing.targets[neuron.id] = neuron;
    neuron.incoming.targets[this.id] = this;
    this.outgoing.weights[neuron.id] = neuron.incoming.weights[this.id] = weight == undefined ? Math.random() * 2 - 1 : weight;
  }

  activate(input) {
    const self = this;

    // Input Neurons
    if (input != undefined) {
      this._output = 1; // f'(x)
      this.output = input; // f(x)
    } else {
      // Hidden/Output Neurons
      const sum = Object.keys(this.incoming.targets).reduce((total, target, index) => {
        return total += self.incoming.targets[target].output * self.incoming.weights[target];
      }, this.bias);

      this._output = this._sigmoid(sum); // f'(x)
      this.output = this.sigmoid(sum); // f(x)
    }

    return this.output;
  }

  propagate(target, rate = 0.3) {
    const self = this;

    const sum = target == undefined ? Object.keys(this.outgoing.targets).reduce((total, target, index) => {
      // weight
      self.outgoing.targets[target].incoming.weights[self.id] = self.outgoing.weights[target] -= rate * self.outgoing.targets[target].error * self.output;

      return total += self.outgoing.targets[target].error * self.outgoing.weights[target];

    }, 0) : this.output - target;

    this.error = sum * this._output;

    this.bias -= rate * this.error;

    return this.error;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
    // f(x) = 1 / (1 + e^(-x))
  }

  _sigmoid(x) {
    return this.sigmoid(x) * (1 - this.sigmoid(x));
    // f'(x) = f(x) * (1 - f(x))
  }

  save() {
    // Used to save the neuron
    return {
      id: this.id,
      bias: this.bias,
      incoming: {
        //targets: {...this.incoming.targets.map(a => a.id) },
        //targets: {...Object.keys(this.incoming.targets).reduce((total, target, index) => { return this.incoming.targets[target].id })},
        weights: this.incoming.weights
      },
      outgoing: {
        //targets: {...this.incoming.targets.map(a => a.id) },
        //targets: {...Object.keys(this.outgoing.targets).reduce((total, target, index) => { return this.outgoing.targets[target].id })},
        weights: this.outgoing.weights
      },
      _output: this._output,
      output: this.output,
      error: this.error,
      _error: this._error
    };
  }

}

module.exports = Neuron;

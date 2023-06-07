const uid = require("cuid");

class Neuron {
  constructor(bias, opts = {}) {
    this.id = opts.id ?? uid(); // Neuron ID
    this.bias = (bias === undefined ? Math.random() * 2 - 1 : bias);
    this.learningRate = 0.3;

    // Connections should be here
    // Incoming Connections
    this.incoming = {
      targets: {},
      weights: {}
    };

    // Outgoing Connections
    this.outgoing = {
      targets: {},
      weights: {}
    };

    this._output; // f'(x) - Derivative of output, measures the change of the function
    this.output; // f(x)
    this.error; // E'(f(x)) - Derivative of error, measures the change of the function
  }

  connect(neuron, weight) {
    this.outgoing.targets[neuron.id] = neuron; // Add new neuron to our outgoing targets
    neuron.incoming.targets[this.id] = this; // set this neuron as an incoming target of the new neuron

    let appliedWeight = (weight === undefined ? Math.random() * 2 - 1 : weight); // determine our weight
    neuron.incoming.weights[this.id] = appliedWeight; // set the new neurons incoming weight for this neuron
    this.outgoing.weights[neuron.id] = neuron.incoming.weights[this.id]; // set our outgoing weight for the new neuron

    //this.outgoing.weights[neuron.id] = neuron.incoming.weights[this.id] = weight === undefined ? Math.random() * 2 - 1 : weight;
  }

  disconnect(neuron) {
    delete this.outgoing.targets[neuron.id]; // Remove the neuron from outgoing targets
    delete neuron.incoming.targets[this.id]; // Remove this neruon as an incoming target
    delete neuron.incoming.weights[this.id]; // Remove our weight from the neuron
    delete this.outgoing.weights[neuron.id]; // Remove our outgoing weight for the new neuron
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

  propagate(target) {
    const self = this;

    const sum = (target === undefined) ? Object.keys(this.outgoing.targets).reduce((total, target, index) => {
      // weight
      self.outgoing.weights[target] -= self.learningRate * self.outgoing.targets[target].error * self.output;
      self.outgoing.targets[target].incoming.weights[self.id] = self.outgoing.weights[target];

      return total += self.outgoing.targets[target].error * self.outgoing.weights[target];

    }, 0) : this.output - target;

    this.error = sum * this._output;

    this.bias -= this.learningRate * this.error;

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
    // used to save the neuron
    let tmp = {
      id: this.id,
      bias: this.bias,
      learningRate: this.learningRate,
      incoming: {
        targets: [],
        weights: this.incoming.weights
      },
      outgoing: {
        targets: [],
        weights: this.outgoing.weights
      },
      _output: this._output,
      output: this.output,
      error: this.error
    };

    Object.keys(this.incoming.targets).forEach((key) => {
      tmp.incoming.targets.push(this.incoming.targets[key].id);
    });

    Object.keys(this.outgoing.targets).forEach((key) => {
      tmp.outgoing.targets.push(this.outgoing.targets[key].id);
    });

    return tmp;
  }

}

module.exports = Neuron;

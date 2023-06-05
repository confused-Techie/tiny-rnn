/**
 * This is basically the top level directory of this repo
 * But without the machine learning part.
 * What if totally random we at least make something that can generate text
 */

 async function main(input) {
   console.log(`Input: ${input}`);

   let rnn = new RNN(input, "vanilla", false);

   rnn.run();

   let res = rnn.getOutput();

   return res;
 }

 class RNN {
   constructor(text, method, verbose = true) {
     this.STEPS = 5000;
     this.method = method;
     this.verbose = verbose;

     this.text = text;
     this.input = this.oneOfKEncoding(text);

     this.outputHistory = [];

     this.hiddenVector = [];

     this.Whh = Math.random() * (this.input.length - 0);
     this.Wxh = Math.random() * (this.input.length - 1) * 0.01;
     //this.Wxh = this.input.length * 50;
     this.Why = Math.random() * (this.input.length - 1) * 0.01;
     //this.Why = this.input.length * 0.01;
   }

   getOutput() {
     // Since our Output History contains 2d arrays, where the inner array
     // is an index that corresponds with our input, it needs to be converted
     // back into text

     // For assistance, we will only print the 1st history, middle and last
     let first = 0;
     let middle = Math.round(this.outputHistory.length / 2);
     let last = this.outputHistory.length - 1;

     console.log(this.outputHistory[first]);
     console.log(this.outputHistory[middle]);
     console.log(this.outputHistory[last]);

     let textOut = this.oneOfKDecoding();

     let textReturn = [];
     textReturn.push(textOut[first]);
     textReturn.push(textOut[middle]);
     textReturn.push(textOut[last]);

     return textReturn;
     //return textOut;
   }

   run() {
     // Manages run cycles
     let workingInput = this.input;
     let output = null;

     for (let i = 0; i < this.STEPS; i++) {
       output = this.step(workingInput, i);
       this.outputHistory.push(output);
       workingInput = output;
     }

     return output;
   }

   step(vectors, step) {

     if (this.method === "random") {
       this.hiddenVector[step] = [];

       for (let i = 0; i < vectors.length; i++) {
         this.log(`step: Receiving: ${vectors[i]}`);

         let vectorStepOutput = this.randomWithinVector();

         this.hiddenVector[step].push(vectorStepOutput);
       }

       return this.hiddenVector[step];

     } else if (this.method == "vanilla") {

       let output = [];

       for (let i = 0; i < vectors.length; i++) {
         this.log(`step: Receiving: ${vectors[i]}`);

         let vectorStepOutput = this.vanillaRnn(vectors[i], i);

         this.log(`step: Output: ${vectorStepOutput}`);

         output.push(vectorStepOutput);
       }

       return output;
     }
   }

   vanillaRnn(vector, step) {
     let prevHidden = this.hiddenVector[step-1] ?? 0;

     this.hiddenVector[step] = Math.tanh(this.dot(this.Whh, prevHidden) + this.dot(this.Wxh, vector));
     this.log(`vanillaRnn: hiddenVector[${step}]: ${this.hiddenVector[step]}`);

     return this.dot(this.Why, this.hiddenVector[step]);
   }

   randomWithinVector() {
     // This returns completely random numbers that can be directly mapped
     // to an input character.
     // Allowing a functional RNN but that is totally random based on input
     return Math.random() * (this.input.length - 0);
   }

   oneOfKDecoding() {
     let textOut = [];

     for (let i = 0; i < this.outputHistory.length; i++) {
       let text = "";
       for (let y = 0; y < this.outputHistory[i].length; y++) {
         text += this.text.charAt(Math.round(this.outputHistory[i][y]));
       }
       textOut.push(text);
     }

     return textOut;
   }

   oneOfKEncoding(input) {
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

   dot(weight, arr) {
     // Attempted short implementation of NumPy Dot()
     if (typeof arr === "number") {
       // Scalar handling
       return arr * weight;
     }

     if (Array.isArray(arr)) {
       if (Array.isArray(arr[0])) {
         let arrNumRows = arr.length, arrNumCols = arr[0].length;
         let m = new Array(arrNumRows);

         for (let r = 0; r < arrNumRows; ++r) {
           m[r] = new Array(arrNumCols);
           for (let c = 0; c < arrNumCols; ++c) {
             m[r][c] = arr[r][c] * weight;
           }
         }

         return m;
       }

       return arr.map((x, i) => arr[i] * weight).reduce((m, n) => m + n);
     }
   }

   log(value) {
     if (this.verbose) {
       console.log(value);
     }
   }

 }

module.exports = main;

function oneOfKEncode(input) {
  let inputArray = Array.from(input);
  let out = [];

  for (let i = 0; i < inputArray.length; i++) {
    let tmp = new Array(inputArray.length).fill(0);
    tmp[i] = 1;
    out.push(tmp);
  }

  return out;
}

function flatOneOfKEncode(input) {
  let inputArray = Array.from(input);
  let out = [];

  for (let i = 0; i < inputArray.length; i++) {
    let tmp = new Array(inputArray.length).fill(0);
    tmp[i] = 1;
    out = out.concat(tmp);
  }

  return out;
}

function flatAlphabetEncode(input) {
  // Unlike my other oneOfKEncoding which all assign the positive 1 according to
  // that letters placement within itself,
  // we will instead provide an array the length of the alphabet, with 1's
  // where our number occurs within the alphabet
  let alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	let inputArray = Array.from(input);
  let out = [];

  for (let i = 0; i < inputArray.length; i++) {
  	for (let y = 0; y < alphabet.length; y++) {
    	if (inputArray[i] === alphabet[y]) {
      	out.push(1);
      } else {
      	out.push(0);
      }
    }
  }

  return out;
}

function flatAlphabetDecode(input) {
  // Same as flatAlphabetEncode but reverse
  // Same as flatAlphabetEncode but reverse
  let alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  let out = "";

  for (let i = 0; i < input.length; i++) {
  	if (input[i] === 1) {
    	let idx = (i > 25) ? i % 26 : i;

    	out += alphabet[idx];
    }
  }

  return out;
}

module.exports = {
  oneOfKEncode,
  flatOneOfKEncode,
  flatAlphabetEncode,
  flatAlphabetDecode,
};

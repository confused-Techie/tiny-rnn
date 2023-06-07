const alphabet =  [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

/**
 * Flat Alphabet Encoding:
 * My own kinda made up format for text data. Only supports alpha numeric characters.
 * Turns each character into a series of 26 0's where only the character found
 * within the source char is a 1, then each letter afterwards
 * is another series of 26 0's appending to the array, resulting in on very long array.
 */

function flatAlphabetEncode(input) {
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
  let out = "";

  for (let i = 0; i < input.length; i++) {
    if (input[i] === 1) {
      let idx = (i > 25) ? i % 26 : i;
      out += alphabet[idx];
    }
  }

  return out;
}

/**
 * Flat Char Encoding:
 * Again my own made up little standard,
 * takes any string input and returns an array of the UTF-16 character codes.
 * Each code is an entry of the array returned
 */
 
function flatCharEncode(input) {
  let inputArray = Array.from(input);
  let out = [];

  for (let i = 0; i < inputArray.length; i++) {
    out.push(input.charCodeAt(i));
  }

  return out;
}

function flatCharDecode(input) {
  return String.fromCharCode(...input);
}

module.exports = {
  flatAlphabetEncode,
  flatAlphabetDecode,
  flatCharEncode,
  flatCharDecode,
};

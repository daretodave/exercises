const toBinaryDigit = codes => letter => codes[letter]
      .split('')
      .map(c => c === '.' ? '1' : '111')
      .join('0');

const toBinaryString = codes => word => word.split('')
      .map(toBinaryDigit(codes))
      .join('000');

const messageToBinary = (codes, message) => message
      .split(' ')
      .map(toBinaryString(codes))
      .join('0000000');

const transmitter = (options, callback) => {
  let index = 0;
  let state = 0;

  const steps = messageToBinary(
    options.codes,
    options.message
  );

  function next() {
    if (index > steps.length) {
      return callback();
    }
    let _state = +steps[index++];
    if (_state !== state) {
      state = _state;
      options.toggle();
    }

    options.timeouter(next, 1);
  }

  next();
}

module.exports = transmitter;

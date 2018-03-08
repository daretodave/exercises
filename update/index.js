const clone = arg => {
  if (Array.isArray(arg)) {
    return arg.slice();
  }
  if (typeof arg === 'object') {
    return Object.assign({}, arg)
  }
  return arg;
}

const actions = {};

actions["$push"] = (values, original) =>
  original
    .concat(values);

actions["$unshift"] = (values, original) =>
  values
    .concat(original);

actions["$splice"] = (values, original) => {
  values.forEach(function (value) {
    Array.prototype.splice.apply(original, value);
  });
  return original;
};

actions["$set"] = value => value;

actions["$merge"] = (values, original) => {
  Object.keys(values).forEach(function (key) {
    original[key] = values[key];
  });
  return original;
};

actions["$apply"] = (transform, original) => transform(original);

const update = (arg, commands) => {
  const object = clone(arg);

  for (var key in commands) {
    const isMatch = Object.hasOwnProperty.call(
      actions,
      key
    );

    if (isMatch) {
      return actions[key](commands[key], object);
    }
  }
  for (var key in commands) {
    object[key] = update(arg[key], commands[key]);
  }
  return object;
}

module.exports = update;

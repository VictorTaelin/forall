const generate = (num, fn) => {
  let a = [];
  for (var i = 0; i < num; ++i)
    a.push(fn(i));
  return a;
}

const replicate = (num, str) =>
  generate(num, () => str);

const color = (num, str) =>
  "\x1b[" + num + "m" + str + "\x1b[00m";


const objectFromPairs = pairs => {
  let map = {};
  for (let i = 0, l = pairs.length; i < l; ++i)
    map[pairs[i][0]] = pairs[i][1];
  return map;
}

const flatten = (array) => {
  return [].concat.apply([], array);
}

const randomOf = array => {
  return array[Math.random() * array.length | 0];
}

const show = value => {
  try { 
    if (value instanceof Function) {
      return value.toString();
    } else if (value === null) {
      return "null";
    } else if (value.test && value.form && value.rand) {
      return "The " + color(34, value.__meta.name) + " type is encoded "
        + "as " + value.form  + ". Ex:\n\n"
        + generate(4, () => color(34, "  " + show(value.rand(6)))).join("\n\n");
    } else if (typeof value === "object" && !(value instanceof Array)) {
      var obj = {};
      for (var key in value)
        if (key[0] !== "_")
          obj[key] = value[key];
      return JSON.stringify(obj, null, 2);
    } else {
      return JSON.stringify(value, null, 2);
    }
  } catch (e) {
    return "<non-stringifiable>";
  }
}

const textBlock = (width, pad, longLines) => {
  const head = "," + replicate(width,"_").join("") + ",";
  const foot = "|" + replicate(width,"_").join("") + "|";
  const body = longLines
    .map((str) => {
      let lines = [];
      let line = "";
      let lineLen = 0;
      for (var i = 0; i < str.length; ++i) {
        if (str[i] === "\x1b") {
          line += str.slice(i,i+5);
          i += 4;
        } else {
          line += str[i];
          ++lineLen;
          if (lineLen === width - pad * 2) {
            lines.push(line);
            line = "";
            lineLen = 0;
          }
        }
      }
      if (lineLen > 0) {
        while (lineLen < width - pad * 2) {
          line += " ";
          ++lineLen;
        }
        lines.push(line);
        lineLen = 0;
      };
      if (lines.length === 0)
        lines.push(replicate(width - 2, " ").join(""));
      const pads = replicate(pad," ").join("");
      return lines
        .map(line => "|" + pads + line + pads + "|")
        .join("\n");
    })
    .join("\n");
  return head + "\n" + body + "\n" + foot;
}

const showBlock = (value) => {
  return show(value).split("\n").map(line => color(34, line))
}

const indent = block => {
  return block.map(line => "  " + line);
}

module.exports = {
  show,
  showBlock,
  indent,
  generate,
  replicate,
  flatten,
  randomOf,
  color,
  textBlock,
  objectFromPairs
}

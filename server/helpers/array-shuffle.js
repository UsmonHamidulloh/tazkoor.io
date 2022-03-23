function shuffle(array) {
  const inner = array.slice();
  for (let i = inner.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [inner[i], inner[j]] = [inner[j], inner[i]];
  }

  return inner;
}

module.exports = shuffle;

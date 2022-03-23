function chunker(chunkSize, array) {
  let chunkedArray = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);

    chunkedArray.push(chunk);
  }

  return chunkedArray;
}

module.exports = chunker;

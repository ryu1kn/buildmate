
const NEW_LINE_CHAR = '\n';

module.exports = async stdin => {
  const text = await readAllText(stdin);
  return text.split(NEW_LINE_CHAR).filter(isNonEmpty);
};

function readAllText(stdin) {
  let input = '';
  stdin.on('data', data => {
    input += data.toString();
  });
  return new Promise((resolve, reject) => {
    stdin.on('error', e => reject(e));
    stdin.on('end', () => resolve(input));
  });
}

function isNonEmpty(string) {
  return string !== '';
}

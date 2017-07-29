
module.exports = async ({config, execSync, stdin}) => {
  const input = await readWholeInput(stdin);
  const filePaths = input.split('\n');
  config.tasks.forEach(task => {
    if (!task.path) return execSync(task.command);
    if (filePaths.includes(task.path)) return execSync(task.command);
  });
};

function readWholeInput(stdin) {
  let input = '';
  stdin.on('data', data => {
    input += data.toString();
  });
  return new Promise((resolve, reject) => {
    stdin.on('error', e => reject(e));
    stdin.on('end', () => resolve(input));
  });
}

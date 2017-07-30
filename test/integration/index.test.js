
const test = require('tape');
const {execSync} = require('child_process');
const fs = require('fs');

const TEST_DIR = __dirname;

test('it executes tasks that match path patterns', t => {
  t.plan(1);

  clean();

  const buildmanConfig = `
module.exports = {
  tasks: [
    {
      path: 'dir1/test.txt',
      command: 'mkdir -p tmp && echo task1 >> tmp/tasks.txt'
    },
    {
      path: 'dir2/test.txt',
      command: 'mkdir -p tmp && echo task2 >> tmp/tasks.txt'
    }
  ]
};`;
  fs.writeFileSync(`${TEST_DIR}/buildman.config.js`, buildmanConfig, 'utf8');

  execSync('echo dir2/test.txt | ../../bin/buildman', {cwd: TEST_DIR});
  const commandOutput = fs.readFileSync(`${TEST_DIR}/tmp/tasks.txt`, 'utf8');
  t.equal(commandOutput, 'task2\n');
});

function clean() {
  execSync('rm -rf tmp', {cwd: TEST_DIR});
  execSync('rm -rf buildman.config.js', {cwd: TEST_DIR});
}

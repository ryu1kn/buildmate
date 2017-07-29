
const test = require('tape');
const {execSync} = require('child_process');
const fs = require('fs');

const TEST_DIR = __dirname;

beforeAll();

test('it executes a task', t => {
  t.plan(1);

  const buildmanConfig = `
module.exports = {
  tasks: [
    {
      command: 'mkdir -p tmp && echo Hello World! > tmp/hello.txt'
    }
  ]
};`;
  fs.writeFileSync(`${TEST_DIR}/buildman.config.js`, buildmanConfig, 'utf8');

  execSync('../../bin/buildman', {cwd: TEST_DIR});
  const commandOutput = fs.readFileSync(`${TEST_DIR}/tmp/hello.txt`, 'utf8');
  t.equal(commandOutput, 'Hello World!\n');
});

function beforeAll() {
  execSync('rm -rf tmp', {cwd: TEST_DIR});
  execSync('rm -rf buildman.config.js', {cwd: TEST_DIR});
}

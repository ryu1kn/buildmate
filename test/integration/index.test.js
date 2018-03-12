
const test = require('tape');
const {execSync} = require('child_process');
const fs = require('fs');
const multiline = require('multiline-string')();

const TEST_DIR = __dirname;
const TMP_DIR = '__tmp';

test('it executes tasks that match path patterns', t => {
  t.plan(1);

  clean();

  const buildmateConfig = multiline(`
    module.exports = {
      tasks: [
        {
          path: 'dir1/test.txt',
          command: 'mkdir -p ${TMP_DIR} && echo task1 >> ${TMP_DIR}/tasks.txt'
        },
        {
          path: 'dir2/test.txt',
          command: 'mkdir -p ${TMP_DIR} && echo task2 >> ${TMP_DIR}/tasks.txt'
        }
      ]
    };
    `);
  fs.writeFileSync(`${TEST_DIR}/buildmate.config.js`, buildmateConfig, 'utf8');

  execSync('echo dir2/test.txt | ../../bin/buildmate', {cwd: TEST_DIR});
  const commandOutput = fs.readFileSync(`${TEST_DIR}/${TMP_DIR}/tasks.txt`, 'utf8');
  t.equal(commandOutput, 'task2\n');
});

function clean() {
  execSync(`rm -rf ${TMP_DIR}`, {cwd: TEST_DIR});
  execSync('rm -rf buildmate.config.js', {cwd: TEST_DIR});
}

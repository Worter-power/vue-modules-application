/**
 * Build npm all
 */
const shell = require('shelljs');
const signale = require('signale');
const config = require('./config');

const { Signale } = signale;

const tasks = [
    'npm run clean',
    'npm run reset',
    'npm run build:pc',
    'npm run build:mobile',
    'npm run build:entry'
].concat( Object.keys(config.entries).length > 0 ? ['npm run build:views'] : []);

tasks.every(task => {
    signale.start(task);
  
    const interactive = new Signale({ interactive: true });
    interactive.pending(task);
  
    const result = shell.exec(`${task} --silent`);
  
    if (result.code !== 0) {
      interactive.error(task);
      return false;
    }
  
    interactive.success(task);
    return true;
  });
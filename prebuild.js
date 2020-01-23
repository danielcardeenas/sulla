/**
 * Copies assets needed into dist directory.
 * Should be executed after build.
 *
 * Used in development only.
 */

var shell = require('shelljs');

shell.cp('-R', './src/lib', 'dist');
// shell.cp('-R', './src/api', 'dist');

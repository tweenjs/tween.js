const fs = require('fs');
const {version} = require('../package.json');

fs.open('.temp.version.js', 'w', (error, fd) => {
  if (error) process.exit(1);
  fs.write(fd, `export var version = '${version}'`, (error) => {
    if (error) process.exit(1);
  });
});

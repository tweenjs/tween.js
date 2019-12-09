const fs = require('fs');

fs.unlink('.temp.version.js', (error) => {
  if (error) {
    process.exit(1);
  }
});

const fs = require('fs')
const {version} = require('../package.json')

fs.open('./src/Version.ts', 'w', (error, fd) => {
	if (error) process.exit(1)
	fs.write(fd, [`const VERSION = '${version}';`, 'export default VERSION;'].join('\n'), error => {
		if (error) process.exit(1)
	})
})

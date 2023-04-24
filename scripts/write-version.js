import fs from 'fs'
import pkg from '../package.json' assert {type: 'json'}

const {version} = pkg

function handleError(error) {
	if (error) {
		console.error(error)
		process.exit(1)
	}
}

fs.open('./src/Version.ts', 'w', (error, fd) => {
	handleError(error)
	fs.write(fd, [`const VERSION = '${version}'`, 'export default VERSION', ''].join('\n'), error => {
		handleError(error)
	})
})

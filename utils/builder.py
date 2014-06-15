import os
import shutil

source = '../src/Tween.js'
output = '../build/tween.min.js'
NPM_DIR = '../build/npm/'
readme = '../README.md'
nodeOutput = NPM_DIR + 'index.js'
nodeReadme = NPM_DIR + 'README.md'
srcJSON = './npm/package.json'
dstJSON = NPM_DIR + 'package.json'
headerComment = '// tween.js - http://github.com/sole/tween.js - Licensed under the MIT License\n'

os.system( 'java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --js ' + source + ' --js_output_file ' + output )

# Add header with library name and url to the compressed output
with open(output,'r') as f: text = f.read()
with open(output,'w') as f: f.write(headerComment + text)

# Build npm package for node.js
if not os.path.exists(NPM_DIR):
	os.makedirs(NPM_DIR)

shutil.copyfile(source, nodeOutput)
shutil.copyfile(readme, nodeReadme)
shutil.copyfile(srcJSON, dstJSON)

with open(nodeOutput,'r') as f: text = f.read()
with open(nodeOutput,'w') as f: f.write(text + '\nmodule.exports=TWEEN;')

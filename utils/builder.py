import os
import shutil

source = '../src/Tween.js'
output = '../build/tween.min.js'
nodeOutput = '../nodejs/index.js'
readme = '../README.md'
nodeReadme = '../nodejs/README.md'

os.system( 'java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --js ' + source + ' --js_output_file ' + output )

# header

with open(output,'r') as f: text = f.read()
with open(output,'w') as f: f.write('// tween.js - http://github.com/sole/tween.js\n' + text)

shutil.copyfile(source, nodeOutput)
shutil.copyfile(readme, nodeReadme)

with open(nodeOutput,'r') as f: text = f.read()
with open(nodeOutput,'w') as f: f.write('// tween.js - http://github.com/sole/tween.js\n' + text + '\nmodule.exports=TWEEN;')

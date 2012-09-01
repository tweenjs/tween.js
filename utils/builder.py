import os

source = '../src/Tween.js'
output = '../build/tween.min.js'

os.system( 'java -jar compiler/compiler.jar --language_in=ECMASCRIPT5 --js ' + source + ' --js_output_file ' + output )

with open(output,'r') as f: text = f.read()
with open(output,'w') as f: f.write("// tween.js - http://github.com/sole/tween.js\n" + text)

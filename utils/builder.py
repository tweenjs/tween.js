import os

source = '../src/Tween.js'
build = '../build/Tween.js'
header = '// Tween.js - http://github.com/sole/tween.js\n'

os.system( 'java -jar compiler/compiler.jar --language_in=ECMASCRIPT5 --js ' + source + ' --js_output_file ' + build )

file = open( build, 'r' )
contents = file.read();
file.close()

file = open( build, 'w' )
file.write( header + contents )
file.close()

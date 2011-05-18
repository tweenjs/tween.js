import sys
import os

output = '../build/tween.js';

# os.system("java -jar yuicompressor-2.4.2.jar ../src/Tween.js -o ../build/Tween.js --charset utf-8 -v");
os.system("java -jar compiler.jar --js ../src/Tween.js --js_output_file %s" % (output))

# HEADER

with open(os.path.join('..', 'REVISION'), 'r') as handle:
	revision = handle.read().rstrip()

string = "// tween.js r%s - http://github.com/sole/tween.js\n" % (revision)

src_file = open(output,'r')
string += src_file.read()

dep_file = open(output,'w')
dep_file.write(string)
dep_file.close()

import sys
import os

output = '../build/Tween.js';

# os.system("java -jar yuicompressor-2.4.2.jar ../src/Tween.js -o ../build/Tween.js --charset utf-8 -v");
os.system("java -jar compiler.jar --js ../src/Tween.js --js_output_file ../build/Tween.js")

# HEADER

string = "// Tween.js - http://github.com/sole/tween.js\n"

src_file = open(output,'r')
string += src_file.read()

dep_file = open(output,'w')
dep_file.write(string)
dep_file.close()

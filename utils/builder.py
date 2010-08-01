import sys
import os

output = '../build/Tween.js';

os.system("java -jar yuicompressor-2.4.2.jar ../src/Tween.js -o ../build/Tween.js --charset utf-8 -v");

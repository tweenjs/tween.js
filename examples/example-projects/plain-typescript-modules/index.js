import * as TWEEN from '@tweenjs/tween.js';
// For sake of example, we put animate() in a separate file, and import it into
// index.ts.
//
// Use a `.js` extension here because TS does not transform import specifiers,
// and plain JS will need the extension by default. Find it ugly? Get used to it
// and move on!
import { animate } from './animate.js';
var position = { x: 100, y: 100, rotation: 10 };
var target = document.getElementById('target');
var tween = new TWEEN.Tween(position)
    .to({ x: 700, y: 200, rotation: 359 }, 2000)
    .delay(1000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(update);
var tweenBack = new TWEEN.Tween(position)
    .to({ x: 100, y: 100, rotation: 10 }, 3000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(update);
tween.chain(tweenBack);
tweenBack.chain(tween);
tween.start();
animate(performance.now());
function update() {
    target.style.transform = "translate3d(".concat(position.x, "px, ").concat(position.y, "px, 0.0001px) rotateY(").concat(Math.floor(position.rotation), "deg)");
}

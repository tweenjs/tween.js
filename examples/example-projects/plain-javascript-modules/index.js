import * as TWEEN from '@tweenjs/tween.js'

// For sake of example, we put animate() in a separate file, and import it into index.js.
import {animate} from './animate.js'

const position = {x: 100, y: 100, rotation: 10}
const target = document.getElementById('target')
const tween = new TWEEN.Tween(position)
	.to({x: 700, y: 200, rotation: 359}, 2000)
	.delay(1000)
	.easing(TWEEN.Easing.Elastic.InOut)
	.onUpdate(update)

const tweenBack = new TWEEN.Tween(position)
	.to({x: 100, y: 100, rotation: 10}, 3000)
	.easing(TWEEN.Easing.Elastic.InOut)
	.onUpdate(update)

tween.chain(tweenBack)
tweenBack.chain(tween)

tween.start()

animate(performance.now())

function update() {
	target.style.transform = `translate3d(${position.x}px, ${position.y}px, 0.0001px) rotateY(${Math.floor(position.rotation)}deg)`
}

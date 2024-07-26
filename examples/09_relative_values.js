import {Tween, Group, Easing} from '@tweenjs/tween.js'

const target1 = document.getElementById('target1')
const tween = new Tween(target1.dataset)
	.to({top: '+20', left: '-20'}, 500)
	.repeat(5)
	.delay(500)
	.easing(Easing.Exponential.In)
	.onUpdate(function (object) {
		object.top = Math.round(object.top)
		object.left = Math.round(object.left)
		updateBox(target1, object)
	})
	.start()

updateBox(target1, target1.dataset)

animate()

function animate(time) {
	requestAnimationFrame(animate)
	tween.update(time)
}

function updateBox(box, params) {
	const s = box.style
	const transform = 'translate(' + params.left + 'px, ' + params.top + 'px)'
	s.transform = transform
}

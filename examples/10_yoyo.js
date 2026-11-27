// @ts-check
import {Tween, Group, Easing} from 'tweenjs'

const group = new Group()

animate()

const target1 = document.getElementById('target1')
const tween1 = new Tween(target1.dataset, group)
	.to({rotation: 360, y: 300}, 750)
	.repeat(1)
	.delay(1000)
	.yoyo(true)
	.easing(Easing.Cubic.InOut)
	.onUpdate(function (object) {
		updateBox(target1, object)
	})
	.start()
const target2 = document.getElementById('target2')
const tween2 = new Tween(target2.dataset, group)
	.to({rotation: 360, y: 300}, 750)
	.repeat(Infinity)
	.delay(1000)
	.yoyo(true)
	.easing(Easing.Cubic.InOut)
	.onUpdate(function (object) {
		updateBox(target2, object)
	})
	.start()
const target3 = document.getElementById('target3')
const tween3 = new Tween(target3.dataset, group)
	.to({rotation: '+360', y: '+300'}, 750)
	.repeat(1)
	.delay(1000)
	.yoyo(true)
	.easing(Easing.Cubic.InOut)
	.onUpdate(function (object) {
		updateBox(target3, object)
	})
	.start()
const target4 = document.getElementById('target4')
const tween4 = new Tween(target4.dataset, group)
	.to({rotation: '+360', y: '+300'}, 750)
	.repeat(Infinity)
	.delay(1000)
	.yoyo(true)
	.easing(Easing.Cubic.InOut)
	.onUpdate(function (object) {
		updateBox(target4, object)
	})
	.start()

// TODO perhaps add these methods to Group

const restart = (window.restart = function () {
	tween1.stop().start()
	tween2.stop().start()
	tween3.stop().start()
	tween4.stop().start()
})

const stop = (window.stop = function () {
	tween1.stop()
	tween2.stop()
	tween3.stop()
	tween4.stop()
})

const start = (window.start = function () {
	tween1.start()
	tween2.start()
	tween3.start()
	tween4.start()
})

const pause = (window.pause = function () {
	tween1.pause()
	tween2.pause()
	tween3.pause()
	tween4.pause()
})

const resume = (window.resume = function () {
	tween1.resume()
	tween2.resume()
	tween3.resume()
	tween4.resume()
})

function animate(time) {
	requestAnimationFrame(animate)

	group.update(time)
}

function updateBox(box, params) {
	const s = box.style,
		transform = 'translateY(' + Math.round(params.y) + 'px) rotate(' + Math.floor(params.rotation) + 'deg)'
	s.webkitTransform = transform
	s.mozTransform = transform
	s.transform = transform
}

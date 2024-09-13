// @ts-check
import {Tween, Group, Easing} from 'tweenjs'

const group = new Group()

animate()

const tweenMap = new Map()

const target1 = document.getElementById('target1')
tweenMap.set(
	'tween1',
	new Tween(target1.dataset, group)
		.to({rotation: 360, y: 300}, 750)
		.repeat(Infinity)
		.delay(1000)
		.yoyo(true)
		.easing(Easing.Quadratic.InOut)
		.onUpdate(function (object) {
			updateBox(target1, object)
		})
		.start(),
)
const target2 = document.getElementById('target2')

tweenMap.set(
	'tween2',
	new Tween(target2.dataset, group)
		.to({rotation: 360, y: 300}, 750)
		.repeat(Infinity)
		.delay(1000)
		.yoyo(true)
		.easing(Easing.Cubic.InOut)
		.onUpdate(function (object) {
			updateBox(target2, object)
		})
		.start(),
)
const target3 = document.getElementById('target3')
tweenMap.set(
	'tween3',
	new Tween(target3.dataset, group)
		.to({rotation: '+360', y: '+300'}, 750)
		.repeat(1)
		.delay(1000)
		.yoyo(true)
		.easing(Easing.Cubic.InOut)
		.onUpdate(function (object) {
			updateBox(target3, object)
		})
		.start(),
)
const target4 = document.getElementById('target4')
tweenMap.set(
	'tween4',
	new Tween(target4.dataset, group)
		.to({rotation: '+360', y: '+300'}, 750)
		.repeat(Infinity)
		.delay(1000)
		.yoyo(true)
		.easing(Easing.Quadratic.InOut)
		.onUpdate(function (object) {
			updateBox(target4, object)
		})
		.start(),
)

const target5 = document.getElementById('target5')
tweenMap.set(
	'tween5',
	new Tween(target5.dataset, group)
		.to({rotation: '+360', y: '+300'}, 1050)
		.repeat(Infinity)
		// .delay(1000) // without delay
		.yoyo(true)
		.easing(Easing.Quadratic.InOut)
		.onUpdate(function (object) {
			updateBox(target5, object)
		})
		.start(),
)

// TODO perhaps add these methods to Group

const restart = (window.restart = function () {
	tweenMap.forEach(tween => tween.start())
})

const stop = (window.stop = function () {
	tweenMap.forEach(tween => tween.stop())
})

const start = (window.start = function () {
	tweenMap.forEach(tween => tween.start())
})

const pause = (window.pause = function () {
	tweenMap.forEach(tween => tween.pause())
})

const resume = (window.resume = function () {
	tweenMap.forEach(tween => tween.resume())
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

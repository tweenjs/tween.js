// @ts-check
import {Tween, Easing} from '../../dist/tween.esm.js'
import {toPhysicalPx} from './toPhysicalPx.js'

const width = 240,
	height = 160

// random points

/*
export const x0 = Math.random() * (width - 40) + 20,
	y0 = Math.random() * (height - 40) + 20,
	xA = [],
	yA = []

for (const i = 0; i < 10; i++) {
	xA.push(Math.random() * (width - 40) + 20)
	yA.push(Math.random() * (height - 40) + 20)
}
*/

// fixed points

export const min = 1 / 6,
	max = 5 / 6

export const x0 = width * min,
	y0 = height / 2,
	xA = [width * max, width / 2],
	yA = [height * min, height * max]

export function createPath(group, text, interpolation, width = 240, height = 160) {
	const div = document.createElement('div')
	div.style.display = 'inline-block'
	// +20 for padding
	div.style.width = width + 20 + 'px'
	div.style.height = height + 20 + 'px'

	const canvas = document.createElement('canvas')
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
	canvas.width = toPhysicalPx(width)
	canvas.height = toPhysicalPx(height)

	const context = canvas.getContext('2d')
	if (!context) throw 'doh'
	context.fillStyle = 'rgb(250,250,250)'
	context.fillRect(0, 0, toPhysicalPx(width), toPhysicalPx(height))

	context.lineWidth = toPhysicalPx(1)
	context.strokeStyle = 'rgb(230,230,230)'

	// points
	context.fillStyle = 'rgb(200,200,200)'
	context.fillRect(
		toPhysicalPx(x0) - toPhysicalPx(3),
		toPhysicalPx(y0) - toPhysicalPx(3),
		toPhysicalPx(6),
		toPhysicalPx(6),
	)
	context.fillRect(
		toPhysicalPx(xA[xA.length - 1]) - toPhysicalPx(3),
		toPhysicalPx(yA[yA.length - 1]) - toPhysicalPx(3),
		toPhysicalPx(6),
		toPhysicalPx(6),
	)

	for (let i = 0; i < xA.length; i++) {
		context.fillRect(
			toPhysicalPx(xA[i]) - toPhysicalPx(2),
			toPhysicalPx(yA[i]) - toPhysicalPx(2),
			toPhysicalPx(4),
			toPhysicalPx(4),
		)
	}
	//

	context.lineWidth = toPhysicalPx(2)
	context.strokeStyle = 'rgba(255,127,127,0.9)'
	context.beginPath()
	context.moveTo(toPhysicalPx(x0), toPhysicalPx(y0))
	context.lineCap = 'round'

	const position = {x: x0, y: y0}

	new Tween(position, group)
		.to({x: xA, y: yA}, 3000)
		.easing(Easing.Linear.None)
		.interpolation(interpolation)
		.onUpdate(function () {
			context.lineTo(toPhysicalPx(position.x), toPhysicalPx(position.y))
			context.stroke()
		})
		.start()

	div.appendChild(document.createTextNode(text))
	div.appendChild(document.createElement('br'))
	div.appendChild(canvas)

	return div
}

export function drawRabbit(context, x, y, color, opacity = 1) {
	context.save()

	context.fillStyle = color
	context.globalAlpha = opacity

	context.translate(x, y)

	context.beginPath()
	context.moveTo(0, 0)
	context.bezierCurveTo(15, 0, 15, -40, 5, -30)
	context.lineTo(0, 0)
	context.bezierCurveTo(-15, 0, -15, -40, -5, -30)
	context.lineTo(0, 0)
	context.closePath()
	context.fill()

	context.beginPath()
	context.arc(0, 0, 15, 0, Math.PI * 2, true)
	context.closePath()
	context.fill()

	context.restore()
}

export function drawFox(context, x, y, color) {
	context.save()

	context.fillStyle = color

	context.translate(x, y - 13)
	context.scale(1.2, 1.2)

	context.beginPath()
	context.moveTo(4, 24)
	context.lineTo(8, 16)
	context.lineTo(14, 10)
	context.lineTo(15, 0)
	context.lineTo(9, -10)
	context.lineTo(2, 0)
	context.lineTo(-2, 0)
	context.lineTo(-9, -10)
	context.lineTo(-15, 0)
	context.lineTo(-14, 10)
	context.lineTo(-8, 16)
	context.lineTo(-4, 24)
	context.closePath()
	context.fill()

	context.restore()
}

export function animate(group) {
	function loop(time) {
		group.update(time)
		const stopped = group.allStopped()
		if (!stopped) requestAnimationFrame(loop)
	}

	loop(performance.now())
}

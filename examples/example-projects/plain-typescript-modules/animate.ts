import type {Group} from '@tweenjs/tween.js'

export function animate(group: Group) {
	function loop(time: number) {
		group.update(time)
		const stopped = group.allStopped()
		if (!stopped) requestAnimationFrame(loop)
	}

	loop(performance.now())
}

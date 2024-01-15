// For sake of example, we put animate() in a separate file, and import it into index.js.
import * as TWEEN from '@tweenjs/tween.js'

//If we register the callback animate, but the TWEEN.update(time) returns false,
//cancel/unregister the handler
export function animate(time) {
	var id = requestAnimationFrame(animate)

	var result = TWEEN.update(time)

	if (!result) cancelAnimationFrame(id)
}

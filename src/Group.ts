import now from './Now'
import type {Tween} from './Tween'

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
export default class Group {
	private _tweens: Record<string, Tween> = {}
	private _tweensAddedDuringUpdate: Record<string, Tween> = {}

	constructor(...tweens: Tween[]) {
		this.add(...tweens)
	}

	getAll(): Array<Tween> {
		return Object.keys(this._tweens).map(tweenId => this._tweens[tweenId])
	}

	removeAll(): void {
		this._tweens = {}
	}

	add(...tweens: Tween[]): void {
		for (const tween of tweens) {
			// Remove from any other group first, a tween can only be in one group at a time.
			// @ts-expect-error library internal access
			tween._group?.remove(tween)

			// @ts-expect-error library internal access
			tween._group = this

			this._tweens[tween.getId()] = tween
			this._tweensAddedDuringUpdate[tween.getId()] = tween
		}
	}

	remove(...tweens: Tween[]): void {
		for (const tween of tweens) {
			// @ts-expect-error library internal access
			tween._group = undefined

			delete this._tweens[tween.getId()]
			delete this._tweensAddedDuringUpdate[tween.getId()]
		}
	}

	/** Return true if all tweens in the group are not paused or playing. */
	allStopped() {
		return this.getAll().every(tween => !tween.isPlaying())
	}

	update(time?: number): void
	/**
	 * @deprecated The `preserve` parameter is now defaulted to `true` and will
	 * be removed in a future major release, at which point all tweens of a
	 * group will always be preserved when calling update. To migrate, always
	 * use `group.add(tween)` or `group.remove(tween)` to manually add or remove
	 * tweens, and do not rely on tweens being automatically added or removed.
	 */
	update(time?: number, preserve?: boolean): void
	update(time: number = now(), preserve = true): void {
		let tweenIds = Object.keys(this._tweens)

		if (tweenIds.length === 0) return

		// Tweens are updated in "batches". If you add a new tween during an
		// update, then the new tween will be updated in the next batch.
		// If you remove a tween during an update, it may or may not be updated.
		// However, if the removed tween was added during the current batch,
		// then it will not be updated.
		while (tweenIds.length > 0) {
			this._tweensAddedDuringUpdate = {}

			for (let i = 0; i < tweenIds.length; i++) {
				const tween = this._tweens[tweenIds[i]]
				const autoStart = !preserve

				if (tween && tween.update(time, autoStart) === false && !preserve) this.remove(tween)
			}

			tweenIds = Object.keys(this._tweensAddedDuringUpdate)
		}
	}
	onComplete(callback: (object: Tween[]) => void) {
		const group = this.getAll()
		group.forEach(tween => {
			const prevCallback = tween.getCompleteCallback()
			tween.onComplete(() => {
				prevCallback?.(tween)
				// Since _isPlaying is updated to false after the onComplete callback finishes, the final tween is omitted from the check to determine if all animations have completed
				if (group.slice(0, group.length - 1).every(t => !t.isPlaying())) callback(group)
			})
		})
	}
}

import now from './Now'
import type {Tween} from './Tween'
import type {Timeline} from './Timeline'

export type GroupChild = Tween<any> | Timeline

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 *
 * Groups can also hold `Timeline` instances (timelines are playable, like tweens).
 */
export default class Group {
	private _tweens: Record<string, GroupChild> = {}
	private _tweensAddedDuringUpdate: Record<string, GroupChild> = {}

	constructor(...tweens: Array<GroupChild>) {
		this.add(...tweens)
	}

	getAll(): Array<GroupChild> {
		return Object.keys(this._tweens).map(tweenId => this._tweens[tweenId])
	}

	removeAll(): void {
		this._tweens = {}
	}

	add(...tweens: Array<GroupChild>): void {
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

	remove(...tweens: Array<GroupChild>): void {
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
	onComplete(callback: (object: Array<GroupChild>) => void) {
		const group = this.getAll()
		group.forEach(child => {
			const notifyIfComplete = () => {
				// After the onComplete callback completes, _isPlaying is updated to false, so if the total number of completed tweens is -1, then they are all complete.
				const completedGroup = group.filter(tween => !tween.isPlaying())
				if (completedGroup.length === group.length - 1) callback(group)
			}

			if ('getCompleteCallback' in child) {
				const prevCallback = child.getCompleteCallback()
				child.onComplete(object => {
					prevCallback?.(object)
					notifyIfComplete()
				})
				return
			}

			child.onComplete(() => {
				notifyIfComplete()
			})
		})
	}
}

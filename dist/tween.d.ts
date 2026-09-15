type EasingFunction = (amount: number) => number;
type EasingFunctionGroup = {
    In: EasingFunction;
    Out: EasingFunction;
    InOut: EasingFunction;
};
/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
declare const Easing: Readonly<{
    Linear: Readonly<EasingFunctionGroup & {
        None: EasingFunction;
    }>;
    Quadratic: Readonly<EasingFunctionGroup>;
    Cubic: Readonly<EasingFunctionGroup>;
    Quartic: Readonly<EasingFunctionGroup>;
    Quintic: Readonly<EasingFunctionGroup>;
    Sinusoidal: Readonly<EasingFunctionGroup>;
    Exponential: Readonly<EasingFunctionGroup>;
    Circular: Readonly<EasingFunctionGroup>;
    Elastic: Readonly<EasingFunctionGroup>;
    Back: Readonly<EasingFunctionGroup>;
    Bounce: Readonly<EasingFunctionGroup>;
    generatePow(power?: number): EasingFunctionGroup;
}>;

/**
 *
 */
type InterpolationFunction = (v: number[], k: number) => number;
/**
 *
 */
declare const Interpolation: {
    Linear: (v: number[], k: number) => number;
    Bezier: (v: number[], k: number) => number;
    CatmullRom: (v: number[], k: number) => number;
    Utils: {
        Linear: (p0: number, p1: number, t: number) => number;
        Bernstein: (n: number, i: number) => number;
        Factorial: (n: number) => number;
        CatmullRom: (p0: number, p1: number, p2: number, p3: number, t: number) => number;
    };
};

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

declare class Tween<T extends UnknownProps = any> {
    static autoStartOnUpdate: boolean;
    private _isPaused;
    private _pauseStart;
    private _valuesStart;
    private _valuesEnd;
    private _valuesStartRepeat;
    private _duration;
    private _isDynamic;
    private _initialRepeat;
    private _repeat;
    private _repeatDelayTime?;
    private _yoyo;
    private _isPlaying;
    private _reversed;
    private _delayTime;
    private _startTime;
    private _easingFunction;
    private _interpolationFunction;
    private _chainedTweens;
    private _onStartCallback?;
    private _onStartCallbackFired;
    private _onEveryStartCallback?;
    private _onEveryStartCallbackFired;
    private _onUpdateCallback?;
    private _onRepeatCallback?;
    private _onCompleteCallback?;
    private _onStopCallback?;
    private _id;
    private _isChainStopped;
    private _propertiesAreSetUp;
    private _object;
    private _group?;
    /**
     * @param object - The object whose properties this Tween will animate.
     * @param group - The object whose properties this Tween will animate.
     */
    constructor(object: T, group?: Group);
    /**
     * @deprecated The group parameter is now deprecated, instead use `new
     * Tween(object)` then `group.add(tween)` to add a tween to a group. Use
     * `new Tween(object, true)` to restore the old behavior for now, but this
     * will be removed in the future.
     */
    constructor(object: T, group: true);
    getId(): number;
    getCompleteCallback(): ((object: T) => void) | undefined;
    isPlaying(): boolean;
    isPaused(): boolean;
    getDuration(): number;
    /**
     * Total duration from `start()` call (including initial delay, repeats
     * and repeat delays). Used by `Timeline` to compute its own duration.
     * Returns `Infinity` when the tween repeats forever.
     */
    getTotalDuration(): number;
    to(target: UnknownProps, duration?: number): this;
    duration(duration?: number): this;
    dynamic(dynamic?: boolean): this;
    start(time?: number, overrideStartingValues?: boolean): this;
    startFromCurrentValues(time?: number): this;
    private _setupProperties;
    stop(): this;
    end(): this;
    pause(time?: number): this;
    resume(time?: number): this;
    stopChainedTweens(): this;
    /**
     * Removes the tween from the current group it is in, if any, then adds the
     * tween to the specified `group`.
     */
    group(group: Group): this;
    /**
     * @deprecated The argless call signature has been removed. Use
     * `tween.group(group)` or `group.add(tween)`, instead.
     */
    group(): this;
    /**
     * Removes the tween from whichever group it is in.
     */
    remove(): this;
    /**
     * @deprecated Timing orchestration is moving to `Timeline` (use a timeline
     * offset instead). This method keeps working for now and will be removed
     * in a future major version.
     */
    delay(amount?: number): this;
    /**
     * @deprecated Timing orchestration is moving to `Timeline` (repeat by
     * adding the tween multiple times, e.g. `timeline.add(tween, {repeat: 3})`,
     * which clones it internally). This method keeps working for now and will
     * be removed in a future major version.
     */
    repeat(times?: number): this;
    /**
     * @deprecated Timing orchestration is moving to `Timeline`. This method
     * keeps working for now and will be removed in a future major version.
     */
    repeatDelay(amount?: number): this;
    /**
     * @deprecated Timing orchestration is moving to `Timeline` (yoyo via
     * `reverse()` clips, e.g. `timeline.add(tween, {yoyo: true})`). This method
     * keeps working for now and will be removed in a future major version.
     */
    yoyo(yoyo?: boolean): this;
    easing(easingFunction?: EasingFunction): this;
    interpolation(interpolationFunction?: InterpolationFunction): this;
    chain(...tweens: Array<Tween<any>>): this;
    /**
     * Create an independent copy of this tween: same object, end values,
     * duration, easing, interpolation, dynamic flag, and callbacks, but no
     * playback state. `Timeline` uses this when the same tween is added more
     * than once (e.g. `timeline.add(tween, {repeat: 3})`).
     *
     * Start values are snapshotted right away, so every repeated play starts
     * from the same state even though the object keeps changing.
     *
     * Chains are not copied; compose with `Timeline` instead.
     */
    clone(): Tween<T>;
    /**
     * Create a new tween that plays this tween backwards: same object, end
     * values, duration, easing, interpolation, dynamic flag, and callbacks,
     * but with progress mirrored so it runs from end to start.
     *
     * The typical use is a yoyo without `yoyo()`:
     *
     * ```js
     * timeline.add(tween)
     * timeline.add(tween.reverse())
     * // or simply: timeline.add(tween, {yoyo: true})
     * ```
     */
    reverse(): Tween<T>;
    onStart(callback?: (object: T) => void): this;
    onEveryStart(callback?: (object: T) => void): this;
    onUpdate(callback?: (object: T, elapsed: number) => void): this;
    onRepeat(callback?: (object: T) => void): this;
    onComplete(callback?: (object: T) => void): this;
    onStop(callback?: (object: T) => void): this;
    private _goToEnd;
    /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     *
     * @param autoStart - When true, calling update will implicitly call start()
     * as well. Note, if you stop() or end() the tween, but are still calling
     * update(), it will start again!
     */
    update(time?: number, autoStart?: boolean): boolean;
    private _updateProperties;
    private _handleRelativeValue;
    private _swapEndStartRepeatValues;
}
type UnknownProps = Record<string, any>;

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * Timeline: compose Tweens (and nested Timelines) in sequence and in parallel.
 *
 * Inspired by trusktr's vision in #647 / #560:
 * - Tween does tweening, Timeline does orchestration (replaces `.chain`).
 * - Single class, sequential by default (append), parallel via explicit offset.
 * - Simple, Three.js ethos: small API, explicit times, no magic.
 */

type TimelineChild = Tween<any> | Timeline;
type TimelineAt = TimelineChild | number | string;
type TimelineAddOptions = {
    at?: TimelineAt;
    atIndex?: number;
    offset?: number;
    shift?: boolean;
    /**
     * Total number of times to play the child. Each extra play clones the
     * child (documented), so every clip has independent playback state.
     * Must be a positive integer, defaults to 1. One call may not expand
     * past {@link MAX_TIMELINE_DURATION_MS}.
     */
    repeat?: number;
    /**
     * Alternate each play with a reversed clip (`child.reverse()`), i.e. a
     * yoyo without `yoyo()`. Total clips are `repeat * 2`, starting with the
     * original: `{yoyo: true, repeat: 2}` plays
     * forward, backward, forward, backward. Only supported for `Tween`
     * children; nested timelines must be reversed manually.
     */
    yoyo?: boolean;
};
type TimelinePosition = TimelineAt | TimelineAddOptions;
declare class Timeline {
    static autoStartOnUpdate: boolean;
    private _id;
    private _entries;
    private _labels;
    private _duration;
    private _startTime;
    private _isPlaying;
    private _isPaused;
    private _pauseStart;
    private _onStartCallback?;
    private _onStartCallbackFired;
    private _onEveryStartCallback?;
    private _onEveryStartCallbackFired;
    private _onUpdateCallback?;
    private _onCompleteCallback?;
    private _onStopCallback?;
    constructor();
    getId(): number;
    getCompleteCallback(): ((timeline: Timeline) => void) | undefined;
    isPlaying(): boolean;
    isPaused(): boolean;
    /** Duration of the timeline (max child end). */
    getDuration(): number;
    getTotalDuration(): number;
    getAll(): Array<TimelineChild>;
    has(node: TimelineChild): boolean;
    private _isAddOptions;
    private _resolveAt;
    private _resolvePosition;
    addLabel(name: string, offset: number): this;
    removeLabel(name: string): this;
    getLabel(name: string): number | undefined;
    private _recalculateDuration;
    /**
     * Add a Tween or nested Timeline.
     *
     * Placement (second argument):
     * - `add(tween)` appends after the last child (sequential).
     * - `add(tween, 0)` starts at timeline start (parallel).
     * - `add(tween, 500)` starts at 500ms.
     * - `add(tween, 'myLabel')` aligns to a label (`start` and `end` builtin).
     * - `add(tween, otherTween)` aligns to another child's start.
     * - `add(tween, {at, atIndex, offset, shift, repeat, yoyo})` for full control.
     *
     * Options:
     * - `at`: a time value, label, or child to align to (default: end).
     * - `atIndex`: entry index to align to (takes precedence over `at`).
     * - `offset`: added to the aligned base (default: 0).
     * - `shift`: shift entries at/after the base later so nothing overlaps.
     * - `repeat`: total plays; extra plays clone the child (default: 1).
     * - `yoyo`: alternate plays with reversed clips (see `Tween.reverse()`).
     *
     * Adding the same tween more than once clones it (each clip needs
     * independent playback state); the original object plays first.
     * `add([a, b])` adds sequentially; `add([a, b], 0)` adds in parallel
     * (`repeat`/`yoyo` apply per child).
     */
    add(node: TimelineChild | Array<TimelineChild>, position?: TimelinePosition): this;
    private _shiftEntries;
    private _addSingle;
    /**
     * Create an independent copy of this timeline: entries, custom labels,
     * and callbacks are copied, and every child is cloned, so the copy plays
     * identically but owns its playback state. Used by
     * `add(child, {repeat})` expansion for nested timelines.
     */
    clone(): Timeline;
    remove(...nodes: Array<TimelineChild>): this;
    removeAll(): this;
    onStart(callback?: (timeline: Timeline) => void): this;
    onEveryStart(callback?: (timeline: Timeline) => void): this;
    onUpdate(callback?: (timeline: Timeline, elapsed: number) => void): this;
    onComplete(callback?: (timeline: Timeline) => void): this;
    onStop(callback?: (timeline: Timeline) => void): this;
    /** Convenience: set easing for all child Tweens (recurses into nested Timelines). */
    easing(easingFunction: EasingFunction): this;
    /** Convenience: set interpolation for all child Tweens (recurses). */
    interpolation(interpolationFunction: InterpolationFunction): this;
    start(time?: number): this;
    stop(): this;
    pause(time?: number): this;
    resume(time?: number): this;
    /**
     * @returns true if still playing after update, false otherwise.
     * Children use a local clock (0 = timeline start).
     */
    update(time?: number, autoStart?: boolean): boolean;
}

type GroupChild = Tween<any> | Timeline;
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 *
 * Groups can also hold `Timeline` instances (timelines are playable, like tweens).
 */
declare class Group {
    private _tweens;
    private _tweensAddedDuringUpdate;
    constructor(...tweens: Array<GroupChild>);
    getAll(): Array<GroupChild>;
    removeAll(): void;
    add(...tweens: Array<GroupChild>): void;
    remove(...tweens: Array<GroupChild>): void;
    /** Return true if all tweens in the group are not paused or playing. */
    allStopped(): boolean;
    update(time?: number): void;
    /**
     * @deprecated The `preserve` parameter is now defaulted to `true` and will
     * be removed in a future major release, at which point all tweens of a
     * group will always be preserved when calling update. To migrate, always
     * use `group.add(tween)` or `group.remove(tween)` to manually add or remove
     * tweens, and do not rely on tweens being automatically added or removed.
     */
    update(time?: number, preserve?: boolean): void;
    onComplete(callback: (object: Array<GroupChild>) => void): void;
}

declare const now: () => number;
declare function setNow(nowFunction: Function): void;

/**
 * Utils
 */
declare class Sequence {
    private static _nextId;
    static nextId(): number;
}

declare const VERSION = "25.0.0";

declare const nextId: typeof Sequence.nextId;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare const getAll: () => GroupChild[];
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare const removeAll: () => void;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare const add: (...tweens: GroupChild[]) => void;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare const remove: (...tweens: GroupChild[]) => void;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare const update: {
    (time?: number | undefined): void;
    (time?: number | undefined, preserve?: boolean | undefined): void;
};

declare const exports: {
    Easing: Readonly<{
        Linear: Readonly<EasingFunctionGroup & {
            None: EasingFunction;
        }>;
        Quadratic: Readonly<EasingFunctionGroup>;
        Cubic: Readonly<EasingFunctionGroup>;
        Quartic: Readonly<EasingFunctionGroup>;
        Quintic: Readonly<EasingFunctionGroup>;
        Sinusoidal: Readonly<EasingFunctionGroup>;
        Exponential: Readonly<EasingFunctionGroup>;
        Circular: Readonly<EasingFunctionGroup>;
        Elastic: Readonly<EasingFunctionGroup>;
        Back: Readonly<EasingFunctionGroup>;
        Bounce: Readonly<EasingFunctionGroup>;
        generatePow(power?: number): EasingFunctionGroup;
    }>;
    Group: typeof Group;
    Interpolation: {
        Linear: (v: number[], k: number) => number;
        Bezier: (v: number[], k: number) => number;
        CatmullRom: (v: number[], k: number) => number;
        Utils: {
            Linear: (p0: number, p1: number, t: number) => number;
            Bernstein: (n: number, i: number) => number;
            Factorial: (n: number) => number;
            CatmullRom: (p0: number, p1: number, p2: number, p3: number, t: number) => number;
        };
    };
    now: () => number;
    setNow: typeof setNow;
    Sequence: typeof Sequence;
    nextId: typeof Sequence.nextId;
    Tween: typeof Tween;
    Timeline: typeof Timeline;
    VERSION: string;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    getAll: () => GroupChild[];
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    removeAll: () => void;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    add: (...tweens: GroupChild[]) => void;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    remove: (...tweens: GroupChild[]) => void;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    update: {
        (time?: number | undefined): void;
        (time?: number | undefined, preserve?: boolean | undefined): void;
    };
};

export { Easing, Group, Interpolation, Sequence, Timeline, Tween, VERSION, add, exports as default, getAll, nextId, now, remove, removeAll, setNow, update };

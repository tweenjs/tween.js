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
    delay(amount?: number): this;
    repeat(times?: number): this;
    repeatDelay(amount?: number): this;
    yoyo(yoyo?: boolean): this;
    easing(easingFunction?: EasingFunction): this;
    interpolation(interpolationFunction?: InterpolationFunction): this;
    chain(...tweens: Array<Tween<any>>): this;
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
 * - Tween does tweening, Timeline does orchestration (replaces `.chain`,
 *   and handles repeat/yoyo at a higher level).
 * - Single class, sequential by default (append), parallel via explicit offset.
 * - Simple, Three.js ethos: small API, explicit times, no magic.
 */

type TimelineChild = Tween<any> | Timeline;
type TimelinePosition = number | string;
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
    private _delayTime;
    private _initialRepeat;
    private _repeat;
    private _repeatDelayTime?;
    private _yoyo;
    private _reversed;
    private _onStartCallback?;
    private _onStartCallbackFired;
    private _onEveryStartCallback?;
    private _onEveryStartCallbackFired;
    private _onUpdateCallback?;
    private _onRepeatCallback?;
    private _onCompleteCallback?;
    private _onStopCallback?;
    constructor();
    getId(): number;
    isPlaying(): boolean;
    isPaused(): boolean;
    /** Duration of one iteration (max child end), excluding own delay/repeats. */
    getDuration(): number;
    /**
     * Total duration from `start()` call, including own delay, repeats and
     * repeat delays. `Infinity` when repeating forever or containing an
     * infinite child.
     */
    getTotalDuration(): number;
    getAll(): Array<TimelineChild>;
    has(node: TimelineChild): boolean;
    /** Resolve a position to a local time in ms. */
    private _parsePosition;
    addLabel(name: string, offset: TimelinePosition): this;
    removeLabel(name: string): this;
    getLabel(name: string): number | undefined;
    private _recalculateDuration;
    /**
     * Add a Tween or nested Timeline.
     *
     * - `add(tween)` appends after the last child (sequential).
     * - `add(tween, 0)` starts at timeline start (parallel).
     * - `add(tween, 500)` starts at 500ms.
     * - `add(tween, 'myLabel')`, `add(tween, 'myLabel+=100')`, `add(tween, '<')`, `add(tween, '>')`.
     * - `add([a, b])` adds sequentially; `add([a, b], 0)` adds in parallel.
     */
    add(node: TimelineChild | Array<TimelineChild>, position?: TimelinePosition): this;
    private _addSingle;
    remove(...nodes: Array<TimelineChild>): this;
    removeAll(): this;
    delay(amount?: number): this;
    repeat(times?: number): this;
    repeatDelay(amount?: number): this;
    yoyo(yoyo?: boolean): this;
    onStart(callback?: (timeline: Timeline) => void): this;
    onEveryStart(callback?: (timeline: Timeline) => void): this;
    onUpdate(callback?: (timeline: Timeline, elapsed: number) => void): this;
    onRepeat(callback?: (timeline: Timeline) => void): this;
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
     * Children use a local clock (0 = timeline start), so yoyo/reverse is a
     * single time mapping with no offset mirroring needed.
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

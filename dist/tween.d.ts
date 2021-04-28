declare type EasingFunction = (amount: number) => number;
/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
declare const Easing: {
    Linear: {
        None: (amount: number) => number;
    };
    Quadratic: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Cubic: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Quartic: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Quintic: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Sinusoidal: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Exponential: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Circular: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Elastic: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Back: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
    Bounce: {
        In: (amount: number) => number;
        Out: (amount: number) => number;
        InOut: (amount: number) => number;
    };
};

/**
 *
 */
declare type InterpolationFunction = (v: number[], k: number) => number;
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

declare class Tween<T extends UnknownProps> {
    private _object;
    private _group;
    private _isPaused;
    private _pauseStart;
    private _valuesStart;
    private _valuesEnd;
    private _valuesStartRepeat;
    private _duration;
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
    private _onUpdateCallback?;
    private _onRepeatCallback?;
    private _onCompleteCallback?;
    private _onStopCallback?;
    private _id;
    private _isChainStopped;
    constructor(_object: T, _group?: Group | false);
    getId(): number;
    isPlaying(): boolean;
    isPaused(): boolean;
    to(properties: UnknownProps, duration?: number): this;
    duration(d?: number): this;
    start(time?: number): this;
    private _setupProperties;
    stop(): this;
    end(): this;
    pause(time?: number): this;
    resume(time?: number): this;
    setProgress(elapsed: number, update?: boolean): this;
    stopChainedTweens(): this;
    group(group?: Group): this;
    delay(amount?: number): this;
    repeat(times?: number): this;
    repeatDelay(amount?: number): this;
    yoyo(yoyo?: boolean): this;
    easing(easingFunction?: EasingFunction): this;
    interpolation(interpolationFunction?: InterpolationFunction): this;
    chain(...tweens: Array<Tween<any>>): this;
    onStart(callback?: (object: T) => void): this;
    onUpdate(callback?: (object: T, elapsed: number) => void): this;
    onRepeat(callback?: (object: T) => void): this;
    onComplete(callback?: (object: T) => void): this;
    onStop(callback?: (object: T) => void): this;
    private _goToEnd;
    /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     */
    update(time?: number, autoStart?: boolean): boolean;
    private _updateProperties;
    private _handleRelativeValue;
    private _swapEndStartRepeatValues;
}
declare type UnknownProps = Record<string, any>;

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
declare class Group {
    private _tweens;
    private _tweensAddedDuringUpdate;
    getAll(): Array<Tween<UnknownProps>>;
    removeAll(): void;
    add(tween: Tween<UnknownProps>): void;
    remove(tween: Tween<UnknownProps>): void;
    update(time?: number, preserve?: boolean): boolean;
}

declare let now: () => number;

/**
 * Utils
 */
declare class Sequence {
    private static _nextId;
    static nextId(): number;
}

declare const VERSION = "18.6.4";

declare const nextId: typeof Sequence.nextId;
declare const getAll: () => Tween<Record<string, any>>[];
declare const removeAll: () => void;
declare const add: (tween: Tween<Record<string, any>>) => void;
declare const remove: (tween: Tween<Record<string, any>>) => void;
declare const update: (time?: number, preserve?: boolean) => boolean;
declare const exports: {
    Easing: {
        Linear: {
            None: (amount: number) => number;
        };
        Quadratic: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Cubic: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Quartic: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Quintic: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Sinusoidal: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Exponential: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Circular: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Elastic: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Back: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
        Bounce: {
            In: (amount: number) => number;
            Out: (amount: number) => number;
            InOut: (amount: number) => number;
        };
    };
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
    Sequence: typeof Sequence;
    nextId: typeof Sequence.nextId;
    Tween: typeof Tween;
    VERSION: string;
    getAll: () => Tween<Record<string, any>>[];
    removeAll: () => void;
    add: (tween: Tween<Record<string, any>>) => void;
    remove: (tween: Tween<Record<string, any>>) => void;
    update: (time?: number, preserve?: boolean) => boolean;
};

export default exports;
export { Easing, Group, Interpolation, Sequence, Tween, VERSION, add, getAll, nextId, now, remove, removeAll, update };

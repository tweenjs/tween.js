declare module "TWEEN" {

    type EasingFunction = (amount: number) => number;

    /**
     * The Ease class provides a collection of easing functions for use with tween.js.
     */
    const Easing: {
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

    let NOW: () => number;

    /**
     *
     */
    type InterpolationFunction = (v: number[], k: number) => number;

    /**
     *
     */
    const Interpolation: {
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
     * Utils
     */
    class Sequence {
        private static _nextId;
        static nextId(): number;
    }

    const VERSION = "18.5.0";

    /**
     * Controlling groups of tweens
     *
     * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
     * In these cases, you may want to create your own smaller groups of tween
     */
    class Main extends Group {
        version: string;
        now: () => number;
        Group: typeof Group;
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
        nextId: typeof Sequence.nextId;
        Tween: typeof Tween;
    }

    const TWEEN: Main;

    /**
     * Tween.js - Licensed under the MIT license
     * https://github.com/tweenjs/tween.js
     * ----------------------------------------------
     *
     * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
     * Thank you all, you're awesome!
     */
    
    
    
    class Tween<T extends UnknownProps> {
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
        constructor(_object: T, _group?: Group);
        getId(): number;
        isPlaying(): boolean;
        isPaused(): boolean;
        to(properties: UnknownProps, duration?: number): this;
        duration(d: number): this;
        start(time: number): this;
        private _setupProperties;
        stop(): this;
        end(): this;
        pause(time: number): this;
        resume(time: number): this;
        stopChainedTweens(): this;
        group(group: Group): this;
        delay(amount: number): this;
        repeat(times: number): this;
        repeatDelay(amount: number): this;
        yoyo(yoyo: boolean): this;
        easing(easingFunction: EasingFunction): this;
        interpolation(interpolationFunction: InterpolationFunction): this;
        chain(...tweens: Array<Tween<UnknownProps>>): this;
        onStart(callback: (object: T) => void): this;
        onUpdate(callback: (object: T, elapsed: number) => void): this;
        onRepeat(callback: (object: T) => void): this;
        onComplete(callback: (object: T) => void): this;
        onStop(callback: (object: T) => void): this;
        update(time: number): boolean;
        private _updateProperties;
        private _handleRelativeValue;
        private _swapEndStartRepeatValues;
    }

    type UnknownProps = Record<string, unknown>;

    /**
     * Controlling groups of tweens
     *
     * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
     * In these cases, you may want to create your own smaller groups of tween
     */
    class Group {
        private _tweens;
        private _tweensAddedDuringUpdate;
        getAll(): Array<Tween<UnknownProps>>;
        removeAll(): void;
        add(tween: Tween<UnknownProps>): void;
        remove(tween: Tween<UnknownProps>): void;
        update(time: number, preserve?: boolean): boolean;
    }

    export default TWEEN;
}

declare module "@tweenjs/tween.js" {
    import TWEEN from "TWEEN";
    export = TWEEN;
}

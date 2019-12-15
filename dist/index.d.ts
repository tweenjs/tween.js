declare module "TWEEN" {

    type EasingFunction = (amount: number) => number;

    /**
     *
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

    var NOW: () => number;

    /**
     * Basic representation of a Tween
     */
    interface TweenBase {
        playing: boolean;
        update: (time: number) => boolean;
        getId: () => number;
    }

    /**
     * Controlling groups of tweens
     *
     * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
     * In these cases, you may want to create your own smaller groups of tween
     */
    class Group {
        private _tweens;
        private _tweensAddedDuringUpdate;
        constructor();
        getAll(): TweenBase[];
        removeAll(): void;
        add(tween: TweenBase): void;
        remove(tween: TweenBase): void;
        update(time: number, preserve: boolean): boolean;
    }

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
        static _nextId: number;
        static nextId: () => number;
    }

    /**
     * A tween (from in-between) is a concept that allows you to change the values of the properties of an object in a
     * smooth way. You just tell it which properties you want to change, which final values should they have when the
     * tween finishes running, and how long should this take, and the tweening engine will take care of finding the
     * intermediate values from the starting to the ending point.
     */
    class Tween implements TweenBase {
        static TWEEN: Group;
        static inject(instance: Group): void;
        playing: boolean;
        private id;
        private object;
        private groupRef;
        private paused;
        private pauseStart;
        private valuesStart;
        private valuesEnd;
        private valuesStartRepeat;
        private durationValue;
        private repeatValue;
        private repeatDelayTime;
        private yoyoValue;
        private reversed;
        private delayTime;
        private startTime;
        private easingFunction;
        private interpolationFunction;
        private chainedTweens;
        private onStartCallbackFired;
        private onStartCallback;
        private onUpdateCallback;
        private onRepeatCallback;
        private onCompleteCallback;
        private onStopCallback;
        constructor(object: any, groupRef?: Group);
        getId(): number;
        isPlaying(): boolean;
        isPaused(): boolean;
        to(properties: {}, duration?: number): this;
        duration(value: number): this;
        start(time?: number | string): this;
        stop(): this;
        end(): this;
        pause(time: number): this;
        resume(time: number): this;
        stopChainedTweens(): void;
        group(group: Group): this;
        delay(amount: number): this;
        repeat(times: number): this;
        repeatDelay(amount: number): this;
        yoyo(yoyo: boolean): this;
        easing(easing: EasingFunction): this;
        interpolation(interpolation: InterpolationFunction): this;
        chain(...tweens: Tween[]): this;
        onStart(callback: (object: any) => void): this;
        onUpdate(callback: (object: any, elapsed: number) => void): this;
        onRepeat(callback: (object: any) => void): this;
        onComplete(callback: (object: any) => void): this;
        onStop(callback: (object: any) => void): this;

        /**
         * Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the update method.
         * The recommended method is to do this inside your main animation loop, which should be called with
         * requestAnimationFrame for getting the best graphics performance
         *
         * If called without parameters, update will determine the current time in order to find out how long has it been
         * since the last time it ran.
         *
         * @param time
         */
        update(time?: number): boolean;
    }

    const VERSION = "18.6.0";

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
        nextId: () => number;
        Tween: typeof Tween;
    }

    const TWEEN: Main;

    export default TWEEN;
}

declare module "@tweenjs/tween.js" {
    import TWEEN from "TWEEN";
    export = TWEEN;
}

// Type definitions for TweenJs r11
// Project: https://github.com/sole/tween.js
// Definitions by: xperiments <http://github.com/xperiments>

declare module TWEEN
{
	export var REVISION:string;

	export function getAll():Tween[];

	export function removeAll():void;

	export function add(tween:Tween):void;

	export function remove(tween:Tween):void;

	export function update(time?:number):void;


	export class Tween
	{

		constructor( object );

		to( properties, duration:number):Tween;

		start(time:number):Tween;

		stop():Tween;

		delay(amount:number):Tween;

		repeat(times:number):Tween;

		yoyo(yoyo:boolean):Tween;

		easing(easing:IEasingFunction):Tween;

		interpolation(interpolation:IInterpolationFunction):Tween;

		chain():Tween;

		onStart(callback:()=>void):Tween;

		onUpdate(callback:()=>void):Tween;

		onComplete(callback:()=>void):Tween;

		update(time:number):Tween;
	}

	export interface IEasingFunction
	{
		(k:number):number
	}
	export interface IEasing
	{
		In:IEasingFunction;
		Out:IEasingFunction;
		InOut:IEasingFunction;
	}
	export var Easing:
	{
		Linear:
		{
			None:IEasingFunction
		};
		Quadratic:IEasing;
		Cubic:IEasing;
		Quartic:IEasing;
		Quintic:IEasing;
		Sinusoidal:IEasing;
		Exponential:IEasing;
		Circular:IEasing;
		Elastic:IEasing;
		Back:IEasing;

	}

	export interface IInterpolationFunction
	{
		(v:number, k:number):number
	}
	export var Interpolation:
	{
		Linear:IInterpolationFunction;
		Bezier:IInterpolationFunction;
		CatmullRom:IInterpolationFunction;
		Utils:
		{
			Linear:(p0:number, p1:number, t:number)=>number;
			Bernstein: (n:number, i:number)=>number;
			Factorial:(n:number)=>number;
			CatmullRom:(p0:number, p1:number, p2:number, p3:number, t:number)=>number;
		}
	}
}



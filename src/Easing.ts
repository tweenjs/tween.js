export type EasingFunction = (amount: number) => number

export type EasingFunctionGroup = {
	In: EasingFunction
	Out: EasingFunction
	InOut: EasingFunction
}

/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */

export const Easing = Object.freeze({
	Linear: Object.freeze<EasingFunctionGroup & {None: EasingFunction}>({
		None(amount: number): number {
			return amount
		},
		In(amount: number): number {
			return amount
		},
		Out(amount: number): number {
			return amount
		},
		InOut(amount: number): number {
			return amount
		},
	}),

	Quadratic: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return amount * amount
		},
		Out(amount: number): number {
			return amount * (2 - amount)
		},
		InOut(amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount
			}

			return -0.5 * (--amount * (amount - 2) - 1)
		},
	}),

	Cubic: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return amount * amount * amount
		},
		Out(amount: number): number {
			return --amount * amount * amount + 1
		},
		InOut(amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount
			}
			return 0.5 * ((amount -= 2) * amount * amount + 2)
		},
	}),

	Quartic: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return amount * amount * amount * amount
		},
		Out(amount: number): number {
			return 1 - --amount * amount * amount * amount
		},
		InOut(amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount
			}

			return -0.5 * ((amount -= 2) * amount * amount * amount - 2)
		},
	}),

	Quintic: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return amount * amount * amount * amount * amount
		},
		Out(amount: number): number {
			return --amount * amount * amount * amount * amount + 1
		},
		InOut(amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount * amount
			}

			return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2)
		},
	}),

	Sinusoidal: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2)
		},
		Out(amount: number): number {
			return Math.sin((amount * Math.PI) / 2)
		},
		InOut(amount: number): number {
			return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)))
		},
	}),

	Exponential: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return amount === 0 ? 0 : Math.pow(1024, amount - 1)
		},
		Out(amount: number): number {
			return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
		},
		InOut(amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}

			if ((amount *= 2) < 1) {
				return 0.5 * Math.pow(1024, amount - 1)
			}

			return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2)
		},
	}),

	Circular: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return 1 - Math.sqrt(1 - amount * amount)
		},
		Out(amount: number): number {
			return Math.sqrt(1 - --amount * amount)
		},
		InOut(amount: number): number {
			if ((amount *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - amount * amount) - 1)
			}
			return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1)
		},
	}),

	Elastic: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}

			return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
		},
		Out(amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}
			return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
		},
		InOut(amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}

			amount *= 2

			if (amount < 1) {
				return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
			}

			return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1
		},
	}),

	Back: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			const s = 1.70158
			return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s)
		},
		Out(amount: number): number {
			const s = 1.70158
			return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1
		},
		InOut(amount: number): number {
			const s = 1.70158 * 1.525
			if ((amount *= 2) < 1) {
				return 0.5 * (amount * amount * ((s + 1) * amount - s))
			}
			return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2)
		},
	}),

	Bounce: Object.freeze(<EasingFunctionGroup>{
		In(amount: number): number {
			return 1 - Easing.Bounce.Out(1 - amount)
		},
		Out(amount: number): number {
			if (amount < 1 / 2.75) {
				return 7.5625 * amount * amount
			} else if (amount < 2 / 2.75) {
				return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75
			} else if (amount < 2.5 / 2.75) {
				return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375
			} else {
				return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375
			}
		},
		InOut(amount: number): number {
			if (amount < 0.5) {
				return Easing.Bounce.In(amount * 2) * 0.5
			}
			return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5
		},
	}),

	generatePow(power = 4): EasingFunctionGroup {
		power = power < Number.EPSILON ? Number.EPSILON : power
		power = power > 10000 ? 10000 : power
		return {
			In(amount: number): number {
				return amount ** power
			},
			Out(amount: number): number {
				return 1 - (1 - amount) ** power
			},
			InOut(amount: number): number {
				if (amount < 0.5) {
					return (amount * 2) ** power / 2
				}
				return (1 - (2 - amount * 2) ** power) / 2 + 0.5
			},
		}
	},
})

export default Easing

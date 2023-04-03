export type EasingFunction = (amount: number) => number

/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
const Easing = {
	Linear: {
		None: function (amount: number): number {
			return amount
		},
	},
	Quadratic: {
		In: function (amount: number): number {
			return amount * amount
		},
		Out: function (amount: number): number {
			return amount * (2 - amount)
		},
		InOut: function (amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount
			}

			return -0.5 * (--amount * (amount - 2) - 1)
		},
	},
	Cubic: {
		In: function (amount: number): number {
			return amount * amount * amount
		},
		Out: function (amount: number): number {
			return --amount * amount * amount + 1
		},
		InOut: function (amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount
			}
			return 0.5 * ((amount -= 2) * amount * amount + 2)
		},
	},
	Quartic: {
		In: function (amount: number): number {
			return amount * amount * amount * amount
		},
		Out: function (amount: number): number {
			return 1 - --amount * amount * amount * amount
		},
		InOut: function (amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount
			}

			return -0.5 * ((amount -= 2) * amount * amount * amount - 2)
		},
	},
	Quintic: {
		In: function (amount: number): number {
			return amount * amount * amount * amount * amount
		},
		Out: function (amount: number): number {
			return --amount * amount * amount * amount * amount + 1
		},
		InOut: function (amount: number): number {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount * amount
			}

			return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2)
		},
	},
	Sinusoidal: {
		In: function (amount: number): number {
			return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2)
		},
		Out: function (amount: number): number {
			return Math.sin((amount * Math.PI) / 2)
		},
		InOut: function (amount: number): number {
			return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)))
		},
	},
	Exponential: {
		In: function (amount: number): number {
			return amount === 0 ? 0 : Math.pow(1024, amount - 1)
		},
		Out: function (amount: number): number {
			return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
		},
		InOut: function (amount: number): number {
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
	},
	Circular: {
		In: function (amount: number): number {
			return 1 - Math.sqrt(1 - amount * amount)
		},
		Out: function (amount: number): number {
			return Math.sqrt(1 - --amount * amount)
		},
		InOut: function (amount: number): number {
			if ((amount *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - amount * amount) - 1)
			}
			return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1)
		},
	},
	Elastic: {
		In: function (amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}

			return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
		},
		Out: function (amount: number): number {
			if (amount === 0) {
				return 0
			}

			if (amount === 1) {
				return 1
			}
			return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
		},
		InOut: function (amount: number): number {
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
	},
	Back: {
		In: function (amount: number): number {
			const s = 1.70158
			return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s)
		},
		Out: function (amount: number): number {
			const s = 1.70158
			return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1
		},
		InOut: function (amount: number): number {
			const s = 1.70158 * 1.525
			if ((amount *= 2) < 1) {
				return 0.5 * (amount * amount * ((s + 1) * amount - s))
			}
			return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2)
		},
	},
	Bounce: {
		In: function (amount: number): number {
			return 1 - Easing.Bounce.Out(1 - amount)
		},
		Out: function (amount: number): number {
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
		InOut: function (amount: number): number {
			if (amount < 0.5) {
				return Easing.Bounce.In(amount * 2) * 0.5
			}
			return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5
		},
	},
	generatePow: function (
		power = 4,
	): {
		In(amount: number): number
		Out(amount: number): number
		InOut(amount: number): number
	} {
		power = power < Number.EPSILON ? Number.EPSILON : power
		power = power > 10000 ? 10000 : power
		return {
			In: function (amount: number): number {
				return amount ** power
			},
			Out: function (amount: number): number {
				return 1 - (1 - amount) ** power
			},
			InOut: function (amount: number): number {
				if (amount < 0.5) {
					return (amount * 2) ** power / 2
				}
				return (1 - (2 - amount * 2) ** power) / 2 + 0.5
			},
		}
	},
	generateExponential: function (
		// A value of 300 is makes the curve very close to Exponential with its value of 1024.
		base = 300,
	): {
		In(amount: number): number
		Out(amount: number): number
		InOut(amount: number): number
	} {
		// https://www.desmos.com/calculator/pioplwo3zq

		if (base <= 0) {
			console.warn(
				'base should be larger than 0. You might like to try between 20 and 400, maybe more. Setting a default value of 300.',
			)
			base = 300
		}

		function In(amount: number): number {
			// Start similar to Exponential
			let expo = base ** (amount - 1)

			// adjust so it hits 0 when amount is 0
			expo = expo - expo * (1 - amount)

			return expo
		}

		function Out(amount: number): number {
			// translate X by 1
			amount = amount + 1

			// Similar to In, but negate power to make the graph have a negative slope instead of positive.
			let expo = base ** -(amount - 1)

			// adjust so it hits 1 when amount is 1
			expo = expo - expo * -(1 - amount)

			// Flip it upside down, move it up by 1.
			return -expo + 1
		}

		function InOut(amount: number): number {
			amount *= 2

			if (amount < 1) return In(amount) / 2

			// Similar to In, but negate power to make the graph have a negative slope instead of positive.
			let expo = base ** -(amount - 1)

			// adjust so it hits 1 when amount is 1
			expo = expo - expo * -(1 - amount)

			// Flip it upside down, move it up by 2.
			expo = -expo + 2

			return expo / 2
		}

		return {In, Out, InOut}
	},
}

export default Easing

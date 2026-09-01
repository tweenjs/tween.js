let _nowFunc = (): DOMHighResTimeStamp => performance.now()

const now = (): number => {
	return _nowFunc()
}

export function setNow(nowFunction: () => number) {
	_nowFunc = nowFunction
}

export default now

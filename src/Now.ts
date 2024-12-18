let _nowFunc: Function = () => performance.now()

const now = (): number => {
  return _nowFunc()
}

export function setNow(nowFunction: Function) {
  _nowFunc = nowFunction
}

export default now

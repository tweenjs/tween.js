/**
 * Utils
 */
export default class Sequence {

    static _nextId = 0;

    static nextId = function (): number {
        return Sequence._nextId++;
    };
}

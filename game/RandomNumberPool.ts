/**
 * A pool of unique random numbers with a limited size.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class RandomNumberPool {
    /**
     * The number of unique random numbers.
     */
    private size: number;

    /**
     * The pool of numbers.
     */
    private pool: Array<number>;

    /**
     * Creates a pool with the given size.
     *
     * @param size The pool size, default 12.
     */
    constructor(size: number = 12) {
        this.size = size;
        this.pool = [];
        this.reset();
    }

    /**
     * Gets a unique random number form the pool.
     *
     * @return {number}
     */
    public getNumber(): number {
        var poolLength: number = this.pool.length;

        if (poolLength === 0) {
            throw 'No numbers left!';
        }

        var index: number = Math.floor(poolLength * Math.random());

        return this.pool.splice(index, 1)[0];
    }

    /**
     * Resets the pool.
     */
    public reset(): void {
        this.pool.length = 0;
        for (var i = 0; i < this.size; i++) {
            this.pool.push(i);
        }
    }
}
/**
 * The game object is a object which gets managed by it's game manager.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 * @abstract
 */
class GameObject<T> {
    /**
     * The object id.
     */
    private id: number = 0;

    /**
     * The object's tag used for grouping and messaging.
     */
    protected tag: string;

    /**
     * The handling game manager instance.
     */
    protected gameManager: GameManager<T>;

    /**
     * The rendering context used for drawing the game object.
     */
    protected renderingContext: T;

    /**
     * The game object init method invoked by the game manager.
     *
     * @param gameManager The invoking game manager.
     * @param renderingContext The rendering context to use.
     */
    public init(gameManager: GameManager<T>, renderingContext: T): void {
        this.gameManager = gameManager;
        this.renderingContext = renderingContext;
    }

    /**
     * Gets called by the game manager when removing the game object.
     */
    public remove(): void {
        this.id = 0;
    }

    /**
     * Gets invoked by the game manager for sending a message to this object.
     */
    public onMessage(message: GameMessage): void {
        // has to be implemented by specific game object
    }

    /**
     * Returns the game object id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Sets the game object id.
     *
     * @param id The id defined by the game manager.
     * @throws An exception if a id has already been set.
     */
    public setId(id: number) {
        if (this.id > 0) {
            throw 'ID has already been set!';
        }

        this.id = id;
    }

    /**
     * Gets the object's tag.
     */
    public getTag(): string {
        return this.tag;
    }
}
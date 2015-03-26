/**
 * The game manager used for creating game objects and messaging between them.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class GameManager<T> {
    /**
     * A list of managed game objects.
     */
    private gameObjects: Array<GameObject<T>> = [];

    /**
     * Internal counter used for generating game objects ids.
     */
    private idCounter: number = 0;

    /**
     * A flag used to determine if the game managers init method has already been called.
     */
    private initialized: boolean = false;

    /**
     * The rendering context used by the game objects.
     */
    private renderingContext: T;

    /**
     * Adds a game object to the manager.
     *
     * @param gameObject The game object to add.
     * @param init If true the object's init method gets called immediately.
     * @param specialRenderingContext Adds this rendering context to the game object inted of the global one.
     */
    public addGameObject (gameObject: GameObject<T>, init: boolean = false, specialRenderingContext?: T): void {
        gameObject.setId(++this.idCounter);
        this.gameObjects.push(gameObject);

        if (init) {
            if (typeof specialRenderingContext === 'undefined') {
                gameObject.init(this,  this.renderingContext);
            } else {
                gameObject.init(this,  specialRenderingContext);
            }
        }
    }

    /**
     * Adds a list of game objects.
     *
     * @param gameObjects The game objects to add.
     * @param init If true the object's init methods gets called immediately.
     */
    public addGameObjects (gameObjects: Array<GameObject<T>>, init: boolean = false): void {
        var length = gameObjects.length;
        for (var i = 0; i < length; i++) {
            this.addGameObject(gameObjects[i], init);
        }
    }

    /**
     * Removes a game object from the manager.
     * The game object's remove method gets called when removing.
     *
     * @param gameObject The game object to remove.
     * @return {boolean} True if the game objects was found and removed, otherwise false.
     */
    public removeGameObject (gameObject: GameObject<T>): boolean {
        if (!gameObject) {
            return;
        }

        gameObject.remove();
        for (var i = this.gameObjects.length - 1; i >= 0; i--) {
            if (this.gameObjects[i].getId() === gameObject.getId()) {
                this.gameObjects.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    /**
     * Init the manager.
     *
     * @param renderingContext The game objects target rendering context.
     */
    public init (renderingContext: T): void {
        if (this.initialized) {
            return;
        }

        this.renderingContext = renderingContext;

        for (var i = this.gameObjects.length - 1; i >= 0; i--) {
            this.gameObjects[i].init(this, renderingContext);
        }

        this.initialized = true;
        this.sendMessage(new GameMessageToAll('init', 0));
    }

    /**
     * Sends a game message to one or many game objects.
     *
     * @param message The message to send.
     */
    public sendMessage (message: GameMessage): void {
        var i = this.gameObjects.length - 1;
        switch (message.targetType) {
            case GameMessageTargetType.ID:
                for (; i >= 0; i--) {
                    if (this.gameObjects[i].getId() === message.target) {
                        this.gameObjects[i].onMessage(message);
                        break;
                    }
                }
                break;
            case GameMessageTargetType.TAG:
                for (; i >= 0; i--) {
                    if (this.gameObjects[i].getTag() === message.target) {
                        this.gameObjects[i].onMessage(message);
                    }
                }
                break;
            default:
            case GameMessageTargetType.ALL:
                for (; i >= 0; i--) {
                    this.gameObjects[i].onMessage(message);
                }
                break;
        }
    }
}
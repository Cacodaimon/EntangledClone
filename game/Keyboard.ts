/**
 * A keyboard game object which fires the game events for the keystrokes.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class Keyboard extends GameObject<D3.Selection> {

    constructor() {
        super();
        this.tag = 'keyboard';
    }

    /**
     * A convinence send message via the game manager helper.
     *
     * @param type The message type.
     * @param senderId The sender id.
     * @param gameManager The game manager used for sending.
     */
    protected static sendMessage(type: string, senderId: number, gameManager: GameManager<D3.Selection>): void {
        gameManager.sendMessage(new GameMessageToTag(
            'game-logic',
            type,
            senderId
        ));
    }

    public init(gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        var senderId = this.getId();

        window.addEventListener('keydown', function(event: KeyboardEvent) {
            switch (event.keyCode) {
                case 37: // left
                    Keyboard.sendMessage('rotate-left', senderId, gameManager);
                    return;
                case 39: // right
                    Keyboard.sendMessage('rotate-right', senderId, gameManager);
                    return;
                // case 38: // up
                // case 40: // down
                case 13: // enter
                    Keyboard.sendMessage('place', senderId, gameManager);
                    return;
                case 32: // space
                    Keyboard.sendMessage('switch', senderId, gameManager);
                    return;
                case 9: // tab
                    Keyboard.sendMessage('new-game', senderId, gameManager);
                    return;
            }
        }, false);
    }
}
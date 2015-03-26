/// <reference path="../vendor/hammer.d.ts" />

/**
 * A touch control using hammer.js.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 * @link http://hammerjs.github.io/
 */
class TouchControl extends GameObject<D3.Selection> {

    constructor() {
        super();
        this.tag = 'touch-control';
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
        var mc = new Hammer(document.getElementById('game-screen'));

        mc.on('swipeleft', function() {
            TouchControl.sendMessage('rotate-left', senderId, gameManager);
        });

        mc.on('swiperight', function() {
            TouchControl.sendMessage('rotate-right', senderId, gameManager);
        });

        mc.on('tap', function() {
            TouchControl.sendMessage('place', senderId, gameManager);
        });

        mc.on('press', function() {
            TouchControl.sendMessage('switch', senderId, gameManager);
        });
    }
}
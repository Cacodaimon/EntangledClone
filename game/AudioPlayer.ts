/**
 * A dummy audio player reating on incomming game messages.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class AudioPlayer extends GameObject<D3.Selection> {

    public onMessage(message: GameMessage): void {
        switch (message.type) {
            case 'hexagon-placed':
            case 'hexagon-switched':
            case 'hexagon-rotated':
            case 'game-reset':
            case 'game-finished':
                console.log('Play sound file for: ' + message.type);
                break;
        }
    }
}
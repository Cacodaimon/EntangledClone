/**
 * Displays the finish screen.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class FinishedDisplay extends SVGGameObject {
    /**
     * The SVG text element selection.
     */
    protected textElement: D3.Selection;

    /**
     * The background SVG rect selection.
     */
    protected hexagonGeometry: HexagonGeometry;

    constructor () {
        super();
        this.tag = 'finished-display';
        this.hexagonGeometry = new HexagonGeometry(200);
    }

    public init (gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);
        this.setOpacity(0, 0);

        var hexagon = new Hexagon(this.hexagonGeometry);
        hexagon.init(this.gameManager, this.svgElement);
        hexagon.setColor('e');
        hexagon.setOpacity(0.75);
        this.center = <Point>[100, 50];
        hexagon.setRotation(30);

        this.textElement = this.svgElement.append('text')
            .attr({
                'class': 'finished-display-text',
                'x': 5,
                'y': 215,
                'text-align': 'left'
            })
            .text('Game Over');
        this.setPosition(<Point>[350 - this.hexagonGeometry.halfRectWidth, 280 - this.hexagonGeometry.halfRectHeight], 0);
    }

    public onMessage(message: GameMessage): void {
        switch (message.type) {
            case 'game-finished':
                this.remove(); // bring the element to front by removing and adding again
                this.init(this.gameManager, this.renderingContext);
                this.setOpacity(1, 1000);
                break;
            case 'game-reset':
                this.setOpacity(0, 500);
                break;
        }
    }
}
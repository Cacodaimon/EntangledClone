/**
 * Displays the current score on the screen.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class ScoreDisplay extends SVGGameObject {
    /**
     * The SVG text element selection.
     */
    protected textElement: D3.Selection;

    /**
     * The background SVG rect selection.
     */
    protected rectElement: D3.Selection;

    /**
     * The players score.
     */
    protected score: number = 0;

    constructor () {
        super();
        this.tag = 'score-display';
    }

    public init (gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);

        this.setPosition(<Point>[-5, 25]);

        this.textElement = this.svgElement.append('text')
            .attr({
                'class': 'score-display-text',
                'x': 10,
                'y': 20
            });

        this.setScore(0);
    }

    public onMessage(message: GameMessage): void {
        switch (message.type) {
            case 'score-changed':
                this.setScore(message.payload);
                break;
            case 'increase-score':
                this.setScore(this.score + message.payload);
                break;
            case 'game-reset':
                this.setScore(0);
                break;
        }
    }

    /**
     * Set the score.
     *
     * @param score The players score.
     * @see https://github.com/mbostock/d3/wiki/Transitions#user-content-tween
     */
    private setScore(score: number) {
        var i = d3.interpolateRound(this.score * 100, score * 100);

        this.textElement.transition()
            .transition()
            .duration(1000)
            .ease('exp')
            .tween('text', function() { return function(t: number) { this.textContent = i(t); }; });
        this.score = score;
    }
}
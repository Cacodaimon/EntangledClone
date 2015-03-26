/**
 * A simple SVG hexagon as game object.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class Hexagon extends SVGGameObject {
    /**
     * A D3.js line generator.
     */
    protected line: (path: Array<Point>) => string;

    /**
     * SVG element/selection for the hexagon path.
     */
    protected svgElementHexagon: D3.Selection;

    /**
     * The row and column position on the tile map.
     */
    protected mapPosition: Point;

    /**
     * Hexagon geometry used for drawing.
     */
    protected hexagonGeometry: HexagonGeometry;

    /**
     * Hexagon css color class postfix.
     */
    protected color: string;

    /**
     * Constructor.
     *
     * @param hexagonGeometry The geometry used for drawing hte hexagon.
     * @param position The optional hexagon position.
     */
    constructor(hexagonGeometry: HexagonGeometry, position: Point = <Point>[0, 0]) {
        super();
        this.hexagonGeometry  = hexagonGeometry;
        this.line             = d3.svg.line().interpolate('linear');
        this.tag              = 'hexagon';
        this.position         = position;
        this.mapPosition      = <Point>[0, 0];
        this.center           = <Point>[hexagonGeometry.halfRectWidth, hexagonGeometry.halfRectHeight];
    }

    public init(gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);

        this.svgElementHexagon = this.svgElement.append('path')
            .attr('class', 'hexagon')
            .attr('d', this.line(this.hexagonGeometry.path));
    }

    /**
     * Sets the position on the hexagon tile map.
     *
     * @param position The row/column based position.
     * @param duration An optional transition duration in milliseconds.
     * @param delay An optional transition delay in milliseconds.
     */
    public setMapPosition(position: Point, duration?: number, delay?: number) {
        this.mapPosition = position;
        this.setPosition(this.hexagonGeometry.getPositionOnMap(position[0], position[1]), duration, delay);
    }

    /**
     * Gets the position on the tile map.
     *
     * @return {Point}
     */
    public getMapPosition(): Point {
        return this.mapPosition;
    }

    /**
     * Sets the hexagon background color.
     *
     * @param color The color class postfix, which is defined in the css file.
     */
    public setColor(color: string): void {
        this.color = color;
        this.svgElementHexagon.attr('class', 'hexagon hexagon-color-' + color);
    }

    /**
     * Gets the hexagon background color.
     *
     * @return {string} The hexagon css color class postfix.
     */
    public getColor(): string {
        return this.color;
    }
}
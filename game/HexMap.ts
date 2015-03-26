/**
 * Displays a map of hexagons on the screen.
 * THe map is stored as tle based map.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class HexMap extends SVGGameObject {
    /**
     * TIle number to color code mapping.
     */
    private static colorCodes: Array<string> = ['', 'a', 'b', 'c', 'd', 'e'];

    /**
     * Creates a new hexagon map.
     *
     * @param hexagonGeometry Hexagon geometry instance to use for placing the hexagons.
     * @param hexMap Sets the tile map or uses the default one.
     */
    constructor(public hexagonGeometry: HexagonGeometry, public hexMap?: Array<Array<number>>) {
        super();
        this.tag = 'map';

        if (typeof this.hexMap === 'undefined') {
            this.hexMap = [
                [0, 0, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 1, 2, 2, 2, 2, 1, 0],
                [0, 1, 2, 2, 2, 2, 2, 1, 0],
                [0, 1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 1, 2, 2, 2, 1],
                [0, 1, 2, 2, 2, 2, 2, 2, 1],
                [0, 1, 2, 2, 2, 2, 2, 1, 0],
                [0, 0, 1, 2, 2, 2, 2, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 0, 0],
            ];
        }
    }

    public init(gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection) {
        super.init(gameManager, renderingContext);
        var middlePoint: Point = this.hexagonGeometry.getPositionOnMap(this.hexMap.length / 2, this.hexMap[0].length / 2);

        var transitionSpeed: number = 2500;
        for (var row = this.hexMap.length - 1; row >= 0; row--) {
            for (var column = this.hexMap.length - 1; column >= 0; column--) {
                var tile = this.hexMap[row][column];

                if (tile === 0) {
                    continue;
                }

                var position: Point = this.hexagonGeometry.getPositionOnMap(row, column);

                var hexagon = new Hexagon(this.hexagonGeometry, middlePoint);
                hexagon.init(gameManager, this.svgElement);
                hexagon.setPosition(position, transitionSpeed, 0, 'elastic');
                hexagon.setColor(HexMap.colorCodes[tile]);
            }
        }

        var that = this;
        window.setTimeout(function() {
            that.gameManager.sendMessage(new GameMessageToTag('game-logic', 'map-animated', that.getId()));
        }, transitionSpeed);
    }

    /**
     * Returns the tile identifier hat the given position.
     *
     * @param row The map's row.
     * @param column The map's column.
     * @return The the tile identifier.
     */
    public getTile(row: number, column: number): number {
        return this.hexMap[row][column];
    }

    /**
     * Gets the map size as point.
     *
     * @return The size as point, the first element is the width and the second the height.
     */
    public getSize(): Point {
        return <Point>[this.hexMap.length, this.hexMap[0].length];
    }

    /**
     * Creates a new empty map with the same dimensions of the current map.
     *
     * @return A two dimensional array initialized with nulls.
     */
    public getEmptyMap<T>(): Array<Array<T>> {
        var dimension: Point = this.getSize();

        var map: Array<Array<T>> = Array(dimension[1]);
        for (var row: number = 0; row < dimension[1]; row++) {
            map[row] = [];
            for (var column: number = 0; column < dimension[0]; column++) {
                map[row][column] = null;
            }
        }

        return map;
    }
}
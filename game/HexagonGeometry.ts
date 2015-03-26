/**
 * Calculates and stores the hexagonal geometry.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 * @see http://www.gamedev.net/page/resources/_/technical/game-programming/coordinates-in-hexagon-based-tile-maps-r1800
 */
class HexagonGeometry {
    /**
     * The hexagon side length.
     */
    public sideLength: number = 0.0;

    /**
     * The height.
     *
     * @link http://uploads.gamedev.net/monthly_04_2011/ccs-8549-0-50213000-1303302089_thumb.gif
     */
    public height: number = 0.0;

    /**
     * The distance.
     *
     * @link http://uploads.gamedev.net/monthly_04_2011/ccs-8549-0-50213000-1303302089_thumb.gif
     */
    public distance: number = 0.0;

    /**
     * The surrounding rectangle height.
     */
    public rectHeight: number = 0.0;

    /**
     * The surrounding rectangle width.
     */
    public rectWidth: number = 0.0;

    /**
     * The surrounding rectangle half height.
     */
    public halfRectHeight: number = 0.0;

    /**
     * The surrounding rectangle half width.
     */
    public halfRectWidth: number = 0.0;

    /**
     * A list of all points defining the hexagon path.
     */
    public path: Array<Point> = null;

    /**
     * Creates a new instance with the given hexagon side length.
     *
     * @param sideLength The hexagon side length, default is ten pixel.
     */
    constructor(sideLength?: number) {
        this.calculate(sideLength);
    }

    /**
     * Recalculates the geometry vars using the given side length.
     *
     * @param sideLength The hexagon side length, default is ten pixel.
     */
    public calculate(sideLength: number = 10.0): void {
        var thirtyDegree = 30.0 * (Math.PI / 180.0);

        this.sideLength     = sideLength;
        this.height         = Math.sin(thirtyDegree) * this.sideLength;
        this.distance       = Math.cos(thirtyDegree) * this.sideLength;
        this.rectHeight     = sideLength + 2.0 * this.height;
        this.rectWidth      = 2.0 * this.distance;
        this.halfRectHeight = this.rectHeight / 2.0;
        this.halfRectWidth  = this.distance;

        this.path = [ // clockwise
            [this.distance,  0.0],                           // top-middle
            [this.rectWidth, this.height],                   // top-right
            [this.rectWidth, this.rectHeight - this.height], // bottom-right
            [this.distance,  this.rectHeight],               // bottom-middle
            [0.0,            this.rectHeight - this.height], // bottom-left
            [0.0,            this.height],                   // top-left
            [this.distance,  0.0],                           // top-middle
        ];
    }

    /**
     * Converts tile based map coordinates to pixel coordinates.
     *
     * @param row The map row.
     * @param column The map column.
     * @return {Point} The pixel coordinate point.
     * @link http://www.gamedev.net/page/resources/_/technical/game-programming/coordinates-in-hexagon-based-tile-maps-r1800
     */
    public getPositionOnMap(row: number, column: number): Point {
        if (row % 2 === 0) { // even or odd check
            return <Point>[
                column * this.rectWidth + this.distance,
                row * (this.height + this.sideLength)
            ];
        }

        return <Point>[
            column * this.rectWidth,
            row * (this.height + this.sideLength)
        ];
    }

    /**
     * Calculates the point on the map which is next to the given point matching the given side.
     *
     * @param row The map position row.
     * @param column The map position column.
     * @param side The relative side, a value between 0 and 5.
     * @return {Point} The point on the tile map.
     */
    public getNextPositionBySide(row: number, column: number, side: number): Point {
        var even: boolean = row % 2 === 0;

        switch (side) { // clockwise
            case 0: // top right
                return <Point>[row - 1, column + (even ? 1 : 0)];
            case 1: // middle right
                return <Point>[row, column + 1];
            case 2: // bottom right
                return <Point>[row + 1, column + (even ? 1 : 0)];
            case 3: // bottom left
                return <Point>[row + 1, column + (even ? 0 : -1)];
            case 4: // middle left
                return <Point>[row, column - 1];
            case 5: // top left
                return <Point>[row - 1, column + (even ? 0 : -1)];
            default:
                throw 'Invalid side: \'' + side + '\' given!';
         }
    }
}
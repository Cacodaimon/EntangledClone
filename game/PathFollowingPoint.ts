/**
 * Internal class used by PathFollowingPoint.
 * Stores a entangled hexagon with a path start point and it's previous hexagon in the path.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class HexagonWithStartPoint {

    /**
     * Creates a new path list entry.
     *
     * @param entangledHexagon The assigned hexagon.
     * @param startPoint The line start point.
     * @param previous A optional previous hexagon.
     */
    constructor (public entangledHexagon: EntangledHexagon, public startPoint: number, public previous?: HexagonWithStartPoint) {
    }

    /**
     * Gets the path length.
     *
     * @returns The path length.
     */
    public getLength(): number {
        return this.getLengthRecursive(this);
    }

    /**
     * Calculates the path length by walking through all previous hexagons.
     *
     * @param hexagon The current hexagon.
     * @returns The path length, relative to the provided hexagon.
     */
    protected getLengthRecursive(hexagon: HexagonWithStartPoint): number {
        if (!hexagon.previous) {
            return 0;
        }

        return this.getLengthRecursive(hexagon.previous) + 1;
    }
}

/**
 * A game object which allows to animate a point which follows a path.
 * The path gets created from the added entangled hexagons.
 */
class PathFollowingPoint extends SVGGameObject {
    /**
     * The resolution of the path (number of points).
     */
    private static PATH_RESOLUTION: number = 25;

    /**
     * The last added element.
     */
    protected currentElement: HexagonWithStartPoint = null;

    constructor () {
        super();
        this.tag = 'line-following-point';
    }

    public init(gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);
    }

    /**
     * Starts the animation process.
     */
    public start (): void {
        this.remove(); // bring the element to front by removing and adding again
        this.init(this.gameManager, this.renderingContext);

        if (this.currentElement !== null) {
            var combinedPath: Array<Point> = [];

            this.follow(this.currentElement, combinedPath);
            var lineGen = d3.svg.line().interpolate('linear');
            var pathD3 = this.svgElement.append('path')
                .attr('class', 'invisible')
                .attr('d', lineGen(combinedPath));

            var path = <SVGPathElement>pathD3.node();
            var length: number = path.getTotalLength();

            this.svgElement
                .append('circle')
                .attr('r', 4).transition()
                .duration(500 * (this.currentElement.getLength() + 1))
                .ease('linear')
                .attrTween('transform', function () {
                                           return function (t: number) {
                                               var p: SVGPoint = path.getPointAtLength(t * length);
                                               return 'translate(' + p.x + ',' + p.y + ')';
                                           };
                                       });
        }
    }

    /**
     * Adds a new hexagon to the path.
     *
     * @param hexagon The hexagon which path the point has to follow.
     * @param startPoint The entry connection point for choosing the rigt path from the hexagon.
     */
    public add (hexagon: EntangledHexagon, startPoint: number): void {
        if (this.currentElement === null) {
            this.currentElement = new HexagonWithStartPoint(hexagon, startPoint);
            return;
        }

        this.currentElement = new HexagonWithStartPoint(hexagon, startPoint, this.currentElement);
    }

    /**
     * Resets the path for reusing the instance.
     */
    public reset (): void {
        this.currentElement = null;
    }

    /**
     * Walks linked list of hexagons down to it's root
     * and creates a list of points the point can follow by combining the single entangled line paths.
     *
     * @param hexagon The current linked list hexagon element.
     * @param combinedPath The combined path
     */
    protected follow (hexagon: HexagonWithStartPoint, combinedPath: Array<Point>): void {
        if (hexagon.previous) {
            this.follow(hexagon.previous, combinedPath);
        }

        var entangledHexagon = hexagon.entangledHexagon;
        var line: Line = entangledHexagon.renameMeGetLineByPoint(hexagon.startPoint);
        var rotation: number = entangledHexagon.getRotation();
        var center: Point = entangledHexagon.getCentroid();
        var position: Point = entangledHexagon.getPosition();

        var pointList: Array<Point> = this.pathToPointList(<SVGPathElement>line.svgLine.node(), rotation, center, position);

        if (hexagon.startPoint !== line.start) {
            pointList.reverse();
        }

        for (var i: number = 0; i < PathFollowingPoint.PATH_RESOLUTION; i++) {
            combinedPath.push(pointList[i]);
        }
    }

    /**
     * Creates a list of points from a given SVG path.
     * The position and rotation gets used for for builing a path relative to the screen.
     *
     * @param path THe SVG path element.
     * @param rotation The path's rotation.
     * @param centroid The path's hexagon centroid.
     * @param position THe path's hexagon position.
     * @returns A list of Points.
     */
    protected pathToPointList(path: SVGPathElement, rotation: number, centroid: Point, position: Point): Array<Point> {
        var length: number = path.getTotalLength();
        var pointList: Array<Point> = [];
        var degToRad: number = Math.PI / 180.0;

        for (var i: number = 0; i < PathFollowingPoint.PATH_RESOLUTION; i++) {
            var originalPoint: SVGPoint = path.getPointAtLength((i / PathFollowingPoint.PATH_RESOLUTION) * length);
            var point: Point = <Point>[originalPoint.x, originalPoint.y];
            point = Utils.rotateAround(point, centroid, rotation * degToRad);
            point[0] += position[0];
            point[1] += position[1];

            pointList.push(point);
        }

        return pointList;
    }
}
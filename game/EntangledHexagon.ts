/**
 * This class represents a hexagon with entangled lines.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class EntangledHexagon extends Hexagon {
    /**
     * This D3.js line generator generates the entangled line paths..
     */
    protected entangledLine: (path: Array<Point>) => string;

    /**
     * The random number pool is used for building the six entangled lines.
     */
    protected randomNumberPool: RandomNumberPool;

    /**
     * Stores the line stats for each line.
     */
    protected connectionPoints: Array<LineState>;

    /**
     * The list of lines.
     */
    protected lines: Array<Line> = [];

    /**
     * Constructor.
     *
     * @param hexagonGeometry The geometry used for drawing hte hexagon.
     * @param position The optional hexagon position.
     * @param randomNumberPool THe random number pool used for generating some randomly connected lines.
     */
    constructor(hexagonGeometry: EntangledHexagonGeometry, position: Point, randomNumberPool: RandomNumberPool) {
        super(hexagonGeometry, position);
        this.entangledLine    = d3.svg.line().interpolate('basis');
        this.randomNumberPool = randomNumberPool;
        var lS: LineState     = LineState.INACTIVE;
        this.connectionPoints = [lS, lS, lS, lS, lS, lS, lS, lS, lS, lS, lS, lS];
    }

    public init(gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);

        this.randomNumberPool.reset();
        for (var i: number = 0; i < 6; i++) {
            var start: number = this.randomNumberPool.getNumber();
            var end: number   = this.randomNumberPool.getNumber();

            this.addEntangledLine(start, end);
        }
    }

    /**
     * Rotates the hexagon left by 60 degree.
     */
    public rotateLeft() {
        this.setRotation(this.getRotation() - 60);
        this.updateConnections();
    }

    /**
     * Rotates the hexagon right by 60 degree.
     */
    public rotateRight() {
        this.setRotation(this.getRotation() + 60);
        this.updateConnections();
    }

    /**
     * Sets the connection state for the given connection point to the provided state.
     *
     * @param connectionPoint The point to set, points  a arranged clockwise.
     * @param state The target state.
     */
    public setConnection(connectionPoint: number, state: LineState): void {
        this.connectionPoints[connectionPoint] = state;
        this.updateConnections();
    }

    /**
     * Gets the exit point for the given point.
     *
     * @param point The point to check, this can be a start or exit point.
     * @returns THe exit point identifier, points a arranged clockwise.
     */
    public getExitPoint(point: number): number {
        var normalizedRotationSide: number = this.getNormalizedRotationSide();
        var line: Line = this.getLineByPoint(point, normalizedRotationSide);

        if (line === null) {
            return -1;
        }

        return (line.getExit(this.rotatePoint(point, normalizedRotationSide)) + normalizedRotationSide) % 12;
    }

    /**
     * Changes the state for all lines matching the from state to the target state.
     *
     * @param from The origin state to match.
     * @param to Th target state.
     */
    public changeLineState(from: LineState, to: LineState) {
        for (var connectionPoint: number = 0; connectionPoint < 12; connectionPoint++) {
            if (this.connectionPoints[connectionPoint] === from) {
                this.connectionPoints[connectionPoint] = to;
            }
        }

        for (var i: number = 0; i < 6; i++) {
            if (this.lines[i].lineState === from) {
                this.lines[i].mark(to);
            }
        }
    }

    /**
     * Updates all line states after a rotation or a specific state change.
     */
    protected updateConnections(): void {
        for (var i: number = 0; i < 6; i++) {
            this.lines[i].mark(LineState.INACTIVE);
        }

        var normalizedRotationSide: number = this.getNormalizedRotationSide();
        for (var connectionPoint: number = 0; connectionPoint < 12; connectionPoint++) {
            if (this.connectionPoints[connectionPoint] === LineState.INACTIVE) {
                continue;
            }

            var rotatedPoint: number = this.rotatePoint(connectionPoint, normalizedRotationSide);
            for (var line: number = 0; line < 6; line++) {
                if (this.lines[line].matches(rotatedPoint)) {
                    this.lines[line].mark(this.connectionPoints[connectionPoint]);
                }
            }
        }
    }

    /**
     * Returns a copy of the Line matching the given point.
     * The line's start and end points a rotated against the current hexagon rotation.
     *
     *
     * @param point The point to match against, this can be a start or end point.
     * @returns A copied line.
     */
    public renameMeGetLineByPoint(point: number): Line {
        var normalizedRotationSide: number = this.getNormalizedRotationSide();
        var line: Line = this.getLineByPoint(point, normalizedRotationSide);

        var start: number = (line.start + normalizedRotationSide) % 12;
        var end: number = (line.end + normalizedRotationSide) % 12;

        return new Line(start, end, line.svgLine, line.lineState);
    }

    /**
     * Searches the line matching the provided connection point.
     *
     * @param point The connection point, a start or end point.
     * @param normalizedRotationSide The rotation side is used for finding the point after the hexagon has been rotated.
     * @returns The matching line or null.
     */
    protected getLineByPoint(point: number, normalizedRotationSide: number): Line {
        var rotatedPoint: number = this.rotatePoint(point, normalizedRotationSide);

        for (var i: number = 0; i < 6; i++) {
            var line = this.lines[i];

            if (line.matches(rotatedPoint)) {
                return line;
            }
        }

        return null;
    }

    /**
     * Rotates and normalizes the point using the provided rotation translated as rotation side.
     *
     * @param point The point to rotate.
     * @param normalizedRotationSide The rotation side.
     * @returns A rotated conection point.
     */
    protected rotatePoint(point: number, normalizedRotationSide: number): number {
        var rotatedPoint: number = (point - normalizedRotationSide) % 12;

        return rotatedPoint < 0 ? rotatedPoint + 12 : rotatedPoint;
    }

    /**
     * Converts the current normalized rotation to a rotation side.
     *
     * @returns THe normalized rotation side.
     */
    protected getNormalizedRotationSide(): number {
        return Utils.nomalizeRotation(this.rotation) / 30;
    }

    /**
     * Adds a entangled line to the hexagon SVG.
     *
     * @param start The line start connection point.
     * @param end The line end connection point.
     */
    private addEntangledLine(start: number, end: number): void {
        var hexagonGeometry = <EntangledHexagonGeometry> this.hexagonGeometry;

        var line: string = this.entangledLine([
            hexagonGeometry.connectionPoints[start],
            hexagonGeometry.helperPoints[start],
            [hexagonGeometry.halfRectWidth, hexagonGeometry.halfRectHeight],
            hexagonGeometry.helperPoints[end],
            hexagonGeometry.connectionPoints[end],
        ]);

        this.svgElement.append('path')
            .attr('class', 'line-border')
            .attr('d', line);

        var svgLine: D3.Selection = this.svgElement.append('path')
            .attr('class', 'line-inactive')
            .attr('d', line);

        this.lines.push(new Line(start, end, svgLine));
    }
}
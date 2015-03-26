/**
 * Line state enum.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
enum LineState {
    INACTIVE, ACTIVE, PREVIEW
}

/**
 * Defines a line drawn in a entangled hexagon.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class Line {
    /**
     * Creates a new line defined by a start and end point, a SVG path and the lin state.
     *
     * @param start The start point.
     * @param end The end point.
     * @param svgLine The SVG path.
     * @param lineState The line state.
     */
    constructor(public start: number, public end: number, public svgLine: D3.Selection, public lineState: LineState = LineState.INACTIVE) {
    }

    /**
     * Checks if the provided connection point equals the line'S start or the end point.
     *
     * @param connectionPoint THe point to check.
     * @returns {boolean} True if the point matches, otherwise false.
     */
    public matches(connectionPoint: number): boolean {
        return this.start === connectionPoint || this.end === connectionPoint;
    }

    /**
     * Sets the given line state.
     *
     * @param lineState The target line state.
     */
    public mark(lineState: LineState = LineState.ACTIVE): void {
        this.lineState = lineState;
        this.svgLine.classed({
            'line-inactive': lineState === LineState.INACTIVE,
            'line-active':   lineState === LineState.ACTIVE,
            'line-preview':  lineState === LineState.PREVIEW
        });
    }

    /**
     * Gets the line's exit point.
     *
     * @param point The point to check.
     * @returns {number} The matching exit point, if the point is not defined in the line the start point gets returned.
     */
    public getExit(point: number): number {
        return this.start === point ? this.end : this.start;
    }
}
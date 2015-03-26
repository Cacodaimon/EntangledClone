/**
 * Extended hexagon geometry which contains connection point geometry information.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class EntangledHexagonGeometry extends HexagonGeometry {
    /**
     * A list of connection point positions.
     */
    public connectionPoints: Array<Point> = null;

    /**
     * Helper points a used for aligning the entangled lines,
     * each connection point has one helper point.
     */
    public helperPoints: Array<Point> = null;

    /**
     * Creates a new instance with the given hexagon side length.
     *
     * @param sideLength The hexagon side length, default is ten pixel.
     */
    constructor(sideLength?: number) {
        super(sideLength);
        this.calculate(sideLength);
    }

    /**
     * Recalculates the geometry vars using the given side length.
     *
     * @param sideLength The hexagon side length, default is ten pixel.
     */
    public calculate(sideLength?: number): void {
        super.calculate(sideLength);
        this.calculateConnectionsPoints();
        this.calculateHelperPoints();
    }

    /**
     * Calculates the connection points using the sine rule.
     */
    protected calculateConnectionsPoints(): void {
        var sideLengthQuater      = this.sideLength / 4.0;
        var sideLengthThreeQuarter = sideLengthQuater * 3.0;
        var pY   = sideLengthQuater / 2.0;
        var pX   = (Math.sqrt(3) * sideLengthQuater) / 2.0;
        var pY2  = sideLengthThreeQuarter / 2.0;
        var pX2  = (Math.sqrt(3) * sideLengthThreeQuarter) / 2.0;
        var pY3  = sideLengthQuater + this.height;
        var pX3  = 0.0;

        this.connectionPoints = [ // clockwise
            [this.rectWidth - pX2, this.height - pY2 ],                  // top-right-a
            [this.rectWidth - pX,  this.height - pY ],                   // top-right-b
            [pX3 + this.rectWidth, pY3 ],                                // middle-right-a
            [pX3 + this.rectWidth, this.rectHeight - pY3 ],              // middle-right-b
            [this.rectWidth - pX,  pY + this.rectHeight - this.height],  // bottom-right-a
            [this.rectWidth - pX2, pY2 + this.rectHeight - this.height], // bottom-right-b
            [pX2,                  pY2 + this.rectHeight - this.height], // bottom-left-a
            [pX,                   pY + this.rectHeight - this.height],  // bottom-left-b
            [pX3,                  this.rectHeight - pY3 ],              // middle-left-a
            [pX3,                  pY3 ],                                // middle-left-b
            [pX,                   this.height - pY ],                   // top-left-a
            [pX2,                  this.height - pY2 ],                  // top-left-b
          ];
    }

    /**
     * Calculates the helper points needed for aligning te entangled lines.
     * New points are created by rotating the hexagon edge point around the connection point
     * by 90 or 270 degree towards the hexagon center.
     */
    protected calculateHelperPoints(): void {
        var twoHundredSeventyDegree = 270.0 * (Math.PI / 180.0);
        var ninetyDegree            =  90.0 * (Math.PI / 180.0);

        this.helperPoints = [ // clockwise
            Utils.rotateAround(this.path[0], this.connectionPoints[0],  twoHundredSeventyDegree),
            Utils.rotateAround(this.path[1], this.connectionPoints[1],  ninetyDegree),
            Utils.rotateAround(this.path[1], this.connectionPoints[2],  twoHundredSeventyDegree),
            Utils.rotateAround(this.path[2], this.connectionPoints[3],  ninetyDegree),
            Utils.rotateAround(this.path[2], this.connectionPoints[4],  twoHundredSeventyDegree),
            Utils.rotateAround(this.path[3], this.connectionPoints[5],  ninetyDegree),
            Utils.rotateAround(this.path[3], this.connectionPoints[6],  twoHundredSeventyDegree),
            Utils.rotateAround(this.path[4], this.connectionPoints[7],  ninetyDegree),
            Utils.rotateAround(this.path[4], this.connectionPoints[8],  twoHundredSeventyDegree),
            Utils.rotateAround(this.path[5], this.connectionPoints[9],  ninetyDegree),
            Utils.rotateAround(this.path[5], this.connectionPoints[10], twoHundredSeventyDegree),
            Utils.rotateAround(this.path[6], this.connectionPoints[11], ninetyDegree),
        ];
    }
}
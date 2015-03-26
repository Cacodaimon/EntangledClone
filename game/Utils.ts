/**
 * A general util method collection.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class Utils {
    /**
     * Rotates a point around another point with the given angle.
     *
     * @param point The point to rotate.
     * @param around The point to rotate around,
     * @param angle THe rotation angle in rad.
     * @returns {Point} The rotated point.
     */
    public static rotateAround(point: Point, around: Point, angle: number): Point {
        var sinAngle: number = Math.sin(angle);
        var cosAngle: number = Math.cos(angle);

        return <Point>[
            cosAngle * (point[0] - around[0]) - sinAngle * (point[1] - around[1]) + around[0],
            sinAngle * (point[0] - around[0]) + cosAngle * (point[1] - around[1]) + around[1]
        ];
    }

    /**
     * Normalizes the provided rotation in degree.
     *
     * @param angle The rotation angle in degree.
     * @returns THe normalized rotation,
     */
    public static nomalizeRotation(angle: number): number {
        while (angle >= 360) {
            angle -= 360;
        }

        while (angle < 0) {
            angle += 360;
        }

        return angle;
    }
}
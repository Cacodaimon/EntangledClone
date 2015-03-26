/**
 * A game object which is based on a SVG element.
 * The element's rotation, scale, position and opacity can be changed independently.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class SVGGameObject extends GameObject<D3.Selection> {
    /**
     * The D3.js selection of the SVG group used for translating the element.
     */
    protected svgElementPositionGroup: D3.Selection;

    /**
     * The D3.js selection of the SVG group used for rotating the element.
     */
    protected svgElementRotationGroup: D3.Selection;

    /**
     * The D3.js selection of the SVG group used for scaling the element.
     */
    protected svgElementZoomGroup: D3.Selection;

    /**
     * The D3.js selection of the SVG group used for changing the element's opacity.
     */
    protected svgElementOpacityGroup: D3.Selection;

    /**
     * The D3.js selection which should be used by game objects that inherit from this class.
     */
    protected svgElement: D3.Selection;

    /**
     * The element's position.
     */
    protected position: Point = <Point>[0, 0];

    /**
     * The element's centroid used for proper rotating.
     */
    protected center: Point = <Point>[0, 0];

    /**
     * The element's rotation in degree.
     */
    protected rotation: number = 0;

    /**
     * The element's opacity.
     */
    protected opacity: number = 1.0;

    /**
     * The element's scale factor.
     */
    protected zoomFactor: number = 1.0;

    constructor () {
        super();
    }

    public init (gameManager: GameManager<D3.Selection>, renderingContext: D3.Selection): void {
        super.init(gameManager, renderingContext);

        this.svgElementPositionGroup = renderingContext
            .append('g')
            .attr('class', this.tag + '-position');

        this.svgElementRotationGroup = this.svgElementPositionGroup
            .append('g')
            .attr('class', this.tag + '-rotation');

        this.svgElementZoomGroup = this.svgElementRotationGroup
            .append('g')
            .attr('class', this.tag + '-zoom');

        this.svgElementOpacityGroup = this.svgElementZoomGroup
            .append('g')
            .attr('class', this.tag + '-opacity');

        this.svgElement = this.svgElementOpacityGroup.append('g')
            .attr('class', this.tag);
    }

    /**
     * Shifts the element to the target position.
     *
     * @param newPosition The target position.
     * @param duration A optional transition duration, if 0 is provided the element gets translated without a transition.
     * @param delay A optional transition delay.
     * @param ease The transition ease method, linear by default.
     * @link http://bl.ocks.org/hunzy/9929724
     */
    public setPosition (newPosition: Point, duration: number = 500, delay: number = 0, ease: string = 'cubic'): void {
        var oldPosition: Point = this.position;
        this.position = newPosition;

        if (duration === 0) {
            this.svgElementPositionGroup
                .attr('transform', 'translate(' + newPosition[0] + ',' + newPosition[1] + ')');

            return;
        }

        this.svgElementPositionGroup.transition()
            .duration(duration)
            .delay(delay)
            .ease(ease)
            .attrTween('transform', function () {
                           return d3.interpolateTransform(
                               'translate(' + oldPosition[0] + ',' + oldPosition[1] + ')',
                               'translate(' + newPosition[0] + ',' + newPosition[1] + ')'
                           );
                       });
    }

    /**
     * Gets the element'S position.
     *
     * @returns The position as point.
     */
    public getPosition(): Point {
        return this.position;
    }

    /**
     * Adds the given rotation in degree to the element's rotation.
     *
     * @param angle The rotation in degree.
     * @param duration A optional transition duration, if 0 is provided the element gets rotated without a transition.
     * @param delay A optional transition delay.
     * @param ease The transition ease method, cubic by default.
     * @link http://bl.ocks.org/hunzy/9929724
     */
    public setRotation (angle: number, duration: number = 250, delay: number = 0, ease: string = 'linear'): void {
        var rotationStart: number = this.rotation;
        this.rotation = angle;
        var rotationEnd: number = this.rotation;

        if (duration === 0) {
            this.svgElementRotationGroup.attr('transform', 'rotate(' + rotationEnd + ',' + this.center[0] + ',' + this.center[1] + ')');

            return;
        }

        var center = this.center;
        this.svgElementRotationGroup.transition()
            .delay(delay)
            .duration(duration)
            .ease(ease)
            .attrTween('transform', function () {
                           return d3.interpolateString( // interpolateTransform is ugly when rotating around centroid
                               'rotate(' + rotationStart + ',' + center[0] + ',' + center[1] + ')',
                               'rotate(' + rotationEnd + ',' + center[0] + ',' + center[1] + ')'
                           );
                       });
    }

    /**
     * Gets the element's rotation in degree.
     *
     * @return {number} The rotation in degree.
     */
    public getRotation(): number {
        return this.rotation;
    }

    /**
     * Scales the element.
     *
     * @param zoomFactor The scale factor in degree.
     * @param duration A optional transition duration, if 0 is provided the element gets scaled without a transition.
     * @param delay A optional transition delay.
     * @param ease The transition ease method, cubic by default.
     * @link http://bl.ocks.org/hunzy/9929724
     */
    public setZoom (zoomFactor: number, duration: number = 250, delay: number = 0, ease: string = 'cubic'): void {
        var zoomFactorStart: number = this.zoomFactor;
        var zoomFactorEnd: number = zoomFactor;

        if (duration === 0) {
            this.svgElementZoomGroup.attr('transform', 'scale(' + this.zoomFactor + ')');

            return;
        }

        this.svgElementZoomGroup.transition()
            .delay(delay)
            .duration(duration)
            .ease(ease)
            .attrTween('transform', function () {
                           return d3.interpolateString(
                               'scale(' + zoomFactorStart + ')',
                               'scale(' + zoomFactorEnd + ')'
                           );
                       });
    }

    /**
     * Changes the element's opacity.
     *
     * @param opacity The target opacity.
     * @param duration A optional transition duration, if 0 is provided the element's opacity will be changed without a transition.
     * @param delay A optional transition delay.
     * @param ease The transition ease method, cubic by default.
     * @link http://bl.ocks.org/hunzy/9929724
     */
    public setOpacity (opacity: number = 1, duration: number = 500, delay: number = 0, ease: string = 'cubic'): void {
        this.opacity = opacity;

        if (duration === 0) {
            this.svgElementOpacityGroup.attr('opacity', opacity);

            return;
        }

        this.svgElementOpacityGroup.transition()
            .delay(delay)
            .duration(duration)
            .ease(ease)
            .attr('opacity', opacity);
    }

    /**
     * Gets the element's centroid.
     *
     * @return {Point} The center point.
     */
    public getCentroid(): Point {
        return this.center;
    }

    /**
     * Removes the game objects root element from given SVG root.
     */
    public remove(): void {
        super.remove();
        this.svgElementPositionGroup.remove();
    }
}
/**
 * The game logic game object controls the whole game flow,
 * by reacting on events send by the keyboard for example.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class GameLogic extends SVGGameObject {
    /**
     * The hexagon which is controllable by the player.
     */
    protected activeHexagon: EntangledHexagon = null;

    /**
     * The hexagon which can be switched with the active one by he player.
     */
    protected spareHexagon: EntangledHexagon = null;

    /**
     * A hexagon indicating the next position after placing the active hexagon.
     */
    protected previewHexagon: Hexagon = null;

    /**
     * The geometry class used for drawing new hexagons.
     */
    protected entangledHexagonGeometry: EntangledHexagonGeometry = null;

    /**
     * This instance is used by all entangled hexagons.
     */
    protected randomNumberPool: RandomNumberPool = null;

    /**
     * All entangled hexagons placed by the player gets stored here, for fast search by the map position.
     */
    protected placedHexagons: Array<Array<EntangledHexagon>> = [];

    /**
     * This game object draws the map shown in the background.
     */
    protected hexMap: HexMap = null;

    /**
     * The connection point of the active hexagon.
     */
    protected activePoint: number = 0;

    /**
     * The score multiplier gets incremented by one for each path passed in one turn.
     */
    protected scoreMultiplier: number = 0;

    /**
     * Indicates if the game is finished.
     */
    protected finished: boolean = false;

    /**
     * Helper which animates the point following the path after one active hxagon has ben placed.
     */
    protected pathFollowingPoint: PathFollowingPoint;

    constructor() {
        super();
        this.tag                      = 'game-logic';
        this.activePoint              = 2;
        this.entangledHexagonGeometry = new EntangledHexagonGeometry(40);
        this.randomNumberPool         = new RandomNumberPool();
        this.hexMap                   = new HexMap(this.entangledHexagonGeometry);
        this.placedHexagons           = this.hexMap.getEmptyMap<EntangledHexagon>();
        this.scoreMultiplier          = 1;
    }

    public onMessage(message: GameMessage): void {
        switch (message.type) {
            case 'init':
                this.gameManager.addGameObject(this.hexMap, true, this.svgElement);
                break;
            case 'new-game':
                this.cleanUp();
                break;
            case 'map-animated':
                this.prepareStart();
                break;
            case 'rotate-left':
                if (!this.finished) {
                    this.activeHexagon.rotateLeft();
                    this.rotated();
                    this.gameManager.sendMessage(new GameMessageToAll('hexagon-rotated', this.getId()));
                }
                break;
            case 'rotate-right':
                if (!this.finished) {
                    this.activeHexagon.rotateRight();
                    this.rotated();
                    this.gameManager.sendMessage(new GameMessageToAll('hexagon-rotated', this.getId()));
                }
                break;
            case 'place':
                this.place();
                break;
            case 'switch':
                this.switchActiveWithSpare();
                break;
        }
    }

    /**
     * Updates al elements which possibly has ben affected by a rotation of the active hexagon.
     */
    protected rotated() {
        this.resetMapPreview();
        this.activeHexagon.setConnection(this.activePoint, LineState.PREVIEW);
        this.placePreviewHexagon(this.activeHexagon, this.activePoint);
    }

    /**
     * Places the active hexagon and continue with the new active hexagon or finish the game..
     */
    private place() {
        if (this.finished) {
            return;
        }

        this.pathFollowingPoint.reset();
        this.activeHexagon.setConnection(this.activePoint, LineState.ACTIVE);
        this.placeNextHexagon(this.activeHexagon, this.activePoint);
        this.placePreviewHexagon(this.activeHexagon, this.activePoint);
        this.pathFollowingPoint.start();
        this.gameManager.sendMessage(new GameMessageToAll('hexagon-placed', this.getId()));
    }

    /**
     * Searches recursive for the next active hexagon position or finishes the game if the map border was hit.
     *
     * @param hexagon The current hexagon to search for connected ones.
     * @param nextConnectionPoint The current hexagon's connection point.
     */
    protected placeNextHexagon(hexagon: EntangledHexagon, nextConnectionPoint: number): void {
        var exitPoint: number  = hexagon.getExitPoint(nextConnectionPoint);
        var exitSide: number   = Math.floor(exitPoint / 2);
        var mapPosition: Point = hexagon.getMapPosition();
        var previewPosition: Point  = this.entangledHexagonGeometry.getNextPositionBySide(mapPosition[0], mapPosition[1], exitSide);
        var hexagonAtPreviewPosition: EntangledHexagon = this.placedHexagons[previewPosition[0]][previewPosition[1]];
        var newConnectionPoint = this.exitPointToNewConnectionPoint(exitPoint);

        if (hexagonAtPreviewPosition === null || typeof hexagonAtPreviewPosition === 'undefined') {
            this.gameManager.sendMessage(new GameMessageToTag('score-display', 'increase-score', this.getId(), this.scoreMultiplier));
            this.scoreMultiplier = 1;

            this.pathFollowingPoint.add(<EntangledHexagon>hexagon, nextConnectionPoint);
            if (this.hexMap.getTile(this.previewHexagon.getMapPosition()[0], this.previewHexagon.getMapPosition()[1]) === 1) {
                this.finish();
                return;
            }

            this.addNewActiveHexagon(this.previewHexagon.getMapPosition(), newConnectionPoint);
            return;
        }

        hexagonAtPreviewPosition.setConnection(newConnectionPoint, LineState.ACTIVE);

        this.pathFollowingPoint.add(hexagon, nextConnectionPoint);
        this.placeNextHexagon(hexagonAtPreviewPosition, newConnectionPoint);
        this.scoreMultiplier++;
        this.gameManager.sendMessage(new GameMessageToTag('score-display', 'increase-score', this.getId(), this.scoreMultiplier));
    }

    /**
     * Searches recursive for the preview hexagon position and places it at this position.
     *
     * @param hexagon The current hexagon to search for connected ones.
     * @param nextConnectionPoint The current hexagon's connection point.
     */
    protected placePreviewHexagon(hexagon: EntangledHexagon, nextConnectionPoint: number): void {
        if (this.finished) {
            return;
        }

        var exitPoint: number  = hexagon.getExitPoint(nextConnectionPoint);
        var exitSide: number   = Math.floor(exitPoint / 2);
        var mapPosition: Point = hexagon.getMapPosition();
        var previewPosition: Point  = this.entangledHexagonGeometry.getNextPositionBySide(mapPosition[0], mapPosition[1], exitSide);
        var placedHexagon: EntangledHexagon = this.placedHexagons[previewPosition[0]][previewPosition[1]];
        var newConnectionPoint = this.exitPointToNewConnectionPoint(exitPoint);

        if (placedHexagon === null || typeof placedHexagon === 'undefined') {
            this.previewHexagon.setMapPosition(previewPosition, 500, 250);
            return;
        }

        placedHexagon.setConnection(newConnectionPoint, LineState.PREVIEW);
        this.placePreviewHexagon(placedHexagon, newConnectionPoint);
    }

    /**
     * Adds a new active hexagon at the given position.
     *
     * @param position The position of the new hexagon.
     * @param connectionPoint The active hexagon's connection point.
     */
    protected addNewActiveHexagon(position: Point, connectionPoint: number): void {
        if (this.activeHexagon !== null) {
            this.activeHexagon.setColor('d');
        }

        this.activeHexagon = new EntangledHexagon(
            this.entangledHexagonGeometry,
            this.entangledHexagonGeometry.getPositionOnMap(4, 4),
            this.randomNumberPool
        );
        this.gameManager.addGameObject(this.activeHexagon, true, this.svgElement);
        this.activeHexagon.setColor('c');
        this.activeHexagon.setMapPosition(position);
        this.activeHexagon.setConnection(connectionPoint, LineState.PREVIEW);
        this.activePoint = connectionPoint;
        this.placedHexagons[position[0]][position[1]] = this.activeHexagon;
    }

    /**
     * Switches the active hexagon with the player's spare hexagon.
     */
    protected switchActiveWithSpare(): void {
        if (this.finished) {
            return;
        }

        var activeHexagon: EntangledHexagon = this.activeHexagon;
        var spareHexagon: EntangledHexagon = this.spareHexagon;

        var tempMapPosition: Point = activeHexagon.getMapPosition();
        activeHexagon.setMapPosition(spareHexagon.getMapPosition());
        spareHexagon.setMapPosition(tempMapPosition);

        this.activeHexagon = spareHexagon;
        this.spareHexagon = activeHexagon;

        this.placedHexagons[tempMapPosition[0]][tempMapPosition[1]] = this.activeHexagon;

        this.spareHexagon.setColor('a');
        this.activeHexagon.setColor('c');
        this.spareHexagon.changeLineState(LineState.PREVIEW, LineState.INACTIVE);

        this.resetMapPreview();
        this.activeHexagon.setConnection(this.activePoint, LineState.PREVIEW);
        this.placePreviewHexagon(this.activeHexagon, this.activePoint);

        this.gameManager.sendMessage(new GameMessageToAll('hexagon-switched', this.getId()));
    }

    /**
     * Sets the line preview state from all placed hexagons.
     */
    protected resetMapPreview() {
        for (var x = 0; x < this.placedHexagons.length; x++) {
            var placedHexagonsX: Array<EntangledHexagon> = this.placedHexagons[x];
            for (var y = 0; y < placedHexagonsX.length; y++) {
                if (placedHexagonsX[y] === null) {
                    continue;
                }

                placedHexagonsX[y].changeLineState(LineState.PREVIEW, LineState.INACTIVE);
            }
        }
    }

    /**
     * Finishes the game.
     */
    protected finish() {
        if (this.finished) {
            return;
        }

        this.finished = true;
        this.gameManager.sendMessage(new GameMessageToAll('game-finished', this.getId()));
    }

    /**
     * Gets the sides opposite point.
     *
     * @param point The end connection point.
     * @return {number} The start connection point at the opposite side.
     */
    protected exitPointToNewConnectionPoint(point: number): number {
        var diagonalModifier: number = ((point + 1) % 2) === 0 ? 5 : 7;
        return (point + diagonalModifier) % 12;
    }

    /**
     * Prepares the start by adding all needed hexagons,
     * the active, the spare and the preview hexagon.
     */
    protected prepareStart(): void {
        this.addNewActiveHexagon(<Point>[4, 3], this.activePoint);

        this.spareHexagon = new EntangledHexagon(this.entangledHexagonGeometry, <Point>[100, 100], this.randomNumberPool);
        this.gameManager.addGameObject(this.spareHexagon, true, this.svgElement);
        this.spareHexagon.setColor('a');
        this.spareHexagon.setMapPosition(<Point>[0, 8], 0);
        this.spareHexagon.setOpacity(0, 0);
        this.spareHexagon.setOpacity(1, 1000);

        this.previewHexagon = new Hexagon(this.entangledHexagonGeometry);
        this.gameManager.addGameObject(this.previewHexagon, true, this.svgElement);
        this.previewHexagon.setOpacity(0.5, 0);
        this.previewHexagon.setColor('c');
        this.placePreviewHexagon(this.activeHexagon, this.activePoint);

        this.pathFollowingPoint = new PathFollowingPoint();
        this.gameManager.addGameObject(this.pathFollowingPoint, true, this.svgElement);
    }

    /**
     * Performs a cleanup before starting a new game.
     */
    protected cleanUp() {
        this.finished = false;

        for (var x = 0; x < this.placedHexagons.length; x++) {
            var placedHexagonsX: Array<EntangledHexagon> = this.placedHexagons[x];
            for (var y = 0; y < placedHexagonsX.length; y++) {
                if (placedHexagonsX[y] === null) {
                    continue;
                }

                placedHexagonsX[y].remove();
                placedHexagonsX[y] = null;
            }
        }

        this.activePoint = 2;

        this.gameManager.removeGameObject(this.spareHexagon);
        this.spareHexagon = null;

        this.gameManager.removeGameObject(this.previewHexagon);
        this.previewHexagon = null;

        this.gameManager.removeGameObject(this.pathFollowingPoint);
        this.pathFollowingPoint = null;

        this.gameManager.removeGameObject(this.hexMap);
        this.gameManager.addGameObject(this.hexMap, true, this.svgElement);

        this.gameManager.sendMessage(new GameMessageToAll('game-reset', this.getId()));
    }
}
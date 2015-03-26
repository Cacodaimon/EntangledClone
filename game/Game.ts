/// <reference path="../vendor/d3.d.ts" />

/**
 * The game screen.
 * @link http://www.w3.org/TR/SVG/images/coords/PreserveAspectRatio.svg
 */
var svg: D3.Selection = d3.select('#game-screen').append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)
    .attr('viewBox', '0 0 ' + 750 + ' ' + 600)
    .attr('preserveAspectRatio', 'xMidYMin');

window.addEventListener('resize', function() {
    svg.attr('width', window.innerWidth);
    svg.attr('height', window.innerHeight);
});

var gameManager = new GameManager<D3.Selection>();
gameManager.addGameObject(new GameLogic());
gameManager.addGameObject(new Keyboard());
gameManager.addGameObject(new TouchControl());
gameManager.addGameObject(new ScoreDisplay());
gameManager.addGameObject(new FinishedDisplay());
gameManager.addGameObject(new AudioPlayer());
gameManager.init(svg);
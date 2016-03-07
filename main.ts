/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private walls:Phaser.TilemapLayer;

    private ACCELERATION = 750;// pixels/second
    private MAX_SPEED = 250;// pixels/second/second
    private DRAG = 200;
    private map:Phaser.Tilemap;

    preload():void {
        super.preload();
        this.load.image('ufo', 'assets/UFO_low.png');
        this.load.image('pickup', 'assets/Pickup_low.png');

        this.game.load.tilemap('tilemap','assets/mapa.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Background_low.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    create():void {
        super.create();
        //var background;
        this.createWalls();//creando las paredes

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.ufo);//activando el physics en el objeto ufo
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG);//rozamiento

        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);// x,y
        this.cursor = this.input.keyboard.createCursorKeys();

        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.setTo(0.7);

    }

    update():void {
        super.update();
        this.setMovements();//setea los movimientos del teclado
        this.physics.arcade.collide(this.ufo, this.walls);//
    }

    private setMovements(){
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
        }else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
        }else{
            this.ufo.body.acceleration.x = 0;
            //this.ufo.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
        }else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
        }else{
            this.ufo.body.acceleration.y = 0;
            //this.ufo.body.velocity.y = 0;
        }
    }

    private createWalls(){
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('Background_low', 'tiles');

        var background = this.map.createLayer('piso');
        this.walls = this.map.createLayer('pared');
        this.map.setCollisionBetween(1, 100, true, 'pared');
    }


}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};

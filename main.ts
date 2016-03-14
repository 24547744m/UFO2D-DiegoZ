/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
class mainState extends Phaser.State {
    game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private walls:Phaser.TilemapLayer;

    private ACCELERATION = 1200;// pixels/second
    private MAX_SPEED = 400;// pixels/second/second
    private DRAG = 50;
    private map:Phaser.Tilemap;

    /******* pickups ******/
    private pickup:Phaser.Sprite;
    private pickups:Phaser.Group;

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
        this.cursor = this.input.keyboard.createCursorKeys();
        //var background;
        this.createWalls();//creando las paredes
        this.createUfo();//creando y seteando propiedades al UFO
        //this.createPickup();

        /** commit a revisar:  https://github.com/lawer/UFO2D/commit/56bcaef1766f92b7683a088e59d7fb2b03fe41aa
         *  09-03-16
         *  https://github.com/lawer/UFO2D/commit/c8149381120dcf5095acedb51cfac6ed3fcc0b34
         * */
        this.pickups = this.add.group();
        this.pickups.enableBody = true;
        this.createPickupObjects();
    }

    update():void {
        super.update();
        this.setMovements();//setea los movimientos del teclado
        this.physics.arcade.collide(this.ufo, this.walls);//
        //this.physics.arcade.collide(this.pickup, this.walls);//
        this.physics.arcade.overlap(this.ufo, this.pickups, this.getPickup, null, this)//al colisionar se ejecuta la funcion getPickup
        //this.ufo.angle += 30;
        //this.pickup.angle += 2;

    }

    private createPickup(){
        this.pickup = this.add.sprite(this.world.centerX + 50, this.world.centerY + 50, 'pickup');
        this.pickup.anchor.setTo(0.5, 0.5);//seteando el punto de referencia en el centro del objeto
        this.physics.enable(this.pickup);//activando el physics en pickup
        this.pickup.angle = 0;

    }

    private createUfo(){
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);
        //this.ufo.angle = 0;
        this.physics.enable(this.ufo);//activando el physics en el objeto ufo
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG);//rozamiento

        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);// x,y

        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.setTo(0.7);
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


    private createPickupObjects():void {
        var positions:Point[] = [
            new Point(300, 125), new Point(300, 475),
            new Point(125, 300), new Point(475, 300),
            new Point(175, 175), new Point(425, 175),
            new Point(175, 425), new Point(425, 425)
        ];

        for (var i = 0; i < positions.length; i++){
            var position = positions[i];
            var pickup = new PickupSprite(this.game, position.x, position.y, 'pickup');
            this.add.existing(pickup);
            this.pickups.add(pickup);
        }

    }//end method

    private getPickup(ufo: Phaser.Sprite, pickup:Phaser.Sprite){
        pickup.kill();
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

class PickupSprite extends Phaser.Sprite{

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);
        this.anchor.setTo(0.5, 0.5);
    }

    update():void {
        super.update();
        this.angle += 3;
    }

}

window.onload = () => {
    var game = new SimpleGame();
};

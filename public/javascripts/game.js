
const bootstrap = function() {

    class Player {
        constructor(name, sprite, x, y, w, h) {
            this.name = name;
            this.sprite = sprite;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.velocityX = 0;
            this.maximumVelocityX = 8;
            this.accelerationX = 2;
            this.frictionX = 0.9;

            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }

        animate(state) {
            if (state.keys[37]) { // left
                //this.x = Math.max(0, this.x - 5);
                this.velocityX = Math.max(this.velocityX - this.accelerationX, this.maximumVelocityX * -1);
            }

            if (state.keys[39]) { // right
                //this.x = Math.min(window.innerWidth - 64, this.x + 5);
                this.velocityX = Math.min(this.velocityX + this.accelerationX, this.maximumVelocityX);
            }

            //
            this.velocityX = this.velocityX * this.frictionX;

            // Collisions

            // 1. Circle Collision Detected between objects
            // const circleCollisionDetected = function(obj1, obj2) {

            //     if (obj1 === obj2) {
            //         return false;
            //     }

            //     var detected = false;

            //     var deltaX = obj1.x - obj2.x;
            //     var deltaY = obj1.y - obj2.y;

            //     var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            //     const objAtMyLeft = obj2.x <= obj1.x;
            //     const movingLeft = obj1.velocityX < 0;

            //     const objAtMyRight = obj2.x >= obj1.x;
            //     const movingRight = obj1.velocityX > 0;

            //     const myRadius = obj1.w / 2;
            //     const objRadius = obj2.w / 2;

            //     // Circles collide when the distance between their origins is less than their combined
            //     // radii. Their middle points are so close that their lines have to be overlapping.
            //     if ((distance < myRadius + objRadius)  &&
            //         ((movingLeft && objAtMyLeft)  ||
            //          (movingRight && objAtMyRight))) {
            //             detected = true;
            //     }

            //     return detected;
            // };

            // // Circle Collision Detected between THIS (the player) and an object
            // const curryCCD = (obj) => {
            //     return circleCollisionDetected(this, obj);
            // }

            // //let move = true;
            // // state.objects.forEach( obj => {
            // //     console.log(obj);
            // //     move = move && !circleCollisionDetected(this, obj);
            // // });
            // let move = state.objects.reduce((acum, obj) => { return acum && !curryCCD(obj) }, true);



            // 2. Detecting rectangle collisions
            // We call this axis-aligned bounding box collision detection (or AABB for short)
            const aabbCollisionDetected = function(obj1, obj2) {
                if (obj1 === obj2) {
                    return false;
                }

                var detected = false;

                const objAtMyLeft = obj2.x <= obj1.x;
                const movingLeft = obj1.velocityX < 0;

                const objAtMyRight = obj2.x >= obj1.x;
                const movingRight = obj1.velocityX > 0;

                if ((obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x &&
                     obj1.y < obj2.y + obj2.h && obj1.y + obj1.y + obj1.h > obj2.y) &&
                    ((movingLeft && objAtMyLeft)  ||
                     (movingRight && objAtMyRight))) {
                    detected = true
                }

                return detected;
            }

            // AABB Collision Detected between THIS (the player) and an object
            const curryAABBCD = (obj) => {
                return aabbCollisionDetected(this, obj);
            }
            let move = state.objects.reduce((acum, obj) => { return acum && !curryAABBCD(obj) }, true);

            if (move) {
                this.x = this.x + this.velocityX;
            }

            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
    }

    class Box {
        constructor(name, sprite, x, y, w, h) {
            this.name = name;
            this.sprite = sprite;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }

        animate(state) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
    }


    const renderer = new PIXI.autoDetectRenderer(
        window.innerWidth,
        window.innerHeight,
        {
            "antialias": true,
            "autoResize": true,
            "transparent": true,
            "resolution": 2
        });

    document.body.appendChild(renderer.view);

    // player
    const playerSprite = new PIXI.Sprite.fromImage("/images/player-idle.png");
    const player = new Player(
        "Player",
        playerSprite,
        window.innerWidth / 2,
        window.innerHeight / 2,
        44,
        56);

    // const objectsWidth = 60;
    // const objectsHeight = 60;

    // const blob1URL = "/images/blob-idle-1.png";
    // const blob2URL = "/images/blob-idle-2.png";

    // // blob1
    // const blob1Sprite = new PIXI.Sprite.fromImage(blob1URL);
    // const blob1 = new Player(
    //     "Blob1",
    //     blob1Sprite,
    //     (window.innerWidth / 2) - 150,
    //     (window.innerHeight / 2) - 35,
    //     objectsWidth,
    //     objectsHeight);

    // // blob2
    // const blob2Sprite = new PIXI.Sprite.fromImage(blob2URL);
    // const blob2 = new Player(
    //     "Blob2",
    //     blob2Sprite,
    //     (window.innerWidth / 2) + 150,
    //     (window.innerHeight / 2) + 35,
    //     objectsWidth,
    //     objectsHeight);

    const boxURL = "/images/box.png";
    const boxW = 44;
    const boxH = 44;

    const box1Sprite = new PIXI.Sprite.fromImage(boxURL);
    const box1 = new Player(
        "Box1",
        box1Sprite,
        (window.innerWidth / 2) - 150,
        (window.innerHeight / 2) - 35,
        boxW,
        boxH);

    const box2Sprite = new PIXI.Sprite.fromImage(boxURL);
    const box2 = new Player(
        "Box2",
        box2Sprite,
        (window.innerWidth / 2) + 150,
        (window.innerHeight / 2) + 35,
        boxW,
        boxH);

    // add sprites to scene
    const container = new PIXI.Container();
    container.addChild(playerSprite);
    // container.addChild(blob1Sprite);
    // container.addChild(blob2Sprite);
    container.addChild(box1Sprite);
    container.addChild(box2Sprite);


    //
    let state = {
        renderer: renderer,
        stage: container,
        keys: {},
        clicks: {},
        mouse: {},
        // objects: [  player,
        //             blob1,
        //             blob2 ],
        objects: [  player,
                    box1,
                    box2 ],
    }

    // EVENTS
    window.addEventListener("keydown", function(event) {
      state.keys[event.keyCode] = true
    })

    window.addEventListener("keyup", function(event) {
      state.keys[event.keyCode] = false
    })

    window.addEventListener("mousedown", function(event) {
      state.clicks[event.which] = {
        "clientX": event.clientX,
        "clientY": event.clientY,
      }
    })

    window.addEventListener("mouseup", function(event) {
      state.clicks[event.which] = false
    })

    window.addEventListener("mousemove", function(event) {
      state.mouse.clientX = event.clientX
      state.mouse.clientY = event.clientY
    })


    // Main loop
    const animate = function() {
        requestAnimationFrame(animate);

        player.animate(state);
        renderer.render(container);
    }

    animate();

}

$(bootstrap);


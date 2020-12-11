import React, { useEffect }  from 'react';
import AnimationCanvas from "../animation-canvas";
import Victor from 'victor';
import '../style/style.global.css';

const ROCKET_DEFAULT_SIZE = 40;
const ROCKET_PULSE_SPEED = 30;
const ROCKET_PULSE_AMPLITUDE = 10;
const ROCKET_MOVE_SPEED = 100;
const MINIMUM_MOVE_THRESHOLD = 1;

const alterCanvasContext = (ctx, alter) => {
    ctx.save();
    alter();
    ctx.restore();
}

const debugLine = (ctx, start, vector, color) => {
    alterCanvasContext(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(start.x + vector.x, start.y + vector.y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.stroke();
    })
}

class Rocket {
    constructor(defaultPos) {
        this.pos = defaultPos;
        this.target = defaultPos;
        this.rocketForward = new Victor(100, -100);

        this.img = new Image(ROCKET_DEFAULT_SIZE, ROCKET_DEFAULT_SIZE);
        this.img.src = 'assets/rocket.png';
    }

    _getMoveVector = () => {
        let m = new Victor(0, 0);
        m.copy(this.target);
        m.subtract(this.pos);
        return m;
    }

    _moveTowardsTarget = (deltaTime) => {
        let delta = this._getMoveVector();
        if (delta.lengthSq() > MINIMUM_MOVE_THRESHOLD) {
            let move = new Victor(0, 0);
            move.copy(delta);

            move.norm().multiply(new Victor(deltaTime * ROCKET_MOVE_SPEED, deltaTime * ROCKET_MOVE_SPEED));
            this.pos.add(move);

            this.currentRotation = this._getRotationForMovement();
        }
    }

    update = (deltaTime) => {
        this._moveTowardsTarget(deltaTime);
    }

    setTarget = (p) => {
        this.target = p;
    }

    _getRotationForMovement = () => {
        let move = this._getMoveVector();
        let f = this.rocketForward;
        let a = Math.atan2(move.y, move.x) - Math.atan2(f.y, f.x);
        if (a < 0) a += 2 * Math.PI;
        return a;
    }

    draw = (ctx, frameCount) => {
        const rocketSize = ROCKET_DEFAULT_SIZE + (Math.cos(frameCount / ROCKET_PULSE_SPEED) * ROCKET_PULSE_AMPLITUDE);

        alterCanvasContext(ctx, () => {
            const centerX = rocketSize / 2;
            const centerY = rocketSize / 2;

            ctx.translate(this.pos.x, this.pos.y);

            ctx.rotate(this.currentRotation);

            ctx.drawImage(this.img, -centerX, -centerY, rocketSize, rocketSize);
        });

        ctx.restore();
    }
}

class Background {
    constructor(width, height) {
        this.img = new Image(0, 0);
        this.img.src = 'assets/bg.jpg';

        this.width = width;
        this.height = height;
    }

    draw = (ctx, frameCount) => {
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }
}

const App = () => {
    let rocket;
    let background;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    useEffect(() => {
        rocket = new Rocket(new Victor(width / 2, height / 2));
        background = new Background(width, height);
    });

    const _mouseMove = (x, y) => {
        rocket?.setTarget(new Victor(x, y));
    }

    const _draw = (ctx, frameCount, deltaTime) => {
        rocket?.update(deltaTime);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        background?.draw(ctx, frameCount);
        rocket?.draw(ctx, frameCount);
    }

    return (
        <AnimationCanvas draw={_draw} width={width} height={height} mousemove={_mouseMove} />
    )
}

export default App;
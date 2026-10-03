(() => {
    if (window.__spinTrailLoaded) return;
    window.__spinTrailLoaded = true;

    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    /* ==============================
       TRAIL CANVAS
    ============================== */

    const trailCanvas = document.createElement("canvas");
    const trailCtx = trailCanvas.getContext("2d");

    trailCanvas.width = canvas.width;
    trailCanvas.height = canvas.height;

    trailCanvas.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 999998;
        margin: 0;
        padding: 0;
    `;

    document.body.appendChild(trailCanvas);


    /* ==============================
       SETTINGS
    ============================== */

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    const RADIUS = 180;

    /* সর্বোচ্চ 270° */
    const MAX_TRAIL = Math.PI * 1.5;

    /* বল থেকে gap */
    const TRAIL_GAP = 0.09;

    /*
     * সর্বোচ্চ trail segments।
     * কম রাখলে rendering load কমে।
     */
    const MAX_DRAW_SEGMENTS = 32;


    /* ==============================
       POSITION
    ============================== */

    function updatePosition() {

        const r =
            canvas.getBoundingClientRect();

        trailCanvas.style.left =
            r.left + "px";

        trailCanvas.style.top =
            r.top + "px";

        trailCanvas.style.width =
            r.width + "px";

        trailCanvas.style.height =
            r.height + "px";
    }


    /* ==============================
       ACTUAL BALL ANGLE
    ============================== */

    let lastTranslateX = null;
    let lastTranslateY = null;

    let lastRotation = null;

    let actualAngle = null;
    let previousAngle = null;

    let totalAngle = 0;

    let lastMovement =
        performance.now();


    /* ==============================
       HISTORY
    ============================== */

    let history = [];


    /* ==============================
       ORIGINAL METHODS
    ============================== */

    const originalTranslate =
        ctx.translate;

    const originalRotate =
        ctx.rotate;


    /* ==============================
       TRANSLATE HOOK
    ============================== */

    ctx.translate = function (x, y) {

        if (
            x === 0 &&
            Math.abs(y + RADIUS) < 0.01 &&
            lastRotation !== null &&
            lastTranslateX === CX &&
            lastTranslateY === CY
        ) {

            actualAngle =
                lastRotation;
        }

        lastTranslateX = x;
        lastTranslateY = y;

        return originalTranslate.call(
            this,
            x,
            y
        );
    };


    /* ==============================
       ROTATE HOOK
    ============================== */

    ctx.rotate = function (angle) {

        lastRotation = angle;

        return originalRotate.call(
            this,
            angle
        );
    };


    /* ==============================
       ANGLE DIFFERENCE
    ============================== */

    function angleDiff(a, b) {

        let d = a - b;

        if (d > Math.PI)
            d -= Math.PI * 2;

        else if (d < -Math.PI)
            d += Math.PI * 2;

        return d;
    }


    /* ==============================
       UPDATE BALL
    ============================== */

    function updateActualBall() {

        if (actualAngle === null)
            return;


        if (previousAngle === null) {

            previousAngle =
                actualAngle;

            totalAngle = 0;

            history.length = 0;

            return;
        }


        const movement =
            angleDiff(
                actualAngle,
                previousAngle
            );


        /*
         * বল সত্যিই নড়েছে।
         */
        if (
            Math.abs(movement) >
            0.00001
        ) {

            totalAngle += movement;

            previousAngle =
                actualAngle;

            lastMovement =
                performance.now();


            const a =
                actualAngle -
                Math.PI / 2;


            history.push({

                angle:
                    totalAngle,

                x:
                    CX +
                    Math.cos(a) *
                    RADIUS,

                y:
                    CY +
                    Math.sin(a) *
                    RADIUS
            });
        }

        /*
         * কোনো movement না থাকলে
         * trail সঙ্গে সঙ্গে clear হবে।
         */
        else {

            history.length = 0;
        }


        /*
         * পুরোনো point দ্রুত বাদ দেওয়া।
         */
        const minimumAngle =
            totalAngle -
            MAX_TRAIL;


        while (
            history.length > 2 &&
            history[0].angle <
            minimumAngle
        ) {

            history.shift();
        }
    }


    /* ==============================
       DRAW TRAIL
    ============================== */

    function drawTrail() {

        trailCtx.clearRect(
            0,
            0,
            trailCanvas.width,
            trailCanvas.height
        );


        if (
            history.length < 2
        ) {
            return;
        }


        const currentAngle =
            totalAngle -
            TRAIL_GAP;


        /*
         * visible-এর শুরু খোঁজা।
         */
        let start = 0;

        const minimumVisibleAngle =
            currentAngle -
            MAX_TRAIL;


        while (
            start < history.length &&
            history[start].angle <
            minimumVisibleAngle
        ) {

            start++;
        }


        const available =
            Math.max(
                0,
                history.length -
                start
            );


        if (available < 2)
            return;


        const points = [];

        const lastIndex =
            history.length - 1;


        let end = start;

        while (
            end <= lastIndex &&
            history[end].angle <= currentAngle
        ) {

            end++;
        }

        end--;


        if (end <= start)
            return;


        const sourceCount =
            end - start + 1;


        const segmentCount =
            Math.min(
                MAX_DRAW_SEGMENTS,
                sourceCount - 1
            );


        /*
         * evenly sampled points।
         */
        for (
            let i = 0;
            i <= segmentCount;
            i++
        ) {

            const ratio =
                i / segmentCount;

            const index =
                start +
                Math.round(
                    ratio *
                    (sourceCount - 1)
                );

            points.push(
                history[index]
            );
        }


        /*
         * Gap-এর জন্য শেষ point interpolate।
         */
        if (
            currentAngle <
            totalAngle
        ) {

            const last =
                history[
                    history.length - 1
                ];

            const base =
                points[
                    points.length - 1
                ];


            const denominator =
                last.angle -
                base.angle;


            if (
                denominator > 0
            ) {

                const ratio =
                    (
                        currentAngle -
                        base.angle
                    ) /
                    denominator;


                points[
                    points.length - 1
                ] = {

                    angle:
                        currentAngle,

                    x:
                        base.x +
                        (
                            last.x -
                            base.x
                        ) *
                        ratio,

                    y:
                        base.y +
                        (
                            last.y -
                            base.y
                        ) *
                        ratio
                };
            }
        }


        if (
            points.length < 2
        ) {
            return;
        }


        /* ==========================
           DRAW
        ========================== */

        trailCtx.lineWidth = 3.5;
        trailCtx.lineCap = "round";


        const segments =
            points.length - 1;


        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const p1 =
                points[i];

            const p2 =
                points[i + 1];


            const progress =
                i / segments;


            /*
             * Tail → faint
             * Middle → dark
             * Ball-এর কাছে → fade
             */
            const alpha =
                0.95 *
                Math.pow(
                    progress,
                    1.8
                ) *
                (
                    1 -
                    0.95 *
                    Math.pow(
                        progress,
                        5
                    )
                );


            if (
                alpha <= 0.005
            ) {
                continue;
            }


            trailCtx.globalAlpha =
                alpha;


            trailCtx.beginPath();

            trailCtx.moveTo(
                p1.x,
                p1.y
            );

            trailCtx.lineTo(
                p2.x,
                p2.y
            );

            trailCtx.strokeStyle =
                "rgb(255,0,0)";

            trailCtx.stroke();
        }


        trailCtx.globalAlpha = 1;
    }


    /* ==============================
       ANIMATION
    ============================== */

    function animate() {

        updateActualBall();

        drawTrail();

        requestAnimationFrame(
            animate
        );
    }


    /* ==============================
       VISIBILITY
    ============================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                history.length = 0;

                previousAngle = null;
                actualAngle = null;

                trailCtx.clearRect(
                    0,
                    0,
                    trailCanvas.width,
                    trailCanvas.height
                );
            }
        }
    );


    /* ==============================
       RESIZE
    ============================== */

    window.addEventListener(
        "resize",
        updatePosition
    );


    /* ==============================
       START
    ============================== */

    updatePosition();

    requestAnimationFrame(
        animate
    );

})();
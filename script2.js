/* =========================================================
   IF THE SUN BURNS OUT TONIGHT
   interactive experience
========================================================= */


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   MAIN ELEMENTS
========================================================= */

const opening = $("opening");
const sun = $("sun");
const choiceScreen = $("choice-screen");
const memoryOverlay = $("memory-overlay");
const reasonScreen = $("reason-screen");
const memoryStage = $("memory-stage");
const collapseStage = $("collapse-stage");
const constellationStage = $("constellation-stage");
const afterlightStage = $("afterlight-stage");
const finalStage = $("final-stage");


/* =========================================================
   BUTTONS
========================================================= */

const enter = $("enter");
const choices = document.querySelectorAll(".choice");

const customMemoryButton = $("custom-memory-button");
const memoryInput = $("memory-input");
const memoryCancel = $("memory-cancel");
const memoryContinue = $("memory-continue");

const reasonInput = $("reason-input");
const reasonSubmit = $("reason-submit");

const afterlightEnter = $("afterlight-enter");

const legacyInput = $("legacy-input");
const legacySubmit = $("legacy-submit");


/* =========================================================
   MEMORY ELEMENTS
========================================================= */

const memoryStar = $("memory-star");
const memoryHalo = $("memory-halo");

const memoryDisplay = $("memory-display");
const displayMemory = $("display-memory");
const displayReason = $("display-reason");

const reflection = $("reflection");
const reflectionText = $("reflection-text");

const continueHint = $("continue-hint");

const sandglass = $("sandglass");
const timeRunningOut = $("time-running-out");

const fractureMemory = $("fracture-memory");

const constellation = $("constellation");
const constellationReflection = $("constellation-reflection");
const constellationMemory = $("constellation-memory");

const afterlightStars = $("afterlight-stars");

const finalStar = $("final-star");


/* =========================================================
   MUSIC
========================================================= */

const music = $("background-music");


/*
   IMPORTANT:
   Music starts directly from the Enter button click.
   Volume = 50%.
*/

function startMusic() {

    if (!music) {
        console.error("❌ Music element not found.");
        return;
    }

    music.volume = 0.50;
    music.muted = false;

    /*
       Reset only if the music has already been played.
       This lets the experience always begin from the start.
    */

    music.currentTime = 0;

    const playPromise = music.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                console.log(
                    "🎵 MUSIC PLAYING — volume:",
                    music.volume
                );

            })
            .catch((error) => {

                console.error(
                    "❌ MUSIC FAILED:",
                    error
                );

            });

    }

}


/* =========================================================
   FINAL MUSIC FADE
========================================================= */

function fadeMusicOut(duration = 6000) {

    if (!music) return;

    const startingVolume = music.volume;

    const start = performance.now();


    function fade(now) {

        const progress = Math.min(
            (now - start) / duration,
            1
        );

        music.volume =
            startingVolume * (1 - progress);


        if (progress < 1) {

            requestAnimationFrame(fade);

        }

    }


    requestAnimationFrame(fade);

}


/* =========================================================
   STATE
========================================================= */

let selectedMemory = "";
let selectedReason = "";
let customMemory = false;


/* =========================================================
   BACKGROUND STARS
========================================================= */

function createBackgroundStars() {

    const field = $("star-field");

    if (!field) return;

    field.innerHTML = "";


    for (let i = 0; i < 170; i++) {

        const star = document.createElement("span");

        star.className = "bg-star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.setProperty(
            "--duration",
            `${2 + Math.random() * 5}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * 5}s`
        );

        field.appendChild(star);

    }

}


createBackgroundStars();


/* =========================================================
   CURSOR
========================================================= */

const cursorGlow = $("cursor-glow");


document.addEventListener(
    "mousemove",
    (event) => {

        if (!cursorGlow) return;

        cursorGlow.style.left =
            `${event.clientX}px`;

        cursorGlow.style.top =
            `${event.clientY}px`;

    }
);


/* =========================================================
   HELPERS
========================================================= */

function show(element) {

    if (!element) return;

    element.classList.remove("hidden");

}


function hide(element) {

    if (!element) return;

    element.classList.add("hidden");

}


function wait(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/* =========================================================
   ACT I → ACT II
   ENTER BUTTON + MUSIC
========================================================= */

enter.addEventListener(
    "click",
    async () => {

        console.log("🌑 ENTER THE LAST NIGHT");


        /*
           THIS IS THE USER CLICK.
           BROWSER ALLOWS AUDIO HERE.
        */

        startMusic();


        /*
           Prevent accidental double clicking,
           but DON'T disable the button in a way
           that interferes with the transition.
        */

        enter.style.pointerEvents = "none";


        /*
           Fade opening.
        */

        opening.style.opacity = "0";


        /*
           Sun dies.
        */

        sun.classList.add("dying");


        /*
           Let the music + visual moment breathe.
        */

        await wait(1800);


        /*
           Remove Act I.
        */

        hide(opening);


        /*
           Show Act II.
        */

        show(choiceScreen);


        choiceScreen.style.opacity = "0";


        requestAnimationFrame(() => {

            choiceScreen.style.opacity = "1";

        });

    }
);


/* =========================================================
   MEMORY QUESTIONS
========================================================= */

const memoryQuestions = {

    "a voice":
        "some voices stay with us long after they stop speaking.",

    "my home":
        "sometimes a place is more than four walls.",

    "someone i love":
        "love is one of the few things we try to carry beyond time.",

    "my pet":
        "some creatures become part of the shape of our lives.",

    "a photograph":
        "one frame can hold an entire world.",

    "the smell of rain":
        "some memories live somewhere words cannot reach.",

    "something i created":
        "we leave pieces of ourselves inside the things we make.",

    "nothing":
        "sometimes letting go is its own kind of choice."

};


/* =========================================================
   PRESET CHOICE
========================================================= */

choices.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                selectedMemory =
                    button.textContent.trim();

                customMemory = false;

                hide(choiceScreen);

                show(reasonScreen);

            }
        );

    }
);


/* =========================================================
   CUSTOM MEMORY
========================================================= */

customMemoryButton.addEventListener(
    "click",
    () => {

        memoryOverlay.classList.remove(
            "hidden"
        );

        setTimeout(
            () => {

                memoryInput.focus();

            },
            300
        );

    }
);


/* =========================================================
   CUSTOM MEMORY CANCEL
========================================================= */

memoryCancel.addEventListener(
    "click",
    () => {

        memoryOverlay.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   CUSTOM MEMORY CONTINUE
========================================================= */

memoryContinue.addEventListener(
    "click",
    () => {

        const value =
            memoryInput.value.trim();


        if (!value) {

            memoryInput.focus();

            return;

        }


        selectedMemory = value;

        customMemory = true;


        memoryOverlay.classList.add(
            "hidden"
        );


        hide(choiceScreen);

        show(reasonScreen);

    }
);


/* =========================================================
   CUSTOM MEMORY ENTER KEY
========================================================= */

memoryInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            memoryContinue.click();

        }

    }
);


/* =========================================================
   REASON → LAST LIGHT
========================================================= */

reasonSubmit.addEventListener(
    "click",
    () => {

        selectedReason =
            reasonInput.value.trim();


        hide(reasonScreen);

        show(memoryStage);


        /*
           Reset visual state in case
           experience is replayed.
        */

        memoryStage.classList.remove(
            "lit"
        );

        memoryStage.classList.remove(
            "slow-disappear"
        );

        memoryDisplay.classList.remove(
            "show"
        );

        reflection.classList.remove(
            "show"
        );

        continueHint.classList.remove(
            "show"
        );

        sandglass.classList.remove(
            "show"
        );

        timeRunningOut.classList.remove(
            "show"
        );


        runLastLight();

    }
);


/* =========================================================
   LOCAL REFLECTION
========================================================= */

function generateReflection(
    memory,
    reason
) {

    const lower =
        memory.toLowerCase();


    if (
        lower.includes("mom") ||
        lower.includes("mother") ||
        lower.includes("dad") ||
        lower.includes("father") ||
        lower.includes("family") ||
        lower.includes("love")
    ) {

        return "maybe what you are really preserving is the feeling of being known.";

    }


    if (
        lower.includes("home") ||
        lower.includes("house") ||
        lower.includes("room") ||
        lower.includes("place")
    ) {

        return "perhaps home is not the place itself, but everything that happened there.";

    }


    if (
        lower.includes("dog") ||
        lower.includes("cat") ||
        lower.includes("pet")
    ) {

        return "some beings become part of our memories simply by being beside us.";

    }


    if (
        lower.includes("photo") ||
        lower.includes("picture")
    ) {

        return "you chose a moment because a moment can sometimes hold an entire life.";

    }


    if (reason) {

        return "whatever the reason was, something in this memory felt worth carrying into the dark.";

    }


    return "perhaps you chose it because some things deserve to exist even after everything else is gone.";

}


/* =========================================================
   ACT III — LAST LIGHT
========================================================= */

async function runLastLight() {

    displayMemory.textContent =
        selectedMemory;


    displayReason.textContent =
        selectedReason
            ? `"${selectedReason}"`
            : "";


    reflectionText.textContent =
        generateReflection(
            selectedMemory,
            selectedReason
        );


    /*
       Small pause before the star appears.
    */

    await wait(300);


    memoryStage.classList.add(
        "lit"
    );


    /*
       Let the star arrive.
    */

    await wait(3300);


    createStarBurst();


    /*
       Let the burst breathe.
    */

    await wait(1400);


    memoryDisplay.classList.add(
        "show"
    );


    await wait(1800);


    reflection.classList.add(
        "show"
    );


    await wait(1900);


    continueHint.classList.add(
        "show"
    );

}


/* =========================================================
   STAR BURST
========================================================= */

function createStarBurst() {

    const burst =
        $("star-burst");


    burst.innerHTML = "";


    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");


        particle.style.position =
            "absolute";

        particle.style.left =
            "50%";

        particle.style.top =
            "44%";

        particle.style.width =
            `${1 + Math.random() * 3}px`;

        particle.style.height =
            particle.style.width;

        particle.style.borderRadius =
            "50%";

        particle.style.background =
            "#fff";


        const angle =
            Math.random() * Math.PI * 2;


        const distance =
            80 + Math.random() * 280;


        particle.animate(

            [

                {
                    transform:
                        "translate(-50%,-50%) scale(0)",

                    opacity: 1

                },

                {

                    transform:
                        `translate(
                            calc(-50% + ${Math.cos(angle) * distance}px),
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        )
                        scale(1)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    1600 + Math.random() * 1200,

                easing:
                    "cubic-bezier(.16,1,.3,1)",

                fill:
                    "forwards"

            }

        );


        burst.appendChild(
            particle
        );

    }

}


/* =========================================================
   WATCH IT DISAPPEAR
========================================================= */

continueHint.addEventListener(
    "click",
    () => {

        beginPainfulDisappearance();

    }
);


/* =========================================================
   PAINFUL DISAPPEARANCE
========================================================= */

async function beginPainfulDisappearance() {

    continueHint.classList.remove(
        "show"
    );


    /*
       Reset sandglass.
    */

    sandglass.classList.remove(
        "show"
    );


    void sandglass.offsetWidth;


    sandglass.classList.add(
        "show"
    );


    /*
       Give the viewer time to notice
       that time is running out.
    */

    await wait(1200);


    timeRunningOut.classList.add(
        "show"
    );


    await wait(500);


    /*
       Memory slowly disappears.
    */

    memoryStage.classList.add(
        "slow-disappear"
    );


    await wait(7000);


    timeRunningOut.classList.remove(
        "show"
    );

    sandglass.classList.remove(
        "show"
    );


    await wait(600);


    collapseMemory();

}


/* =========================================================
   ACT IV — COLLAPSE
========================================================= */

async function collapseMemory() {

    memoryDisplay.classList.remove(
        "show"
    );

    reflection.classList.remove(
        "show"
    );


    hide(memoryStage);


    await wait(1000);


    show(collapseStage);


    createFracture();


    await wait(1800);


    collapseStage.classList.add(
        "reveal"
    );


    await wait(3000);


    showConstellation();

}


/* =========================================================
   FRACTURE
========================================================= */

function createFracture() {

    fractureMemory.innerHTML = "";


    const words =
        selectedMemory.split(" ");


    words.forEach(
        (word, index) => {

            const piece =
                document.createElement("span");


            piece.className =
                "fracture-piece";


            piece.textContent =
                word;


            piece.style.left =
                `${42 + Math.random() * 16}%`;


            piece.style.top =
                `${42 + Math.random() * 16}%`;


            piece.style.setProperty(
                "--x",
                `${(Math.random() - .5) * 700}px`
            );


            piece.style.setProperty(
                "--y",
                `${(Math.random() - .5) * 500}px`
            );


            piece.style.setProperty(
                "--r",
                `${(Math.random() - .5) * 120}deg`
            );


            piece.style.fontSize =
                `${18 + Math.random() * 20}px`;


            piece.style.animationDelay =
                `${index * 80}ms`;


            fractureMemory.appendChild(
                piece
            );

        }
    );


    /*
       Dust.
    */

    for (let i = 0; i < 100; i++) {

        const dust =
            document.createElement("span");


        dust.className =
            "fracture-piece";


        dust.textContent =
            "·";


        dust.style.left =
            `${45 + Math.random() * 10}%`;


        dust.style.top =
            `${43 + Math.random() * 14}%`;


        dust.style.setProperty(
            "--x",
            `${(Math.random() - .5) * 900}px`
        );


        dust.style.setProperty(
            "--y",
            `${(Math.random() - .5) * 700}px`
        );


        dust.style.setProperty(
            "--r",
            `${Math.random() * 180}deg`
        );


        dust.style.animationDelay =
            `${Math.random() * 1000}ms`;


        fractureMemory.appendChild(
            dust
        );

    }

}


/* =========================================================
   ACT V — CONSTELLATION
========================================================= */

async function showConstellation() {

    hide(collapseStage);


    await wait(900);


    show(constellationStage);


    constellationStage.style.opacity =
        "0";


    requestAnimationFrame(
        () => {

            constellationStage.style.opacity =
                "1";

        }
    );


    buildConstellation();

}


/* =========================================================
   CONSTELLATION POINTS
========================================================= */

function generateConstellationPoints() {

    const patterns = {

        "a voice": [
            [20,65],
            [29,48],
            [39,58],
            [48,37],
            [58,52],
            [69,34],
            [80,48]
        ],

        "my home": [
            [25,70],
            [35,52],
            [50,67],
            [50,42],
            [65,67],
            [75,50],
            [50,25]
        ],

        "someone i love": [
            [20,50],
            [30,35],
            [43,25],
            [55,35],
            [70,50],
            [55,65],
            [43,78],
            [30,65]
        ],

        "my pet": [
            [22,60],
            [32,45],
            [43,55],
            [55,35],
            [65,50],
            [77,40],
            [68,68]
        ],

        "a photograph": [
            [22,35],
            [40,35],
            [58,35],
            [76,35],
            [22,65],
            [40,65],
            [58,65],
            [76,65]
        ],

        "the smell of rain": [
            [20,30],
            [30,48],
            [42,35],
            [50,60],
            [60,42],
            [72,62],
            [82,38]
        ],

        "something i created": [
            [18,70],
            [30,55],
            [40,35],
            [52,50],
            [63,28],
            [74,48],
            [85,30]
        ],

        "nothing": [
            [50,20],
            [35,38],
            [65,38],
            [25,65],
            [50,55],
            [75,65],
            [50,85]
        ]

    };


    /*
       Preset constellation.
    */

    if (
        !customMemory &&
        patterns[selectedMemory]
    ) {

        return patterns[selectedMemory];

    }


    /*
       Deterministic custom constellation.
       Same memory = same constellation.
    */

    let seed = 0;


    for (
        let i = 0;
        i < selectedMemory.length;
        i++
    ) {

        seed =
            (
                seed * 31 +
                selectedMemory.charCodeAt(i)
            ) % 100000;

    }


    function random() {

        seed =
            (
                seed * 9301 +
                49297
            ) % 233280;


        return seed / 233280;

    }


    const points = [];


    const count =
        7 + Math.floor(
            random() * 4
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        points.push([

            15 + random() * 70,

            20 + random() * 60

        ]);

    }


    return points;

}


/* =========================================================
   BUILD CONSTELLATION
========================================================= */

function buildConstellation() {

    constellation.innerHTML = "";


    const points =
        generateConstellationPoints();


    /*
       Stars.
    */

    points.forEach(
        (point, index) => {

            const star =
                document.createElement("span");


            star.className =
                "constellation-star";


            star.style.left =
                `${point[0]}%`;


            star.style.top =
                `${point[1]}%`;


            star.style.animationDelay =
                `${index * .22}s`;


            constellation.appendChild(
                star
            );

        }
    );


    /*
       Connecting lines.
    */

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {

        const [x1, y1] =
            points[i];


        const [x2, y2] =
            points[i + 1];


        const line =
            document.createElement("span");


        line.className =
            "constellation-line";


        const dx =
            x2 - x1;


        const dy =
            y2 - y1;


        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const angle =
            Math.atan2(dy, dx) *
            180 /
            Math.PI;


        line.style.left =
            `${x1}%`;


        line.style.top =
            `${y1}%`;


        line.style.width =
            `${length}%`;


        line.style.transform =
            `rotate(${angle}deg)`;


        constellation.appendChild(
            line
        );

    }


    /*
       Text.
    */

    constellationMemory.textContent =
        selectedMemory;


    constellationReflection.textContent =
        selectedReason
            ? "you gave it a reason. now it has somewhere to remain."
            : "some things disappear from our hands without disappearing from us.";

}


/* =========================================================
   ACT V → ACT VI
========================================================= */

afterlightEnter.addEventListener(
    "click",
    async () => {

        constellationStage.style.opacity =
            "0";


        await wait(1800);


        hide(constellationStage);


        show(afterlightStage);


        afterlightStage.style.opacity =
            "0";


        requestAnimationFrame(
            () => {

                afterlightStage.style.opacity =
                    "1";

            }
        );


        createAfterlightStars();

    }
);


/* =========================================================
   AFTERLIGHT STARS
========================================================= */

function createAfterlightStars() {

    afterlightStars.innerHTML = "";


    for (let i = 0; i < 130; i++) {

        const star =
            document.createElement("span");


        star.className =
            "after-star";


        star.style.left =
            `${Math.random() * 100}%`;


        star.style.top =
            `${Math.random() * 100}%`;


        star.style.opacity =
            .15 + Math.random() * .55;


        star.style.transform =
            `scale(${.5 + Math.random()})`;


        afterlightStars.appendChild(
            star
        );

    }

}


/* =========================================================
   FINAL MOMENT
========================================================= */

legacySubmit.addEventListener(
    "click",
    () => {

        const legacy =
            legacyInput.value.trim();


        if (!legacy) {

            legacyInput.focus();

            return;

        }


        createFinalMoment(
            legacy
        );

    }
);


/* =========================================================
   FINAL
========================================================= */

async function createFinalMoment(
    legacy
) {

    /*
       Music gently disappears
       as the experience ends.
    */

    fadeMusicOut(6000);


    afterlightStage.style.opacity =
        "0";


    await wait(2200);


    hide(afterlightStage);


    show(finalStage);


    finalStage.classList.remove(
        "entering"
    );


    void finalStage.offsetWidth;


    finalStage.classList.add(
        "entering"
    );


    /*
       Their final words become
       the final piece of light.
    */

    const quote =
        document.createElement("p");


    quote.className =
        "legacy-quote";


    quote.textContent =
        `"${legacy}"`;


    quote.style.position =
        "absolute";


    quote.style.left =
        "50%";


    quote.style.bottom =
        "12%";


    quote.style.transform =
        "translateX(-50%)";


    quote.style.width =
        "min(600px,85vw)";


    quote.style.textAlign =
        "center";


    quote.style.fontFamily =
        "Cormorant Garamond, serif";


    quote.style.fontStyle =
        "italic";


    quote.style.fontSize =
        "19px";


    quote.style.color =
        "rgba(255,255,255,.35)";


    quote.style.opacity =
        "0";


    quote.style.transition =
        "opacity 2s ease";


    finalStage.appendChild(
        quote
    );


    await wait(2200);


    quote.style.opacity =
        "1";

}
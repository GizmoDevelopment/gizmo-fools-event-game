$(document).ready($ => {

    function ramTalk (text, stop) {
        return new Promise ((res, rej) => {

            ramText.html("");
            ramText.fadeIn(100);

            text.split("").forEach((c, i) => {
                setTimeout(() => {
                    ramText.html(ramText.html() + c);
                    createAudio("ramTalk", .4);
                }, 80 * i);
            });

            if (!stop) {
                setTimeout(() => {
                    ramTextIcon.fadeIn(50);
                        ramText.click(() => {
                            if (ramText.html() == text) {
                                ramText.fadeOut(150);
                                ramTextIcon.fadeOut(100);
                                res();
                            }
                        })
                }, text.length * 80);
            }
        });
    }

    function bullet (x, y) {

        x = x == 0 ? Math.floor((Math.random() + .1) * 5) : x;
        y = y == 0 ? Math.floor((Math.random() + .1) * -5) : y;

        this.speedX = x;
        this.speedY = y;
        this.width = 15;
        this.height = 15;
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        this.update = () => {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.newPos = () => {
            this.x += this.speedX;
            this.y += this.speedY;
        }

    }

    function rectIntersect (obj1, obj2) {
        return false;
        return !(
            ((obj1.y + obj1.height) < (obj2.y)) ||
            (obj1.y > (obj2.y + obj2.height)) ||
            ((obj1.x + obj1.width) < obj2.x) ||
            (obj1.x > (obj2.x + obj2.width))
        );
    }

    function component (w, h, x, y) {

        this.game = game;
        this.width = w;
        this.height = h;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;

        var avatar = new Image();

        avatar.onload = () => {
            ctx.imageSmoothingEnabled = false;
        }

        avatar.src = pfp;

        this.update = () => {

            ctx.drawImage(avatar, this.x, this.y, this.width, this.height);

            bullets.forEach(b => {
                if (!failed && rectIntersect(this, b)) {
                    failed = true;
                    window.location.reload();
                }
            });

        }

        setTimeout(() => {
            delete this;
        }, 3000);

        this.newPos = () => {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    function refreshGame () {

        game.clear();
        gameRender.speedX = 0;
        gameRender.speedY = 0;

        if (game.keys) {
            if ((game.keys[37] || game.keys[65]) && gameRender.x > 0) { // Left
                gameRender.speedX = -8;
            }
            if ((game.keys[38] || game.keys[87]) && gameRender.y > 0) { // Up
                gameRender.speedY = -8;
            }
            if ((game.keys[40] || game.keys[83]) && gameRender.y < game.canvas.height) { // Down
                gameRender.speedY = 8;
            }
            if ((game.keys[39] || game.keys[68]) && gameRender.x < game.canvas.width) { // Right
                gameRender.speedX = 8;
            }
        }

        gameRender.newPos();
        gameRender.update();

        bullets.forEach(b => {
            b.newPos();
            b.update();
        });
    }

    function createAudio (name, vol) {
        var c = document.getElementById(name).cloneNode();
        c.volume = vol;
        c.play();
        return c;
    }

    var ram = $("#ramBox");
    var ramText = $("#ramText");
    var ramTextIcon = $("#ramTextIcon");
    var gameRender;
    var bullets = [];
    var canvasObj = $("canvas")[0];
    var ctx = canvasObj.getContext("2d");
    var failed = false;

    var game = {
        canvas: document.getElementsByTagName("canvas")[0],
        start: function () {

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(refreshGame, 15);

            window.addEventListener("keydown", e => {
                game.keys = (game.keys || []);
                game.keys[e.keyCode] = (e.type == "keydown");
            });

            window.addEventListener("keyup", e => {
                game.keys[e.keyCode] = (e.type == "keydown");
            });

        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function () {
            clearInterval(this.interval);
            bullets = [];
            this.clear();
        }
    }

    /* Checking whether the provided variables were incorrect

        var pfp = window.location.search.match(/pfp=(.*)/)[1] || null;
        var id = window.location.search.match(/id=(.+?)(\?)/)[1] || null;

        if (pfp.slice(pfp.length - "?size=128".length) != "?size=128") {
            if (pfp.match(/\?(.*)/) !== null) {
                pfp = pfp.replace(pfp.match(/\?(.*)/)[0], "?size=128");
            } else {
                pfp = null;
            }
        }
    */

    var pfp = "./assets/rem.png"; // This is the player icon;

    /* This was to prevent users from entering the battle with incorrect GET parameters
        if (pfp === null || id === null) {
            ramTalk("Something went wrong. Please re-use the provided link or ping me.", true);
    */

    setTimeout(() => {
        ram.fadeIn(2000, () => {
            ramTalk("How DARE you walk into my chamber? I will have to punish you for coming this far.").then(() => {
                ramTalk("Prepare to.... DIE!").then(() => {
                    setTimeout(() => {

                        ram.css({
                            transition: "all .5s",
                            top: "calc(50% - 50px)"
                        });

                        setTimeout(() => {
                            setTimeout(() => {

                                var theme = createAudio("ramTheme", .4);
                                var allowBullets = true;

                                ram.css("animation", "spin .8s linear infinite");
                                gameRender = new component (50, 50, Math.random() > .5 ? 45 : game.canvas.width - 45, Math.random() > .5 ? 45 : game.canvas.height - 45);
                                game.start();

                                function randomCoord () {
                                    return Math.random() > .65
                                    ? Math.random() * 15
                                    : Math.random() * -15;
                                }

                                for (var i = 0; i < 1500; i++) {

                                    bullets = [];

                                    setTimeout(() => {

                                        var sX = randomCoord();
                                        var sY = randomCoord();

                                        for (var ii = 0; ii < 10; ii++) {
                                            setTimeout(() => {
                                                bullets.push(new bullet (sX, sY));
                                            }, ii * 10);
                                        }

                                    }, i * 60);
                                }

                                setTimeout(() => {

                                    ram.css("animation", "spin .4s linear infinite");

                                    for (var i = 0; i < 1100; i++) {

                                        bullets = [];

                                        setTimeout(() => {

                                            var sX = randomCoord();
                                            var sY = randomCoord();

                                            for (var ii = 0; ii < 10; ii++) {
                                                setTimeout(() => {
                                                    bullets.push(new bullet (sX, sY));
                                                }, ii * 5);
                                            }

                                        }, i * 15);
                                    }

                                    setTimeout(() => {

                                        ram.css("animation", "spin .2s linear infinite");

                                        for (var i = 0; i < 1800; i++) {

                                            bullets = [];

                                            setTimeout(() => {

                                                var sX = randomCoord();
                                                var sY = randomCoord();

                                                for (var ii = 0; ii < 4; ii++) {
                                                    setTimeout(() => {
                                                        bullets.push(new bullet (sX, sY));
                                                    }, ii * 5);
                                                }

                                            }, i * 10);
                                        }
                                    }, 400 * 60);
                                }, 99 * 80);

                                setTimeout(() => {

                                    allowBullets = false;

                                    setTimeout(() => {

                                        theme.pause();
                                        game.stop();
                                        ram.css({
                                            transition: "all .5s",
                                            top: "calc(40%)",
                                            animation: "none"
                                        });

                                        setTimeout(() => {

                                            ram.css({
                                                transition: "all 0s",
                                                top: "calc(40%)"
                                            });

                                            ramTalk("Unbelievable... You dodged all of my attacks yet you still don't have a way of bringing me down!").then(() => {
                                                $("body").css("animation", "shake .1s linear infinite");
                                                setTimeout(() => {
                                                    $("body").css("animation", "none");
                                                    ramTalk("H-huh..?").then(() => {
                                                        ram.css("animation", "shaketwo .1s linear infinite");
                                                        setTimeout(() => {
                                                            ram.css("animation", "beat 2.5s linear infinite");
                                                            setTimeout(() => {
                                                                ram.attr("src", "./assets/rem.png").css("animation", "none");
                                                                ramTalk("Woooo! Finally took over her consciousness! I am so sorry for the trouble my sister caused in the past 2 days. She always becomes an annoying shit during April Fools, y'know. Well, anyhow, I'll be bringing peace back to Gizmo really soon.").then(() => {
                                                                    // ramText.css("user-select", "text"); This allowed users to select the code
                                                                    ramTalk("You have earned a special role for participating in this event!", true);
                                                                });
                                                            }, 3000);
                                                        }, 1500);
                                                    });
                                                }, 1000);
                                            });
                                        }, 500);
                                    }, 2500);
                                }, 50000);
                            }, 500);
                        }, 500);
                    }, 200);
                });
            });
        });
    }, 500);
});

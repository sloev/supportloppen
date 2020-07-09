var video;
var freeze = false;
var a4AspectRatio = 1.41451612903;
var angleInRadians = 0;
var backgroundImg = new Image(),
    foregroundImg = new Image(),
    loppenLogoBlack = new Image();

window.addEventListener("load", function() {
    // [1] GET ALL THE HTML ELEMENTS
    var take = document.getElementById("vid-take"),
        videoCanvas = document.getElementById("vid-show");

    video = document.getElementById("vid-record");
    foregroundImg.src = "static/a4.png"
    loppenLogoBlack.src = "static/loppenLogo.png";



    var videoContext = videoCanvas.getContext("2d");


    // [2] ASK FOR USER PERMISSION TO ACCESS CAMERA
    // WILL FAIL IF NO CAMERA IS ATTACHED TO COMPUTER
    var oldIsWhite = false;
    var logoOppacity = 0.1;
    var supportImgIndex = 1;

    function loop() {
        if (!freeze) {
            var draw = document.createElement("canvas");
            var aspect = video.videoHeight / video.videoWidth;
            var wantedWidth = 341; // or use height
            var height = Math.round(wantedWidth * aspect);

            draw.width = wantedWidth;
            draw.height = height;
            var context2D = draw.getContext("2d");
            context2D.drawImage(video, 0, 0, wantedWidth, height);
            var rectY = height * 0.5;
            var a4Height = (height - rectY - 30)
            var a4Width = Math.round(a4Height * a4AspectRatio);
            var rectX = (wantedWidth - a4Width) / 2;


            const pixels = context2D.getImageData(rectX, rectY, a4Width, a4Height);
            const isWhite = hasWhitePaper(pixels);
            if (isWhite) {
                if (!oldIsWhite) {
                    angleInRadians = (Math.PI / 180) * (Math.floor(Math.random() * 20) - 10);
                    supportImgIndex = Math.floor(Math.random() * 4) + 1;
                    backgroundImg.src = `static/support${supportImgIndex}.png`;
                }
                logoOppacity *= 1.5

            } else {
                context2D.drawImage(foregroundImg, rectX - 20, rectY - 20, a4Width + 40, a4Height + 40);
            }

            if (logoOppacity > 1.0) {
                logoOppacity = 1.0;
            } else if (logoOppacity < 0.001) {
                logoOppacity = 0.001;
            }
            var logoRectY = rectY + 10
            context2D.globalAlpha = logoOppacity;

            context2D.translate(rectX, logoRectY)
            context2D.rotate(angleInRadians);


            context2D.drawImage(backgroundImg, 0, 0, a4Width, a4Height);

            context2D.rotate(-angleInRadians);
            context2D.translate(-rectX, -logoRectY)

            oldIsWhite = isWhite;
            logoOppacity *= 0.9;
            // context2D.globalAlpha = 0.8 - logoOppacity;


            context2D.globalAlpha = 1.0;


            // videoContext.putImageData(threshImage, 0, 100);
            const allPixels = context2D.getImageData(0, 0, wantedWidth, height);
            videoContext.putImageData(allPixels, 0, 100)

        }
        raf = requestAnimationFrame(loop);
    }

    // [2] ASK FOR USER PERMISSION TO ACCESS CAMERA
    // WILL FAIL IF NO CAMERA IS ATTACHED TO COMPUTER
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: 'environment' } } })
        .then(function(stream) {
            console.log("got camera")
                // [3] SHOW VIDEO STREAM ON VIDEO TAG
            video.srcObject = stream;
            video.play();
            video.onplaying = function() {

                // call our loop only when the video is playing
                raf = requestAnimationFrame(loop);
            };
            // [4] WHEN WE CLICK ON "TAKE PHOTO" BUTTON

        })
        .catch(function(err) {
            navigator.mediaDevices.getUserMedia({ audio: false, video: true })
                .then(function(stream) {
                    console.log("got camera")
                        // [3] SHOW VIDEO STREAM ON VIDEO TAG
                    video.srcObject = stream;
                    video.play();
                    video.onplaying = function() {

                        // call our loop only when the video is playing
                        raf = requestAnimationFrame(loop);
                    };
                    // [4] WHEN WE CLICK ON "TAKE PHOTO" BUTTON

                })
                .catch(function(err) {
                    alert("ERROR");
                    document.getElementById("vid-controls").innerHTML = "Please enable access and attach a camera";
                });
        });
});

var share = function() {
    $(".shoot-button").hide()
    freeze = true
        // Create snapshot from video
    var draw = document.createElement("canvas");
    draw.width = video.videoWidth;
    draw.height = video.videoHeight;
    var context2D = draw.getContext("2d");

    var rectY = (video.videoHeight * 0.5) + 10;
    var a4Height = (video.videoHeight - rectY - 30)
    var a4Width = Math.round(a4Height * a4AspectRatio);
    var rectX = (video.videoWidth - a4Width) / 2;
    context2D.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // Upload to server
    context2D.translate(rectX, rectY)
    context2D.rotate(angleInRadians);

    context2D.drawImage(backgroundImg, 0, 0, a4Width, a4Height);

    context2D.rotate(-angleInRadians);
    context2D.translate(-rectX, -rectY)
    for (var i = 1; i < 20; i += 1) {
        angleInRadians = (Math.PI / 180) * (Math.floor(Math.random() * 40) - 20);
        supportImgIndex = Math.floor(Math.random() * 4) + 1;
        backgroundImg.src = `static/support${supportImgIndex}.png`;

        var x = Math.floor(Math.random() * 20) + 1;
        var y = Math.floor(Math.random() * video.videoHeight - 1) + 1;

        context2D.translate(x, y)
        context2D.rotate(angleInRadians);
        context2D.drawImage(loppenLogoBlack, -20, -25, 40, 50);


        context2D.rotate(-angleInRadians);
        context2D.translate(-x, -y)
    }
    for (var i = 1; i < 20; i += 1) {
        angleInRadians = (Math.PI / 180) * (Math.floor(Math.random() * 40) - 20);
        supportImgIndex = Math.floor(Math.random() * 4) + 1;
        backgroundImg.src = `static/support${supportImgIndex}.png`;

        var x = video.videoWidth - (Math.floor(Math.random() * 20) + 1);
        var y = Math.floor(Math.random() * video.videoHeight - 1) + 1;

        context2D.translate(x, y)
        context2D.rotate(angleInRadians);
        context2D.drawImage(loppenLogoBlack, -20, -25, 40, 50);


        context2D.rotate(-angleInRadians);
        context2D.translate(-x, -y)
    }
    var link = document.createElement('a');
    link.download = 'support_loppen.png';
    link.href = draw.toDataURL()
    link.click();
    window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent("https://www.gofundme.com/f/support-loppen") + '&t=' + encodeURIComponent("Support Loppen Crowdfund"), 'sharer', 'toolbar=0,status=0,width=626,height=436')
    freeze = false
    $(".shoot-button").show()

};


/*
 * Excerpt from "Making Image Filters with Canvas - HTML5 Rocks"
 * By Ilmari Heikkinen, Published May 25th, 2011
 * https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 */
var hasWhitePaper = function(pixels) {
    var data = pixels.data;
    const components = data.length;
    let L = 0;
    let W = 0
    for (let i = 0; i < components; i += 4) {
        // A single pixel (R, G, B, A) will take 4 positions in the array:
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        var l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        var w = (r + g + b) / 3

        // Update components for solid color and alpha averages:
        L += l;
        W += w;

    }

    const pixelsPerChannel = components / 4;

    // The | operator is used here to perform an integer division:

    L = L / pixelsPerChannel | 0;
    W = W / pixelsPerChannel | 0;


    if (L > 170 && W > 170) {
        return true
    }
    return false

};

function contrastImage(pixels) { // contrast as an integer percent  
    contrast = 150;
    var data = pixels.data; // original array modified, but canvas not updated
    contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
    var factor = (255 + contrast) / (255.01 - contrast); //add .1 to avoid /0 error

    for (var i = 0; i < data.length; i += 4) //pixel values in 4-byte blocks (r,g,b,a)
    {
        data[i] = factor * (data[i] - 128) + 128; //r value
        data[i + 1] = factor * (data[i + 1] - 128) + 128; //g value
        data[i + 2] = factor * (data[i + 2] - 128) + 128; //b value

    }
    return imageData; //optional (e.g. for filter function chaining)
}
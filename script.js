function printHello() {
    console.log("Hello, world!");
}

// Asks for user permission to access the camera and displays the video stream.
function startVideo() {
    const video = document.getElementById('videoElement');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
            })
            .catch(function(err) {
                console.log("Something went wrong!", err);
            });
    }
}

window.onload = startVideo;

let videoStream;

function startVideo() {
    const video = document.getElementById('videoElement');
    video.muted = true; // Ensure video is muted to avoid autoplay issues
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }) // Prefer the front camera on mobile devices
            .then(function(stream) {
                video.srcObject = stream;
                videoStream = stream;
            })
            .catch(function(err) {
                console.log("Something went wrong!", err);
            });
    }
}

function takePhoto() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('videoElement');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    // Show the canvas and hide the video
    canvas.style.display = 'block';
    video.style.display = 'none';

    // Optionally, stop the camera after taking the photo
    videoStream.getTracks().forEach(track => track.stop());
}

function retakePhoto() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('videoElement');
    // Hide the canvas and show the video
    canvas.style.display = 'none';
    video.style.display = 'block';
    // Restart the video stream
    startVideo();
}

window.onload = startVideo;

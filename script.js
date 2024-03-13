// script.js
document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var snap = document.getElementById('snap');
    var popup = document.getElementById('popup');
    var send = document.getElementById('send');
    var retry = document.getElementById('retry');

    // Get access to the camera
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    snap.addEventListener("click", function() {
        snap.disabled = true; // Disable button to prevent multiple clicks
        setTimeout(function() { // 3 second countdown
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.style.display = 'none'; // Hide the video element
            canvas.style.display = 'block'; // Show the canvas
            applyOverlay(); // Apply your overlay
            popup.style.display = 'flex'; // Show popup
            snap.disabled = false; // Enable button again
        }, 3000);
    });

    function applyOverlay() {
        var overlayImg = new Image();
        overlayImg.onload = function() {
            // Make sure the canvas size matches the video feed
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Redraw the image from the video feed first
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Then draw the overlay image on top
            // This example assumes you want the overlay to cover the entire canvas,
            // but you can adjust the positioning and size as needed
            context.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
            
            // At this point, the canvas contains both the photo and the overlay
            // You can now proceed with other actions, such as showing the popup
            popup.style.display = 'flex';
        };
        // Set the source of the overlay image
        overlayImg.src = './hat.png';
    }

    // Send photo logic
    send.addEventListener("click", function() {
        // Implement the logic to convert canvas to an image and send it via email
        // This might involve converting the canvas to a data URL and sending it to a server
        // need to have a server running

        // TODO: the server can have a copy of the image and do the processing itself as I know how to do it in python
    });

    // Retry photo
    retry.addEventListener("click", function() {
        video.style.display = 'block';
        canvas.style.display = 'none';
        popup.style.display = 'none';
    });
});

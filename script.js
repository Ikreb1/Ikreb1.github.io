// script.js
document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var snap = document.getElementById('snap');
    var popup = document.getElementById('popup');
    var send = document.getElementById('send');
    var retry = document.getElementById('retry');
    var photo = document.getElementById('photo');
    var emailInput = document.getElementById('emailInput');

    canvas.style.display = 'none'; // Hide the canvas

    // Get access to the camera
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    snap.addEventListener("click", function() {
        snap.disabled = true; // Disable the button to prevent multiple clicks
    
        let countdownNumber = 3;
        document.getElementById('countdown').innerText = countdownNumber; // Display initial countdown number

        photo.style.display = 'flex'; // Hide the photo
    
        // Update the countdown every second
        var countdownInterval = setInterval(function() {
            countdownNumber--;
            if(countdownNumber > 0) {
                document.getElementById('countdown').innerText = countdownNumber;
            } else {
                clearInterval(countdownInterval);
                document.getElementById('countdown').innerText = ''; // Clear the countdown
                capturePhotoAndOverlay(); // Call the function to capture the photo and apply the overlay
            }
        }, 1000);
    });

    
    function capturePhotoAndOverlay() { // 3 second countdown
        photo.style.display = 'none'; // Hide the photo
        snap.style.display = 'none'; // Hide the button
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.style.display = 'none'; // Hide the video element
        canvas.style.display = 'block'; // Show the canvas
        applyOverlay(); // Apply your overlay
        popup.style.display = 'flex'; // Show popup
        snap.disabled = false; // Enable button again
    };

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
        overlayImg.crossOrigin = "anonymous";
        // random hat1 or hat2
        if (Math.random() < 0.5) {
            overlayImg.src = './hat1.png';
        } else {
            overlayImg.src = './hat2.png';
        }
    }

    // Send photo logic
    send.addEventListener("click", function() {
        // TODO: send which random filter was applied with
        var canvas = document.getElementById('canvas');
        var imageData = canvas.toDataURL('image/png');
        var email = emailInput.value;

        // Check if the email input is not empty
        if (email.trim() === '') {
            alert('Please enter an email address.');
            return;
        }

        fetch('https://melkorka.applikuapp.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({image: imageData, email: email}),
        })
        .then(response => {
            if (response.status === 200) {
                console.log("Email sent successfully");
                return response.json();
            } else {
                console.log("Response not 200", response.status);
                // Extract the error message from the server's response
                return response.json().then(err => {
                    throw new Error(`Server responded with a non-200 status: ${response.status} - ${err.error}`);
                });
            }
        })
        .then(data => {
            console.log(data);
            document.getElementById('retry').click();
        })
        .catch((error) => {
            // This will now log the specific server error message
            console.error('Error:', error.message);
        });
    });

    // Retry photo
    retry.addEventListener("click", function() {
        snap.style.display = 'block';
        video.style.display = 'block';
        canvas.style.display = 'none';
        popup.style.display = 'none';
    });
});

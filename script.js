// References to the video element and button
const videoElement = document.getElementById('video');
const button = document.getElementById('button');

// Function to select and initialize the media stream
async function selectMediaStream() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            alert("Screen sharing is not supported on this browser. Please use a desktop browser for this feature.");
            return;
        }

        // Prompt user to select a screen/window to share
        const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        videoElement.srcObject = mediaStream;

        // Handle when the media stream ends (e.g., user stops sharing)
        mediaStream.getVideoTracks()[0].onended = () => {
            console.log("Media stream ended.");
            videoElement.srcObject = null; // Clear the video source
        };

        // Play the video once the metadata is loaded
        videoElement.onloadedmetadata = () => {
            videoElement.play();
        };
    } catch (error) {
        console.error("Error selecting media stream:", error);
        alert("Error accessing screen sharing: " + error.message);
    }
}

// Function to handle Picture-in-Picture
async function startPictureInPicture() {
    if (!document.pictureInPictureEnabled || !videoElement.requestPictureInPicture) {
        alert("Picture-in-Picture is not supported on this browser.");
        return;
    }

    try {
        // Disable the button
        button.disabled = true;
        // Start Picture-in-Picture
        await videoElement.requestPictureInPicture();
    } catch (error) {
        console.error("Error starting Picture-in-Picture:", error);
        alert("Error starting Picture-in-Picture: " + error.message);
    } finally {
        // Re-enable the button
        button.disabled = false;
    }
}

// Event listener for the button click
button.addEventListener('click', async () => {
    if (!videoElement.srcObject) {
        // If no media stream is active, select a new one
        await selectMediaStream();
    } else {
        await startPictureInPicture();
    }
});

// Check for API support and provide a warning if unsupported
if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    alert("Screen sharing is not supported on this browser. For the best experience, use a desktop browser.");
}

if (!document.pictureInPictureEnabled) {
    alert("Picture-in-Picture is not supported on this browser.");
}

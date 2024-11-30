// References to the video element and button
const videoElement = document.getElementById('video');
const button = document.getElementById('button');

// Function to select and initialize the media stream
async function selectMediaStream() {
    try {
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
    }
}

// Event listener for the button click
button.addEventListener('click', async () => {
    if (!videoElement.srcObject) {
        // If no media stream is active, select a new one
        await selectMediaStream();
    }
    try {
        // Disable the button
        button.disabled = true;
        // Start Picture-in-Picture
        await videoElement.requestPictureInPicture();
    } catch (error) {
        console.error("Error starting Picture-in-Picture:", error);
    } finally {
        // Re-enable the button
        button.disabled = false;
    }
});

// Initialize on page load
selectMediaStream();

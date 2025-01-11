document.addEventListener("DOMContentLoaded", () => {
  // speech API Loaded
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // browser support
  if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition. Please try a different browser.");
      return; // Exit if unsupported
  }

  const recognition = new SpeechRecognition();

  // adjusting recognition settings
  recognition.lang = "en-US"; // Language: English (US)
  recognition.interimResults = false; // Only show final results
  recognition.continuous = true; // Keep listening until stopped

  // DOM elements
  const speechBox = document.getElementById("speechBox");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const copyButton = document.getElementById("copyText");

  // State to track recognition
  let isListening = false; // Tracks whether the recording is currently active
  let hasPaused = false;  // Tracks whether the recording was paused

  // Start/Resume button  
  playButton.addEventListener("click", () => {
      if (!isListening) {
          if (hasPaused) {
              alert("Recording resumed!");
              console.log("Recognition resumed...");
          } else {
              alert("Recording started!");
              console.log("Recognition started...");
          }
          recognition.start();
          isListening = true;
          hasPaused = false; // Reset the paused state
      } else {
          alert("Recording is already running!");
      }
  });

  // Pause button 
  pauseButton.addEventListener("click", () => {
      if (isListening) {
          recognition.stop();
          isListening = false;
          hasPaused = true; // Set the paused state
          alert("Recording paused!");
          console.log("Recognition stopped...");
      } else {
          alert("Cannot pause. Recording is not active.");
      }
  });

  // Copy button 
  copyButton.addEventListener("click", () => {
      speechBox.select();
      try {
          const successful = document.execCommand("copy");
          if (successful) {
              alert("Text copied to clipboard!");
          } else {
              alert("Unable to copy text. Please try again.");
          }
      } catch (err) {
          alert("Copying text is not supported in this browser.");
          console.error("Error copying text:", err);
      }
  });

  // Append speech to the textarea
  recognition.addEventListener("result", (event) => {
      const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
      speechBox.value += transcript + " ";
  });

  // Handle errors
  recognition.addEventListener("error", (event) => {
      console.error("Speech recognition error:", event.error);
  });

  // Automatically restart recognition if it stops unexpectedly
  recognition.addEventListener("end", () => {
      if (isListening) {
          recognition.start();
          alert("Resumed recording!");
      }
  });
});

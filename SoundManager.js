/**
 * Plays sound.
 * 
 * @param {sound} sound - The sound to play.
*/
function playSound(sound) {
    if (sound.isPlaying()) return;
    sound.play();
}

/**
 * Stop playing sound.
 * @param {sound} sound - The sound to stop playing.
*/
function stopSound(sound) {
    sound.stop();
}
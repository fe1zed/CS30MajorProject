/* eslint-disable curly */
/**
 * Plays sound.
 * 
 * @param {sound} sound - The sound to play.
*/
function playSound(sound, playImmideately=false) {
  if (!playImmideately) {
    if (sound.isPlaying()) return;
    sound.play();
  }
  else {
    if (sound.isPlaying()) sound.stopSound();
    sound.play();
  }
}

/**
 * Stop playing sound.
 * @param {sound} sound - The sound to stop playing.
*/
function stopSound(sound) {
  sound.stop();
}
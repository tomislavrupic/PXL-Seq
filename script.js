const grid = document.querySelector('#phrase-grid');
const play = document.querySelector('#play');
const position = document.querySelector('#position');
const notes = [28, 52, 38, 82, 28, 65, 45, 95, 58, 32, 88, 44, 70, 35, 100, 62];
const sequence = [...Array(3).fill(notes.slice(0, 8)).flat(), ...notes.slice(8)];
const steps = sequence.map((height, index) => {
  const cell = document.createElement('span');
  cell.className = `step${index >= 24 ? ' b' : ''}${index === 0 ? ' active' : ''}`;
  cell.style.setProperty('--height', `${height}%`);
  grid.append(cell);
  return cell;
});
let current = 0;
let timer = null;
function stop() {
  clearInterval(timer);
  timer = null;
  play.textContent = '▶';
  play.setAttribute('aria-label', 'Play phrase visualization');
  play.title = 'Play phrase visualization';
}
play.addEventListener('click', () => {
  if (timer !== null) return stop();
  play.textContent = 'Ⅱ';
  play.setAttribute('aria-label', 'Pause phrase visualization');
  play.title = 'Pause phrase visualization';
  timer = setInterval(() => {
    steps[current].classList.remove('active');
    current = (current + 1) % steps.length;
    steps[current].classList.add('active');
    position.value = `${String(current + 1).padStart(2, '0')} / 32`;
  }, 150);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
});

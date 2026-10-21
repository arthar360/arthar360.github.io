const form = document.querySelector('#terminal-form');
const input = document.querySelector('#terminal-input');
const output = document.querySelector('#terminal-output');
const screen = document.querySelector('.terminal-screen');
const promptText = document.querySelector('.prompt').textContent;
const history = [];
let historyIndex = 0;

const maximizeButton = document.querySelector('#terminal-maximize');
maximizeButton.addEventListener('click', () => {
  const maximized = document.querySelector('.terminal').classList.toggle('terminal-maximized');
  const label = maximized ? 'Restore terminal' : 'Maximize terminal';
  maximizeButton.setAttribute('aria-pressed', String(maximized));
  maximizeButton.setAttribute('aria-label', label);
  maximizeButton.title = label;
});

document.querySelector('#terminal-close').addEventListener('click', () => {
  const closedScreen = document.querySelector('#closed-screen');
  document.querySelector('.terminal').replaceWith(closedScreen.content.cloneNode(true));
  document.documentElement.classList.add('terminal-closed');
  document.querySelector('meta[name="theme-color"]').content = '#eee9f8';
  document.title = 'Thanks for coming by! — atharva.de';
  document.querySelector('#crash-title').focus();
});

function addLine(className, text) {
  const line = document.createElement('div');
  line.className = className;
  line.textContent = text;
  output.append(line);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;

  history.push(command);
  historyIndex = history.length;
  addLine('command-line', `${promptText} ${command}`);

  if (command === 'clear') {
    output.replaceChildren();
    return;
  }

  if (command === 'help') {
    addLine('output-line', 'Available commands:');
    addLine('output-line', '  help       Show this list');
    addLine('output-line', '  about      A little about this site');
    addLine('output-line', '  whoami     Show the current user');
    addLine('output-line', '  pwd        Print the current directory');
    addLine('output-line', '  ls         List site files');
    addLine('output-line', '  date       Show the current date and time');
    addLine('output-line', '  echo TEXT  Print a line of text');
    addLine('output-line', '  clear      Clear the terminal');
  } else if (command === 'about') {
    addLine('output-line', 'Welcome to atharva.de — a little corner of the internet.');
  } else if (command === 'whoami') {
    addLine('output-line', 'guest');
  } else if (command === 'pwd') {
    addLine('output-line', '/home/guest');
  } else if (command === 'ls') {
    addLine('output-line', 'about.txt   projects/   README.md');
  } else if (command === 'date') {
    addLine('output-line', new Date().toString());
  } else if (command.startsWith('echo ')) {
    addLine('output-line', command.slice(5));
  } else {
    addLine('output-line', `${command.split(/\s+/, 1)[0]}: command not found`);
  }

  screen.scrollTop = screen.scrollHeight;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = '';
  screen.scrollTop = screen.scrollHeight;
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && historyIndex > 0) {
    event.preventDefault();
    input.value = history[--historyIndex];
  } else if (event.key === 'ArrowDown' && historyIndex < history.length) {
    event.preventDefault();
    input.value = history[++historyIndex] ?? '';
  }
});

screen.addEventListener('click', (event) => {
  if (!(event.target instanceof HTMLInputElement)) input.focus();
});

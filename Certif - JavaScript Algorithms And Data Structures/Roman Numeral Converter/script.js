// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }}
  
  
  // ——————————————————————————————————————————————————
  // Example
  // ——————————————————————————————————————————————————
  
  const phrases = [
  'CONVERTISSEUR DE NOMBRES ROMAINS',
  'CONVERSOR DE NÚMEROS ROMANOS',
  'RÖMISCHE ZAHLEN KONVERTER',
  'CONVERTITORE DI NUMERI ROMANI',
  'محول الأرقام الرومانية',
  'КОНВЕРТЕР РИМСКИХ ЧИСЕЛ',
  'CONVERSOR DE NÚMEROS ROMANOS'];
  
  
  const el = document.querySelector('.text, .dud2');
  const fx = new TextScramble(el);
  
  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 800);
    });
    counter = (counter + 1) % phrases.length;
  };
  
  next();

  // ROMAN CONVERTER

const form = document.getElementById('form');
const convertButton = document.getElementById('convert-btn');
const output = document.getElementById('output');

const convertToRoman = num => {

    const ref = [
        
        ['M', 1000],['CM', 900],['D', 500],['CD', 400],['C', 100],['XC', 90],
        ['L', 50],['XL', 40],['X', 10],['IX', 9],['V', 5],['IV', 4],['I', 1]
                      ];

    const res = [];

ref.forEach(function (arr) {

        while (num >= arr[1]) {

                res.push(arr[0]);
                num -= arr[1];

                      }});

        return res.join('');
};

    const isValid = (str, int) => {
    let errText = '';

        if (!str || !/^\d+$/.test(str)) {
            errText = 'Ecris un chiffre valide.';
        } else if (int < 1) {
            errText = 'Ecris un chiffre plus grand que 1.';
        } else if (int > 10000) {
            errText = 'Ecris un chiffre plus petit que 10000.';
        }else {

    // Pas d'erreur.

        return true;
              }
    output.innerText = errText;
    output.classList.add('alert');

        return false;
    };

    const clearOutput = () => {
            output.innerText = '';
            output.classList.remove('alert');

    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        updateUi();
    });

    convertButton.addEventListener('click', () => {
        updateUi();
    });

    const updateUi = () => {
        const numStr = document.getElementById('number').value;
        const int = parseInt(numStr, 10);

    output.classList.remove('hidden');      

    clearOutput();

if ( isValid(numStr, int)) {
    output.innerText = convertToRoman(int);
}

    };

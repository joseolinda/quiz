// js/app.js

const questionEl      = document.getElementById('question');
const choicesEl       = document.getElementById('choices');
const nextBtn         = document.getElementById('next-btn');
const scoreContainer  = document.getElementById('score-container');

let questions     = [];
let currentIndex  = 0;
let score         = 0;

// 1. Carrega o JSON e puxa o array de perguntas
fetch('data/questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data.questions;            // antes era data
    showQuestion();
  })
  .catch(err => console.error('Erro ao carregar perguntas:', err));

function showQuestion() {
  resetState();

  const q = questions[currentIndex];
  // Exibe o enunciado
  questionEl.textContent = q.question;

  // Se houver dica, exibe um botão para mostrá-la
  if (q.hint) {
    const hintBtn = document.createElement('button');
    hintBtn.textContent = 'Mostrar dica';
    hintBtn.classList.add('hint-btn');
    hintBtn.addEventListener('click', () => {
      const hintEl = document.createElement('p');
      hintEl.textContent = q.hint;
      hintEl.classList.add('hint-text');
      // evita criar várias vezes
      if (!document.querySelector('.hint-text')) {
        questionEl.parentElement.insertBefore(hintEl, choicesEl);
      }
    });
    questionEl.parentElement.insertBefore(hintBtn, choicesEl);
  }

  // Cria botões para cada alternativa
  q.answerOptions.forEach(option => {
    const li  = document.createElement('li');
    const btn = document.createElement('button');

    btn.textContent = option.text;
    btn.classList.add('choice-btn');

    // Ao clicar, passa o próprio objeto option
    btn.addEventListener('click', () => selectAnswer(btn, option));

    li.appendChild(btn);
    choicesEl.appendChild(li);
  });
}

function resetState() {
  nextBtn.disabled = true;
  // limpa escolhas
  choicesEl.innerHTML = '';
  // remove possível dica e racionalização das questões anteriores
  const prevHint = document.querySelector('.hint-text');
  if (prevHint) prevHint.remove();
}

function selectAnswer(btn, option) {
  const isCorrect = option.isCorrect;

  // destaca correto/incorreto
  btn.classList.add(isCorrect ? 'correct' : 'wrong');

  // exibe a justificativa (rationale) logo abaixo do botão
  const rationaleEl = document.createElement('p');
  rationaleEl.textContent = option.rationale;
  rationaleEl.classList.add('rationale-text');
  btn.parentElement.appendChild(rationaleEl);

  if (isCorrect) score++;

  // desabilita todas as alternativas após a escolha
  Array.from(choicesEl.querySelectorAll('button'))
       .forEach(b => b.disabled = true);

  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  document.querySelector('.quiz-container').innerHTML = `
    <h2>Quiz concluído!</h2>
    <p>Você acertou ${score} de ${questions.length} perguntas.</p>
    <button onclick="location.reload()">Refazer Quiz</button>
  `;
}

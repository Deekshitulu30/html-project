// Use Strict Mode for safer code
'use strict';

// Configuration
const QUESTION_COUNT = 15; // Change this number to set how many questions show in the exam

// Global state variables
let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;
let timeRemaining = 15 * 60; // 15 minutes

// Wait for DOM to be ready before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    
    // Cache DOM elements
    const els = {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        res: document.getElementById('result-screen'),
        head: document.getElementById('exam-header'),
        qTxt: document.getElementById('question-text'),
        opts: document.getElementById('options-container'),
        next: document.getElementById('next-btn'),
        prev: document.getElementById('prev-btn'),
        timer: document.getElementById('timer'),
        qNum: document.getElementById('current-q-num'),
        totalQNum: document.getElementById('total-q-num'), // Added to update total count in header
        bar: document.getElementById('progress-bar'),
        rev: document.getElementById('review-container')
    };

    // --- Core Functions ---

    // Fetch Questions from JSON file
    async function fetchQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Could not load questions:", error);
            alert("Error loading questions. Please ensure you are running this on a local server (Live Server).");
            return [];
        }
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) {
                endExam();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
        const seconds = (timeRemaining % 60).toString().padStart(2, '0');
        els.timer.textContent = `${minutes}:${seconds}`;
        
        if (timeRemaining < 60) {
            els.timer.parentElement.className = "bg-red-600 px-4 py-2 rounded-full font-mono text-lg font-bold flex items-center gap-2 animate-pulse";
        }
    }

    function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];
        
        // Update UI Text
        els.qNum.textContent = currentQuestionIndex + 1;
        // Dynamic progress bar calculation
        els.bar.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
        els.qTxt.textContent = `${currentQuestionIndex + 1}. ${q.question}`;
        
        // Render Options
        els.opts.innerHTML = q.options.map((opt, i) => `
            <div onclick="window.selectOption(${i})">
                <input type="radio" name="opt" id="o${i}" class="hidden option-input" ${userAnswers[currentQuestionIndex] === i ? 'checked' : ''}>
                <label for="o${i}" class="option-label flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-indigo-300 bg-white">
                    <div class="radio-circle w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0 relative"></div>
                    <span class="text-gray-700 font-medium">${opt}</span>
                </label>
            </div>
        `).join('');
        
        updateNavButtons();
    }

    function updateNavButtons() {
        // Previous Button
        els.prev.disabled = currentQuestionIndex === 0;
        els.prev.className = currentQuestionIndex === 0 
            ? "px-6 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl transition flex items-center gap-2 cursor-not-allowed" 
            : "px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition flex items-center gap-2 shadow-sm";
        
        // Next Button
        const hasAnswer = userAnswers[currentQuestionIndex] !== null;
        els.next.disabled = !hasAnswer;
        els.next.className = hasAnswer 
            ? "flex-grow md:flex-grow-0 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2 transform active:scale-95" 
            : "flex-grow md:flex-grow-0 px-8 py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed transition flex items-center justify-center gap-2";
        
        // Dynamic check for last question
        const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
        els.next.querySelector('span').textContent = isLastQuestion ? "Submit Exam" : "Next Question";
    }

    function endExam() {
        clearInterval(timerInterval);
        
        let score = 0;
        currentQuestions.forEach((q, i) => {
            if (userAnswers[i] === q.answer) score++;
        });

        els.quiz.classList.add('hidden');
        els.head.classList.add('hidden');
        els.res.classList.remove('hidden');
        
        // Dynamic Score and Percentage calculation
        document.getElementById('score-display').textContent = score;
        document.getElementById('percentage-display').textContent = Math.round((score / currentQuestions.length) * 100);
        
        els.rev.innerHTML = currentQuestions.map((q, i) => {
            const u = userAnswers[i];
            const isC = u === q.answer;
            const isS = u === null;
            
            const badge = isC 
                ? '<span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200">Correct</span>' 
                : (isS 
                    ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200">Skipped</span>' 
                    : '<span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded border border-red-200">Wrong</span>');
            
            const opts = q.options.map((o, idx) => {
                let cls = "p-2 rounded border text-sm flex items-center gap-2 ";
                let icon = "";
                if (idx === q.answer) { cls += "review-correct font-semibold"; icon = `✓`; }
                else if (idx === u && !isC) { cls += "review-wrong"; icon = `✗`; }
                else { cls += "border-transparent text-gray-500"; icon = ``; }
                return `<div class="${cls}">${icon} ${o}</div>`;
            }).join('');

            return `
                <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                        <h4 class="font-semibold text-gray-800 text-sm">
                            <span class="text-indigo-600 font-bold mr-1">Q${i+1}.</span> ${q.question}
                        </h4>
                        ${badge}
                    </div>
                    <div class="space-y-1">${opts}</div>
                </div>
            `;
        }).join('');
    }

    // --- Expose functions to Global Scope for HTML Buttons ---
    
    window.startExam = async function() {
        if (allQuestions.length === 0) {
            const btn = els.start.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = "<span>Loading...</span>";
            
            allQuestions = await fetchQuestions();
            
            btn.innerHTML = originalText;
            if (allQuestions.length === 0) return;
        }

        // Use the config constant
        currentQuestions = shuffleArray([...allQuestions]).slice(0, QUESTION_COUNT);
        
        // Update header total count
        if (els.totalQNum) els.totalQNum.textContent = QUESTION_COUNT;

        currentQuestionIndex = 0;
        userAnswers = new Array(QUESTION_COUNT).fill(null);
        timeRemaining = 15 * 60;
        
        els.start.classList.add('hidden');
        els.quiz.classList.remove('hidden');
        els.quiz.classList.add('flex');
        els.head.classList.remove('hidden');
        
        startTimer();
        loadQuestion();
    };

    window.selectOption = function(index) {
        userAnswers[currentQuestionIndex] = index;
        loadQuestion();
    };

    window.prevQuestion = function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            els.quiz.classList.remove('fade-in');
            void els.quiz.offsetWidth;
            els.quiz.classList.add('fade-in');
            loadQuestion();
        }
    };

    window.nextQuestion = function() {
        // Dynamic check for end of exam
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            els.quiz.classList.remove('fade-in');
            void els.quiz.offsetWidth;
            els.quiz.classList.add('fade-in');
            loadQuestion();
        } else {
            endExam();
        }
    };
});
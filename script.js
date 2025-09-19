// Floating icons generator
const icons = ["📘","🧮","🔬","💻","🧪","🎓","📝","📊","📡","⚡","📚","🧠"];
const floatingContainer = document.getElementById("floating-icons");
let iconInterval;

function createIcon(){
  if (!floatingContainer || floatingContainer.style.display === "none") return;

  const span = document.createElement("span");
  span.textContent = icons[Math.floor(Math.random()*icons.length)];
  span.style.left = Math.random() * 100 + "vw";
  span.style.fontSize = (1 + Math.random() * 2) + "rem";
  const duration = 4 + Math.random() * 10; // 8–18s
  span.style.animationDuration = duration + "s";
  floatingContainer.appendChild(span);

  // remove after animation
  setTimeout(()=> span.remove(), duration * 1000);
}

function startFloatingIcons(){
  floatingContainer.style.display = "block";
  if (!iconInterval) iconInterval = setInterval(createIcon, 1500);
}

function stopFloatingIcons(){
  floatingContainer.style.display = "none";
  clearInterval(iconInterval);
  iconInterval = null;
  floatingContainer.innerHTML = ""; // clear old
}





const screens = {
  login: document.getElementById("login-screen"),
  subject: document.getElementById("subject-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
  about: document.getElementById("about-screen"),
  leaderboard: document.getElementById("leaderboard-screen")
};


let currentSubject = "";
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questions = {
  math: [
    { q: "2 + 2 = ?", options: ["3","4","5","6"], answer: 1 },
    { q: "5 × 3 = ?", options: ["8","15","10","20"], answer: 1 },
    { q: "Square root of 16?", options: ["2","4","6","8"], answer: 1 },
    { q: "12 ÷ 3 = ?", options: ["3","4","5","6"], answer: 1 },
    { q: "10 - 7 = ?", options: ["2","3","5","7"], answer: 1 },
    { q: "100 ÷ 10 = ?", options: ["5","10","20","50"], answer: 1 },
    { q: "7 × 6 = ?", options: ["36","42","48","56"], answer: 1 },
    { q: "9 + 8 = ?", options: ["16","17","18","19"], answer: 1 },
    { q: "15 ÷ 5 = ?", options: ["2","3","4","5"], answer: 1 },
    { q: "3² = ?", options: ["6","7","8","9"], answer: 3 }
  ],
  physics: [
    { q: "Speed = ?", options: ["Distance/Time","Force×Mass","Work/Power","Energy×Time"], answer: 0 },
    { q: "SI unit of Force?", options: ["Newton","Joule","Watt","Pascal"], answer: 0 },
    { q: "Acceleration due to gravity (m/s²)?", options: ["8.9","9.8","10.5","9.0"], answer: 1 },
    { q: "Which is scalar?", options: ["Force","Velocity","Energy","Acceleration"], answer: 2 },
    { q: "Sound needs?", options: ["Vacuum","Medium","Light","Heat"], answer: 1 },
    { q: "Speed of light?", options: ["3×10⁸ m/s","3×10⁶ m/s","1.5×10⁸ m/s","None"], answer: 0 },
    { q: "SI unit of Power?", options: ["Watt","Newton","Pascal","Volt"], answer: 0 },
    { q: "Work = ?", options: ["Force×Distance","Force/Time","Mass×Speed","Energy/Time"], answer: 0 },
    { q: "Current unit?", options: ["Volt","Ampere","Ohm","Coulomb"], answer: 1 },
    { q: "Heat transfer in solids?", options: ["Conduction","Convection","Radiation","Fusion"], answer: 0 }
  ],
  chemistry: [
    { q: "H₂O is?", options: ["Oxygen","Water","Hydrogen","Salt"], answer: 1 },
    { q: "NaCl is?", options: ["Sugar","Salt","Acid","Base"], answer: 1 },
    { q: "CO₂ gas is?", options: ["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"], answer: 2 },
    { q: "pH of neutral water?", options: ["5","6","7","8"], answer: 2 },
    { q: "Gold symbol?", options: ["Gd","Ag","Au","Go"], answer: 2 },
    { q: "O₂ is?", options: ["Oxygen","Hydrogen","Nitrogen","Helium"], answer: 0 },
    { q: "Atomic number of H?", options: ["0","1","2","3"], answer: 1 },
    { q: "Acid taste?", options: ["Sweet","Bitter","Sour","Salty"], answer: 2 },
    { q: "Formula of Methane?", options: ["CH₂","CH₄","C₂H₆","C₂H₄"], answer: 1 },
    { q: "NaOH is?", options: ["Acid","Base","Salt","Water"], answer: 1 }
  ],
  cs: [
    { q: "CPU stands for?", options: ["Central Power Unit","Central Processing Unit","Computer Personal Unit","Control Processing Unit"], answer: 1 },
    { q: "HTML is?", options: ["Programming","Markup","Styling","Database"], answer: 1 },
    { q: "CSS used for?", options: ["Logic","Styling","Database","Storage"], answer: 1 },
    { q: "JS means?", options: ["Java Style","JavaScript","Jumbo Script","Just Style"], answer: 1 },
    { q: "Binary digits?", options: ["0 & 1","1 & 2","2 & 3","3 & 4"], answer: 0 },
    { q: "Database query language?", options: ["SQL","HTML","CSS","JS"], answer: 0 },
    { q: "Python is?", options: ["Snake","Markup","Programming","Styling"], answer: 2 },
    { q: "Java is?", options: ["OS","Programming","Game","Editor"], answer: 1 },
    { q: "OOP full form?", options: ["Object Oriented Programming","Object Open Processing","Only Oriented Processing","Oriented Object Program"], answer: 0 },
    { q: "C language was developed by?", options: ["James","Dennis Ritchie","Bill Gates","Elon Musk"], answer: 1 }
  ]
};

function show(screen){
  Object.values(screens).forEach(s => s.style.display = "none");
  screen.style.display = "flex";

  // floating icons only for quiz flow
  if (screen.id === "login-screen" || screen.id === "subject-screen" || screen.id === "quiz-screen") {
    startFloatingIcons();
  } else {
    stopFloatingIcons();
  }

  // if leaderboard screen, refresh it
  if (screen.id === "leaderboard-screen") updateLeaderboard();
}


function startQuiz(){
  if(document.getElementById("name").value.trim() === "") return alert("Enter your name!");
  show(screens.subject);
}

function chooseSubject(sub){
  currentSubject = sub;
  currentQuestion = 0;
  score = 0;
  show(screens.quiz);
  loadQuestion();
}

function loadQuestion(){
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s ⏳`;
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s ⏳`;
    if(timeLeft<=0){
      clearInterval(timer);
      nextQuestion();
    }
  },1000);

  const q = questions[currentSubject][currentQuestion];
  document.getElementById("question").textContent = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = ()=>checkAnswer(i,btn);
    optionsDiv.appendChild(btn);
  });
  document.getElementById("progress-bar").style.width = `${(currentQuestion/questions[currentSubject].length)*100}%`;
  document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(selected, btn){
  const q = questions[currentSubject][currentQuestion];
  const options = document.querySelectorAll("#options button");
  options.forEach((b,i)=>{
    if(i===q.answer) b.classList.add("correct");
    else if(i===selected) b.classList.add("wrong");
    b.disabled = true;
  });
  if(selected===q.answer) score++;
  document.getElementById("next-btn").style.display = "block";
  clearInterval(timer);
}

function nextQuestion(){
  currentQuestion++;
  if(currentQuestion<questions[currentSubject].length){
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz(){
  show(screens.result);

  const total = questions[currentSubject].length;
  const percent = Math.round((score / total) * 100);

  document.getElementById("score-text").textContent = `You scored ${score} out of ${total}`;
  document.getElementById("congrats-text").textContent = score > 5 
    ? "🎉 Congratulations! 🎉" 
    : "👍 Good Try, Keep Practicing!";

  startCelebration(); // 🎈 party time

  // Animate score ring with dynamic color
  const circle = document.getElementById("progress-ring");
  const percentText = document.getElementById("score-percent");
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let color = "#1dd1a1";
  if(percent < 40) color = "#ff6b6b"; // red
  else if(percent < 70) color = "#feca57"; // yellow
  circle.style.stroke = color;

  let progress = 0;
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  const interval = setInterval(() => {
    if(progress >= percent){
      clearInterval(interval);
    } else {
      progress++;
      const offset = circumference - (progress / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      percentText.textContent = `${progress}%`;
    }
  }, 20);
}
// ✅ Save to leaderboard
  const playerName = document.getElementById("name").value.trim();
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a,b)=> b.score - a.score);
  leaderboard = leaderboard.slice(0,5); // keep top 5
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  updateLeaderboard();

  function updateLeaderboard(){
  const tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach((entry, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding:10px;">${i+1}</td>
      <td style="padding:10px;">${entry.name}</td>
      <td style="padding:10px;">${entry.score}</td>
    `;
    tbody.appendChild(tr);
  });
}


function retryQuiz(){
  stopCelebration(); // ✅ stop balloons when retrying
  show(screens.subject);

  currentQuestion = 0;
  score = 0;
  clearInterval(timer);
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("options").innerHTML = "";
  document.getElementById("question").textContent = "";
}


function goHome(){
  stopCelebration(); // stop balloons & pops

  currentSubject = "";
  currentQuestion = 0;
  score = 0;
  clearInterval(timer);
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("options").innerHTML = "";
  document.getElementById("question").textContent = "";

  show(screens.subject);
}



let celebrationActive = false;
let celebrationFrame;

function startCelebration(){
  const canvas = document.getElementById("celebration-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const balloons = [];
  const particles = [];
  const colors = ["#ff6b6b","#feca57","#1dd1a1","#5f27cd","#48dbfb","#ff9ff3"];

  // Create balloons
  for(let i=0;i<30;i++){
    balloons.push({
      x: Math.random()*canvas.width,
      y: canvas.height + Math.random()*300,
      r: 25 + Math.random()*20,
      color: colors[Math.floor(Math.random()*colors.length)],
      speed: 1 + Math.random()*1.5,
      popped: false
    });
  }

  function drawBalloon(b){
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fillStyle = b.color;
    ctx.fill();

    // string
    ctx.beginPath();
    ctx.moveTo(b.x, b.y+b.r);
    ctx.lineTo(b.x, b.y+b.r+25);
    ctx.strokeStyle = "#555";
    ctx.stroke();
  }

  function drawParticles(){
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function updateParticles(){
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.r *= 0.95; // shrink
      if(p.r < 1) particles.splice(i,1);
    }
  }

  function popBalloon(b){
    b.popped = true;
    for(let i=0;i<20;i++){
      particles.push({
        x: b.x,
        y: b.y,
        r: 4+Math.random()*3,
        color: b.color,
        vx: (Math.random()-0.5)*6,
        vy: (Math.random()-0.5)*6
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    balloons.forEach(b=>{
      if(!b.popped) drawBalloon(b);
    });

    drawParticles();
  }

  function update(){
    balloons.forEach(b=>{
      if(!b.popped){
        b.y -= b.speed;
        if(Math.random() < 0.002) popBalloon(b); // random pop
        if(b.y < -50) { // reset if off screen
          b.y = canvas.height+50;
          b.popped = false;
        }
      }
    });

    updateParticles();
  }

  function loop(){
    if(!celebrationActive) return;
    draw();
    update();
    celebrationFrame = requestAnimationFrame(loop);
  }

  celebrationActive = true;
  loop();
}

function stopCelebration(){
  celebrationActive = false;
  const canvas = document.getElementById("celebration-canvas");
  const ctx = canvas.getContext("2d");
  cancelAnimationFrame(celebrationFrame);
  ctx.clearRect(0,0,canvas.width,canvas.height);
}




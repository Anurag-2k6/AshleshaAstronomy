const levels = [
  {name:"Micro World", subtitle:"Where the Universe gets unbelievably small.", icon:"🧬", scale:"~10⁻⁶ m", facts:["Cells are typically measured in micrometres — a millionth of a metre.","Molecules and atoms take us far below what the human eye can resolve." ]},
  {name:"Human Scale", subtitle:"The scale we experience every day.", icon:"🧍", scale:"~10⁰ m", facts:["A human is roughly a metre tall — tiny compared with planets, yet enormous compared with atoms.","Our everyday intuition works best around this scale." ]},
  {name:"Earth", subtitle:"Our home, suspended in space.", icon:"🌍", scale:"~10⁷ m", facts:["Earth's diameter is about 12,742 km.","More than 70% of Earth's surface is covered by oceans." ]},
  {name:"Solar System", subtitle:"One star, planets, moons and a lot of empty space.", icon:"☀️", scale:"~10¹³ m", facts:["Neptune orbits roughly 4.5 billion km from the Sun on average.","Light from the Sun takes about 8 minutes 20 seconds to reach Earth." ]},
  {name:"Milky Way", subtitle:"Our galaxy — one island in a cosmic sea.", icon:"🌌", scale:"~10²¹ m", facts:["The Milky Way is roughly 100,000 light-years across.","Our Solar System lies in the Orion Arm, far from the galactic centre." ]},
  {name:"Local Group", subtitle:"Galaxies bound together by gravity.", icon:"🌀", scale:"~10²³ m", facts:["The Local Group contains dozens of known galaxies, including the Milky Way and Andromeda.","Galaxies interact gravitationally across millions of light-years." ]},
  {name:"Observable Universe", subtitle:"The largest horizon we can currently observe.", icon:"✨", scale:"~10²⁶ m", facts:["The observable Universe is about 93 billion light-years across.","It contains an enormous number of galaxies, all seen from a finite cosmic horizon." ]}
];

let current = 0;
const $ = id => document.getElementById(id);

function renderRail(){
  const rail = $("railMarkers");
  rail.innerHTML = levels.map((_,i)=>`<button class="rail-marker ${i===current?"active":""}" style="top:${8 + i*14}%;" aria-label="Go to level ${i+1}" onclick="setLevel(${i})"></button>`).join("");
}
function renderDots(){
  $("dots").innerHTML = levels.map((_,i)=>`<span class="dot ${i===current?"active":""}" onclick="setLevel(${i})" role="button" tabindex="0"></span>`).join("");
}
function renderGrid(){
  $("levelGrid").innerHTML = levels.map((l,i)=>`
    <article class="level-tile ${i===current?"active":""}" onclick="setLevel(${i})">
      <span>0${i+1}</span><h3>${l.name}</h3><p>${l.subtitle}</p>
    </article>`).join("");
}
function setLevel(i, scroll=true){
  current = Math.max(0,Math.min(levels.length-1,i));
  const l = levels[current];
  $("levelEyebrow").textContent = `LEVEL ${String(current+1).padStart(2,"0")}`;
  $("levelTitle").textContent = l.name;
  $("levelSubtitle").textContent = l.subtitle;
  $("visualIcon").textContent = l.icon;
  $("scaleText").textContent = l.scale;
  $("fact1").textContent = l.facts[0];
  $("fact2").textContent = l.facts[1];
  $("levelCounter").textContent = `${String(current+1).padStart(2,"0")} / ${String(levels.length).padStart(2,"0")}`;
  $("progressBar").style.width = `${((current+1)/levels.length)*100}%`;
  $("nextBtn").textContent = current===levels.length-1 ? "Finish Journey ✦" : "Next Level →";
  $("prevBtn").style.opacity = current===0 ? ".45" : "1";
  renderRail(); renderDots(); renderGrid();
  $("visualCard").animate([{transform:"scale(.98)",opacity:.65},{transform:"scale(1)",opacity:1}],{duration:420,easing:"ease-out"});
  if(scroll) $("elevator").scrollIntoView({behavior:"smooth",block:"center"});
}
$("startBtn").onclick=()=>{setLevel(0);$("elevator").scrollIntoView({behavior:"smooth"})};
$("nextBtn").onclick=()=>{ if(current<levels.length-1)setLevel(current+1); else $("quizNext").scrollIntoView({behavior:"smooth"}) };
$("prevBtn").onclick=()=>{if(current>0)setLevel(current-1)};
$("restartBtn").onclick=()=>{setLevel(0);window.scrollTo({top:0,behavior:"smooth"})};

document.addEventListener("keydown",e=>{
  if(["ArrowDown","ArrowRight"].includes(e.key)){e.preventDefault();setLevel(current+1)}
  if(["ArrowUp","ArrowLeft"].includes(e.key)){e.preventDefault();setLevel(current-1)}
});

const questions=[
  {q:"Which object is closest to the human scale?",o:["A bacterium","A person","The Earth","The Milky Way"],a:1},
  {q:"What is the approximate diameter of the Milky Way?",o:["100 km","12,742 km","100,000 light-years","93 billion km"],a:2},
  {q:"Why can the observable Universe be smaller than the age of the Universe × speed of light intuition suggests?",o:["Light travels backwards","Space has expanded while light travelled","Gravity stops all light","Stars are transparent"],a:1}
];
let qi=0,score=0,answered=false;
function renderQuiz(){
  const q=questions[qi];
  $("quizCount").textContent=`Question ${qi+1} / ${questions.length}`;
  $("quizScore").textContent=`Score: ${score}`;
  $("quizQuestion").textContent=q.q;
  $("quizOptions").innerHTML=q.o.map((x,i)=>`<button class="option" onclick="answerQuiz(${i})">${x}</button>`).join("");
  $("quizNext").disabled=true;$("quizResult").textContent="";answered=false;
}
function answerQuiz(i){
  if(answered)return; answered=true;
  const q=questions[qi], opts=[...document.querySelectorAll(".option")];
  opts[q.a].classList.add("correct");
  if(i===q.a){score++;$("quizResult").textContent="Correct — cosmic thinking unlocked ✦";}
  else {opts[i].classList.add("wrong");$("quizResult").textContent="Not quite. The highlighted answer is correct."}
  $("quizScore").textContent=`Score: ${score}`;$("quizNext").disabled=false;
}
$("quizNext").onclick=()=>{
  if(qi<questions.length-1){qi++;renderQuiz()}
  else {$("quizResult").textContent=`Finished! You scored ${score}/${questions.length}. ✦`;$("quizNext").textContent="Restart Quiz";$("quizNext").onclick=()=>{qi=0;score=0;$("quizNext").textContent="Next Question →";renderQuiz()}}
};
let soundOn=false,audioCtx;
$("soundToggle").onclick=()=>{
  soundOn=!soundOn;$("soundToggle").innerHTML=soundOn?"♫ <span>Sound On</span>":"♫ <span>Sound</span>";
  if(soundOn){
    try{
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type="sine";osc.frequency.value=110;gain.gain.value=.012;osc.connect(gain).connect(audioCtx.destination);osc.start();
      setTimeout(()=>{gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1.8);osc.stop(audioCtx.currentTime+1.9)},100);
    }catch(e){}
  }
};
renderQuiz();setLevel(0,false);

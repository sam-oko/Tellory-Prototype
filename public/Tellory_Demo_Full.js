const STAGE = document.getElementById("stage");

const QUERIES = ["is HRT safe at 47?","bioidentical vs synthetic hormones","why am i not sleeping anymore","perimenopause brain fog reddit","why have i gained 15 lbs without changing anything","best OB-GYN menopause near me","estradiol patch 0.05 vs 0.075","when do hot flashes stop","vaginal dryness over the counter","DHEA dosage women 50","magnesium glycinate vs threonate","ashwagandha and HRT interaction","hair thinning women 50","tretinoin pregnancy safe","facelift vs Sofwave 2026","DEXA scan cost without insurance","pelvic floor PT covered","why am i crying randomly","creatine for women perimenopause","NAD+ vs NMN evidence","WHI study 2002 reanalysis","SSRIs for hot flashes safe?","does HRT cause breast cancer","joint pain age 49 ferritin","libido drop after 45","best supplement for cortisol","is intermittent fasting bad for women over 45","seed oils inflammation true?","perimenopause anxiety attacks","crepey neck home remedy","why is my hair falling out clumps","blood pressure rising menopause","fasting glucose 98 should i worry","do i need testosterone too","biote pellets reviews","compounded hormones FDA","thyroid TSH normal but tired"];

const HEADLINES = [
  {t:"HRT raises breast cancer risk.", by:"NYT 2002", contra:true},
  {t:"HRT is essential for women's longevity.", by:"Dr. Mary Claire Haver, 2024"},
  {t:"Cardio is the only thing that matters.", by:"Influencer A", contra:true},
  {t:"Lift heavy or accelerate sarcopenia.", by:"Dr. Stacy Sims"},
  {t:"Avoid all carbs after 45.", by:"Keto coach", contra:true},
  {t:"Carbs are essential for sleep.", by:"Registered dietitian"},
  {t:"Cold plunges reverse aging.", by:"Wellness podcast"},
  {t:"Cold plunges are placebo.", by:"Skeptic MD", contra:true},
  {t:"Bioidenticals are safer than synthetic.", by:"Functional clinic"},
  {t:"There's no clinical difference.", by:"NAMS 2024", contra:true},
  {t:"Eat 1 g protein per lb of body weight.", by:"Trainer 1"},
  {t:"That much protein damages kidneys.", by:"Nephrologist", contra:true},
  {t:"GLP-1s are the new HRT.", by:"WSJ 2025"},
  {t:"GLP-1s cause muscle loss in women.", by:"Endocrinology 2025", contra:true},
  {t:"Skip the retinol after menopause.", by:"Esthetician", contra:true},
  {t:"Retinoids are still gold-standard.", by:"Dermatologist"}
];
const APPTS = [
  {t:"OB-GYN: next opening Dec 14", m:"3-month wait"},
  {t:"Dermatologist: $475 / 15 min", m:"cash-pay only"},
  {t:"Endocrinologist: not accepting new", m:"waitlist closed"},
  {t:"Therapist: out of network", m:"$220 / session"},
  {t:"Trichologist: 92 mi away", m:"earliest April"},
  {t:"Pelvic floor PT: 6-wk wait", m:"hsa eligible"},
  {t:"Sleep clinic: insurance denied", m:"appeal pending"},
  {t:"Lab: estradiol order missing", m:"reorder needed"},
  {t:"Urogynecologist: 11-week wait", m:"queue position 84"},
  {t:"Plastic surgeon: $300 consult fee", m:"non-refundable"},
  {t:"Strength coach: full roster", m:"join waitlist"},
  {t:"Nutritionist: $250 intake", m:"3 visits min."}
];
const PILLS = [
  {n:"Magnesium glycinate",c:""},{n:"NAD+ NMN 500mg",c:"r"},{n:"DHEA 25mg",c:"b"},
  {n:"Estradiol patch",c:"r"},{n:"Progesterone 100mg",c:"r"},{n:"Black cohosh",c:"g"},
  {n:"Ashwagandha",c:"g"},{n:"Vitamin D3 K2",c:""},{n:"Omega-3 EPA 2g",c:""},
  {n:"Creatine 5g",c:"b"},{n:"Collagen peptides",c:""},{n:"Iron + C",c:"r"},
  {n:"Tretinoin 0.05%",c:"r"},{n:"Peptide serum",c:""},{n:"Minoxidil 5%",c:"r"},
  {n:"DHT-blocker shampoo",c:"b"},{n:"Biotin 5000",c:""},{n:"Pelvic trainer",c:"b"},
  {n:"Glucose monitor",c:"b"},{n:"Red light 660/850",c:"r"},{n:"L-theanine 200",c:"g"},
  {n:"Glycine 3g",c:""},{n:"Taurine 1g",c:""},{n:"Vit B-complex",c:""}
];
const ALARMS = [
  "&#9888; Lab portal: 4 unread results","&#9888; Insurance denied: HRT prior auth",
  "&#9888; Refill needed: 3 Rx tomorrow","&#9888; Conflicting advice from 2 doctors",
  "&#9888; Sleep score: 41/100",
  "&#9888; Bone density appointment missed",
  "&#9888; Symptom journal: 12 entries unsynced","&#9888; Prior auth expires in 6 days"
];

let running=false, paused=false, speedMul=4, raf=null;
const TOTAL_MS_AT_1X = 70000;
let elapsed=0, lastFrame=0;
const hoursPerDomain = { hormones:0,surgery:0,longevity:0,sexual:0,weight:0,mood:0,skin:0,hair:0 };
const domainMax = { hormones:230, surgery:60, longevity:90, sexual:80, weight:120, mood:160, skin:80, hair:44 };
let phaseIdx=-1;
const MAX_ELEMENTS = 220;

function setPhase(i){
  if(i===phaseIdx) return;
  phaseIdx = i;
  const names = ["Perimenopause","Menopause","Postmenopause"];
  document.getElementById("phaseLbl").textContent = names[i];
  document.querySelectorAll(".phase").forEach((el,idx)=>{
    el.classList.toggle("active", idx===i);
    el.classList.toggle("done", idx<i);
  });
  flashPhase(names[i], i);
}
function flashPhase(name,i){
  const f = document.getElementById("phaseFlash");
  const sub = ["4 years","1 year","30 years"][i];
  f.innerHTML = name + "<br><span style='font-size:24px;letter-spacing:.18em;color:#5a534f;font-family:Inter;font-weight:500;text-transform:uppercase'>" + sub + " alone</span>";
  f.classList.remove("show"); void f.offsetWidth; f.classList.add("show");
}
function rand(a,b){ return a + Math.random()*(b-a); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function placeRandom(el){
  const r = STAGE.getBoundingClientRect();
  const padL = 270, padR = 280;
  const x = rand(padL+10, r.width - padR - 280);
  const y = rand(60, r.height - 80);
  el.style.left = x + "px";
  el.style.top  = y + "px";
  el.style.transform = "rotate(" + rand(-3,3).toFixed(2) + "deg)";
}
function gc(){
  const all = STAGE.querySelectorAll(".el");
  if(all.length > MAX_ELEMENTS){
    const toKill = all.length - MAX_ELEMENTS + 10;
    for(let k=0;k<toKill && k<all.length;k++){
      const e = all[k]; e.style.transition="opacity .5s, transform .6s"; e.style.opacity="0";
      e.style.transform += " scale(.9)"; setTimeout(()=>e.remove(), 600);
    }
  }
}
function spawnTab(){ const el=document.createElement("div"); const hot=Math.random()<.3;
  el.className="el tab"+(hot?" hot":""); el.textContent=pick(QUERIES); placeRandom(el); STAGE.appendChild(el); gc(); }
function spawnAppt(){ const a=pick(APPTS); const el=document.createElement("div"); el.className="el appt";
  el.innerHTML="<b>"+a.t+"</b><div class='meta'>"+a.m+"</div>"; placeRandom(el); STAGE.appendChild(el); gc(); }
function spawnQuote(){ const q=pick(HEADLINES); const el=document.createElement("div");
  el.className="el quote"+(q.contra?" contra":""); el.innerHTML="&ldquo;"+q.t+"&rdquo;<span class='by'>"+q.by+"</span>";
  placeRandom(el); STAGE.appendChild(el); gc(); }
function spawnPill(){ const p=pick(PILLS); const el=document.createElement("div");
  el.className="el pill "+(p.c||""); el.textContent=p.n; placeRandom(el); STAGE.appendChild(el); gc(); }
function spawnAlarm(){ const el=document.createElement("div"); el.className="el alarm";
  el.innerHTML=pick(ALARMS); placeRandom(el); STAGE.appendChild(el); gc(); }
function tickDomain(){
  const allD = Object.keys(hoursPerDomain); const d = pick(allD);
  if(hoursPerDomain[d] < domainMax[d]){
    const inc = rand(0.4, 1.4);
    hoursPerDomain[d] = Math.min(domainMax[d], hoursPerDomain[d]+inc);
    const row = document.querySelector(".dom[data-d='"+d+"']");
    if(row){ row.querySelector(".bar i").style.width = (hoursPerDomain[d]/domainMax[d]*100).toFixed(0)+"%";
      row.querySelector(".n").textContent = Math.round(hoursPerDomain[d])+"h"; }
  }
}
function setTotal(h){ document.getElementById("hrs").textContent = Math.round(h).toLocaleString(); }
function setProgress(pct){ document.getElementById("fill").style.width = (pct*100).toFixed(1)+"%";
  document.getElementById("yrs").textContent = "Year "+Math.round(pct*35)+" of 35"; }

let lastSpawn = {tab:0,appt:0,quote:0,pill:0,alarm:0,domain:0};
function maybeSpawn(now){
  const cad = phaseIdx===0
    ? {tab:140, appt:550, quote:780, pill:520, alarm:1400, domain:55}
    : phaseIdx===1
    ? {tab:110, appt:380, quote:520, pill:380, alarm:900,  domain:40}
    : {tab:260, appt:900, quote:1400,pill:720, alarm:2200, domain:75};
  for(const k of Object.keys(cad)){
    if(now - lastSpawn[k] >= cad[k]){
      lastSpawn[k]=now;
      if(k==="tab") spawnTab(); else if(k==="appt") spawnAppt();
      else if(k==="quote") spawnQuote(); else if(k==="pill") spawnPill();
      else if(k==="alarm") spawnAlarm(); else if(k==="domain") tickDomain();
    }
  }
}
function loop(now){
  if(!running) return;
  if(!lastFrame) lastFrame = now;
  let dt = (now - lastFrame) * speedMul; if(paused) dt = 0;
  lastFrame = now; elapsed += dt;
  let pct = Math.min(1, elapsed / TOTAL_MS_AT_1X);
  let phase = pct < 0.4 ? 0 : (pct < 0.5 ? 1 : 2);
  setPhase(phase);
  let hrs;
  if(phase===0){ const p=pct/0.4; hrs=p*211; }
  else if(phase===1){ const p=(pct-0.4)/0.1; hrs=211+p*53; }
  else { const p=(pct-0.5)/0.5; hrs=264+p*600; }
  setTotal(hrs); setProgress(pct);
  if(!paused) maybeSpawn(now);
  if(pct >= 1){ finishChaos(); return; }
  raf = requestAnimationFrame(loop);
}
function startChaos(){
  document.getElementById("hint").classList.add("gone");
  document.getElementById("reveal").classList.remove("on");
  STAGE.querySelectorAll(".el").forEach(e=>e.remove());
  for(const k in hoursPerDomain){ hoursPerDomain[k]=0; }
  document.querySelectorAll(".dom .bar i").forEach(i=>i.style.width="0%");
  document.querySelectorAll(".dom .n").forEach(n=>n.textContent="0h");
  setTotal(0); setProgress(0);
  document.getElementById("mPeri").classList.remove("done");
  document.getElementById("mMeno").classList.remove("done");
  document.getElementById("mPost").classList.remove("done");
  phaseIdx=-1; elapsed=0; lastFrame=0; running=true; paused=false;
  for(const k in lastSpawn) lastSpawn[k]=0;
  document.getElementById("pauseBtn").textContent = "Pause";
  raf = requestAnimationFrame(loop);
}
function finishChaos(){
  running=false; cancelAnimationFrame(raf);
  setTotal(864);
  document.querySelectorAll(".phase").forEach(p=>{p.classList.remove("active");p.classList.add("done");});
  document.getElementById("mPeri").classList.add("done");
  document.getElementById("mMeno").classList.add("done");
  document.getElementById("mPost").classList.add("done");
  for(const d in domainMax){
    hoursPerDomain[d] = domainMax[d];
    const row = document.querySelector(".dom[data-d='"+d+"']");
    if(row){ row.querySelector(".bar i").style.width="100%";
      row.querySelector(".n").textContent = domainMax[d]+"h"; }
  }
  setTimeout(()=>document.getElementById("reveal").classList.add("on"), 600);
}

function setSegment(n){
  document.querySelectorAll(".seg .s").forEach((el,i)=>{
    el.classList.toggle("active", (i+1)===n);
    el.classList.toggle("done", (i+1)<n);
  });
}
function goToSolution(){
  running = false; cancelAnimationFrame(raf);
  document.getElementById("reveal").classList.remove("on");
  document.body.classList.remove("chaos-mode");
  document.body.classList.add("solution-mode");
  document.getElementById("act1").classList.remove("on");
  document.getElementById("act2").classList.add("on");
  document.getElementById("act3").classList.remove("on");
  setSegment(2);
  window.scrollTo({top:0, behavior:"instant"});
}
function goToAgents(){
  document.getElementById("act2").classList.remove("on");
  document.getElementById("act3").classList.add("on");
  setSegment(3);
  window.scrollTo({top:0, behavior:"smooth"});
  launchAgents();
  startDataMoat();
}
function goToStart(){
  document.body.classList.remove("solution-mode");
  document.body.classList.add("chaos-mode");
  document.getElementById("act2").classList.remove("on");
  document.getElementById("act3").classList.remove("on");
  document.getElementById("act1").classList.add("on");
  setSegment(1);
  const wrap = document.getElementById("agents"); wrap.innerHTML=""; wrap.dataset.built="";
  document.querySelectorAll(".kpi em").forEach(e=>e.textContent="0");
  stopDataMoat();
  document.getElementById("stream").innerHTML="";
  document.getElementById("bpsum").classList.remove("show");
  document.getElementById("nextBtn").classList.remove("show");
  document.getElementById("gen").disabled = false;
  document.getElementById("gen").textContent = "Generate longevity blueprint";
  document.getElementById("hint").classList.remove("gone");
  document.getElementById("reveal").classList.remove("on");
  STAGE.querySelectorAll(".el").forEach(e=>e.remove());
  for(const k in hoursPerDomain){ hoursPerDomain[k]=0; }
  document.querySelectorAll(".dom .bar i").forEach(i=>i.style.width="0%");
  document.querySelectorAll(".dom .n").forEach(n=>n.textContent="0h");
  document.querySelectorAll(".phase").forEach(p=>{p.classList.remove("active");p.classList.remove("done");});
  setTotal(0); setProgress(0);
  document.getElementById("mPeri").classList.remove("done");
  document.getElementById("mMeno").classList.remove("done");
  document.getElementById("mPost").classList.remove("done");
  phaseIdx=-1; elapsed=0;
  window.scrollTo({top:0,behavior:"instant"});
}

document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>c.classList.toggle("on")));
const ageEl = document.getElementById("age");
ageEl.addEventListener("input",()=>document.getElementById("agev").textContent=ageEl.value);

function streamLines(lines, container, onDone){
  let i = 0;
  function next(){
    if(i>=lines.length){ onDone && onDone(); return; }
    const line = lines[i++];
    const el = document.createElement("div");
    el.className = "line " + (line.k||"");
    const tick = line.k==="good" ? "&#10003;" : line.k==="warn" ? "&#9888;" : "&#9656;";
    el.innerHTML = "<span class='tick'>"+tick+"</span><span>"+line.t+"</span>";
    container.appendChild(el);
    requestAnimationFrame(()=>el.classList.add("show"));
    container.scrollTop = container.scrollHeight;
    setTimeout(next, line.d||520);
  }
  next();
}
function runBlueprint(){
  const btn = document.getElementById("gen"); btn.disabled=true; btn.textContent="Building blueprint...";
  const stream = document.getElementById("stream"); stream.innerHTML="";
  document.getElementById("bpsum").classList.remove("show");
  document.getElementById("nextBtn").classList.remove("show");
  const name = document.getElementById("name").value || "Sarah";
  const age = ageEl.value;
  const sx = Array.from(document.querySelectorAll('#symps .chip.on')).map(e=>e.textContent).join(", ");
  const lines = [
    {t:"Reading intake: "+name+", age "+age, d:380},
    {t:"Symptom cluster detected: "+(sx||"none selected"), d:520},
    {t:"Matching biology: estradiol decline, FSH elevation likely perimenopausal", d:620},
    {t:"Querying clinical literature: 312 papers, 2022-2026", d:640},
    {t:"Cross-referencing FDA HRT label updates (Nov 2025 + Feb 2026)", d:600, k:"good"},
    {t:"Ranking interventions by evidence strength + symptom fit", d:560},
    {t:"Flagging interaction risks: SSRI / SNRI conflict guardrails on", d:540, k:"warn"},
    {t:"Composing protocol across 8 dimensions", d:600},
    {t:"Routing assignments to specialist agents", d:500, k:"good"},
    {t:"Blueprint compiled: 24 protocol items, 6 provider matches", d:600, k:"good"}
  ];
  streamLines(lines, stream, ()=>{
    const sum = document.getElementById("bpsum");
    sum.innerHTML =
      "<div class='row'><span>Patient</span><b>"+name+", "+age+"</b></div>" +
      "<div class='row'><span>Phase</span><b>Late perimenopause</b></div>" +
      "<div class='row'><span>Protocol items</span><b>24 across 8 dimensions</b></div>" +
      "<div class='row'><span>Provider matches</span><b>6 (all clinically vetted)</b></div>" +
      "<div class='row'><span>Evidence basis</span><b>312 papers, FDA-current</b></div>";
    sum.classList.add("show");
    document.getElementById("nextBtn").classList.add("show");
    btn.disabled=false; btn.textContent="Regenerate blueprint";
    document.getElementById("forwho").textContent = name.split(" ")[0];
  });
}
document.getElementById("gen").addEventListener("click", runBlueprint);
document.getElementById("nextBtn").addEventListener("click", goToAgents);

const AGENTS = [
  {key:"hormones",ic:"&#9784;",name:"Hormones",plan:[
    {v:"BUY",t:"Bioidentical estradiol patch, 0.05mg/day"},
    {v:"BUY",t:"Micronized progesterone, 100mg nightly"},
    {v:"BOOK",t:"Endocrinologist consult, Dr. Patel, Tue 2:30pm"},
    {v:"BOOK",t:"Lab panel: estradiol, FSH, TSH, vitamin D"}]},
  {key:"surgery",ic:"&#9876;",name:"Surgery & Procedures",plan:[
    {v:"BUY",t:"Recovery kit: arnica, silicone strips, ice mask"},
    {v:"BOOK",t:"Facial consult, Dr. Talei, Aug 14"},
    {v:"BUY",t:"Pre-op skin prep regimen, 6 weeks"}]},
  {key:"longevity",ic:"&#129508;",name:"Longevity & Biohacking",plan:[
    {v:"BUY",t:"NAD+ precursor (NMN), 500mg/day"},
    {v:"BUY",t:"Red light panel, 660/850nm"},
    {v:"BOOK",t:"DEXA scan, Wed 10am"},
    {v:"BOOK",t:"IV NAD+ therapy, biweekly"}]},
  {key:"sexual",ic:"&#9829;",name:"Sexual Health",plan:[
    {v:"BUY",t:"Vaginal estradiol cream, prescribed"},
    {v:"BUY",t:"Pelvic floor trainer device"},
    {v:"BOOK",t:"Urogynecologist, Dr. Reyes, Aug 22"}]},
  {key:"weight",ic:"&#127947;",name:"Weight & Fitness",plan:[
    {v:"BUY",t:"Continuous glucose monitor, 90-day"},
    {v:"BUY",t:"Resistance bands + adjustable dumbbells"},
    {v:"BOOK",t:"Strength coach, 2x/week, Tu/Th 6:30am"},
    {v:"BOOK",t:"Macro-aware RD intake, Fri 11am"}]},
  {key:"mood",ic:"&#129504;",name:"Mindset & Mood",plan:[
    {v:"BUY",t:"Magnesium L-threonate, nightly"},
    {v:"BUY",t:"Omega-3 (high EPA), 2g/day"},
    {v:"BOOK",t:"Perimenopause therapist, Mon 5pm weekly"}]},
  {key:"skin",ic:"&#10024;",name:"Skincare & Beauty",plan:[
    {v:"BUY",t:"Tretinoin 0.05%, nightly"},
    {v:"BUY",t:"Peptide serum + SPF 50 routine"},
    {v:"BOOK",t:"Dermatologist, Dr. Colombo, skin baseline"}]},
  {key:"hair",ic:"&#10052;",name:"Hair",plan:[
    {v:"BUY",t:"Topical minoxidil 5% (women's)"},
    {v:"BUY",t:"DHT-aware shampoo + scalp serum"},
    {v:"BOOK",t:"Trichologist consult + PRP eval"}]}
];

function launchAgents(){
  const wrap = document.getElementById("agents");
  if(wrap.dataset.built) return;
  wrap.dataset.built = "1";
  wrap.innerHTML = "";
  AGENTS.forEach(a=>{
    const el = document.createElement("div");
    el.className = "agent"; el.dataset.key=a.key;
    el.innerHTML =
      "<div class='ah'>" +
      "<div class='ic'>"+a.ic+"</div>" +
      "<div class='name'>"+a.name+"</div>" +
      "<div class='status'>queued</div>" +
      "</div>" +
      "<div class='feed'></div>" +
      "<div class='ftr'><span>Agent: <b>"+a.name+"</b></span><span>v1.0</span></div>";
    wrap.appendChild(el);
  });
  let items=0, outcomes=0;
  const kpItems = document.querySelector("#kp-items em");
  const kpHrs   = document.querySelector("#kp-hrs em");
  const kpOut   = document.querySelector("#kp-out em");
  AGENTS.forEach((a, idx)=>{
    setTimeout(()=>{
      const card = wrap.querySelector("[data-key='"+a.key+"']");
      card.classList.add("live");
      card.querySelector(".status").textContent = "executing";
      const feed = card.querySelector(".feed");
      a.plan.forEach((row, j)=>{
        setTimeout(()=>{
          const r = document.createElement("div"); r.className="row";
          r.innerHTML = "<span class='verb "+row.v.toLowerCase()+"'>"+row.v+"</span><span>"+row.t+"</span>";
          feed.appendChild(r);
          requestAnimationFrame(()=>r.classList.add("show"));
          items++; outcomes++;
          kpItems.textContent = items;
          kpOut.textContent = outcomes;
          kpHrs.textContent = (items*36).toLocaleString();
          if(j===a.plan.length-1){
            setTimeout(()=>{ card.querySelector(".status").textContent="optimizing"; }, 700);
          }
        }, 500 + j*620);
      });
    }, 280 + idx*240);
  });
}

let dmTimer = null;
function startDataMoat(){
  const nodes = Array.from(document.querySelectorAll(".fw-node"));
  const arcs  = Array.from(document.querySelectorAll(".fw-orbit .arc"));
  if(!nodes.length) return;
  if(dmTimer){ clearInterval(dmTimer); dmTimer=null; }
  nodes.forEach(n=>n.classList.remove("active"));
  arcs.forEach(a=>a.classList.remove("active"));
  let i = 0;
  function tick(){
    nodes.forEach(n=>n.classList.remove("active"));
    arcs.forEach(a=>a.classList.remove("active"));
    nodes[i % nodes.length].classList.add("active");
    arcs[i % arcs.length].classList.add("active");
    i++;
  }
  tick();
  dmTimer = setInterval(tick, 1700);
  document.querySelectorAll(".bar-fill").forEach(el=>{
    el.style.height = "0%";
    const h = parseFloat(el.dataset.h);
    const d = parseInt(el.dataset.delay,10) || 200;
    setTimeout(()=>{ el.style.height = h + "%"; }, d);
  });
}
function stopDataMoat(){
  if(dmTimer){ clearInterval(dmTimer); dmTimer=null; }
  document.querySelectorAll(".fw-node").forEach(n=>n.classList.remove("active"));
  document.querySelectorAll(".fw-orbit .arc").forEach(a=>a.classList.remove("active"));
  document.querySelectorAll(".bar-fill").forEach(el=>{ el.style.height = "0%"; });
}

document.getElementById("startBtn").addEventListener("click", startChaos);
document.getElementById("replay2").addEventListener("click", function(){ goToStart(); setTimeout(startChaos, 200); });
document.getElementById("solBtn").addEventListener("click", goToSolution);
document.getElementById("replayBtn").addEventListener("click", function(){ goToStart(); setTimeout(startChaos, 200); });
document.getElementById("replay3").addEventListener("click", function(){ goToStart(); setTimeout(startChaos, 200); });
document.getElementById("pauseBtn").addEventListener("click", function(){
  if(!running) return;
  paused = !paused;
  document.getElementById("pauseBtn").textContent = paused ? "Resume" : "Pause";
});
document.querySelectorAll("#speed b").forEach(b=>{
  b.addEventListener("click", function(){
    document.querySelectorAll("#speed b").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    speedMul = parseFloat(b.dataset.s);
  });
});
document.querySelectorAll(".seg .s").forEach(function(el){
  el.addEventListener("click", function(){
    const n = parseInt(el.dataset.seg,10);
    if(n===1) goToStart();
    else if(n===2){
      document.body.classList.remove("chaos-mode"); document.body.classList.add("solution-mode");
      document.getElementById("act1").classList.remove("on");
      document.getElementById("act3").classList.remove("on");
      document.getElementById("act2").classList.add("on");
      setSegment(2); window.scrollTo({top:0,behavior:"instant"});
    } else if(n===3){
      document.body.classList.remove("chaos-mode"); document.body.classList.add("solution-mode");
      document.getElementById("act1").classList.remove("on");
      document.getElementById("act2").classList.remove("on");
      document.getElementById("act3").classList.add("on");
      setSegment(3); window.scrollTo({top:0,behavior:"instant"}); launchAgents(); startDataMoat();
    }
  });
});
setSegment(1);

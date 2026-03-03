import { useState, useEffect, useRef } from "react";

// ── THEME ──────────────────────────────────────────────
const T = {
  bg: "#0a0d0f", surface: "#111518", card: "#161b20", border: "#1e2730",
  accent: "#c9a84c", accent2: "#4ca8c9", accent3: "#c94c4c",
  text: "#e8e2d6", muted: "#6b7585", success: "#4caf7d",
};

// ── GLOBAL STYLES ──────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
    input,select,textarea{background:${T.surface};border:1px solid ${T.border};color:${T.text};border-radius:8px;padding:.6rem 1rem;font-family:'DM Sans',sans-serif;font-size:.88rem;width:100%;outline:none;transition:border-color .2s}
    input:focus,select:focus{border-color:${T.accent}}
    input::placeholder{color:${T.muted}}
    option{background:${T.surface};color:${T.text}}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-track{background:${T.surface}}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  `}</style>
);

// ── DATA ───────────────────────────────────────────────
const SUBJECTS = ["History","Geography","Polity","Economy","Environment","Science & Technology","Current Affairs","Ethics"];

const SUBJECT_PROGRESS = [
  {name:"History",pct:82},{name:"Geography",pct:74},{name:"Polity",pct:91},
  {name:"Economy",pct:60},{name:"Environment",pct:55},{name:"Science & Tech",pct:48},
  {name:"Current Affairs",pct:70},{name:"Ethics",pct:35},
];

const MATERIALS = [
  {id:1,subject:"History",topic:"Ancient India",title:"Indus Valley Civilisation — Complete Notes",excerpt:"Comprehensive coverage of Harappan culture, trade networks, town planning and decline theories.",difficulty:"intermediate",tags:["Prelims","Mains"],content:"The Indus Valley Civilisation (c. 3300–1300 BCE) was a Bronze Age civilisation in northwestern South Asia. Key cities: Mohenjo-daro, Harappa, Dholavira, Lothal. Features include advanced urban planning, drainage systems, standardised weights, and an undeciphered script. Trade links with Mesopotamia evidenced by seals at Ur. Declined ~1900 BCE — theories include climate change, flooding, and migration."},
  {id:2,subject:"Polity",topic:"Constitutional Amendments",title:"Major Constitutional Amendments — Quick Reference",excerpt:"All key amendments from 1st to 106th with significance and articles affected.",difficulty:"advanced",tags:["Prelims","GS-II"],content:"Key amendments: 1st (1951) — Schedule 9; 7th (1956) — State reorganisation; 42nd (1976) — 'Mini Constitution'; 44th (1978) — Restored fundamental rights; 73rd/74th (1992) — Panchayati Raj; 86th (2002) — Right to Education; 101st (2016) — GST; 103rd (2019) — EWS 10% reservation; 106th (2023) — Women reservation."},
  {id:3,subject:"Economy",topic:"Monetary Policy",title:"RBI & Monetary Policy Framework Explained",excerpt:"Repo rate, CRR, SLR, OMO — all monetary instruments with current figures.",difficulty:"intermediate",tags:["Prelims","Economy"],content:"RBI instruments: Repo Rate (lending to banks), Reverse Repo (borrowing from banks), CRR (Cash Reserve Ratio — % kept with RBI), SLR (Statutory Liquidity Ratio — liquid assets), OMOs (Open Market Operations). The MPC meets every two months. Current stance focuses on withdrawal of accommodation."},
  {id:4,subject:"Geography",topic:"Monsoon",title:"Indian Monsoon System — Mechanisms & Impact",excerpt:"Origin, advance, retreat, El Niño effects and regional variation of monsoons.",difficulty:"beginner",tags:["Prelims","Geography"],content:"Indian monsoon driven by differential heating. SW monsoon (June–Sept) brings 75% annual rainfall. ITCZ shifts northward in summer. El Niño suppresses; La Niña enhances monsoon. NE monsoon affects Tamil Nadu (Oct–Dec). Western Ghats cause orographic rainfall — windward heavy rain, leeward rain shadow."},
  {id:5,subject:"Environment",topic:"Biodiversity",title:"Biodiversity Hotspots & Conservation Strategies",excerpt:"India's 4 hotspots, IUCN categories, protected areas and key conventions.",difficulty:"intermediate",tags:["Prelims","Environment"],content:"India has 4 biodiversity hotspots: Western Ghats, Eastern Himalayas, Indo-Burma, Sundaland. Protected areas: 106 National Parks, 567 Wildlife Sanctuaries, 18 Biosphere Reserves. IUCN categories: Extinct → Critically Endangered → Endangered → Vulnerable. Key conventions: CBD (1992), CITES, Ramsar, CMS."},
  {id:6,subject:"Ethics",topic:"Case Studies",title:"Ethics Case Studies — Approach & Framework",excerpt:"How to structure Mains GS-IV answers, stakeholder analysis and ethical dilemmas.",difficulty:"advanced",tags:["Mains","GS-IV"],content:"GS-IV covers ethics, integrity, aptitude. Key concepts: Attitude (cognitive, affective, behavioural), EI (Goleman model), Ethical theories (Consequentialism, Deontology, Virtue Ethics). For case studies: identify stakeholders → list options → weigh consequences → apply constitutional framework → choose aligned with public interest."},
  {id:7,subject:"Science & Technology",topic:"Space Technology",title:"ISRO Missions & Space Technology for UPSC",excerpt:"Chandrayaan, Mangalyaan, Aditya-L1 — complete mission details and significance.",difficulty:"beginner",tags:["Prelims","S&T"],content:"Key ISRO missions: Chandrayaan-3 (2023) — first soft landing near lunar south pole; Mangalyaan/MOM (2014) — Mars Orbiter, cost-effective; Aditya-L1 (2023) — solar observatory at L1. Launch vehicles: PSLV (4-stage workhorse), LVM3 (heavy lift). India became 4th country to soft-land on the Moon."},
  {id:8,subject:"Current Affairs",topic:"International Relations",title:"India's Foreign Policy — Key Bilateral Relations 2024",excerpt:"India-US, India-China, QUAD, SCO, G20 presidency outcomes.",difficulty:"intermediate",tags:["Mains","GS-II"],content:"Foreign policy pillars: Strategic autonomy, Neighbourhood First, Act East, Think West. Partnerships: QUAD (India, US, Japan, Australia); G20 (India hosted 2023 — African Union admitted); SCO membership; India-Russia (S-400, oil imports); India-China (LAC disengagement rounds)."},
];

const QUESTIONS = [
  {id:1,question:"Which city of the Indus Valley Civilisation is located in present-day Gujarat?",options:["Mohenjo-daro","Harappa","Lothal","Kalibangan"],correct:2,explanation:"Lothal in present-day Gujarat was a major trade port of the IVC with a famous dockyard for maritime commerce.",subject:"History",difficulty:"easy"},
  {id:2,question:"The 42nd Constitutional Amendment is called 'Mini Constitution' because:",options:["It added a new schedule","It made sweeping changes to Preamble, FRs, and DPSPs","It established Panchayati Raj","It introduced GST"],correct:1,explanation:"The 42nd Amendment (1976) amended the Preamble, curtailed Fundamental Rights, expanded DPSPs, and altered the federal structure.",subject:"Polity",difficulty:"medium"},
  {id:3,question:"El Niño is associated with which effect on Indian monsoon?",options:["Above-normal rainfall","Below-normal rainfall / drought","No significant impact","Enhanced NE monsoon"],correct:1,explanation:"El Niño (anomalous warming of central/eastern Pacific) suppresses the Indian SW monsoon, often causing deficient rainfall.",subject:"Geography",difficulty:"easy"},
  {id:4,question:"The Monetary Policy Committee (MPC) of RBI has how many members?",options:["3","5","6","8"],correct:2,explanation:"The MPC has 6 members: 3 from RBI (Governor as Chair, Deputy Governor, one official) and 3 external experts appointed by GoI.",subject:"Economy",difficulty:"medium"},
  {id:5,question:"Which of India's biodiversity hotspots extends into Myanmar?",options:["Western Ghats","Indo-Burma","Eastern Himalayas","Sundaland"],correct:1,explanation:"The Indo-Burma hotspot covers northeastern India and extends into Myanmar, Thailand, Cambodia, Laos, Vietnam and southern China.",subject:"Environment",difficulty:"hard"},
  {id:6,question:"Chandrayaan-3 made India the ___ country to achieve a soft landing on the Moon.",options:["2nd","3rd","4th","5th"],correct:2,explanation:"India became the 4th country to soft-land on Moon (August 23, 2023), after USSR, USA, and China — first near the lunar south pole.",subject:"Science & Technology",difficulty:"easy"},
  {id:7,question:"The QUAD grouping consists of which four nations?",options:["India, US, UK, France","India, US, Japan, Australia","India, US, Japan, South Korea","India, US, Australia, New Zealand"],correct:1,explanation:"The Quad (Quadrilateral Security Dialogue) consists of India, USA, Japan, and Australia, focused on a free Indo-Pacific.",subject:"Current Affairs",difficulty:"easy"},
  {id:8,question:"Which amendment granted constitutional status to Panchayati Raj Institutions?",options:["68th","71st","73rd","76th"],correct:2,explanation:"The 73rd Amendment (1992) gave constitutional status to PRIs, adding Part IX and the 11th Schedule with mandatory elections.",subject:"Polity",difficulty:"medium"},
  {id:9,question:"G20 Summit hosted by India in 2023 admitted which new member?",options:["Bangladesh","African Union","ASEAN","Pakistan"],correct:1,explanation:"At the G20 New Delhi Summit (September 2023), the African Union was admitted as a permanent member.",subject:"Current Affairs",difficulty:"medium"},
  {id:10,question:"Which is NOT a monetary policy tool used by RBI?",options:["Repo Rate","Cash Reserve Ratio","Minimum Support Price","Open Market Operations"],correct:2,explanation:"Minimum Support Price (MSP) is an agricultural tool used by the government (Ministry of Agriculture), not the RBI.",subject:"Economy",difficulty:"hard"},
];

// ── UTILS ──────────────────────────────────────────────
const css = (obj) => Object.entries(obj).reduce((a,[k,v])=>({...a,[k]:v}),{});

// ── COMPONENTS ─────────────────────────────────────────
const Btn = ({children,variant="gold",size="md",style={},onClick,disabled}) => {
  const base = {display:"inline-flex",alignItems:"center",gap:"6px",border:"none",borderRadius:"8px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .2s",opacity:disabled?.5:1,...(size==="sm"?{padding:"6px 14px",fontSize:".8rem"}:{padding:"10px 22px",fontSize:".88rem"})};
  const variants = {
    gold:{background:T.accent,color:"#000"},
    outline:{background:"transparent",color:T.text,border:`1px solid ${T.border}`},
    ghost:{background:T.border,color:T.text},
    danger:{background:T.accent3,color:"#fff"},
  };
  return <button style={{...base,...variants[variant],...style}} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Badge = ({children,color="gold"}) => {
  const colors = {
    gold:{background:"rgba(201,168,76,.15)",color:T.accent,border:`1px solid rgba(201,168,76,.3)`},
    blue:{background:"rgba(76,168,201,.15)",color:T.accent2,border:`1px solid rgba(76,168,201,.3)`},
    red:{background:"rgba(201,76,76,.15)",color:T.accent3,border:`1px solid rgba(201,76,76,.3)`},
    green:{background:"rgba(76,175,125,.15)",color:T.success,border:`1px solid rgba(76,175,125,.3)`},
  };
  return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:"99px",fontSize:".7rem",fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",...colors[color]}}>{children}</span>;
};

const Card = ({children,style={},onClick}) => (
  <div onClick={onClick} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.5rem",...style}}>{children}</div>
);

const SectionTitle = ({children}) => (
  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"1rem",display:"flex",alignItems:"center",gap:"8px"}}>
    {children}
    <div style={{flex:1,height:"1px",background:T.border,marginLeft:"8px"}}/>
  </div>
);

const Toast = ({msg}) => (
  <div style={{position:"fixed",bottom:"2rem",right:"2rem",zIndex:500,background:T.card,border:`1px solid ${T.border}`,borderRadius:"10px",padding:".9rem 1.25rem",fontSize:".86rem",color:T.text,boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:"fadeUp .3s ease",pointerEvents:"none"}}>
    {msg}
  </div>
);

// ── PAGES ──────────────────────────────────────────────

// LANDING / AUTH
const LandingPage = ({onLogin}) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({email:"",password:"",name:"",year:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const handleLogin = () => {
    if(!form.email||!form.password) return;
    onLogin(form.email.split("@")[0]);
  };
  const handleRegister = () => {
    if(!form.name||!form.email||!form.password) return;
    onLogin(form.name.split(" ")[0]);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse 60% 50% at 70% 20%,rgba(201,168,76,.07) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 20% 80%,rgba(76,168,201,.05) 0%,transparent 60%),${T.bg}`,padding:"2rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",maxWidth:"1060px",width:"100%",alignItems:"center"}}>
        {/* Hero */}
        <div style={{animation:"fadeUp .5s ease"}}>
          <Badge color="gold">🏛 UPSC 2025–26 Preparation</Badge>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.6rem,5vw,4rem)",lineHeight:1.1,fontWeight:900,margin:"1.5rem 0"}}>
            Your <em style={{fontStyle:"normal",color:T.accent}}>Ace Path</em><br/>to Civil Services
          </h1>
          <p style={{color:T.muted,fontSize:"1.05rem",lineHeight:1.7,marginBottom:"2rem"}}>Structured study plans, curated materials, adaptive quizzes, and real-time analytics — everything you need to crack UPSC.</p>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <Btn onClick={()=>setTab("register")}>Start Preparing Free</Btn>
            <Btn variant="outline" onClick={()=>onLogin("Aspirant")}>View Demo →</Btn>
          </div>
          <div style={{display:"flex",gap:"2.5rem",marginTop:"2.5rem"}}>
            {[["12K+","Practice Questions"],["450+","Study Notes"],["98%","Syllabus Coverage"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.accent}}>{n}</div>
                <div style={{fontSize:".78rem",color:T.muted,marginTop:"2px"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"2.5rem",position:"relative",overflow:"hidden",animation:"fadeUp .6s ease"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${T.accent},${T.accent2})`}}/>
          <div style={{display:"flex",gap:"8px",marginBottom:"2rem"}}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:".6rem",textAlign:"center",borderRadius:"8px",cursor:"pointer",fontSize:".88rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all .2s",...(tab===t?{background:T.accent,color:"#000",border:`1px solid ${T.accent}`}:{background:T.surface,color:T.muted,border:`1px solid ${T.border}`})}}>
                {t==="login"?"Sign In":"Register"}
              </button>
            ))}
          </div>

          {tab==="login" ? (
            <div style={{animation:"fadeUp .3s ease"}}>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}/></div>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Password</label><input type="password" placeholder="Password" value={form.password} onChange={set("password")} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
              <Btn style={{width:"100%",justifyContent:"center",marginTop:"6px"}} onClick={handleLogin}>Sign In</Btn>
              <Divider/>
              <GoogleBtn onClick={()=>onLogin("Google User")}/>
              <p style={{textAlign:"center",marginTop:"1rem",fontSize:".8rem",color:T.muted}}><a href="#" style={{color:T.accent,textDecoration:"none"}}>Forgot password?</a></p>
            </div>
          ):(
            <div style={{animation:"fadeUp .3s ease"}}>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Full Name</label><input type="text" placeholder="Arjun Sharma" value={form.name} onChange={set("name")}/></div>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}/></div>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Password</label><input type="password" placeholder="Min 8 characters" value={form.password} onChange={set("password")}/></div>
              <div style={{marginBottom:"1rem"}}><label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"6px",fontWeight:500}}>Target Year</label>
                <select value={form.year} onChange={set("year")}><option value="">Select year</option>{["2025","2026","2027"].map(y=><option key={y}>{y}</option>)}</select>
              </div>
              <Btn style={{width:"100%",justifyContent:"center"}} onClick={handleRegister}>Create Account</Btn>
              <Divider/>
              <GoogleBtn onClick={()=>onLogin("Google User")}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:"1rem",color:T.muted,fontSize:".8rem",margin:"1.2rem 0"}}>
    <div style={{flex:1,height:"1px",background:T.border}}/> or continue with <div style={{flex:1,height:"1px",background:T.border}}/>
  </div>
);

const GoogleBtn = ({onClick}) => (
  <button onClick={onClick} style={{width:"100%",padding:".65rem",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"8px",color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:".88rem",fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>
    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    Continue with Google
  </button>
);

// DASHBOARD
const DashboardPage = ({user,onNav}) => {
  const studyPlan = [
    {task:"Read: Indus Valley Civilisation notes",subject:"History",done:true},
    {task:"Attempt 20 Polity MCQs",subject:"Polity",done:true},
    {task:"Watch: Monsoon mechanisms video",subject:"Geography",done:false},
    {task:"Revise: RBI instruments",subject:"Economy",done:false},
  ];
  const activities = [
    {text:"Completed Polity Mock Test — scored 84%",time:"2 hours ago"},
    {text:"Read: Major Constitutional Amendments",time:"5 hours ago"},
    {text:"Attempted 20 Geography questions",time:"Yesterday"},
    {text:"Started: RBI & Monetary Policy notes",time:"Yesterday"},
  ];
  const streakDays = [1,1,1,1,1,1,0,0,1,1,1,1,1,0,"today"];

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
        <div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700}}>Good morning, <span style={{color:T.accent}}>{user}</span> 👋</h1>
          <p style={{color:T.muted,fontSize:".88rem",marginTop:"4px"}}>Day 47 of your UPSC journey · <span style={{color:T.success}}>On Track</span></p>
        </div>
        <Btn onClick={()=>onNav("quiz")}>Start Quick Quiz →</Btn>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"2rem"}}>
        {[["Questions Solved","1,284","↑ 48 this week",T.accent],["Accuracy Rate","73%","↑ 5% vs last week",T.accent2],["Topics Covered","68/120","57% complete",T.success],["Study Hours","142","6.2 hrs this week",T.accent3]].map(([label,val,change,color])=>(
          <div key={label} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.25rem 1.5rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",background:color}}/>
            <div style={{fontSize:".75rem",color:T.muted,fontWeight:500,marginBottom:"6px",textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700}}>{val}</div>
            <div style={{fontSize:".78rem",color:T.success,marginTop:"4px"}}>{change}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"1.5rem"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <Card>
            <SectionTitle>Subject Coverage</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {SUBJECT_PROGRESS.map(s=>(
                <div key={s.name} style={{display:"flex",alignItems:"center",gap:"12px"}}>
                  <span style={{fontSize:".85rem",width:"140px",flexShrink:0}}>{s.name}</span>
                  <div style={{flex:1,height:"6px",background:T.border,borderRadius:"99px",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:"99px",background:`linear-gradient(90deg,${T.accent},${T.accent2})`,width:`${s.pct}%`,transition:"width 1s ease"}}/>
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".75rem",color:T.muted,width:"36px",textAlign:"right"}}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle>Today's Study Plan</SectionTitle>
            {studyPlan.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 0",borderBottom:i<studyPlan.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:"18px",height:"18px",borderRadius:"50%",border:`2px solid ${t.done?T.success:T.border}`,background:t.done?T.success:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:".65rem",color:"#fff"}}>{t.done?"✓":""}</div>
                <span style={{fontSize:".84rem",textDecoration:t.done?"line-through":"none",color:t.done?T.muted:T.text,flex:1}}>{t.task}</span>
                <Badge color="blue">{t.subject}</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <Card>
            <SectionTitle>Study Streak</SectionTitle>
            <div style={{textAlign:"center",padding:"1.5rem",background:"linear-gradient(135deg,rgba(201,168,76,.08),rgba(76,168,201,.05))",borderRadius:"12px",border:`1px solid rgba(201,168,76,.2)`,marginBottom:"1rem"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"3.5rem",fontWeight:900,color:T.accent,lineHeight:1}}>🔥 14</div>
              <div style={{fontSize:".82rem",color:T.muted,marginTop:"6px"}}>days in a row</div>
              <div style={{display:"flex",justifyContent:"center",gap:"5px",marginTop:"12px",flexWrap:"wrap"}}>
                {streakDays.map((d,i)=>(
                  <div key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:d==="today"?T.accent2:d?T.accent:T.border,boxShadow:d==="today"?`0 0 8px ${T.accent2}`:"none"}}/>
                ))}
              </div>
            </div>
            <Btn variant="ghost" style={{width:"100%",justifyContent:"center"}} onClick={()=>onNav("progress")}>View Full Progress</Btn>
          </Card>
          <Card>
            <SectionTitle>Recent Activity</SectionTitle>
            {activities.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",padding:"12px 0",borderBottom:i<activities.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:T.accent,marginTop:"5px",flexShrink:0}}/>
                <div>
                  <div style={{fontSize:".84rem",lineHeight:1.5}}>{a.text}</div>
                  <div style={{fontSize:".75rem",color:T.muted,marginTop:"2px"}}>{a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

// MATERIALS
const MaterialsPage = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MATERIALS.filter(m =>
    (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.topic.toLowerCase().includes(search.toLowerCase())) &&
    (!subject || m.subject === subject) &&
    (!difficulty || m.difficulty === difficulty)
  );

  const diffColor = d => d==="advanced"?"red":d==="beginner"?"green":"blue";

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{marginBottom:"2rem"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700}}>Study Materials</h1>
        <p style={{color:T.muted,fontSize:".88rem",marginTop:"4px"}}>450+ curated notes across all UPSC subjects</p>
      </div>

      <div style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"1.5rem",alignItems:"center"}}>
        <input style={{flex:1,minWidth:"200px"}} placeholder="🔍  Search topics, subjects..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{width:"auto",minWidth:"150px"}} value={subject} onChange={e=>setSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {SUBJECTS.map(s=><option key={s}>{s}</option>)}
        </select>
        <select style={{width:"auto",minWidth:"140px"}} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem"}}>
        {filtered.map(m=>(
          <div key={m.id} onClick={()=>setSelected(m)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.25rem",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",gap:"10px"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.accent2}}>{m.subject}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,lineHeight:1.3}}>{m.title}</div>
            <div style={{fontSize:".82rem",color:T.muted,lineHeight:1.6,flex:1}}>{m.excerpt}</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              <Badge color={diffColor(m.difficulty)}>{m.difficulty}</Badge>
              {m.tags.map(t=><Badge key={t} color="gold">{t}</Badge>)}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .2s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"2rem",maxWidth:"680px",width:"90%",maxHeight:"85vh",overflowY:"auto",position:"relative"}}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:"1rem",right:"1rem",background:T.border,border:"none",borderRadius:"50%",width:"32px",height:"32px",cursor:"pointer",color:T.text,fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            <div style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.accent2}}>{selected.subject} · {selected.topic}</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",marginTop:"8px",marginBottom:"8px"}}>{selected.title}</h2>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"1rem"}}>
              <Badge color={diffColor(selected.difficulty)}>{selected.difficulty}</Badge>
              {selected.tags.map(t=><Badge key={t} color="gold">{t}</Badge>)}
            </div>
            <p style={{fontSize:".9rem",color:T.muted,lineHeight:1.85}}>{selected.content}</p>
            <div style={{marginTop:"1.5rem",display:"flex",gap:"10px"}}>
              <Btn size="sm" onClick={()=>setSelected(null)}>Done Reading</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// QUIZ
const QuizPage = () => {
  const [phase, setPhase] = useState("setup"); // setup | quiz | result
  const [cfg, setCfg] = useState({subject:"All",difficulty:"easy",n:10,mode:"practice"});
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({correct:0,wrong:0,skipped:0});
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);

  const startQuiz = () => {
    let pool = QUESTIONS;
    if(cfg.subject !== "All") pool = pool.filter(q=>q.subject===cfg.subject);
    if(!pool.length) pool = QUESTIONS;
    const shuffled = [...pool].sort(()=>Math.random()-.5).slice(0,Math.min(cfg.n,pool.length));
    setQs(shuffled); setCur(0); setStats({correct:0,wrong:0,skipped:0});
    setAnswered(false); setSelected(null);
    setPhase("quiz");
  };

  useEffect(()=>{
    if(phase!=="quiz") return;
    const secs = cfg.mode==="mock"?60:120;
    setTimeLeft(secs);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){ clearInterval(timerRef.current); handleSkip(); return 0; }
        return t-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[cur,phase]);

  const handleAnswer = idx => {
    if(answered) return;
    clearInterval(timerRef.current);
    setAnswered(true); setSelected(idx);
    const q = qs[cur];
    if(idx===q.correct) setStats(s=>({...s,correct:s.correct+1}));
    else setStats(s=>({...s,wrong:s.wrong+1}));
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    if(!answered) setStats(s=>({...s,skipped:s.skipped+1}));
    advance();
  };

  const advance = () => {
    if(cur+1>=qs.length){ setPhase("result"); return; }
    setCur(c=>c+1); setAnswered(false); setSelected(null);
  };

  const q = qs[cur];
  const score = qs.length ? Math.round((stats.correct/qs.length)*100) : 0;
  const letters = ["A","B","C","D"];
  const timerColor = timeLeft<20?T.accent3:T.accent;
  const mm = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const ss = String(timeLeft%60).padStart(2,"0");

  const OptionPicker = ({label,options,field,multi=false}) => (
    <div style={{marginBottom:"1.25rem"}}>
      <label style={{fontSize:".82rem",color:T.muted,display:"block",marginBottom:"8px",fontWeight:500}}>{label}</label>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
        {options.map(o=>(
          <button key={o} onClick={()=>setCfg(c=>({...c,[field]:o}))} style={{padding:"8px 16px",background:cfg[field]===o?"rgba(201,168,76,.1)":T.surface,border:`1px solid ${cfg[field]===o?T.accent:T.border}`,borderRadius:"8px",color:cfg[field]===o?T.accent:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:".84rem",cursor:"pointer",transition:"all .2s"}}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  if(phase==="setup") return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700}}>Practice Quiz</h1>
        <p style={{color:T.muted,fontSize:".88rem",marginTop:"4px"}}>Choose your preferences and test your knowledge</p>
      </div>
      <div style={{maxWidth:"620px",margin:"0 auto"}}>
        <Card>
          <OptionPicker label="Subject" options={["All",...SUBJECTS]} field="subject"/>
          <OptionPicker label="Difficulty" options={["easy","medium","hard"]} field="difficulty"/>
          <OptionPicker label="Number of Questions" options={[10,20,30]} field="n"/>
          <OptionPicker label="Mode" options={["practice","mock","pyq"]} field="mode"/>
          <Btn style={{width:"100%",justifyContent:"center",padding:"14px",marginTop:"8px"}} onClick={startQuiz}>Start Quiz →</Btn>
        </Card>
      </div>
    </div>
  );

  if(phase==="quiz" && q) return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{maxWidth:"780px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
          <span style={{fontSize:".82rem",color:T.muted}}>Question {cur+1} of {qs.length}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"1rem",color:timerColor,fontWeight:600}}>{mm}:{ss}</span>
        </div>
        <div style={{height:"4px",background:T.border,borderRadius:"99px",marginBottom:"2rem",overflow:"hidden"}}>
          <div style={{height:"100%",background:T.accent,borderRadius:"99px",width:`${(cur/qs.length)*100}%`,transition:"width .4s ease"}}/>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",lineHeight:1.5,marginBottom:"1.75rem",fontWeight:600}}>{q.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {q.options.map((opt,i)=>{
            let bg = T.surface, border = T.border, color = T.text;
            if(answered){
              if(i===q.correct){bg="rgba(76,175,125,.1)";border=T.success;color=T.success;}
              else if(i===selected&&i!==q.correct){bg="rgba(201,76,76,.1)";border=T.accent3;color=T.accent3;}
            } else if(selected===i){bg="rgba(76,168,201,.1)";border=T.accent2;}
            return (
              <button key={i} onClick={()=>handleAnswer(i)} disabled={answered} style={{padding:"14px 18px",background:bg,border:`1px solid ${border}`,borderRadius:"10px",color,fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",cursor:answered?"default":"pointer",textAlign:"left",display:"flex",gap:"14px",alignItems:"center",transition:"all .2s"}}>
                <span style={{width:"28px",height:"28px",borderRadius:"50%",background:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,flexShrink:0}}>{letters[i]}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{marginTop:"1.5rem",padding:"1rem 1.25rem",background:"rgba(201,168,76,.06)",border:`1px solid rgba(201,168,76,.2)`,borderRadius:"10px",fontSize:".86rem",lineHeight:1.7,animation:"fadeUp .3s ease"}}>
            <strong style={{color:T.accent}}>Explanation: </strong>{q.explanation}
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"2rem"}}>
          <Btn variant="ghost" onClick={handleSkip}>Skip</Btn>
          {answered && <Btn onClick={advance}>{cur+1<qs.length?"Next →":"See Results"}</Btn>}
        </div>
      </div>
    </div>
  );

  if(phase==="result") return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{maxWidth:"680px",margin:"0 auto",textAlign:"center"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700,marginBottom:"8px"}}>Quiz Complete! 🎉</h1>
        <p style={{color:T.muted,marginBottom:"2.5rem"}}>Here's how you did</p>
        <div style={{width:"160px",height:"160px",borderRadius:"50%",background:`conic-gradient(${T.accent} 0% ${score}%, ${T.border} 0%)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 2.5rem",position:"relative"}}>
          <div style={{position:"absolute",inset:"12px",borderRadius:"50%",background:T.card}}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:"2.2rem",fontWeight:900,color:T.accent,position:"relative",zIndex:1}}>{score}%</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"2rem"}}>
          {[[stats.correct,"Correct",T.success],[stats.wrong,"Incorrect",T.accent3],[stats.skipped,"Skipped",T.muted]].map(([n,l,c])=>(
            <div key={l} style={{padding:"1rem",background:T.surface,borderRadius:"10px",border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:c}}>{n}</div>
              <div style={{fontSize:".78rem",color:T.muted,marginTop:"2px"}}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{color:T.muted,fontSize:".9rem",marginBottom:"2rem"}}>
          {score>=90?"🏆 Outstanding! You're on track for top ranks!":score>=75?"✅ Great performance! Keep the momentum.":score>=60?"📚 Good effort! Focus on weak areas.":"💪 Keep going! Review explanations and retry."}
        </p>
        <div style={{display:"flex",gap:"1rem",justifyContent:"center"}}>
          <Btn onClick={()=>{setPhase("setup");setCur(0);}}>Try Again</Btn>
          <Btn variant="outline" onClick={()=>setPhase("setup")}>Change Settings</Btn>
        </div>
      </div>
    </div>
  );
};

// PROGRESS
const ProgressPage = () => {
  const scores = [55,62,58,71,68,74,70,79];
  const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  const maxScore = Math.max(...scores);
  const accData = [
    {name:"Polity",pct:84,color:"#4ca8c9"},{name:"History",pct:72,color:"#c9a84c"},
    {name:"Geography",pct:68,color:"#4caf7d"},{name:"Economy",pct:61,color:"#c94c4c"},
    {name:"Environment",pct:55,color:"#a84cc9"},{name:"Ethics",pct:48,color:"#c9784c"},
  ];
  const heatLevels = ["","l1","l2","l3","l4"];
  const heatData = Array.from({length:26*7},()=>Math.random()<.35?"":[...heatLevels].sort(()=>Math.random()-.5)[0]);
  const heatColors = {"":"var(--border)","l1":"rgba(201,168,76,.2)","l2":"rgba(201,168,76,.45)","l3":"rgba(201,168,76,.7)","l4":T.accent};

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem",animation:"fadeUp .4s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
        <div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700}}>Your Progress</h1>
          <p style={{color:T.muted,fontSize:".88rem",marginTop:"4px"}}>Analytics across all subjects and sessions</p>
        </div>
        <Badge color="gold">🏆 Rank #127 This Week</Badge>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
        {[["Total Attempts","38",T.accent],["Best Score","92%",T.accent2],["Avg Score","71%",T.success],["Study Hours","142",T.accent3]].map(([l,v,c])=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.25rem 1.5rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",background:c}}/>
            <div style={{fontSize:".75rem",color:T.muted,fontWeight:500,marginBottom:"6px",textTransform:"uppercase",letterSpacing:".05em"}}>{l}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <Card style={{marginBottom:"1.5rem",gridColumn:"1/-1"}}>
        <SectionTitle>Study Activity — Last 6 Months</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(26,1fr)",gap:"3px",marginTop:"8px"}}>
          {heatData.map((l,i)=>(
            <div key={i} style={{aspectRatio:"1",borderRadius:"3px",background:heatColors[l]||T.border}}/>
          ))}
        </div>
        <div style={{display:"flex",gap:"6px",alignItems:"center",marginTop:"10px",fontSize:".74rem",color:T.muted}}>
          Less
          {["",T.border,"rgba(201,168,76,.2)","rgba(201,168,76,.5)",T.accent].map((c,i)=>(
            <div key={i} style={{width:"10px",height:"10px",borderRadius:"2px",background:c||T.border}}/>
          ))}
          More
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
        <Card>
          <SectionTitle>Weekly Quiz Scores</SectionTitle>
          <div style={{display:"flex",alignItems:"flex-end",gap:"6px",height:"120px",marginTop:"8px"}}>
            {scores.map((s,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",height:"100%",justifyContent:"flex-end"}}>
                <span style={{fontSize:".68rem",color:T.muted}}>{s}%</span>
                <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:`linear-gradient(180deg,${T.accent},rgba(201,168,76,.4))`,height:`${(s/maxScore)*100}%`,minHeight:"4px"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
            {weeks.map(w=><span key={w} style={{fontSize:".7rem",color:T.muted,flex:1,textAlign:"center"}}>{w}</span>)}
          </div>
        </Card>

        <Card>
          <SectionTitle>Subject Accuracy</SectionTitle>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"}}>
            {accData.map(a=>(
              <div key={a.name} style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <span style={{fontSize:".82rem",width:"110px",flexShrink:0}}>{a.name}</span>
                <div style={{flex:1,height:"8px",background:T.border,borderRadius:"99px",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:"99px",background:a.color,width:`${a.pct}%`,transition:"width .8s ease"}}/>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".75rem",color:T.muted,width:"36px",textAlign:"right"}}>{a.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── NAV ────────────────────────────────────────────────
const Nav = ({active, onNav, onLogout}) => {
  const links = [["dashboard","Dashboard"],["materials","Materials"],["quiz","Quiz"],["progress","Progress"]];
  return (
    <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,13,15,.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:"60px"}}>
      <div onClick={()=>onNav("dashboard")} style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",color:T.accent,cursor:"pointer"}}>
        UPSC <span style={{color:T.text,fontWeight:400}}>Ace Path</span>
      </div>
      <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
        {links.map(([page,label])=>(
          <button key={page} onClick={()=>onNav(page)} style={{padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:".85rem",fontWeight:500,border:"none",transition:"all .2s",background:active===page?T.border:"transparent",color:active===page?T.text:T.muted,fontFamily:"'DM Sans',sans-serif"}}>
            {label}{page==="quiz"&&<span style={{background:T.accent,color:"#000",fontSize:".65rem",fontWeight:700,padding:"2px 6px",borderRadius:"99px",marginLeft:"6px"}}>NEW</span>}
          </button>
        ))}
        <button onClick={onLogout} style={{marginLeft:"8px",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:".82rem",fontWeight:600,border:`1px solid ${T.border}`,background:"transparent",color:T.text,fontFamily:"'DM Sans',sans-serif"}}>Logout</button>
      </div>
    </nav>
  );
};

// ── APP ────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleLogin = name => { setUser(name); setPage("dashboard"); showToast(`Welcome, ${name}!`); };
  const handleLogout = () => { setUser(null); showToast("Signed out"); };

  return (
    <div style={{background:T.bg,minHeight:"100vh",color:T.text}}>
      <GlobalStyle/>
      {!user ? (
        <LandingPage onLogin={handleLogin}/>
      ) : (
        <>
          <Nav active={page} onNav={setPage} onLogout={handleLogout}/>
          {page==="dashboard" && <DashboardPage user={user} onNav={setPage}/>}
          {page==="materials" && <MaterialsPage/>}
          {page==="quiz" && <QuizPage/>}
          {page==="progress" && <ProgressPage/>}
        </>
      )}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}
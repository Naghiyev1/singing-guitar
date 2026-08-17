"use client";

import { useEffect, useRef, useState } from "react";

type Video = { label: string; channel: string; url: string };
type LessonMeta = {
  week: number;
  phase: number;
  title: string;
  kicker: string;
  minutes: number;
  focus: string;
  videos: Video[];
  references?: number[];
};

type ParsedLesson = { title: string; body: string };
type View = "course" | "practice" | "repertoire";
type LessonTab = "lesson" | "tab" | "practice" | "notes";

const phases = [
  { id: 0, label: "First sounds", range: "Weeks 1–2", color: "acid", description: "Four riffs you can play immediately." },
  { id: 1, label: "Blues repertoire", range: "Weeks 3–10", color: "orange", description: "Groove, bends, vibrato and phrasing." },
  { id: 2, label: "Jazz standards", range: "Weeks 11–18", color: "blue", description: "Melody, swing and changing harmony." },
  { id: 3, label: "Neo-soul feel", range: "Weeks 19–24", color: "pink", description: "Pocket, legato and original pieces." },
  { id: 4, label: "The recital", range: "Weeks 25–30", color: "cream", description: "Turn your repertoire into a performance." },
];

const lessons: LessonMeta[] = [
  { week: 1, phase: 0, title: "Seven Nation Army + Smoke on the Water", kicker: "Your first two riffs", minutes: 20, focus: "Single-string control and double-stops", videos: [
    { label: "Seven Nation Army — beginner lesson", channel: "Marty Music", url: "https://www.youtube.com/watch?v=UO4-S8KRkSg" },
    { label: "Smoke on the Water — full riff lesson", channel: "Marty Music", url: "https://www.youtube.com/watch?v=tCQ0r7vqkFQ" },
  ]},
  { week: 2, phase: 0, title: "Iron Man + Come As You Are", kicker: "Weight and texture", minutes: 20, focus: "Power shapes, palm muting and clean changes", videos: [
    { label: "Iron Man — riff and song tutorial", channel: "Marty Music", url: "https://www.youtube.com/watch?v=q8jrm91bqog" },
    { label: "Come As You Are — intro, chords and feel", channel: "Marty Music", url: "https://www.youtube.com/watch?v=3UV1CtIUOmU" },
  ]},
  { week: 3, phase: 1, title: "Mannish Boy", kicker: "Your first blues groove", minutes: 25, focus: "Triplet feel, stamina and pulse", videos: [{ label: "Mannish Boy — blues guitar lesson", channel: "Blues Guitar Institute", url: "https://www.youtube.com/watch?v=aIcQdZ8dXKY" }] },
  { week: 4, phase: 1, title: "The Thrill Is Gone", kicker: "Your first real solo", minutes: 25, focus: "Minor pentatonic, bending and space", videos: [{ label: "The Thrill Is Gone — step-by-step lesson", channel: "GuitarZero2Hero", url: "https://www.youtube.com/watch?v=F_ro_EHlfE0" }] },
  { week: 5, phase: 1, title: "Mary Had a Little Lamb", kicker: "Make the guitar sing", minutes: 25, focus: "Vocal phrasing, bend accuracy and breath", videos: [{ label: "Buddy Guy’s Mary Had a Little Lamb", channel: "Jon MacLennan", url: "https://www.youtube.com/watch?v=0Z2PnB__Ob4" }] },
  { week: 6, phase: 1, title: "Boom Boom", kicker: "Loose, hypnotic shuffle", minutes: 25, focus: "Shuffle rhythm and groove over perfection", videos: [{ label: "Boom Boom — beginner blues lesson", channel: "BlitzGuitar", url: "https://www.youtube.com/watch?v=Z4bzTcqpwHY" }] },
  { week: 7, phase: 1, title: "Born Under a Bad Sign", kicker: "Riff meets solo", minutes: 25, focus: "Barres, position shifts and expressive bends", videos: [{ label: "Born Under a Bad Sign — full lesson", channel: "Marty Music", url: "https://www.youtube.com/watch?v=mN6pAWlBs1I" }] },
  { week: 8, phase: 1, title: "Sweet Little Angel", kicker: "Enter the B.B. Box", minutes: 25, focus: "High-register phrasing and controlled vibrato", videos: [
    { label: "Sweet Little Angel — lesson with tabs", channel: "Jon MacLennan", url: "https://www.youtube.com/watch?v=TKDOV78dc8U" },
    { label: "The B.B. King Box explained", channel: "Guitar Tricks", url: "https://www.youtube.com/watch?v=a1PTtoXZ-xM" },
  ]},
  { week: 9, phase: 1, title: "Red House", kicker: "Call and response", minutes: 30, focus: "Conversational phrasing and silence", videos: [{ label: "Red House inspired guitar lesson", channel: "Marty Music", url: "https://www.youtube.com/watch?v=hX7yZUecRPI" }] },
  { week: 10, phase: 1, title: "The Blues Mini-Recital", kicker: "Checkpoint one", minutes: 30, focus: "Memory, recovery and performance flow", videos: [{ label: "Five practical blues guitar tips", channel: "Blues Guitar Unleashed", url: "https://www.youtube.com/watch?v=Z78T_p07vCE" }], references: [3, 4, 5, 6, 7, 8, 9] },
  { week: 11, phase: 2, title: "Autumn Leaves", kicker: "The melody", minutes: 25, focus: "Connected notes, clean tone and resolution", videos: [{ label: "Autumn Leaves — melody lesson", channel: "JustinGuitar", url: "https://www.youtube.com/watch?v=AIMyL4rtvQQ" }] },
  { week: 12, phase: 2, title: "Blue Bossa", kicker: "Your first jazz solo", minutes: 30, focus: "C minor pentatonic and a 16-bar form", videos: [{ label: "Blue Bossa — chords, melody and scales", channel: "Sound Guitar Lessons", url: "https://www.youtube.com/watch?v=LmSN5CsnsX0" }] },
  { week: 13, phase: 2, title: "Take the A Train", kicker: "Find the swing", minutes: 25, focus: "Long-short eighths and forward motion", videos: [{ label: "Take the A Train — complete lesson", channel: "Sound Guitar Lessons", url: "https://www.youtube.com/watch?v=SkmVklYlG5Q" }] },
  { week: 14, phase: 2, title: "Summertime", kicker: "Blues meets jazz", minutes: 25, focus: "Melody, vibrato and modal color", videos: [{ label: "Summertime — melody, chords and scales", channel: "Sound Guitar Lessons", url: "https://www.youtube.com/watch?v=oZtjrAOwR0E" }] },
  { week: 15, phase: 2, title: "All of Me", kicker: "Hear the ABAC form", minutes: 25, focus: "Form, memory and slow-moving harmony", videos: [{ label: "All of Me — complete jazz guitar lesson", channel: "Sound Guitar Lessons", url: "https://www.youtube.com/watch?v=NpUxQhys0MI" }] },
  { week: 16, phase: 2, title: "The ii–V–I Lick", kicker: "A sentence in jazz", minutes: 25, focus: "Resolution and transposition", videos: [{ label: "Three easy ii–V–I licks", channel: "Learn Jazz Standards", url: "https://www.youtube.com/watch?v=YjIVyb1AP7c" }] },
  { week: 17, phase: 2, title: "Chitlins Con Carne", kicker: "Blues-jazz graduation", minutes: 30, focus: "Chasing chord changes with pentatonic shapes", videos: [{ label: "Chitlins Con Carne — Kenny Burrell lesson", channel: "Guitar Control", url: "https://www.youtube.com/watch?v=USW8gYgX1m4" }], references: [12, 16] },
  { week: 18, phase: 2, title: "The Jazz Mini-Recital", kicker: "Checkpoint two", minutes: 30, focus: "Melody recall, form and one-chorus solos", videos: [{ label: "Practice jazz guitar more effectively", channel: "Jens Larsen", url: "https://www.youtube.com/watch?v=60ZngB534AQ" }], references: [11, 12, 13, 14, 15, 17] },
  { week: 19, phase: 3, title: "Neo-Soul Double Stops", kicker: "Two notes, one voice", minutes: 25, focus: "Balanced dyads, slides and economy", videos: [{ label: "Ultimate neo-soul double-stop lesson", channel: "Nasty Soul", url: "https://www.youtube.com/watch?v=ZJbAQ9TlfZo" }] },
  { week: 20, phase: 3, title: "The Pocket", kicker: "Play behind the beat", minutes: 25, focus: "Relaxed placement and deep time", videos: [{ label: "Phrasing behind the beat", channel: "Access Creative College", url: "https://www.youtube.com/watch?v=4wJUByByNXc" }] },
  { week: 21, phase: 3, title: "Hammer-Ons and Pull-Offs", kicker: "Legato feel", minutes: 25, focus: "Even volume without picking every note", videos: [{ label: "Hammer-ons and pull-offs — exercises", channel: "Andy Guitar", url: "https://www.youtube.com/watch?v=hitFFak3OTs" }] },
  { week: 22, phase: 3, title: "Sunday Morning", kicker: "Compose piece one", minutes: 30, focus: "A clear motif and a 16-bar story", videos: [{ label: "Get started writing instrumental guitar music", channel: "Signals Music Studio", url: "https://www.youtube.com/watch?v=y0nLQmtn-60" }], references: [19, 20, 21] },
  { week: 23, phase: 3, title: "Coffee Shop", kicker: "Compose piece two", minutes: 30, focus: "Space, ambience and subtle variation", videos: [{ label: "Easy neo-soul chord progression", channel: "Rhett Shull", url: "https://www.youtube.com/watch?v=A9bpbJenIN0" }], references: [19, 20, 21] },
  { week: 24, phase: 3, title: "Night Drive", kicker: "Compose piece three", minutes: 30, focus: "Riff, chorus lift and a strong ending", videos: [{ label: "Seven neo-soul solo ideas", channel: "Guitar With", url: "https://www.youtube.com/watch?v=cWspYUPH9Ww" }], references: [19, 20, 21] },
  { week: 25, phase: 4, title: "The Thrill Is Gone", kicker: "Full performance", minutes: 30, focus: "Dynamics, structure and controlled intensity", videos: [{ label: "The Thrill Is Gone — complete performance lesson", channel: "GuitarZero2Hero", url: "https://www.youtube.com/watch?v=F_ro_EHlfE0" }], references: [4] },
  { week: 26, phase: 4, title: "Autumn Leaves", kicker: "Chord melody", minutes: 30, focus: "Melody and harmony at the same time", videos: [{ label: "Autumn Leaves chord melody for beginners", channel: "Jazz Guitar with Andy", url: "https://www.youtube.com/watch?v=Uucku-EpUZw" }], references: [11] },
  { week: 27, phase: 4, title: "Blue Bossa", kicker: "Full performance", minutes: 30, focus: "Head, solo, head — the jazz format", videos: [{ label: "Blue Bossa — melody and improvisation", channel: "Sound Guitar Lessons", url: "https://www.youtube.com/watch?v=LmSN5CsnsX0" }], references: [12] },
  { week: 28, phase: 4, title: "Born Under a Bad Sign", kicker: "Full performance", minutes: 30, focus: "Riff, solo and a confident return", videos: [{ label: "Born Under a Bad Sign — complete lesson", channel: "Marty Music", url: "https://www.youtube.com/watch?v=mN6pAWlBs1I" }], references: [7] },
  { week: 29, phase: 4, title: "Your Neo-Soul Set", kicker: "Three originals", minutes: 30, focus: "Tone, transitions and atmosphere", videos: [{ label: "How to really play neo-soul guitar", channel: "Eric Assarsson", url: "https://www.youtube.com/watch?v=kT27ukSXOAY" }], references: [22, 23, 24] },
  { week: 30, phase: 4, title: "The Final Recital", kicker: "Fifteen minutes of music", minutes: 30, focus: "Preparation, confidence and one complete take", videos: [
    { label: "Prepare for your first guitar performance", channel: "Pickup Music", url: "https://www.youtube.com/watch?v=QVAm6cp642U" },
    { label: "Record guitar videos on your phone", channel: "GuitarZero2Hero", url: "https://www.youtube.com/watch?v=nkQSjs4kzds" },
  ], references: [3, 4, 5, 11, 12, 14, 22, 23, 24] },
];

const repertoire = [
  ["Mannish Boy", "Muddy Waters", 3], ["The Thrill Is Gone", "B.B. King", 4], ["Mary Had a Little Lamb", "Buddy Guy", 5],
  ["Boom Boom", "John Lee Hooker", 6], ["Born Under a Bad Sign", "Albert King", 7], ["Red House", "Jimi Hendrix", 9],
  ["Autumn Leaves", "Jazz standard", 11], ["Blue Bossa", "Kenny Dorham", 12], ["Take the A Train", "Billy Strayhorn", 13],
  ["Summertime", "George Gershwin", 14], ["All of Me", "Jazz standard", 15], ["Sunday Morning", "Your composition", 22],
  ["Coffee Shop", "Your composition", 23], ["Night Drive", "Your composition", 24],
] as const;

const backingTracks = [
  ["Slow blues in A", "70 BPM", "https://www.youtube.com/results?search_query=A+minor+slow+blues+backing+track+70+bpm"],
  ["Medium blues in A", "90 BPM", "https://www.youtube.com/results?search_query=A+minor+blues+backing+track+90+bpm"],
  ["Blue Bossa", "120 BPM", "https://www.youtube.com/results?search_query=Blue+Bossa+backing+track+120+bpm"],
  ["Autumn Leaves", "80 BPM", "https://www.youtube.com/results?search_query=Autumn+Leaves+backing+track+80+bpm"],
  ["Neo-soul in C", "75 BPM", "https://www.youtube.com/results?search_query=C+major+neo+soul+guitar+backing+track+75+bpm"],
  ["Neo-soul in A minor", "80 BPM", "https://www.youtube.com/results?search_query=A+minor+neo+soul+backing+track+80+bpm"],
] as const;

function phaseFor(id: number) { return phases.find((phase) => phase.id === id)!; }

function cleanCourseText(text: string) {
  return text.replace(/cite🛠[^]*/g, "").replace(/\r/g, "").trim();
}

function parseCourse(markdown: string) {
  const result: Record<number, ParsedLesson> = {};
  const regex = /### WEEK (\d+):\s*([^\n]+)\n([\s\S]*?)(?=\n### WEEK \d+:|\n# PHASE|\n# APPENDIX|$)/g;
  for (const match of cleanCourseText(markdown).matchAll(regex)) {
    result[Number(match[1])] = { title: match[2].trim(), body: match[3].trim() };
  }
  return result;
}

function inlineText(text: string) {
  return text.split(/(\*\*.*?\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <span key={index}>{part}</span>;
  });
}

function CourseMarkdown({ source, mode = "all" }: { source: string; mode?: "all" | "tab" | "practice" }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let inCode = false;
  let code: string[] = [];
  let key = 0;

  const flushCode = () => {
    if (!code.length) return;
    if (mode !== "practice") blocks.push(<pre className="tab-block" key={`code-${key++}`}><code>{code.join("\n")}</code></pre>);
    code = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim().startsWith("```")) {
      if (inCode) flushCode();
      inCode = !inCode;
      continue;
    }
    if (inCode) { code.push(raw); continue; }
    if (mode === "tab") continue;
    if (mode === "practice" && !/\*\*Day|\*\*The Assignment|\*\*Do not move|\*\*Performance tip|\*\*The Approach|\*\*Structure|^\d+\.|^- /.test(line)) continue;
    if (!line.trim() || line.trim() === "---") continue;
    if (line.startsWith("**") && line.endsWith("**") && line.length < 100) {
      blocks.push(<h3 key={`h-${key++}`}>{inlineText(line)}</h3>);
    } else if (line.startsWith("**")) {
      blocks.push(<p className={mode === "practice" ? "practice-line" : ""} key={`p-${key++}`}>{inlineText(line)}</p>);
    } else if (line.startsWith("- ")) {
      blocks.push(<div className="course-bullet" key={`b-${key++}`}><span>→</span><p>{inlineText(line.slice(2))}</p></div>);
    } else if (/^\d+\. /.test(line)) {
      const number = line.match(/^\d+/)?.[0];
      blocks.push(<div className="course-step" key={`s-${key++}`}><span>{number}</span><p>{inlineText(line.replace(/^\d+\. /, ""))}</p></div>);
    } else if (line.startsWith("#")) {
      blocks.push(<h3 key={`mh-${key++}`}>{line.replace(/^#+\s*/, "")}</h3>);
    } else {
      blocks.push(<p key={`t-${key++}`}>{inlineText(line)}</p>);
    }
  }
  if (inCode) flushCode();
  if (mode === "tab" && !blocks.length) return <EmptyTab />;
  return <div className={`course-copy ${mode === "practice" ? "practice-copy" : ""}`}>{blocks}</div>;
}

function EmptyTab() {
  return <div className="empty-tab"><span>♪</span><h3>This week is about performance</h3><p>Use the linked reference weeks below for the notation, then return here to assemble the full piece.</p></div>;
}

function ProgressRing({ value }: { value: number }) {
  return <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}%</strong><span>complete</span></div></div>;
}

function Metronome({ compact = false }: { compact?: boolean }) {
  const [bpm, setBpm] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const beatRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    const click = () => {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioRef.current ??= new AudioCtx();
      const ctx = audioRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = beatRef.current === 0 ? 880 : 660;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.07);
      beatRef.current = (beatRef.current + 1) % 4;
      setBeat(beatRef.current);
    };
    click();
    timerRef.current = setInterval(click, 60000 / bpm);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, bpm]);

  return <section className={`tool-card metronome ${compact ? "compact" : ""}`}>
    <div className="tool-heading"><span>Time lab</span><strong>METRONOME</strong></div>
    <div className="beat-row">{[0,1,2,3].map((item) => <i className={playing && beat === item ? "active" : ""} key={item} />)}</div>
    <div className="bpm-display"><strong>{bpm}</strong><span>BPM</span></div>
    <input aria-label="Metronome tempo" type="range" min="40" max="180" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
    <div className="tool-actions"><button onClick={() => setBpm((v) => Math.max(40, v - 5))}>− 5</button><button className="primary" onClick={() => setPlaying(!playing)}>{playing ? "Stop" : "Start"}</button><button onClick={() => setBpm((v) => Math.min(180, v + 5))}>+ 5</button></div>
  </section>;
}

function PracticeTimer() {
  const [seconds, setSeconds] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [running, seconds]);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return <section className="tool-card timer-card">
    <div className="tool-heading"><span>Stay focused</span><strong>PRACTICE TIMER</strong></div>
    <div className="timer-display">{minutes}<em>:</em>{remainder}</div>
    <div className="preset-row">{[5, 20, 30].map((value) => <button key={value} onClick={() => { setSeconds(value * 60); setRunning(false); }}>{value} min</button>)}</div>
    <button className="wide-button" onClick={() => setRunning(!running)}>{running ? "Pause session" : "Begin session"}</button>
  </section>;
}

export default function Home() {
  const [course, setCourse] = useState<Record<number, ParsedLesson>>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [view, setView] = useState<View>("course");
  const [lessonTab, setLessonTab] = useState<LessonTab>("lesson");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("./course.md").then((response) => response.text()).then((text) => setCourse(parseCourse(text))).catch(() => setCourse({}));
    try {
      const savedProgress = JSON.parse(localStorage.getItem("singing-guitar-progress") || "[]");
      const savedNotes = JSON.parse(localStorage.getItem("singing-guitar-notes") || "{}");
      queueMicrotask(() => {
        setCompleted(savedProgress);
        setNotes(savedNotes);
      });
    } catch { /* device storage may be disabled */ }
  }, []);

  const progress = Math.round((completed.length / lessons.length) * 100);
  const nextWeek = lessons.find((lesson) => !completed.includes(lesson.week))?.week || 30;
  const current = selectedWeek ? lessons[selectedWeek - 1] : null;
  const filteredLessons = lessons.filter((lesson) => `${lesson.title} ${lesson.focus} ${phaseFor(lesson.phase).label}`.toLowerCase().includes(search.toLowerCase()));

  const saveProgress = (next: number[]) => { setCompleted(next); localStorage.setItem("singing-guitar-progress", JSON.stringify(next)); };
  const toggleCompleted = (week: number) => saveProgress(completed.includes(week) ? completed.filter((item) => item !== week) : [...completed, week].sort((a,b) => a-b));
  const openLesson = (week: number) => { setSelectedWeek(week); setView("course"); setLessonTab("lesson"); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const saveNote = (week: number, value: string) => { const next = { ...notes, [week]: value }; setNotes(next); localStorage.setItem("singing-guitar-notes", JSON.stringify(next)); };

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => { setSelectedWeek(null); setView("course"); }} aria-label="The Singing Guitar home"><span className="brand-mark">SG</span><span><strong>The Singing Guitar</strong><small>Play songs. Build a voice.</small></span></button>
      <nav aria-label="Main navigation">
        {(["course", "practice", "repertoire"] as View[]).map((item) => <button key={item} className={view === item ? "active" : ""} onClick={() => { setView(item); if (item !== "course") setSelectedWeek(null); }}>{item}</button>)}
      </nav>
      <div className="top-progress"><span>{completed.length}/30 weeks</span><div><i style={{ width: `${progress}%` }} /></div></div>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle course menu">{menuOpen ? "Close" : "Weeks"}</button>
    </header>

    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="sidebar-head"><ProgressRing value={progress} /><div><span>Your course</span><strong>{completed.length === 30 ? "Recital ready" : `Week ${nextWeek} is next`}</strong></div></div>
      <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a song or skill" aria-label="Search the course" /></label>
      <div className="week-list">
        {phases.map((phase) => {
          const items = filteredLessons.filter((lesson) => lesson.phase === phase.id);
          if (!items.length) return null;
          return <div className="phase-group" key={phase.id}><div className="phase-label"><i className={phase.color} />Phase {phase.id}</div>{items.map((lesson) => <button className={`${selectedWeek === lesson.week ? "selected" : ""} ${completed.includes(lesson.week) ? "done" : ""}`} key={lesson.week} onClick={() => openLesson(lesson.week)}><span>{completed.includes(lesson.week) ? "✓" : lesson.week}</span><div><small>Week {lesson.week}</small><strong>{lesson.title}</strong></div></button>)}</div>;
        })}
      </div>
      <div className="free-note"><strong>Free. No account.</strong><p>Your progress lives only on this device.</p></div>
    </aside>

    <div className="content">
      {view === "course" && !current && <Dashboard progress={progress} nextWeek={nextWeek} completed={completed} openLesson={openLesson} />}
      {view === "course" && current && <Lesson lesson={current} parsed={course[current.week]} completed={completed.includes(current.week)} tab={lessonTab} setTab={setLessonTab} toggleCompleted={() => toggleCompleted(current.week)} openLesson={openLesson} note={notes[current.week] || ""} saveNote={(value) => saveNote(current.week, value)} />}
      {view === "practice" && <PracticeRoom />}
      {view === "repertoire" && <Repertoire completed={completed} openLesson={openLesson} />}
    </div>
  </main>;
}

function Dashboard({ progress, nextWeek, completed, openLesson }: { progress: number; nextWeek: number; completed: number[]; openLesson: (week: number) => void }) {
  const next = lessons[nextWeek - 1];
  return <div className="dashboard">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">A complete 30-week performance course</span><h1>Stop practising.<br/><em>Start playing.</em></h1><p>Learn electric guitar through real blues, jazz and neo-soul music. One focused lesson. One new sound. Every week.</p><div className="hero-actions"><button className="cta" onClick={() => openLesson(nextWeek)}>{progress ? `Continue with Week ${nextWeek}` : "Start Week 1"}<span>→</span></button><button className="text-button" onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })}>See the roadmap ↓</button></div><div className="trust-row"><span>30 weeks</span><span>14 pieces</span><span>20–30 min/day</span></div></div>
      <div className="guitar-poster" aria-label="Abstract electric guitar fretboard illustration"><div className="poster-top"><span>Course no. 01</span><span>Standard tuning</span></div><div className="pick-shape"><span>PLAY</span></div><div className="strings">{[1,2,3,4,5,6].map((item) => <i key={item} />)}</div><div className="poster-bottom"><strong>Blues<br/>Jazz<br/>Neo-Soul</strong><span>→ recital</span></div></div>
    </section>

    <section className="continue-card">
      <div className="continue-number"><span>Next</span><strong>{String(nextWeek).padStart(2, "0")}</strong></div><div className="continue-copy"><span>{phaseFor(next.phase).label} · {next.minutes} min/day</span><h2>{next.title}</h2><p>{next.focus}</p></div><div className="continue-progress"><strong>{progress}%</strong><span>Course complete</span><button onClick={() => openLesson(nextWeek)}>Open lesson →</button></div>
    </section>

    <section className="roadmap" id="roadmap"><div className="section-heading"><span>01 / The path</span><h2>Music first.<br/>Theory when it helps.</h2><p>Every phase adds one practical layer, then turns it into a piece you can perform.</p></div><div className="phase-grid">{phases.map((phase) => { const phaseLessons = lessons.filter((lesson) => lesson.phase === phase.id); const done = phaseLessons.filter((lesson) => completed.includes(lesson.week)).length; return <article key={phase.id} className={phase.color}><div className="phase-card-top"><span>0{phase.id}</span><i>{done}/{phaseLessons.length}</i></div><h3>{phase.label}</h3><small>{phase.range}</small><p>{phase.description}</p><button onClick={() => openLesson(phaseLessons.find((lesson) => !completed.includes(lesson.week))?.week || phaseLessons[0].week)}>Enter phase <span>→</span></button></article>; })}</div></section>

    <section className="today-tools"><div><span className="eyebrow">Built for daily practice</span><h2>Your timing is your sound.</h2><p>Use the metronome inside the course. Begin slowly enough to stay relaxed, then add five beats at a time.</p></div><Metronome compact /></section>
  </div>;
}

function Lesson({ lesson, parsed, completed, tab, setTab, toggleCompleted, openLesson, note, saveNote }: { lesson: LessonMeta; parsed?: ParsedLesson; completed: boolean; tab: LessonTab; setTab: (tab: LessonTab) => void; toggleCompleted: () => void; openLesson: (week: number) => void; note: string; saveNote: (value: string) => void }) {
  const phase = phaseFor(lesson.phase);
  const source = parsed?.body || `**Focus:** ${lesson.focus}\n\nThe complete lesson content is loading. Your video and practice tools are ready below.`;
  const hasTabs = source.includes("```");
  return <article className="lesson-page">
    <div className="lesson-masthead"><div className="lesson-meta"><span>Phase {lesson.phase} · {phase.label}</span><span>{lesson.minutes} min/day</span></div><div className="lesson-title-row"><div><span className="week-stamp">Week {String(lesson.week).padStart(2, "0")}</span><h1>{lesson.title}</h1><p>{lesson.kicker}</p></div><div className="lesson-orbit"><strong>{lesson.week}</strong><span>of 30</span></div></div><div className="focus-strip"><span>THIS WEEK</span><strong>{lesson.focus}</strong><i className={phase.color} /></div></div>
    <div className="lesson-tabs" role="tablist">{(["lesson", "tab", "practice", "notes"] as LessonTab[]).map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item === "tab" ? "Tab & notation" : item}</button>)}</div>
    <div className="lesson-layout"><section className="lesson-body">
      {tab === "lesson" && <><CourseMarkdown source={source} /><VideoShelf videos={lesson.videos} /></>}
      {tab === "tab" && <><div className="tab-legend"><span><code>0</code> open string</span><span><code>b</code> bend</span><span><code>h / p</code> hammer / pull</span><span><code>~</code> vibrato</span><span><code>/</code> slide</span></div>{hasTabs ? <CourseMarkdown source={source} mode="tab" /> : <EmptyTab />}</>}
      {tab === "practice" && <><div className="practice-intro"><span>7-day plan</span><h2>Small wins, repeated.</h2><p>Stay with today’s task until it feels easy. Speed is the result, not the goal.</p></div><CourseMarkdown source={source} mode="practice" /><div className="practice-rule"><strong>The clean-ten rule</strong><p>Move on only after ten relaxed, clean repetitions in a row. If repetition nine breaks, calmly restart at one.</p></div></>}
      {tab === "notes" && <div className="notes-panel"><span>Private practice journal</span><h2>What did you hear today?</h2><p>Write down what improved, what still catches, and the BPM where the part feels clean. These notes stay on this device.</p><textarea value={note} onChange={(event) => saveNote(event.target.value)} placeholder="Example: Bend reaches pitch at 60 BPM. Keep thumb lower tomorrow…" /><small>{note.length} characters · saved automatically</small></div>}
    </section><aside className="lesson-aside"><div className="complete-card"><span>{completed ? "Lesson complete" : "Your checkpoint"}</span><strong>{completed ? "Nice work." : "Can you play it cleanly?"}</strong><p>{completed ? "Revisit any time, or keep the momentum moving." : "Record one take. Listen back. Then mark the week complete."}</p><button className={completed ? "completed" : ""} onClick={toggleCompleted}>{completed ? "✓ Completed — undo" : "Mark week complete"}</button></div><div className="quick-resource"><span>Video lesson{lesson.videos.length > 1 ? "s" : ""}</span>{lesson.videos.map((video) => <a href={video.url} target="_blank" rel="noreferrer" key={video.url}><i>▶</i><div><strong>{video.label}</strong><small>{video.channel} · YouTube</small></div></a>)}</div>{lesson.references && <div className="reference-card"><span>Related course tabs</span>{lesson.references.map((week) => <button key={week} onClick={() => openLesson(week)}><i>{week}</i><div><strong>{lessons[week - 1].title}</strong><small>Open Week {week} notation</small></div><b>→</b></button>)}</div>}<div className="lesson-nav"><button disabled={lesson.week === 1} onClick={() => openLesson(lesson.week - 1)}>← Previous</button><button disabled={lesson.week === 30} onClick={() => openLesson(lesson.week + 1)}>Next →</button></div></aside></div>
  </article>;
}

function VideoShelf({ videos }: { videos: Video[] }) {
  return <section className="video-shelf"><div className="video-heading"><span>Watch, then play</span><h2>Free companion lesson{videos.length > 1 ? "s" : ""}</h2><p>Use the video for demonstration. Return to this page for the practice plan and your progress.</p></div><div className="video-grid">{videos.map((video, index) => <a href={video.url} target="_blank" rel="noreferrer" key={video.url}><div className="video-poster"><span>0{index + 1}</span><i>▶</i><small>YouTube</small></div><strong>{video.label}</strong><span>{video.channel} ↗</span></a>)}</div></section>;
}

function PracticeRoom() {
  return <div className="practice-room"><section className="page-intro"><span className="eyebrow">The practice room</span><h1>Slow is smooth.<br/><em>Smooth becomes fast.</em></h1><p>Everything you need for a focused session, in one place.</p></section><div className="tool-grid"><Metronome /><PracticeTimer /></div><section className="warmup"><div className="section-heading"><span>05 / Daily ritual</span><h2>The five-minute warm-up</h2><p>Do this before every practice session. Stay light; nothing should hurt.</p></div><div className="warmup-list">{[["01", "Finger stretches", "1 min", "Spread fingers wide, make a loose fist. Repeat 10 times."],["02", "Single-string picking", "1 min", "Pick the open A string 50 times with even volume."],["03", "Pentatonic review", "2 min", "Play A minor pentatonic up and down. Say the frets aloud."],["04", "Bend check", "1 min", "Bend B-string fret 8 to the pitch at fret 10. Repeat five times."]].map((item) => <article key={item[0]}><span>{item[0]}</span><div><h3>{item[1]}</h3><p>{item[3]}</p></div><strong>{item[2]}</strong></article>)}</div></section><section className="tracks"><div className="section-heading"><span>06 / Play with a band</span><h2>Backing tracks</h2><p>Choose a track, count two bars, and start with fewer notes than you think you need.</p></div><div className="track-list">{backingTracks.map((track, index) => <a href={track[2]} target="_blank" rel="noreferrer" key={track[0]}><span>0{index + 1}</span><div><strong>{track[0]}</strong><small>{track[1]} · YouTube search</small></div><i>↗</i></a>)}</div></section></div>;
}

function Repertoire({ completed, openLesson }: { completed: number[]; openLesson: (week: number) => void }) {
  const learned = repertoire.filter((item) => completed.includes(item[2])).length;
  return <div className="repertoire-page"><section className="page-intro repertoire-intro"><span className="eyebrow">Your songbook</span><h1>Fourteen pieces.<br/><em>One guitar voice.</em></h1><p>Completion here follows the week where each piece becomes performance-ready.</p><div className="repertoire-count"><strong>{learned}</strong><span>of {repertoire.length}<br/>pieces learned</span></div></section><div className="repertoire-table"><div className="table-head"><span>Piece</span><span>Style / artist</span><span>Status</span></div>{repertoire.map((item, index) => { const done = completed.includes(item[2]); return <button key={item[0]} onClick={() => openLesson(item[2])}><span className="track-number">{String(index + 1).padStart(2, "0")}</span><strong>{item[0]}</strong><span>{item[1]}</span><i className={done ? "done" : ""}>{done ? "✓ Learned" : `Week ${item[2]}`}</i><b>→</b></button>; })}</div><section className="recital-order"><div><span>Final set</span><h2>Your 15-minute recital</h2><p>Mannish Boy → The Thrill Is Gone → Mary Had a Little Lamb → Autumn Leaves → Blue Bossa → Summertime → Sunday Morning → Coffee Shop → Night Drive</p></div><button onClick={() => openLesson(30)}>Open Week 30 →</button></section></div>;
}

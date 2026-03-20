"use client";

import { useState, useEffect } from "react";
import type { ForgeResult } from "@/types";

// ━━━ DESIGN SYSTEM ━━━
const C = {
  bg: "#030407",
  surface: "#070910",
  card: "#0B0D16",
  border: "#12172A",
  borderHover: "#1C2540",
  red: "#E03020",
  redHover: "#B82818",
  gold: "#C88A08",
  goldDim: "#241800",
  goldBright: "#F0AA20",
  green: "#1E9A5A",
  greenDim: "#0A1F12",
  blue: "#2060CC",
  purple: "#7040C0",
  orange: "#D06020",
  text: "#E2DDD8",
  muted: "#384060",
  dim: "#161C2C",
  mono: "'JetBrains Mono', monospace",
  sans: "'DM Sans', system-ui, sans-serif",
};

const INTENT_COLORS: Record<string, string> = {
  IMAGE_GENERATION: "#7050CC",
  PHOTO_TRANSFORMATION: "#2880AA",
  FACE_SWAP_SCENE: "#A83060",
  ART_STYLE_TRANSFER: "#C06020",
  THREE_D_LOGO_RENDER: "#4060CC",
  VIDEO_GENERATION: "#CC2020",
  VIDEO_SERIES: "#AA2040",
  IMAGE_TO_VIDEO: "#882060",
  INTERACTIVE_SESSION: "#208855",
  MUSIC_GENERATION: "#AA7010",
  VOICE_DESIGN: "#6040A0",
  CONTENT_STRATEGY: "#2858A8",
  BUSINESS_WRITING: "#384888",
  EDUCATION_LEARNING: "#286040",
  CREATIVE_WRITING: "#885020",
  CODE_GENERATION: "#1870A0",
  GENERAL: "#384860",
};

const EXAMPLES = [
  { e: "🧍", l: "Portrait", t: "A woman in a dark burgundy dress fueling a green Lamborghini at night" },
  { e: "🎭", l: "Face Swap", t: "Put my face in a noir lounge scene with whiskey and leather sofa" },
  { e: "🎨", l: "Art Style", t: "Transform my photo into a pen and ink engraving steampunk style" },
  { e: "🔮", l: "3D Logo", t: "Transform my uploaded logo into a premium emerald glass 3D sculpture" },
  { e: "🎬", l: "Video", t: "A monk on a salt flat slams his staff and buildings float up into space" },
  { e: "🎞️", l: "FPV", t: "A bee flying through a kitchen in first person view hitting a window" },
  { e: "📺", l: "Series", t: "5-scene YouTube Shorts story about an Indian Hulk character with Hindi dialogue" },
  { e: "📝", l: "Scene+Text", t: "A classroom with students and an alphabet chart on the wall" },
  { e: "🔄", l: "Fix Photo", t: "Turn my bathroom mirror selfie into a professional portrait" },
  { e: "📚", l: "IELTS", t: "I want to practice my IELTS speaking test with real scoring" },
  { e: "🎵", l: "Music", t: "A melancholic indie folk song about leaving your hometown forever" },
  { e: "📱", l: "Strategy", t: "30-day Instagram strategy for a fitness coach building authority in Canada" },
];

const LOAD_MSGS = [
  "Detecting intent...",
  "Checking text risk...",
  "Applying specialist principles...",
  "Engineering your prompt...",
  "Building variations...",
  "Routing to best tool...",
];

const NEW_V10 = [
  { label: "FPV Cinematic", desc: "Kling 2.6 bee-eye formula" },
  { label: "Text Risk System", desc: "Detects + fixes background text" },
  { label: "Bold = Scene only", desc: "Identity frozen, scene pushed" },
  { label: "Variation Locks", desc: "Declares what changes/freezes" },
  { label: "Unknown Handler", desc: "Honest fallback, no fake depth" },
  { label: "Seedream 3.0", desc: "Bilingual + 2K text scenes" },
  { label: "Recraft routing", desc: "Style-consistent brand assets" },
  { label: "Ideogram routing", desc: "Auto-detects text-risk scenes" },
];

export default function PromptForge() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadIdx, setLoadIdx] = useState(0);
  const [result, setResult] = useState<ForgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("prompt");
  const [copied, setCopied] = useState("");
  const [showDNA, setShowDNA] = useState(false);
  const [dna, setDna] = useState({ niche: "", tone: "", platform: "" });
  const [scoreAnim, setScoreAnim] = useState(0);

  useEffect(() => {
    if (!result) return;
    setScoreAnim(0);
    const target = result.score_forged || 0;
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(n + 2, target);
      setScoreAnim(n);
      if (n >= target) clearInterval(t);
    }, 14);
    return () => clearInterval(t);
  }, [result]);

  useEffect(() => {
    if (!loading) { setLoadIdx(0); return; }
    const t = setInterval(() => setLoadIdx(p => (p + 1) % LOAD_MSGS.length), 1000);
    return () => clearInterval(t);
  }, [loading]);

  const forge = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveTab("prompt");

    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim(), dna }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try rephrasing your idea.");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Something went wrong. Try rephrasing your idea.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const getActivePrompt = () => {
    if (!result) return "";
    if (activeTab === "bold") return result.variation_bold || result.prompt;
    if (activeTab === "experimental") return result.variation_experimental || result.prompt;
    return result.prompt;
  };

  const copyAll = () => {
    if (!result) return;
    const activePrompt = getActivePrompt();
    const parts = [
      `FORGED PROMPT:\n${activePrompt}`,
      result.negative_prompt ? `\nNEGATIVE PROMPT:\n${result.negative_prompt}` : "",
      result.text_risk ? `\nTEXT RISK NOTE:\n${result.text_risk_note}` : "",
      result.unknown_technique ? `\nTECHNIQUE FLAG:\n${result.technique_flag}` : "",
      result.tool ? `\nUSE IN: ${result.tool}\n${result.tool_reason}` : "",
      result.parameters ? `\n${result.parameters_label || "PARAMETERS"}:\n${result.parameters}` : "",
      result.tips?.length ? `\nTIPS:\n${result.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}` : "",
    ].filter(Boolean).join("\n");
    copy(parts, "all");
  };

  const intentColor = result ? (INTENT_COLORS[result.intent_category] || C.muted) : C.muted;
  const scoreColor = scoreAnim > 85 ? C.green : scoreAnim > 70 ? C.gold : C.muted;
  const hasNegative = result?.negative_prompt;
  const hasTextRisk = result?.text_risk;
  const hasUnknownTechnique = result?.unknown_technique;

  const TABS = [
    { id: "prompt", label: "✦ PROMPT" },
    hasNegative ? { id: "negative", label: "🚫 NEGATIVE" } : null,
    { id: "bold", label: "🔥 BOLD" },
    { id: "experimental", label: "🌀 EXPERIMENTAL" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.sans, color: C.text }}>

      {/* HEADER */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 20px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: `linear-gradient(135deg, ${C.red} 0%, ${C.gold} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
          }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.02em" }}>PromptForge</span>
          <span style={{
            background: C.gold, color: "#000",
            fontSize: 8, fontWeight: 700, padding: "1px 5px",
            borderRadius: 3, letterSpacing: "0.1em", fontFamily: C.mono,
          }}>V10</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 700 }}>
          {EXAMPLES.map(ex => (
            <button key={ex.l} onClick={() => setInput(ex.t)} style={{
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 20, color: C.muted, cursor: "pointer",
              fontSize: 9, fontFamily: C.mono, padding: "3px 8px",
              transition: "all 0.15s", letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 3,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBright; e.currentTarget.style.color = C.goldBright; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
            >
              <span>{ex.e}</span>{ex.l}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr]" style={{ minHeight: "calc(100vh - 52px)" }}>

        {/* LEFT PANEL */}
        <div style={{
          background: C.surface, borderRight: `1px solid ${C.border}`,
          padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: C.muted, fontFamily: C.mono }}>
            DESCRIBE ANYTHING — WE FORGE THE PERFECT PROMPT
          </div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) forge(); }}
            placeholder={"What do you want to create, fix, learn, build?\n\nTry: 'A bee flying through a kitchen in FPV' or 'A classroom with alphabet chart on wall' or 'Transform my logo into a 3D ruby glass sculpture'"}
            style={{
              background: C.card, border: `1px solid ${input ? C.borderHover : C.border}`,
              borderRadius: 10, color: C.text, fontFamily: C.sans,
              fontSize: 13, lineHeight: 1.7, padding: "12px",
              resize: "none", height: 140,
              outline: "none", transition: "border-color 0.2s",
              width: "100%", boxSizing: "border-box",
            }}
          />

          {/* V10 NEW */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderLeft: `2px solid ${C.gold}`,
            borderRadius: 8, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 8, color: C.gold, letterSpacing: "0.12em", fontFamily: C.mono, marginBottom: 8 }}>
              NEW IN V10
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {NEW_V10.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.gold, fontSize: 9, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.text }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: C.muted, marginLeft: 6 }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand DNA */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <button onClick={() => setShowDNA(!showDNA)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: showDNA ? C.goldBright : C.muted,
              fontSize: 9, fontFamily: C.mono, letterSpacing: "0.1em", padding: 0,
            }}>
              <span>{showDNA ? "▼" : "▶"}</span>
              BRAND DNA
              <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: C.dim, color: C.muted }}>OPTIONAL</span>
            </button>
            {showDNA && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {(["niche", "tone", "platform"] as const).map((k) => (
                  <input
                    key={k}
                    value={dna[k]}
                    onChange={e => setDna(p => ({ ...p, [k]: e.target.value }))}
                    placeholder={k === "niche" ? "Niche / industry..." : k === "tone" ? "Brand tone..." : "Primary platform..."}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: 6, color: C.text, fontFamily: C.sans,
                      fontSize: 12, padding: "6px 10px",
                      width: "100%", boxSizing: "border-box", outline: "none",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={forge}
            disabled={!input.trim() || loading}
            style={{
              background: !input.trim() || loading ? C.dim : C.red,
              border: "none", borderRadius: 10,
              color: !input.trim() || loading ? C.muted : "#fff",
              cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              fontFamily: C.sans, fontWeight: 700, fontSize: 13,
              letterSpacing: "0.03em", padding: "14px",
              width: "100%", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = C.redHover; }}
            onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.background = C.red; }}
          >
            {loading
              ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>↻</span>{LOAD_MSGS[loadIdx]}</>
              : "FORGE PROMPT  ⌘↵"}
          </button>

          <div style={{ textAlign: "center", fontSize: 9, color: C.dim, fontFamily: C.mono, letterSpacing: "0.05em" }}>
            16 INTENT CATEGORIES · FPV · TEXT RISK DETECTION · VARIATION LOCKS
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: "18px", overflowY: "auto", background: C.bg }}>

          {/* EMPTY STATE */}
          {!result && !loading && !error && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, width: "100%", maxWidth: 520 }}>
                {[
                  ["🎞️", "FPV Cinematic", "Bee/creature first-person"],
                  ["📝", "Text Scenes", "Classrooms, stores, signs"],
                  ["🎭", "Face Swap", "12-step identity lock"],
                  ["🎨", "Art Style", "Photo to art medium"],
                  ["🔮", "3D Logo", "Flat logo to sculpture"],
                  ["📺", "Video Series", "Multi-scene 8s format"],
                  ["🧍", "Portrait", "B-O-P-A framework"],
                  ["🎵", "Music", "Suno + ElevenLabs"],
                ].map(([emoji, label, desc]) => (
                  <div key={label} style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: "12px 8px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.text, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 8, color: C.muted, lineHeight: 1.4 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, textAlign: "center", letterSpacing: "0.08em", lineHeight: 2 }}>
                V10 · DESCRIBE YOUR IDEA · PROMPTFORGE APPLIES THE PRINCIPLES
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div style={{ background: "#130505", border: "1px solid #401010", borderRadius: 10, padding: 20, color: "#FF6060", fontFamily: C.mono, fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* RESULT STATE */}
          {result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* INTENT + SCORE */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: C.card, border: `1px solid ${intentColor}44`,
                  borderLeft: `3px solid ${intentColor}`,
                  borderRadius: 10, padding: "8px 14px",
                }}>
                  <span style={{ fontSize: 20 }}>{result.intent_emoji}</span>
                  <div>
                    <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em", fontFamily: C.mono }}>INTENT DETECTED</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: intentColor, marginTop: 1 }}>{result.intent_label}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.muted, fontFamily: C.mono, letterSpacing: "0.1em" }}>ORIGINAL</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: C.dim, fontVariantNumeric: "tabular-nums" }}>{result.score_original}</div>
                  </div>
                  <div style={{ fontSize: 16, color: C.border }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.muted, fontFamily: C.mono, letterSpacing: "0.1em" }}>FORGED</div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: scoreColor, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{scoreAnim}</div>
                  </div>
                </div>
              </div>

              {/* SCORE REASON */}
              {result.score_reason && (
                <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic", borderLeft: `2px solid ${C.border}`, paddingLeft: 10, lineHeight: 1.7 }}>
                  {result.score_reason}
                </div>
              )}

              {/* TEXT RISK ALERT */}
              {hasTextRisk && (
                <div style={{
                  background: "#0A0E1A", border: `1px solid ${C.orange}44`,
                  borderLeft: `3px solid ${C.orange}`,
                  borderRadius: 8, padding: "10px 14px",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 9, color: C.orange, letterSpacing: "0.1em", fontFamily: C.mono, marginBottom: 4 }}>BACKGROUND TEXT RISK DETECTED</div>
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{result.text_risk_note}</div>
                  </div>
                </div>
              )}

              {/* UNKNOWN TECHNIQUE FLAG */}
              {hasUnknownTechnique && (
                <div style={{
                  background: "#0A100E", border: `1px solid ${C.green}44`,
                  borderLeft: `3px solid ${C.green}`,
                  borderRadius: 8, padding: "10px 14px",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🔍</span>
                  <div>
                    <div style={{ fontSize: 9, color: C.green, letterSpacing: "0.1em", fontFamily: C.mono, marginBottom: 4 }}>NEW TECHNIQUE DETECTED</div>
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{result.technique_flag}</div>
                  </div>
                </div>
              )}

              {/* OUTPUT TABS */}
              <div style={{ display: "flex", gap: 2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: "7px 4px", borderRadius: 5, border: "none", cursor: "pointer",
                    background: activeTab === tab.id ? C.card : "transparent",
                    color: activeTab === tab.id ? C.text : C.muted,
                    fontFamily: C.mono, fontSize: 8, letterSpacing: "0.07em",
                    transition: "all 0.15s",
                  }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* PROMPT OUTPUT */}
              {activeTab !== "negative" && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.goldBright}`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontSize: 8, color: C.goldBright, letterSpacing: "0.14em", fontFamily: C.mono }}>FORGED PROMPT</div>
                      {activeTab === "bold" && (
                        <span style={{ fontSize: 8, color: C.orange, fontFamily: C.mono, background: "#1A0A00", padding: "1px 6px", borderRadius: 3 }}>SCENE PUSHED · IDENTITY FROZEN</span>
                      )}
                      {activeTab === "experimental" && (
                        <span style={{ fontSize: 8, color: C.purple, fontFamily: C.mono, background: "#0D0818", padding: "1px 6px", borderRadius: 3 }}>INTENT KEPT · WORLD CHANGED</span>
                      )}
                    </div>
                    <button onClick={() => copy(getActivePrompt(), "prompt")} style={{
                      background: copied === "prompt" ? C.green : "transparent",
                      border: `1px solid ${copied === "prompt" ? C.green : C.border}`,
                      borderRadius: 5, color: copied === "prompt" ? "#fff" : C.muted,
                      cursor: "pointer", fontSize: 9, fontFamily: C.mono, padding: "3px 10px", transition: "all 0.15s",
                    }}>
                      {copied === "prompt" ? "✓ COPIED" : "COPY"}
                    </button>
                  </div>
                  <div style={{ padding: "14px", fontFamily: C.mono, fontSize: 12, lineHeight: 1.9, color: C.text, whiteSpace: "pre-wrap" }}>
                    {getActivePrompt()}
                  </div>
                </div>
              )}

              {/* NEGATIVE PROMPT */}
              {activeTab === "negative" && hasNegative && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: "3px solid #CC2020", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                    <div style={{ fontSize: 8, color: "#CC2020", letterSpacing: "0.14em", fontFamily: C.mono }}>NEGATIVE PROMPT — PASTE IN NEGATIVE FIELD</div>
                    <button onClick={() => copy(result.negative_prompt!, "neg")} style={{
                      background: copied === "neg" ? C.green : "transparent",
                      border: `1px solid ${copied === "neg" ? C.green : C.border}`,
                      borderRadius: 5, color: copied === "neg" ? "#fff" : C.muted,
                      cursor: "pointer", fontSize: 9, fontFamily: C.mono, padding: "3px 10px",
                    }}>
                      {copied === "neg" ? "✓ COPIED" : "COPY"}
                    </button>
                  </div>
                  <div style={{ padding: "14px", fontFamily: C.mono, fontSize: 12, lineHeight: 1.9, color: "#FF8080", whiteSpace: "pre-wrap" }}>
                    {result.negative_prompt}
                  </div>
                </div>
              )}

              {/* TOOL + PARAMS */}
              <div style={{ display: "grid", gridTemplateColumns: result.parameters ? "1fr 1fr" : "1fr", gap: 10 }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em", fontFamily: C.mono, marginBottom: 7 }}>PASTE INTO</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 5 }}>{result.tool}</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{result.tool_reason}</div>
                </div>
                {result.parameters && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px 5px" }}>
                      <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em", fontFamily: C.mono }}>{result.parameters_label || "PARAMETERS"}</div>
                      <button onClick={() => copy(result.parameters!, "params")} style={{
                        background: "transparent", border: `1px solid ${copied === "params" ? C.green : C.border}`,
                        borderRadius: 4, color: copied === "params" ? C.green : C.muted,
                        cursor: "pointer", fontSize: 9, fontFamily: C.mono, padding: "2px 8px",
                      }}>
                        {copied === "params" ? "✓" : "COPY"}
                      </button>
                    </div>
                    <div style={{ padding: "3px 14px 12px", fontFamily: C.mono, fontSize: 11, color: C.goldBright, lineHeight: 1.8, wordBreak: "break-all" }}>
                      {result.parameters}
                    </div>
                  </div>
                )}
              </div>

              {/* TIPS */}
              {result.tips?.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em", fontFamily: C.mono, marginBottom: 10 }}>TIPS FOR BEST RESULTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {result.tips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{
                          flexShrink: 0, width: 17, height: 17, borderRadius: "50%",
                          background: C.goldDim, color: C.goldBright,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, fontWeight: 700, fontFamily: C.mono, marginTop: 2,
                        }}>{i + 1}</div>
                        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7 }}>{tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COPY ALL */}
              <button onClick={copyAll} style={{
                background: "transparent",
                border: `1px solid ${copied === "all" ? C.green : C.border}`,
                borderRadius: 8, color: copied === "all" ? C.green : C.muted,
                cursor: "pointer", fontFamily: C.mono, fontSize: 9,
                padding: "11px", width: "100%", letterSpacing: "0.08em", transition: "all 0.15s",
              }}>
                {copied === "all" ? "✓ EVERYTHING COPIED" : "COPY EVERYTHING (PROMPT + NEGATIVE + TOOL + TIPS)"}
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

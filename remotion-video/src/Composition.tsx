import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const W = 1920;
const H = 1080;

const neon = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  green: "#34d399",
  pink: "#f472b6",
  bg: "#050816",
  lime: "#e6d2a2",
  accent: "#1d624d",
  muted: "#94a3b8",
};

const fontDisplay = "'Manrope', sans-serif";
const fontBody = "'DM Sans', sans-serif";
const fontSerif = "'EB Garamond', Georgia, serif";

const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);

const show = (frame: number, start: number, end: number) => frame >= start * FPS && frame < end * FPS;

const fade = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start * FPS, (start + dur) * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const glowText = (color: string, size: number) => ({
  fontFamily: fontDisplay,
  fontSize: size,
  fontWeight: 800,
  letterSpacing: "-0.07em",
  lineHeight: 1.02,
  color: "#fff",
  textShadow: `0 0 12px ${color}, 0 0 32px ${color}, 0 0 64px ${color}`,
});

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = 0, s2 = 3, s3 = 7, s4 = 11, s5 = 15;

  return (
    <AbsoluteFill style={{ background: neon.bg, fontFamily: fontBody, color: "#fff", overflow: "hidden" }}>
      {/* audio */}
      <Audio src={staticFile("assets/voiceover.wav")} volume={1} />
      <Audio src={staticFile("assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")} volume={0.18} />
      {frame === Math.round(2.4 * fps) && <Audio src={staticFile("assets/sfx/interface/bong_001.ogg")} volume={0.6} />}
      {frame === Math.round(4.2 * fps) && <Audio src={staticFile("assets/sfx/interface/drop_001.ogg")} volume={0.6} />}
      {frame === Math.round(10.5 * fps) && <Audio src={staticFile("assets/sfx/ui/click3.ogg")} volume={0.55} />}
      {frame === Math.round(11.6 * fps) && <Audio src={staticFile("assets/sfx/impact/impactSoft_medium_001.ogg")} volume={0.7} />}
      {frame === Math.round(16.5 * fps) && <Audio src={staticFile("assets/sfx/impact/impactBell_heavy_000.ogg")} volume={0.6} />}

      {/* neon background orbs */}
      <div style={{ position: "absolute", width: 900, height: 900, left: "15%", top: "30%", borderRadius: "50%", background: `radial-gradient(circle, ${neon.violet}55 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.7 }} />
      <div style={{ position: "absolute", width: 700, height: 700, right: "10%", top: "20%", borderRadius: "50%", background: `radial-gradient(circle, ${neon.cyan}55 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", width: 600, height: 600, left: "50%", bottom: "-10%", transform: "translateX(-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${neon.green}44 0%, transparent 70%)`, filter: "blur(50px)", opacity: 0.5 }} />

      {/* grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${neon.cyan}11 1px, transparent 1px), linear-gradient(90deg, ${neon.cyan}11 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />

      {/* Scene 1 */}
      {show(frame, s1, s2) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.cyan, fontWeight: 800, marginBottom: 18, textShadow: `0 0 12px ${neon.cyan}` }}>
              StockSetu
            </div>
            <div style={{ ...glowText(neon.cyan, 108), transform: `translateY(${interpolate(fade(frame, 0.3, 0.6), [0, 1], [40, 0])}px)`, opacity: fade(frame, 0.3, 0.6) }}>
              Stock sambhalo.
            </div>
            <div style={{ ...glowText(neon.violet, 96), fontStyle: "italic", fontFamily: fontSerif, fontWeight: 400, marginTop: 6, transform: `translateY(${interpolate(fade(frame, 0.7, 0.6), [0, 1], [30, 0])}px)`, opacity: fade(frame, 0.7, 0.6) }}>
              Hisab saaf rakho.
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 2 */}
      {show(frame, s2, s3) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.green, fontWeight: 800, marginBottom: 16, textShadow: `0 0 12px ${neon.green}` }}>
              One calm workspace
            </div>
            <div style={{ ...glowText("#fff", 80), transform: `translateY(${interpolate(fade(frame, s2 + 0.2, 0.5), [0, 1], [30, 0])}px)`, opacity: fade(frame, s2 + 0.2, 0.5) }}>
              Inventory, billing, purchases
            </div>
            <div style={{ ...glowText(neon.cyan, 74), fontStyle: "italic", fontFamily: fontSerif, fontWeight: 400, marginTop: 4, transform: `translateY(${interpolate(fade(frame, s2 + 0.6, 0.5), [0, 1], [20, 0])}px)`, opacity: fade(frame, s2 + 0.6, 0.5) }}>
              &amp; reports — ek jagah.
            </div>
            <div
              style={{
                marginTop: 30,
                width: 1240,
                height: 580,
                borderRadius: 22,
                background: "rgba(10,15,40,.55)",
                border: `1px solid ${neon.cyan}55`,
                boxShadow: `0 0 40px ${neon.cyan}33, 0 40px 90px rgba(0,0,0,.5)`,
                backdropFilter: "blur(14px)",
                overflow: "hidden",
                display: "flex",
                opacity: fade(frame, s2 + 0.3, 0.8),
                transform: `translateY(${interpolate(fade(frame, s2 + 0.3, 0.8), [0, 1], [50, 0])}px)`,
              }}
            >
              <div style={{ width: 210, flex: "0 0 210px", background: "rgba(5,8,22,.6)", borderRight: `1px solid ${neon.cyan}22`, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 800, letterSpacing: "-.05em", display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: neon.lime ?? neon.lime, display: "grid", placeItems: "center", color: "#050816" }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17.5 10.8 4h2.4L20 17.5h-3.2l-1.5-3.2h-5l-1.5 3.2H4Zm7.6-5.8h2.3l-1.1-2.5-1.2 2.5Z"/><path d="M5 20h14"/></svg>
                  </span>
                  stocksetu
                </div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: neon.cyan, fontWeight: 600, background: `${neon.cyan}18`, border: `1px solid ${neon.cyan}33` }}>Overview</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Inventory</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Sales & invoices</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Purchases</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Reports</div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ height: 48, borderBottom: `1px solid ${neon.cyan}22`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 13, color: "#94a3b8" }}>
                  <span>Workspace / Overview</span>
                  <span>Today</span>
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
                  <div>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 22, letterSpacing: "-.05em", margin: 0, color: "#fff" }}>Good morning, Vinayak</h2>
                    <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 12 }}>Here’s your business at a glance.</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[
                      ["Sales recorded", "₹48,200", "This week"],
                      ["Products added", "128", "In catalogue"],
                      ["Outstanding", "₹6,400", "Pending balance"],
                    ].map(([l, v, n]) => (
                      <div key={l} style={{ border: `1px solid ${neon.cyan}22`, borderRadius: 10, padding: 10, background: "rgba(255,255,255,.04)" }}>
                        <small style={{ display: "block", color: "#94a3b8", fontSize: 10 }}>{l}</small>
                        <b style={{ display: "block", marginTop: 5, fontFamily: fontDisplay, fontSize: 18, letterSpacing: "-.04em", color: neon.cyan, textShadow: `0 0 8px ${neon.cyan}` }}>{v}</b>
                        <em style={{ display: "block", marginTop: 3, fontStyle: "normal", color: neon.green, fontSize: 10, fontWeight: 700 }}>{n}</em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 3 */}
      {show(frame, s3, s4) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.pink, fontWeight: 800, marginBottom: 16, textShadow: `0 0 12px ${neon.pink}` }}>
              Built for everyday business
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, width: 1480, margin: "0 auto" }}>
              {[
                ["01 / INVENTORY", "Know what’s on the shelf.", "Quantities, prices and low-stock items — ek jagah.", neon.cyan],
                ["02 / BILLING", "Billing that stays tidy.", "Invoice, payment aur details — sab record.", neon.violet],
                ["03 / PURCHASES", "Purchases flow into stock.", "Supplier se seedha inventory tak.", neon.green],
                ["04 / STOCKSATHI", "Ask your stock anything.", "Is mahine kharido? Kitne din chalega? AI answers.", neon.pink],
              ].map(([idx, h, p, color], i) => {
                const st = s3 + 0.1 + i * 0.25;
                const pp = spring({ frame: frame - st * FPS, fps, config: { damping: 12, stiffness: 140 } });
                const y = interpolate(pp, [0, 1], [40, 0]);
                const o = interpolate(pp, [0, 1], [0, 1]);
                const sc = interpolate(pp, [0, 1], [0.9, 1]);
                return (
                  <div
                    key={idx}
                    style={{
                      border: `1px solid ${color}55`,
                      borderRadius: 18,
                      background: "rgba(10,15,40,.55)",
                      backdropFilter: "blur(10px)",
                      padding: 22,
                      boxShadow: `0 0 30px ${color}22, 0 24px 60px rgba(0,0,0,.4)`,
                      transform: `translateY(${y}px) scale(${sc})`,
                      opacity: o,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color, fontWeight: 800, textShadow: `0 0 8px ${color}` }}>{idx}</div>
                    <h3 style={{ margin: "10px 0 6px", fontFamily: fontDisplay, fontSize: 20, letterSpacing: "-.04em", color: "#fff" }}>{h}</h3>
                    <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.55 }}>{p}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 4 */}
      {show(frame, s4, s5) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.green, fontWeight: 800, marginBottom: 16, textShadow: `0 0 12px ${neon.green}` }}>
              StockSathi — AI saathi
            </div>
            <div style={{ width: 920, borderRadius: 18, background: "rgba(10,15,40,.6)", border: `1px solid ${neon.cyan}44`, backdropFilter: "blur(16px)", padding: 20, boxShadow: `0 0 40px ${neon.cyan}22, 0 30px 70px rgba(0,0,0,.5)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${neon.cyan}, ${neon.violet})`, display: "grid", placeItems: "center", color: "#050816", boxShadow: `0 0 18px ${neon.cyan}` }}>✦</div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 18, letterSpacing: "-.05em", color: "#fff" }}>StockSathi</h3>
                  <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: 11 }}>sirf tumhare records se</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {(() => {
                  const buP = spring({ frame: frame - (s4 + 0.2) * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const b1P = spring({ frame: frame - (s4 + 1.0) * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const b2P = spring({ frame: frame - (s4 + 1.5) * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const b3P = spring({ frame: frame - (s4 + 2.0) * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const bubble = (text: string, p: number, type: "user" | "bot" | "warn") => {
                    const o = interpolate(p, [0, 1], [0, 1]);
                    const y = interpolate(p, [0, 1], [16, 0]);
                    const color = type === "user" ? neon.cyan : type === "warn" ? neon.pink : neon.green;
                    return (
                      <div
                        style={{
                          maxWidth: "88%",
                          padding: "9px 11px",
                          borderRadius: 11,
                          fontSize: 12,
                          lineHeight: 1.5,
                          marginBottom: 7,
                          alignSelf: type === "user" ? "flex-end" : "flex-start",
                          marginLeft: type === "user" ? "auto" : 0,
                          background: type === "user" ? `linear-gradient(135deg, ${neon.cyan}, ${neon.violet})` : "rgba(255,255,255,.06)",
                          color: type === "user" ? "#050816" : "#e2e8f0",
                          border: type === "user" ? "none" : `1px solid ${color}44`,
                          borderBottomRightRadius: type === "user" ? 4 : 11,
                          borderBottomLeftRadius: type === "bot" ? 4 : 11,
                          boxShadow: type === "user" ? `0 0 18px ${neon.cyan}66` : `0 0 12px ${color}22`,
                          opacity: o,
                          transform: `translateY(${y}px)`,
                        }}
                      >
                        {text}
                      </div>
                    );
                  };
                  return (
                    <>
                      {bubble("Is mahine kharido?", buP, "user")}
                      {bubble("Stock theek hai — 45 pieces, ~84 din chalega.", b1P, "bot")}
                      {bubble("Maang ~0.5 pieces roz · suggested order 0 pieces.", b2P, "bot")}
                      {bubble("Dhyaan: pichle 7 din ki maang pichle 30 din se double hai.", b3P, "warn")}
                    </>
                  );
                })()}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 8 }}>
                {[
                  ["Stock", "45 pieces", neon.cyan],
                  ["Sold 30 din", "16 pieces", neon.violet],
                  ["Maag / roz", "~0.5", neon.green],
                  ["Suggest order", "0 pieces", neon.pink],
                ].map(([l, v, color]) => (
                  <div key={l} style={{ border: `1px solid ${color}44`, borderRadius: 8, padding: 7, background: "rgba(255,255,255,.04)", boxShadow: `0 0 12px ${color}22` }}>
                    <small style={{ display: "block", color: "#94a3b8", fontSize: 9 }}>{l}</small>
                    <b style={{ display: "block", marginTop: 3, fontFamily: fontDisplay, fontSize: 14, letterSpacing: "-.04em", color, textShadow: `0 0 8px ${color}` }}>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 5 */}
      {show(frame, s5, 18) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
              {(() => {
                const p = spring({ frame: frame - s5 * FPS, fps, config: { damping: 12, stiffness: 140 } });
                const o = interpolate(p, [0, 1], [0, 1]);
                const sc = interpolate(p, [0, 1], [0.9, 1]);
                const underline = interpolate(frame, [s5 * FPS + 1.2 * FPS, s5 * FPS + 1.7 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div style={{ width: 1120, minHeight: 380, borderRadius: 26, background: `linear-gradient(135deg, ${neon.accent}, #0f3d2e)`, color: "#fff", padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: `0 0 60px ${neon.green}44, 0 40px 90px rgba(0,0,0,.6)`, border: `1px solid ${neon.green}44`, transform: `scale(${sc})`, opacity: o }}>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 68, lineHeight: 1.06, letterSpacing: "-.065em", fontWeight: 700, margin: 0, textShadow: `0 0 24px ${neon.green}66` }}>
                      Stock sambhalo.<br />
                      <span style={{ fontFamily: fontSerif, fontStyle: "italic", fontWeight: 400, color: neon.lime, textShadow: `0 0 18px ${neon.cyan}` }}>Hisab saaf rakho.</span>
                    </h2>
                    <div style={{ height: 7, width: 360, borderRadius: 99, background: `linear-gradient(90deg, ${neon.cyan}, ${neon.green})`, transformOrigin: "left center", transform: `scaleX(${underline})`, boxShadow: `0 0 18px ${neon.cyan}` }} />
                    <div style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: "-.06em", display: "flex", alignItems: "center", gap: 10, textShadow: `0 0 12px ${neon.cyan}` }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: neon.lime, display: "grid", placeItems: "center", color: "#050816", boxShadow: `0 0 16px ${neon.lime}` }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17.5 10.8 4h2.4L20 17.5h-3.2l-1.5-3.2h-5l-1.5 3.2H4Zm7.6-5.8h2.3l-1.1-2.5-1.2 2.5Z"/><path d="M5 20h14"/></svg>
                      </span>
                      stocksetu
                    </div>
                    <div style={{ fontSize: 14, color: "#c2d7c8" }}>stocksetu-inventory-management.vercel.app</div>
                  </div>
                );
              })()}
            </div>
          </div>
        </Scene>
      )}
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="StockSetuFlashy"
      component={MyComponent}
      durationInFrames={18 * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};

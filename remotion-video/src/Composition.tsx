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

  const s1 = 0, s2 = 3, s3 = 8, s4 = 13;

  return (
    <AbsoluteFill style={{ background: neon.bg, fontFamily: fontBody, color: "#fff", overflow: "hidden" }}>
      {/* audio (no voiceover) */}
      <Audio src={staticFile("assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")} volume={0.35} />
      {frame === Math.round(2.4 * fps) && <Audio src={staticFile("assets/sfx/interface/bong_001.ogg")} volume={0.6} />}
      {frame === Math.round(4.0 * fps) && <Audio src={staticFile("assets/sfx/interface/drop_001.ogg")} volume={0.65} />}
      {frame === Math.round(10.5 * fps) && <Audio src={staticFile("assets/sfx/ui/click3.ogg")} volume={0.55} />}
      {frame === Math.round(11.6 * fps) && <Audio src={staticFile("assets/sfx/impact/impactSoft_medium_001.ogg")} volume={0.7} />}
      {frame === Math.round(16.5 * fps) && <Audio src={staticFile("assets/sfx/impact/impactBell_heavy_000.ogg")} volume={0.6} />}

      {/* neon bg */}
      <div style={{ position: "absolute", width: 900, height: 900, left: "15%", top: "30%", borderRadius: "50%", background: `radial-gradient(circle, ${neon.violet}55 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.7 }} />
      <div style={{ position: "absolute", width: 700, height: 700, right: "10%", top: "20%", borderRadius: "50%", background: `radial-gradient(circle, ${neon.cyan}55 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", width: 600, height: 600, left: "50%", bottom: "-10%", transform: "translateX(-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${neon.green}44 0%, transparent 70%)`, filter: "blur(50px)", opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${neon.cyan}11 1px, transparent 1px), linear-gradient(90deg, ${neon.cyan}11 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />

      {/* Scene 1 */}
      {show(frame, s1, s2) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.cyan, fontWeight: 800, marginBottom: 18, textShadow: `0 0 12px ${neon.cyan}` }}>StockSetu</div>
            <div style={{ ...glowText(neon.cyan, 108), transform: `translateY(${interpolate(fade(frame, 0.3, 0.6), [0, 1], [40, 0])}px)`, opacity: fade(frame, 0.3, 0.6) }}>Stock sambhalo.</div>
            <div style={{ ...glowText(neon.violet, 96), fontStyle: "italic", fontFamily: fontSerif, fontWeight: 400, marginTop: 6, transform: `translateY(${interpolate(fade(frame, 0.7, 0.6), [0, 1], [30, 0])}px)`, opacity: fade(frame, 0.7, 0.6) }}>Hisab saaf rakho.</div>
          </div>
        </Scene>
      )}

      {/* Scene 2: modern before/after */}
      {show(frame, s2, s3) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: neon.pink, fontWeight: 800, marginBottom: 18, textShadow: `0 0 12px ${neon.pink}` }}>Before vs After</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, width: 1500, alignItems: "stretch" }}>
              {/* Before */}
              <div style={{ border: `1px solid ${neon.pink}44`, borderRadius: 18, background: "rgba(244,114,182,.06)", padding: 26, boxShadow: `0 0 30px ${neon.pink}22`, opacity: fade(frame, s2 + 0.1, 0.6) }}>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: neon.pink, fontWeight: 800, marginBottom: 12 }}>Before</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    ["📝", "Scattered paper notes", "Stock counts on loose sheets"],
                    ["❓", "Manual stock counts", "Quantity galat ho jati hai"],
                    ["⏰", "Missed reorders", "Low stock ka pata nahi"],
                    ["📉", "Hisab galat", "Sales vs stock mismatch"],
                  ].map(([icon, h, p]) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${neon.pink}22` }}>
                      <span style={{ fontSize: 20 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{h}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              <div style={{ display: "grid", placeItems: "center", fontSize: 36, color: neon.cyan, textShadow: `0 0 18px ${neon.cyan}` }}>→</div>
              {/* After */}
              <div style={{ border: `1px solid ${neon.green}44`, borderRadius: 18, background: "rgba(52,211,153,.06)", padding: 26, boxShadow: `0 0 30px ${neon.green}22`, opacity: fade(frame, s2 + 0.4, 0.6) }}>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: neon.green, fontWeight: 800, marginBottom: 12 }}>After — StockSetu</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                  {[
                    ["📦", "Inventory", "Live stock levels"],
                    ["🧾", "Billing", "Tidy invoices"],
                    ["🛒", "Purchases", "Supplier → stock"],
                    ["📊", "Reports", "Clear numbers"],
                    ["🤖", "StockSathi", "AI answers"],
                    ["🔔", "Alerts", "Low stock reminders"],
                  ].map(([icon, h, p]) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 9, background: "rgba(255,255,255,.05)", border: `1px solid ${neon.green}22` }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{h}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 3: dashboard + StockSathi */}
      {show(frame, s3, s4) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 24, padding: "60px 80px", alignItems: "center" }}>
            <div style={{ border: `1px solid ${neon.cyan}33`, borderRadius: 18, background: "rgba(10,15,40,.55)", backdropFilter: "blur(14px)", padding: 18, boxShadow: `0 0 40px ${neon.cyan}22` }}>
              <div style={{ height: 40, borderBottom: `1px solid ${neon.cyan}22`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 12, color: "#94a3b8" }}>
                <span>Workspace / Overview</span><span>Today</span>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 20, letterSpacing: "-.05em", color: "#fff" }}>Good morning, Vinayak</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {[
                    ["Sales recorded", "₹48,200", neon.cyan],
                    ["Products added", "128", neon.violet],
                    ["Outstanding", "₹6,400", neon.green],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ border: `1px solid ${c}33`, borderRadius: 9, padding: 8, background: "rgba(255,255,255,.04)", boxShadow: `0 0 12px ${c}22` }}>
                      <small style={{ display: "block", color: "#94a3b8", fontSize: 9 }}>{l}</small>
                      <b style={{ display: "block", marginTop: 4, fontFamily: fontDisplay, fontSize: 16, letterSpacing: "-.04em", color: c, textShadow: `0 0 8px ${c}` }}>{v}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ border: `1px solid ${neon.green}44`, borderRadius: 18, background: "rgba(10,15,40,.6)", backdropFilter: "blur(16px)", padding: 18, boxShadow: `0 0 40px ${neon.green}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${neon.cyan}, ${neon.violet})`, display: "grid", placeItems: "center", color: "#050816", boxShadow: `0 0 16px ${neon.cyan}` }}>✦</div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 16, letterSpacing: "-.05em", color: "#fff" }}>StockSathi</h3>
                  <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: 10 }}>sirf tumhare records se</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["user", "Is mahine kharido?"],
                  ["bot", "Stock theek hai — 45 pieces, ~84 din chalega."],
                  ["bot", "Maang ~0.5 pieces roz · suggested order 0 pieces."],
                  ["warn", "Dhyaan: pichle 7 din ki maang pichle 30 din se double hai."],
                ].map(([type, text], i) => {
                  const st = s3 + 0.4 + i * 0.35;
                  const p = spring({ frame: frame - st * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const o = interpolate(p, [0, 1], [0, 1]);
                  const y = interpolate(p, [0, 1], [12, 0]);
                  const color = type === "user" ? neon.cyan : type === "warn" ? neon.pink : neon.green;
                  return (
                    <div key={i} style={{ alignSelf: type === "user" ? "flex-end" : "flex-start", maxWidth: "88%", padding: "8px 10px", borderRadius: 10, fontSize: 11, lineHeight: 1.5, background: type === "user" ? `linear-gradient(135deg, ${neon.cyan}, ${neon.violet})` : "rgba(255,255,255,.06)", color: type === "user" ? "#050816" : "#e2e8f0", border: type === "user" ? "none" : `1px solid ${color}44`, boxShadow: type === "user" ? `0 0 14px ${neon.cyan}55` : `0 0 10px ${color}22`, opacity: o, transform: `translateY(${y}px)` }}>
                      {text}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 8 }}>
                {[
                  ["Stock", "45 pieces", neon.cyan],
                  ["Sold 30 din", "16 pieces", neon.violet],
                  ["Maag / roz", "~0.5", neon.green],
                  ["Suggest order", "0 pieces", neon.pink],
                ].map(([l, v, color]) => (
                  <div key={l} style={{ border: `1px solid ${color}44`, borderRadius: 7, padding: 6, background: "rgba(255,255,255,.04)", boxShadow: `0 0 10px ${color}22` }}>
                    <small style={{ display: "block", color: "#94a3b8", fontSize: 8 }}>{l}</small>
                    <b style={{ display: "block", marginTop: 2, fontFamily: fontDisplay, fontSize: 12, letterSpacing: "-.04em", color, textShadow: `0 0 6px ${color}` }}>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 4: CTA */}
      {show(frame, s4, 18) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
              {(() => {
                const p = spring({ frame: frame - s4 * FPS, fps, config: { damping: 12, stiffness: 140 } });
                const o = interpolate(p, [0, 1], [0, 1]);
                const sc = interpolate(p, [0, 1], [0.9, 1]);
                const underline = interpolate(frame, [s4 * FPS + 1.0 * FPS, s4 * FPS + 1.5 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div style={{ width: 1120, minHeight: 360, borderRadius: 26, background: `linear-gradient(135deg, ${neon.accent}, #0f3d2e)`, color: "#fff", padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: `0 0 60px ${neon.green}44, 0 40px 90px rgba(0,0,0,.6)`, border: `1px solid ${neon.green}44`, transform: `scale(${sc})`, opacity: o }}>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 64, lineHeight: 1.06, letterSpacing: "-.065em", fontWeight: 700, margin: 0, textShadow: `0 0 24px ${neon.green}66` }}>
                      Stock sambhalo.<br />
                      <span style={{ fontFamily: fontSerif, fontStyle: "italic", fontWeight: 400, color: neon.lime, textShadow: `0 0 18px ${neon.cyan}` }}>Hisab saaf rakho.</span>
                    </h2>
                    <div style={{ height: 7, width: 360, borderRadius: 99, background: `linear-gradient(90deg, ${neon.cyan}, ${neon.green})`, transformOrigin: "left center", transform: `scaleX(${underline})`, boxShadow: `0 0 18px ${neon.cyan}` }} />
                    <div style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 800, letterSpacing: "-.06em", display: "flex", alignItems: "center", gap: 10, textShadow: `0 0 12px ${neon.cyan}` }}>
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
      id="StockSetuNeon"
      component={MyComponent}
      durationInFrames={18 * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};

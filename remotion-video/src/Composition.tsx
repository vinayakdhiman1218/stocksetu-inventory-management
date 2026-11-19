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

const brand = {
  paper: "#f6f7f3",
  ink: "#1c2925",
  accent: "#1d624d",
  lime: "#e6d2a2",
  mint: "#e9f1eb",
  muted: "#727d76",
  green: "#4b8656",
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
  color: brand.ink,
  textShadow: `0 0 10px ${color}55, 0 0 24px ${color}33`,
});

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = 0, s2 = 3, s3 = 7, s4 = 11, s5 = 15;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 30%, ${brand.lime}55 0%, transparent 42%), linear-gradient(180deg,#fafbf8 0%, ${brand.paper} 100%)`, fontFamily: fontBody, color: brand.ink, overflow: "hidden" }}>
      {/* audio (no voiceover) */}
      <Audio src={staticFile("assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")} volume={0.35} />
      {frame === Math.round(2.4 * fps) && <Audio src={staticFile("assets/sfx/interface/bong_001.ogg")} volume={0.6} />}
      {frame === Math.round(4.0 * fps) && <Audio src={staticFile("assets/sfx/interface/drop_001.ogg")} volume={0.65} />}
      {frame === Math.round(10.5 * fps) && <Audio src={staticFile("assets/sfx/ui/click3.ogg")} volume={0.55} />}
      {frame === Math.round(11.6 * fps) && <Audio src={staticFile("assets/sfx/impact/impactSoft_medium_001.ogg")} volume={0.7} />}
      {frame === Math.round(16.5 * fps) && <Audio src={staticFile("assets/sfx/impact/impactBell_heavy_000.ogg")} volume={0.6} />}

      {/* soft glow orbs */}
      <div style={{ position: "absolute", width: 700, height: 700, left: "15%", top: "30%", borderRadius: "50%", background: `radial-gradient(circle, ${brand.lime}66 0%, transparent 70%)`, filter: "blur(50px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", width: 600, height: 600, right: "10%", top: "20%", borderRadius: "50%", background: `radial-gradient(circle, ${brand.mint}99 0%, transparent 70%)`, filter: "blur(50px)", opacity: 0.7 }} />
      <div style={{ position: "absolute", width: 500, height: 500, left: "50%", bottom: "-10%", transform: "translateX(-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${brand.lime}55 0%, transparent 70%)`, filter: "blur(60px)", opacity: 0.5 }} />

      {/* Scene 1 */}
      {show(frame, s1, s2) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: brand.accent, fontWeight: 800, marginBottom: 18 }}>StockSetu</div>
            <div style={{ ...glowText(brand.accent, 108), transform: `translateY(${interpolate(fade(frame, 0.3, 0.6), [0, 1], [40, 0])}px)`, opacity: fade(frame, 0.3, 0.6) }}>Stock sambhalo.</div>
            <div style={{ ...glowText(brand.green, 96), fontStyle: "italic", fontFamily: fontSerif, fontWeight: 400, marginTop: 6, transform: `translateY(${interpolate(fade(frame, 0.7, 0.6), [0, 1], [30, 0])}px)`, opacity: fade(frame, 0.7, 0.6) }}>Hisab saaf rakho.</div>
          </div>
        </Scene>
      )}

      {/* Scene 2: modern before/after */}
      {show(frame, s2, s3) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: brand.accent, fontWeight: 800, marginBottom: 10 }}>Before vs After</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 46, fontWeight: 800, letterSpacing: "-.05em", color: brand.ink, marginBottom: 24 }}>From chaos to clarity.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, width: 1500, alignItems: "stretch" }}>
              <div style={{ border: `1px solid ${brand.muted}44`, borderRadius: 18, background: "#fff", padding: 26, boxShadow: "0 20px 60px rgba(24,57,38,.08)", opacity: fade(frame, s2 + 0.1, 0.6) }}>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a36435", fontWeight: 800, marginBottom: 12 }}>Before</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    ["📝", "Scattered paper notes", "Stock counts on loose sheets"],
                    ["❓", "Manual stock counts", "Quantity galat ho jati hai"],
                    ["⏰", "Missed reorders", "Low stock ka pata nahi"],
                    ["📉", "Hisab galat", "Sales vs stock mismatch"],
                  ].map(([icon, h, p]) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, background: "#fff8f1", border: "1px solid #f0dccb" }}>
                      <span style={{ fontSize: 20 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: brand.ink }}>{h}</div>
                        <div style={{ fontSize: 11, color: brand.muted }}>{p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", placeItems: "center", fontSize: 36, color: brand.accent }}>→</div>
              <div style={{ border: `1px solid ${brand.accent}44`, borderRadius: 18, background: "#fff", padding: 26, boxShadow: "0 20px 60px rgba(24,57,38,.1)", opacity: fade(frame, s2 + 0.4, 0.6) }}>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: brand.accent, fontWeight: 800, marginBottom: 12 }}>After — StockSetu</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                  {[
                    ["📦", "Inventory", "Live stock levels"],
                    ["🧾", "Billing", "Tidy invoices"],
                    ["🛒", "Purchases", "Supplier → stock"],
                    ["📊", "Reports", "Clear numbers"],
                    ["🤖", "StockSathi", "AI answers"],
                    ["🔔", "Alerts", "Low stock reminders"],
                  ].map(([icon, h, p]) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 9, background: brand.mint, border: `1px solid ${brand.accent}22` }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: brand.ink }}>{h}</div>
                        <div style={{ fontSize: 10, color: brand.muted }}>{p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 3: dashboard */}
      {show(frame, s3, s4) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: Math.min(fade(frame, s3, 0.5), 1 - fade(frame, s4 - 0.5, 0.5)) }}>
            <div style={{ width: 1320, border: `1px solid ${brand.accent}33`, borderRadius: 20, background: "#fff", padding: 24, boxShadow: "0 24px 70px rgba(24,57,38,.12)" }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 30, letterSpacing: "-.05em", color: brand.ink, fontWeight: 700, marginBottom: 12 }}>Your business at a glance.</div>
              <div style={{ height: 44, borderBottom: `1px solid ${brand.accent}22`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontSize: 13, color: brand.muted }}>
                <span>Workspace / Overview</span><span>Today</span>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 24, letterSpacing: "-.05em", color: brand.ink, fontWeight: 700 }}>Good morning, Vinayak</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {[
                    ["Sales recorded", "₹48,200", brand.accent, "This week"],
                    ["Products added", "128", brand.green, "In catalogue"],
                    ["Outstanding", "₹6,400", "#a36435", "Pending balance"],
                  ].map(([l, v, c, n]) => (
                    <div key={l} style={{ border: `1px solid ${c}33`, borderRadius: 10, padding: 12, background: brand.mint }}>
                      <small style={{ display: "block", color: brand.muted, fontSize: 10 }}>{l}</small>
                      <b style={{ display: "block", marginTop: 6, fontFamily: fontDisplay, fontSize: 22, letterSpacing: "-.04em", color: c }}>{v}</b>
                      <em style={{ display: "block", marginTop: 4, fontStyle: "normal", color: brand.muted, fontSize: 10, fontWeight: 600 }}>{n}</em>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 6, border: `1px solid ${brand.accent}22`, borderRadius: 12, padding: 12, background: "#fff" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: brand.ink, marginBottom: 8 }}>Stock to watch</div>
                  {[
                    ["Cotton Shirt · M · Blue", "45 pieces", "In stock"],
                    ["Jeans · 32", "10 pieces", "Low stock"],
                  ].map(([name, qty, status]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${brand.accent}11` }}>
                      <span style={{ fontSize: 12, color: brand.ink, fontWeight: 600 }}>{name}</span>
                      <span style={{ fontSize: 11, color: brand.muted }}>{qty} · {status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 4: StockSathi full screen */}
      {show(frame, s4, s5) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: Math.min(fade(frame, s4, 0.5), 1 - fade(frame, s5 - 0.5, 0.5)) }}>
            <div style={{ width: 980, border: `1px solid ${brand.accent}33`, borderRadius: 20, background: "#fff", padding: 26, boxShadow: "0 24px 70px rgba(24,57,38,.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: brand.lime, display: "grid", placeItems: "center", color: "#173c2c" }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: fontDisplay, fontSize: 26, letterSpacing: "-.05em", color: brand.ink, fontWeight: 700, marginBottom: 8 }}>Ask your stock anything.</div>
                  <h3 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 18, letterSpacing: "-.05em", color: brand.ink }}>StockSathi</h3>
                  <p style={{ margin: "2px 0 0", color: brand.muted, fontSize: 11 }}>sirf tumhare records se</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 220 }}>
                {[
                  ["user", "Is mahine kharido?"],
                  ["bot", "Stock theek hai — 45 pieces, ~84 din chalega."],
                  ["bot", "Maang ~0.5 pieces roz · suggested order 0 pieces."],
                  ["warn", "Dhyaan: pichle 7 din ki maang pichle 30 din se double hai."],
                ].map(([type, text], i) => {
                  const st = s4 + 0.3 + i * 0.35;
                  const p = spring({ frame: frame - st * FPS, fps, config: { damping: 12, stiffness: 140 } });
                  const o = interpolate(p, [0, 1], [0, 1]);
                  const y = interpolate(p, [0, 1], [12, 0]);
                  const color = type === "user" ? brand.accent : type === "warn" ? "#a36435" : brand.green;
                  const bg = type === "user" ? brand.accent : type === "warn" ? "#fff8f1" : brand.mint;
                  const tc = type === "user" ? "#fff" : brand.ink;
                  return (
                    <div key={i} style={{ alignSelf: type === "user" ? "flex-end" : "flex-start", maxWidth: "88%", padding: "10px 12px", borderRadius: 10, fontSize: 14, lineHeight: 1.5, background: bg, color: tc, border: `1px solid ${color}33`, opacity: o, transform: `translateY(${y}px)` }}>
                      {text}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
                {[
                  ["Stock", "45 pieces", brand.accent],
                  ["Sold 30 din", "16 pieces", brand.green],
                  ["Maag / roz", "~0.5", "#a36435"],
                  ["Suggest order", "0 pieces", brand.accent],
                ].map(([l, v, color]) => (
                  <div key={l} style={{ border: `1px solid ${color}33`, borderRadius: 8, padding: 8, background: brand.mint }}>
                    <small style={{ display: "block", color: brand.muted, fontSize: 11 }}>{l}</small>
                    <b style={{ display: "block", marginTop: 3, fontFamily: fontDisplay, fontSize: 14, letterSpacing: "-.04em", color }}>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Scene>
      )}

      {/* Scene 4: CTA */}
      {show(frame, s5, 18) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
              {(() => {
                const p = spring({ frame: frame - s4 * FPS, fps, config: { damping: 12, stiffness: 140 } });
                const o = interpolate(p, [0, 1], [0, 1]);
                const sc = interpolate(p, [0, 1], [0.9, 1]);
                const underline = interpolate(frame, [s4 * FPS + 1.0 * FPS, s4 * FPS + 1.5 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div style={{ width: 1120, minHeight: 360, borderRadius: 26, background: brand.accent, color: "#fff", padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: "0 40px 90px rgba(18,71,53,.28)", transform: `scale(${sc})`, opacity: o }}>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 64, lineHeight: 1.06, letterSpacing: "-.065em", fontWeight: 700, margin: 0 }}>
                      Stock sambhalo.<br />
                      <span style={{ fontFamily: fontSerif, fontStyle: "italic", fontWeight: 400, color: brand.lime }}>Hisab saaf rakho.</span>
                    </h2>
                    <div style={{ height: 7, width: 360, borderRadius: 99, background: brand.lime, transformOrigin: "left center", transform: `scaleX(${underline})` }} />
                    <div style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 800, letterSpacing: "-.06em", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: brand.lime, display: "grid", placeItems: "center", color: "#173c2c" }}>
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
      id="StockSetuTheme"
      component={MyComponent}
      durationInFrames={18 * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};

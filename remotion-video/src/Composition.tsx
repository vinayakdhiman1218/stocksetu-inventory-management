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

const palette = {
  paper: "#f6f7f3",
  ink: "#1c2925",
  accent: "#1d624d",
  lime: "#e6d2a2",
  mint: "#e9f1eb",
  muted: "#727d76",
};

const fontDisplay = "'Manrope', sans-serif";
const fontBody = "'DM Sans', sans-serif";
const fontSerif = "'EB Garamond', Georgia, serif";

const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);

const Kinetic: React.FC<{ frame: number; start: number; text: string; size?: number; serif?: boolean }> = ({
  frame,
  start,
  text,
  size = 96,
  serif = false,
}) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start * fps, fps, config: { damping: 14, stiffness: 120 } });
  const y = interpolate(p, [0, 1], [40, 0]);
  const o = interpolate(p, [0, 1], [0, 1]);
  const blur = interpolate(p, [0, 1], [12, 0]);
  return (
    <div
      style={{
        fontFamily: serif ? fontSerif : fontDisplay,
        fontSize: size,
        fontWeight: serif ? 400 : 800,
        fontStyle: serif ? "italic" : "normal",
        color: serif ? palette.accent : palette.ink,
        letterSpacing: "-0.07em",
        lineHeight: 1.02,
        transform: `translateY(${y}px)`,
        opacity: o,
        filter: `blur(${blur}px)`,
      }}
    >
      {text}
    </div>
  );
};

const show = (frame: number, start: number, end: number) => frame >= start * FPS && frame < end * FPS;

const fade = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start * FPS, (start + dur) * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = 0, s2 = 3, s3 = 7, s4 = 11.5, s5 = 15.5;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg,#fafbf8 0%,#f6f7f3 100%)",
        fontFamily: fontBody,
        color: palette.ink,
      }}
    >
      <Audio src={staticFile("assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")} volume={0.4} />
      {frame === Math.round(2.6 * fps) && <Audio src={staticFile("assets/sfx/interface/bong_001.ogg")} volume={0.6} />}
      {frame === Math.round(4.6 * fps) && <Audio src={staticFile("assets/sfx/interface/drop_001.ogg")} volume={0.65} />}
      {frame === Math.round(11 * fps) && <Audio src={staticFile("assets/sfx/ui/click3.ogg")} volume={0.55} />}
      {frame === Math.round(12 * fps) && <Audio src={staticFile("assets/sfx/impact/impactSoft_medium_001.ogg")} volume={0.7} />}
      {frame === Math.round(16.8 * fps) && <Audio src={staticFile("assets/sfx/impact/impactBell_heavy_000.ogg")} volume={0.6} />}

      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          left: "50%",
          top: "45%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(230,210,162,.4) 0%,transparent 70%)",
          opacity: 0.2,
          filter: "blur(2px)",
        }}
      />

      {show(frame, s1, s2) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase", color: "#557558", fontWeight: 800, marginBottom: 16 }}>StockSetu</div>
            <Kinetic frame={frame} start={0.3} text="Stock manage karna" size={104} />
            <Kinetic frame={frame} start={0.7} text="mushkil nahi hona chahiye." size={96} serif />
          </div>
        </Scene>
      )}

      {show(frame, s2, s3) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase", color: "#557558", fontWeight: 800, marginBottom: 16 }}>One calm workspace</div>
            <Kinetic frame={frame} start={s2 + 0.4} text="Inventory, billing, purchases" size={86} />
            <Kinetic frame={frame} start={s2 + 0.8} text="& reports — ek jagah." size={80} serif />
            <div
              id="window"
              style={{
                marginTop: 28,
                width: 1240,
                height: 580,
                border: "1px solid rgba(37,68,47,.12)",
                borderRadius: 22,
                background: "rgba(255,255,255,.92)",
                boxShadow: "0 36px 80px rgba(24,57,38,.14)",
                overflow: "hidden",
                display: "flex",
                opacity: fade(frame, s2 + 0.2, 1),
                transform: `translateY(${interpolate(fade(frame, s2 + 0.2, 1), [0, 1], [40, 0])}px)`,
              }}
            >
              <div style={{ width: 210, flex: "0 0 210px", background: "#fbfcfa", borderRight: "1px solid #edf0eb", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 800, letterSpacing: "-.05em", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: palette.lime, display: "grid", placeItems: "center", color: "#173c2c", fontSize: 14 }}>◆</span>
                  stocksetu
                </div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: palette.accent, fontWeight: 600, background: "#eaf4e8" }}>Overview</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#69766f", fontWeight: 600 }}>Inventory</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#69766f", fontWeight: 600 }}>Sales & invoices</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#69766f", fontWeight: 600 }}>Purchases</div>
                <div style={{ padding: "7px 9px", borderRadius: 8, fontSize: 14, color: "#69766f", fontWeight: 600 }}>Reports</div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ height: 48, borderBottom: "1px solid #edf0eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 13, color: "#89948d" }}>
                  <span>Workspace / Overview</span>
                  <span>Today</span>
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
                  <div>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 22, letterSpacing: "-.05em", margin: 0 }}>Good morning, Vinayak</h2>
                    <p style={{ margin: "4px 0 0", color: "#7e8a81", fontSize: 12 }}>Here’s your business at a glance.</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[
                      ["Sales recorded", "₹48,200", "This week"],
                      ["Products added", "128", "In catalogue"],
                      ["Outstanding", "₹6,400", "Pending balance"],
                    ].map(([l, v, n]) => (
                      <div key={l} style={{ border: "1px solid #e8ece6", borderRadius: 10, padding: 10, background: "#fff" }}>
                        <small style={{ display: "block", color: "#718077", fontSize: 10 }}>{l}</small>
                        <b style={{ display: "block", marginTop: 5, fontFamily: fontDisplay, fontSize: 18, letterSpacing: "-.04em" }}>{v}</b>
                        <em style={{ display: "block", marginTop: 3, fontStyle: "normal", color: "#398254", fontSize: 10, fontWeight: 700 }}>{n}</em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scene>
      )}

      {show(frame, s3, s4) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase", color: "#557558", fontWeight: 800, marginBottom: 16 }}>Built for everyday business</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, width: 1480, margin: "0 auto" }}>
              {[
                ["01 / INVENTORY", "Know what’s on the shelf.", "Quantities, prices and low-stock items — ek jagah."],
                ["02 / BILLING", "Billing that stays tidy.", "Invoice, payment aur details — sab record."],
                ["03 / PURCHASES", "Purchases flow into stock.", "Supplier se seedha inventory tak."],
                ["04 / STOCKSATHI", "Ask your stock anything.", "Is mahine kharido? Kitne din chalega? AI answers."],
              ].map(([idx, h, p], i) => {
                const st = s3 + 0.1 + i * 0.3;
                const pp = spring({ frame: frame - st * FPS, fps, config: { damping: 14, stiffness: 120 } });
                const y = interpolate(pp, [0, 1], [30, 0]);
                const o = interpolate(pp, [0, 1], [0, 1]);
                return (
                  <div key={idx} style={{ border: "1px solid rgba(37,68,47,.12)", borderRadius: 18, background: "rgba(255,255,255,.88)", padding: 22, boxShadow: "0 24px 60px rgba(24,57,38,.1)", transform: `translateY(${y}px)`, opacity: o, textAlign: "left" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#557558", fontWeight: 800 }}>{idx}</div>
                    <h3 style={{ margin: "10px 0 6px", fontFamily: fontDisplay, fontSize: 20, letterSpacing: "-.04em" }}>{h}</h3>
                    <p style={{ color: "#68756d", fontSize: 12, lineHeight: 1.55 }}>{p}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Scene>
      )}

      {show(frame, s4, s5) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase", color: "#557558", fontWeight: 800, marginBottom: 16 }}>StockSathi — AI saathi</div>
            <div style={{ width: 920, border: "1px solid rgba(37,68,47,.12)", borderRadius: 18, background: "rgba(255,255,255,.92)", padding: 20, boxShadow: "0 30px 70px rgba(24,57,38,.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: palette.lime, display: "grid", placeItems: "center", color: "#173c2c" }}>✦</div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 18, letterSpacing: "-.05em" }}>StockSathi</h3>
                  <p style={{ margin: "2px 0 0", color: palette.muted, fontSize: 11 }}>sirf tumhare records se</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {(() => {
                  const buP = spring({ frame: frame - (s4 + 0.2) * FPS, fps, config: { damping: 14, stiffness: 120 } });
                  const b1P = spring({ frame: frame - (s4 + 1.0) * FPS, fps, config: { damping: 14, stiffness: 120 } });
                  const b2P = spring({ frame: frame - (s4 + 1.5) * FPS, fps, config: { damping: 14, stiffness: 120 } });
                  const b3P = spring({ frame: frame - (s4 + 2.0) * FPS, fps, config: { damping: 14, stiffness: 120 } });
                  const bubble = (text: string, p: number, type: "user" | "bot" | "warn") => {
                    const o = interpolate(p, [0, 1], [0, 1]);
                    const y = interpolate(p, [0, 1], [16, 0]);
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
                          background: type === "user" ? palette.accent : type === "warn" ? "#fff8f1" : "#fff",
                          color: type === "user" ? "#fff" : type === "warn" ? "#7a5638" : "#3a4d41",
                          border: type === "user" ? "none" : type === "warn" ? "1px solid #f0dccb" : "1px solid #e8ece6",
                          borderBottomRightRadius: type === "user" ? 4 : 11,
                          borderBottomLeftRadius: type === "bot" ? 4 : 11,
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
                  ["Stock", "45 pieces"],
                  ["Sold 30 din", "16 pieces"],
                  ["Maag / roz", "~0.5"],
                  ["Suggest order", "0 pieces"],
                ].map(([l, v]) => (
                  <div key={l} style={{ border: "1px solid #e8ece6", borderRadius: 8, padding: 7, background: "#fff" }}>
                    <small style={{ display: "block", color: "#718077", fontSize: 9 }}>{l}</small>
                    <b style={{ display: "block", marginTop: 3, fontFamily: fontDisplay, fontSize: 14, letterSpacing: "-.04em" }}>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Scene>
      )}

      {show(frame, s5, 18) && (
        <Scene>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
              {(() => {
                const p = spring({ frame: frame - s5 * FPS, fps, config: { damping: 14, stiffness: 120 } });
                const o = interpolate(p, [0, 1], [0, 1]);
                const sc = interpolate(p, [0, 1], [0.92, 1]);
                const underline = interpolate(frame, [s5 * FPS + 1.3 * FPS, s5 * FPS + 1.8 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div style={{ width: 1120, minHeight: 380, borderRadius: 26, background: palette.accent, color: "#fff", padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: "0 40px 90px rgba(18,71,53,.28)", transform: `scale(${sc})`, opacity: o }}>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 68, lineHeight: 1.06, letterSpacing: "-.065em", fontWeight: 700, margin: 0 }}>
                      Stock sambhalo.<br />
                      <span style={{ fontFamily: fontSerif, fontStyle: "italic", fontWeight: 400, color: palette.lime }}>Hisab saaf rakho.</span>
                    </h2>
                    <div style={{ height: 7, width: 360, borderRadius: 99, background: palette.lime, transformOrigin: "left center", transform: `scaleX(${underline})` }} />
                    <div style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: "-.06em", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: palette.lime, display: "grid", placeItems: "center", color: "#173c2c" }}>◆</span>
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
      id="StockSetuAd"
      component={MyComponent}
      durationInFrames={18 * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};

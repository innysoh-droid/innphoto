const { useState, useEffect, useRef, useMemo } = React;

// ────────────────────────────────────────────────────────────
// Placeholder photo component — monospace-labeled striped frame
// Swap `src` in later to drop real photography in.
// ────────────────────────────────────────────────────────────
function Photo({ label, src, tone = 1, ratio = "3/4", style = {}, children }) {
  const bg = `hsl(28 ${8 + tone * 2}% ${6 + tone * 3}%)`;
  const stripe = `hsl(28 ${10 + tone * 2}% ${10 + tone * 3}%)`;
  return (
    <div
      style={{
        aspectRatio: ratio,
        background: src
          ? `url(${src}) center/cover no-repeat`
          : `repeating-linear-gradient(135deg, ${bg} 0 14px, ${stripe} 14px 28px)`,
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        ...style,
      }}
    >
      {!src && label && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "rgba(242,236,227,.45)",
            textAlign: "center",
            padding: 16,
            lineHeight: 1.6,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Tweaks panel
// ────────────────────────────────────────────────────────────
function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const set = (k, v) => {
    setTweaks((prev) => ({ ...prev, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };
  const accents = [
    { name: "Copper", v: "#c68a5a" },
    { name: "Ember", v: "#b85c3c" },
    { name: "Bone", v: "#e3d9c6" },
    { name: "Sage", v: "#8aa38a" },
    { name: "Indigo", v: "#6a7aa8" },
  ];
  const fonts = ["Cormorant Garamond", "Inter Tight", "JetBrains Mono"];
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 260,
        background: "rgba(14,11,9,.94)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--rule)",
        borderRadius: 4,
        padding: 18,
        zIndex: 200,
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--fg)",
        boxShadow: "0 30px 80px rgba(0,0,0,.6)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ letterSpacing: ".24em", textTransform: "uppercase", color: "var(--fg-dim)" }}>Tweaks</div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--fg-muted)",
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--fg-muted)", marginBottom: 8, fontSize: 10, letterSpacing: ".18em" }}>ACCENT</div>
        <div style={{ display: "flex", gap: 6 }}>
          {accents.map((a) => (
            <button
              key={a.v}
              onClick={() => set("accent", a.v)}
              title={a.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: a.v,
                border: tweaks.accent === a.v ? "2px solid var(--fg)" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--fg-muted)", marginBottom: 8, fontSize: 10, letterSpacing: ".18em" }}>DISPLAY TYPE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => set("display_font", f)}
              style={{
                textAlign: "left",
                padding: "6px 8px",
                background: tweaks.display_font === f ? "var(--bg-soft)" : "transparent",
                border: "1px solid var(--rule)",
                color: "var(--fg)",
                fontFamily: f,
                fontSize: 13,
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--fg-muted)", marginBottom: 8, fontSize: 10, letterSpacing: ".18em" }}>DENSITY</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["editorial", "gallery", "compact"].map((d) => (
            <button
              key={d}
              onClick={() => set("density", d)}
              style={{
                flex: 1,
                padding: "6px 4px",
                background: tweaks.density === d ? "var(--fg)" : "transparent",
                color: tweaks.density === d ? "var(--bg)" : "var(--fg-dim)",
                border: "1px solid var(--rule)",
                cursor: "pointer",
                fontFamily: "var(--mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                borderRadius: 2,
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={tweaks.show_numbers}
          onChange={(e) => set("show_numbers", e.target.checked)}
        />
        <span style={{ color: "var(--fg-dim)", fontSize: 10, letterSpacing: ".18em" }}>SECTION NUMBERS</span>
      </label>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// NAV
// ────────────────────────────────────────────────────────────
function Nav({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const link = { color: "var(--fg-dim)", cursor: "pointer", transition: "color .2s" };
  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: scrolled ? "14px 40px" : "22px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrolled ? "rgba(14,11,9,.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
        transition: "all .35s ease",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: ".18em",
        textTransform: "uppercase",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 12px var(--accent)",
        }} />
        <span style={{ letterSpacing: ".3em", color: "var(--fg)" }}>INN PHOTO</span>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <a href="#work" style={link} onMouseEnter={(e) => e.target.style.color = "var(--fg)"} onMouseLeave={(e) => e.target.style.color = "var(--fg-dim)"}>Work</a>
        <a href="#about" style={link} onMouseEnter={(e) => e.target.style.color = "var(--fg)"} onMouseLeave={(e) => e.target.style.color = "var(--fg-dim)"}>About</a>
        <a href="#journal" style={link} onMouseEnter={(e) => e.target.style.color = "var(--fg)"} onMouseLeave={(e) => e.target.style.color = "var(--fg-dim)"}>Journal</a>
        <button
          onClick={onContact}
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
            padding: "9px 18px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 2,
          }}
        >
          Enquire
        </button>
      </div>
    </nav>
  );
}

// ────────────────────────────────────────────────────────────
// HERO — layout 0: large photo left, text right, editorial metadata
// ────────────────────────────────────────────────────────────
function Hero({ onContact }) {
  const [narrow, setNarrow] = useState(typeof window !== "undefined" && window.innerWidth < 1100);
  useEffect(() => {
    const h = () => setNarrow(window.innerWidth < 1100);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return (
    <section style={{ minHeight: narrow ? "auto" : "100vh", padding: narrow ? "120px 24px 64px" : "140px 40px 80px", position: "relative" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: narrow ? "minmax(0, 1fr)" : "minmax(0, 1.05fr) minmax(0, 1fr)",
        gap: narrow ? 40 : 56,
        maxWidth: 1480,
        margin: "0 auto",
        alignItems: "stretch",
      }}>
        {/* Left: hero image */}
        <div style={{ position: "relative" }}>
          <Photo
            src="photos/church-exit.jpg"
            ratio="2/3"
            tone={2}
            style={{ height: "100%", minHeight: narrow ? 420 : 560 }}
          />
          {/* Corner tags on the photo */}
          <div style={{
            position: "absolute",
            top: 16, left: 16,
            display: "flex",
            gap: 10,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(242,236,227,.85)",
          }}>
            <span style={{ padding: "4px 8px", background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" }}>
              Frame 01 / 24
            </span>
          </div>
          <div style={{
            position: "absolute",
            bottom: 16, left: 16, right: 16,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(242,236,227,.7)",
          }}>
            <span>Quinta da Bacalhôa · 2025</span>
            <span>ƒ/1.8 · 1/200</span>
          </div>
        </div>

        {/* Right: text column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0" }}>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
              Est. Lisbon · Available 2026
            </div>

            <h1 style={{
              fontFamily: "var(--display)",
              fontWeight: 300,
              fontSize: "clamp(44px, 6vw, 104px)",
              lineHeight: 0.98,
              letterSpacing: "-.015em",
              margin: "0 0 28px",
              color: "var(--fg)",
            }}>
              Weddings, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>events</em><br/>
              & the quiet<br/>
              moments between.
            </h1>

            <p style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--fg-dim)",
              maxWidth: 460,
              margin: "0 0 40px",
              fontWeight: 300,
            }}>
              Documentary photography for people who'd rather be in the moment
              than pose for it. Based in Lisbon, working anywhere a good story
              brings me.
            </p>
          </div>

          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 36 }}>
              <button
                onClick={onContact}
                style={{
                  background: "var(--fg)",
                  color: "var(--bg)",
                  border: "none",
                  padding: "16px 28px",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                Check a date →
              </button>
              <a
                href="#work"
                style={{
                  background: "transparent",
                  color: "var(--fg)",
                  border: "1px solid var(--rule)",
                  padding: "16px 28px",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                See the work
              </a>
            </div>

            {/* Stat strip */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              paddingTop: 28,
              borderTop: "1px solid var(--rule)",
            }}>
              {[
                ["140+", "Celebrations documented"],
                ["6 yrs", "Behind the lens"],
                ["11", "Countries traveled"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: "var(--display)",
                    fontSize: 34,
                    fontWeight: 400,
                    color: "var(--fg)",
                    lineHeight: 1,
                  }}>{n}</div>
                  <div style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    marginTop: 8,
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll marker */}
      <div style={{
        position: "absolute",
        bottom: 24,
        left: 40,
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: ".28em",
        textTransform: "uppercase",
        color: "var(--fg-muted)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span>Scroll</span>
        <span style={{ width: 24, height: 1, background: "var(--fg-muted)" }} />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// SECTION HEADER
// ────────────────────────────────────────────────────────────
function SectionHeader({ num, kicker, title, showNumbers }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 20,
        marginBottom: 16,
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: ".24em",
        textTransform: "uppercase",
      }}>
        {showNumbers && (
          <span style={{ color: "var(--accent)" }}>§ {num}</span>
        )}
        <span style={{ color: "var(--fg-muted)" }}>{kicker}</span>
      </div>
      <h2 style={{
        fontFamily: "var(--display)",
        fontWeight: 300,
        fontSize: "clamp(38px, 5vw, 68px)",
        lineHeight: 1.02,
        letterSpacing: "-.01em",
        margin: 0,
        color: "var(--fg)",
        maxWidth: 900,
      }}>
        {title}
      </h2>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// WORK / PORTFOLIO — editorial masonry
// ────────────────────────────────────────────────────────────
function Work({ showNumbers, density }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Weddings", "Details", "Aerial"];

  const items = [
    { cat: "Aerial", src: "photos/venue-aerial.jpg", label: "quinta from above\naerial, portugal", ratio: "16/10", span: 8 },
    { cat: "Weddings", src: "photos/signing.jpg", label: "registry signing\nchurch, candlelight", ratio: "2/3", span: 4 },
    { cat: "Weddings", src: "photos/ceremony-joy.jpg", label: "ceremony recessional\nlisbon", ratio: "3/2", span: 7 },
    { cat: "Weddings", src: "photos/wedding-01.jpg", label: "reception, late night\nlisbon", ratio: "3/2", span: 5 },
    { cat: "Details", src: "photos/bride-shoes.jpg", label: "bride's shoes\ngetting ready", ratio: "2/3", span: 4 },
    { cat: "Details", src: "photos/groom-details.jpg", label: "groom's details\nties, watch, cufflinks", ratio: "2/3", span: 4 },
    { cat: "Details", src: "photos/cufflinks.jpg", label: "cufflinks & boutonnières\nmorning light", ratio: "3/2", span: 4 },
    { cat: "Weddings", src: "photos/azulejo-walk.jpg", label: "bride walks out\nazulejo façade", ratio: "2/3", span: 4 },
    { cat: "Weddings", src: "photos/church-exit.jpg", label: "church exit, rice toss\nlisbon", ratio: "2/3", span: 4 },
    { cat: "Weddings", src: "photos/band-night.jpg", label: "live band, first dance\noutdoor stage", ratio: "2/3", span: 4 },
    { cat: "Aerial", src: "photos/reception-aerial.jpg", label: "full reception\nstretch tent, golden hour", ratio: "3/2", span: 8 },
    { cat: "Details", src: "photos/cake.jpg", label: "wedding cake\nlate reception", ratio: "2/3", span: 4 },
    { cat: "Weddings", src: "photos/guest-portrait.jpg", label: "guest portrait\ngolden hour", ratio: "2/3", span: 4 },
    { cat: "Weddings", src: "photos/reception-laugh.jpg", label: "reception, quiet laugh\nquinta, portugal", ratio: "3/2", span: 8 },
  ];

  const filtered = filter === "All" ? items : items.filter(i => i.cat === filter);

  const gap = density === "compact" ? 10 : density === "gallery" ? 18 : 24;

  return (
    <section id="work" style={{ padding: "120px 40px", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <SectionHeader
          num="01"
          kicker="Selected Work / 2024 — 2026"
          title={<>A quiet catalogue of <em style={{ fontStyle: "italic", fontWeight: 300 }}>moments</em><br/>made in Lisbon & elsewhere.</>}
          showNumbers={showNumbers}
        />

        {/* Filter bar */}
        <div style={{
          display: "flex",
          gap: 6,
          marginBottom: 40,
          flexWrap: "wrap",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
          padding: "14px 0",
        }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? "var(--fg)" : "transparent",
                color: filter === c ? "var(--bg)" : "var(--fg-dim)",
                border: "none",
                padding: "6px 14px",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all .2s",
              }}
            >
              {c}
            </button>
          ))}
          <span style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            alignSelf: "center",
          }}>
            {filtered.length} / {items.length} frames
          </span>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap,
        }}>
          {filtered.map((item, i) => (
            <div
              key={i}
              style={{
                gridColumn: `span ${item.span}`,
                position: "relative",
                cursor: "pointer",
                transition: "transform .4s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Photo src={item.src} label={item.label} ratio={item.ratio} tone={(i % 3) + 1} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}>
                <span>{String(i + 1).padStart(2, "0")} · {item.cat}</span>
                <span>↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// ABOUT
// ────────────────────────────────────────────────────────────
function About({ showNumbers }) {
  return (
    <section id="about" style={{ padding: "120px 40px", borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <SectionHeader
          num="02"
          kicker="About — Inn"
          title={<>I'm <em style={{ fontStyle: "italic" }}>Inn</em>. I photograph<br/>the way things actually feel.</>}
          showNumbers={showNumbers}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: 80,
          alignItems: "start",
        }}>
          <div style={{ position: "sticky", top: 100 }}>
            <Photo src="photos/inn-portrait.jpg" ratio="3/2" tone={1} />
          </div>

          <div style={{ fontSize: 19, lineHeight: 1.7, color: "var(--fg-dim)", fontWeight: 300 }}>
            <p style={{ fontSize: 24, fontFamily: "var(--display)", fontStyle: "italic", color: "var(--fg)", lineHeight: 1.4, margin: "0 0 32px" }}>
              "The best photographs aren't taken — they're noticed. My job is to
              stay quiet enough that you forget I'm there."
            </p>

            <p style={{ margin: "0 0 20px" }}>
              Based in Lisbon, shooting weddings and the details around them —
              ceremonies, receptions, the quiet getting-ready frames. What I'm
              after is the <em>true</em> frame, not the pretty one. Sometimes
              those are the same.
            </p>

            <p style={{ margin: "0 0 40px" }}>
              I travel often for events across Portugal and Europe. I shoot with a
              small kit, work alongside a second shooter when it matters, and
              deliver galleries you'll actually revisit.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px 40px",
              paddingTop: 32,
              borderTop: "1px solid var(--rule)",
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}>
              {[
                ["Based", "Lisbon, PT"],
                ["Available", "PT · EU · Travel"],
                ["Languages", "PT · EN · ES"],
                ["Gear", "Sony · Leica · Film"],
                ["Turnaround", "3—5 weeks"],
                ["Booking", "2026 open"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: ".2em", fontSize: 10, marginBottom: 4 }}>{k}</div>
                  <div style={{ color: "var(--fg)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// SERVICES (small strip — event types)
// ────────────────────────────────────────────────────────────
function Services({ showNumbers }) {
  const services = [
    { n: "01", t: "Weddings", d: "Full-day coverage, from getting ready to last dance. Documentary-led, lightly directed where it matters." },
    { n: "02", t: "Ceremony & details", d: "The quiet frames — rings, shoes, signatures, the space before the guests arrive." },
    { n: "03", t: "Aerial & venue", d: "Drone coverage of quintas, ceremonies, and receptions — context shots that set the day." },
    { n: "04", t: "Receptions & parties", d: "Live bands, first dances, late nights. Comfortable in low light." },
  ];
  return (
    <section style={{ padding: "120px 40px", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <SectionHeader
          num="03"
          kicker="Services"
          title={<>What I shoot.</>}
          showNumbers={showNumbers}
        />

        <div style={{
          borderTop: "1px solid var(--rule)",
        }}>
          {services.map((s) => (
            <div
              key={s.n}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 2fr 80px",
                gap: 24,
                padding: "28px 0",
                borderBottom: "1px solid var(--rule)",
                alignItems: "baseline",
                cursor: "pointer",
                transition: "all .3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.paddingLeft = "12px";
                e.currentTarget.style.background = "var(--bg-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.paddingLeft = "0";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: ".24em",
                color: "var(--accent)",
              }}>{s.n}</div>
              <div style={{
                fontFamily: "var(--display)",
                fontSize: 32,
                fontWeight: 300,
                color: "var(--fg)",
              }}>{s.t}</div>
              <div style={{
                fontSize: 15,
                color: "var(--fg-dim)",
                maxWidth: 560,
              }}>{s.d}</div>
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
                textAlign: "right",
              }}>Enquire →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// JOURNAL / INSTAGRAM FEED
// ────────────────────────────────────────────────────────────
function Journal({ showNumbers }) {
  const posts = [
    { src: "photos/reception-laugh.jpg", label: "quinta reception", ratio: "1/1" },
    { src: "photos/signing.jpg", label: "registry, church", ratio: "1/1" },
    { src: "photos/ceremony-joy.jpg", label: "church recessional", ratio: "1/1" },
    { src: "photos/azulejo-walk.jpg", label: "azulejo walk", ratio: "1/1" },
    { src: "photos/cake.jpg", label: "wedding cake", ratio: "1/1" },
    { src: "photos/venue-aerial.jpg", label: "venue from above", ratio: "1/1" },
    { src: "photos/band-night.jpg", label: "live band", ratio: "1/1" },
    { src: "photos/bride-shoes.jpg", label: "details, morning of", ratio: "1/1" },
  ];
  return (
    <section id="journal" style={{ padding: "120px 40px", borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <SectionHeader
            num="04"
            kicker="Journal · @innsvp"
            title={<>Fresh frames, always.</>}
            showNumbers={showNumbers}
          />
          <a
            href="https://www.instagram.com/innsvp/"
            target="_blank"
            rel="noopener"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "var(--accent)",
              borderBottom: "1px solid var(--accent)",
              paddingBottom: 4,
              marginBottom: 48,
              display: "inline-block",
            }}
          >
            Follow on Instagram ↗
          </a>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
        }}>
          {posts.map((p, i) => (
            <div
              key={i}
              style={{ position: "relative", cursor: "pointer", overflow: "hidden" }}
              onMouseEnter={(e) => {
                const o = e.currentTarget.querySelector("[data-overlay]");
                if (o) o.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const o = e.currentTarget.querySelector("[data-overlay]");
                if (o) o.style.opacity = 0;
              }}
            >
              <Photo src={p.src} label={p.label} ratio={p.ratio} tone={(i % 3) + 1} />
              <div
                data-overlay
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(14,11,9,.6)",
                  opacity: 0,
                  transition: "opacity .3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  color: "var(--fg)",
                }}
              >
                View post ↗
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// CONTACT / BOOKING
// ────────────────────────────────────────────────────────────
function Contact({ showNumbers, contactRef }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "Wedding",
    date: "",
    location: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // Opens an email draft to Inn
    const body = `Name: ${form.name}%0D%0A` +
      `Event: ${form.type}%0D%0A` +
      `Date: ${form.date}%0D%0A` +
      `Location: ${form.location}%0D%0A%0D%0A` +
      `${form.notes}`;
    window.location.href = `mailto:innysoh@gmail.com?subject=Booking%20enquiry%20%E2%80%94%20${encodeURIComponent(form.type)}&body=${body}`;
    setSent(true);
  };

  const field = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--rule)",
    padding: "16px 0",
    color: "var(--fg)",
    fontFamily: "var(--sans)",
    fontSize: 16,
    width: "100%",
    outline: "none",
    transition: "border-color .2s",
  };

  const labelStyle = {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: ".24em",
    textTransform: "uppercase",
    color: "var(--fg-muted)",
    marginBottom: 4,
    display: "block",
  };

  return (
    <section id="contact" ref={contactRef} style={{ padding: "120px 40px", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
          gap: 100,
        }}>
          <div>
            <SectionHeader
              num="05"
              kicker="Enquire"
              title={<>Tell me about<br/>the day you're<br/><em style={{ fontStyle: "italic", color: "var(--accent)" }}>planning.</em></>}
              showNumbers={showNumbers}
            />

            <p style={{ fontSize: 17, color: "var(--fg-dim)", lineHeight: 1.6, maxWidth: 460, marginBottom: 40 }}>
              A sentence or a paragraph, both work. I reply within 48 hours with
              availability, a deck of relevant work, and package details.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 18,
              paddingTop: 28,
              borderTop: "1px solid var(--rule)",
            }}>
              {[
                ["Email", "innysoh@gmail.com", "mailto:innysoh@gmail.com"],
                ["Instagram", "@innsvp", "https://www.instagram.com/innsvp/"],
                ["Based", "Lisbon, Portugal · available for travel", null],
              ].map(([k, v, href]) => (
                <div key={k} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <div style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: ".24em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    minWidth: 90,
                  }}>{k}</div>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{
                      color: "var(--fg)",
                      borderBottom: "1px solid var(--accent)",
                      paddingBottom: 2,
                    }}>{v}</a>
                  ) : (
                    <span style={{ color: "var(--fg)" }}>{v}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <label style={labelStyle}>Your name</label>
              <input required style={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input required type="email" style={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label style={labelStyle}>Event type</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {["Wedding", "Ceremony", "Reception", "Details"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    style={{
                      background: form.type === t ? "var(--fg)" : "transparent",
                      color: form.type === t ? "var(--bg)" : "var(--fg-dim)",
                      border: "1px solid var(--rule)",
                      padding: "8px 14px",
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: 2,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Date (approx.)</label>
                <input type="text" placeholder="e.g. June 2026" style={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input type="text" placeholder="e.g. Sintra" style={field} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>A few words about your event</label>
              <textarea rows="4" style={{ ...field, resize: "vertical" }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button
              type="submit"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                padding: "18px 28px",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: ".28em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 2,
                marginTop: 8,
              }}
            >
              {sent ? "Opened your email ↗" : "Send enquiry →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "60px 40px 40px",
      borderTop: "1px solid var(--rule)",
      background: "var(--bg)",
    }}>
      <div style={{
        maxWidth: 1480,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 24,
      }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 88, fontWeight: 300, lineHeight: .9, letterSpacing: "-.02em", color: "var(--fg)" }}>
          Inn<em style={{ fontStyle: "italic", color: "var(--accent)" }}>.</em>
        </div>
        <div style={{
          display: "flex",
          gap: 40,
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}>
          <div>
            <div style={{ color: "var(--fg)", marginBottom: 8 }}>© 2026 Inn Photo</div>
            <div>Lisbon, Portugal</div>
          </div>
          <div>
            <a href="mailto:innysoh@gmail.com" style={{ display: "block", color: "var(--fg)", marginBottom: 8 }}>innysoh@gmail.com</a>
            <a href="https://www.instagram.com/innsvp/" target="_blank" rel="noopener">@innsvp ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────
// APP
// ────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const contactRef = useRef(null);

  // Apply tweaks → CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--display", `'${tweaks.display_font}', serif`);
  }, [tweaks]);

  // Edit mode protocol
  useEffect(() => {
    const h = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", h);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", h);
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <Nav onContact={scrollToContact} />
      <Hero onContact={scrollToContact} />
      <Work showNumbers={tweaks.show_numbers} density={tweaks.density} />
      <About showNumbers={tweaks.show_numbers} />
      <Services showNumbers={tweaks.show_numbers} />
      <Journal showNumbers={tweaks.show_numbers} />
      <Contact showNumbers={tweaks.show_numbers} contactRef={contactRef} />
      <Footer />
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

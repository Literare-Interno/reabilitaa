import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceCard {
  num: string;
  title: string;
  desc: string;
  tag: string;
  img: string;
  alt: string;
  variant: "light" | "orange" | "dark";
}

interface FaqItem {
  question: string;
  answer: string;
}

interface NumberStat {
  val: number;
  suffix: string;
  label: string;
  prefix?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICE_CARDS: ServiceCard[] = [
  {
    num: "01 —",
    title: "Terapia Assistida",
    desc: "Intervenções terapêuticas estruturadas com animais para saúde, reabilitação e bem-estar humano.",
    tag: "Saúde & Clínica",
    img: "./src/assets/imgs/63.png",
    alt: "Terapia Assistida por Animais",
    variant: "light",
  },
  {
    num: "02 —",
    title: "Educação Assistida",
    desc: "Uso educacional e pedagógico dos animais como facilitadores do aprendizado e inclusão social.",
    tag: "Educação",
    img: "./src/assets/imgs/3.png",
    alt: "Educação Assistida por Animais",
    variant: "orange",
  },
  {
    num: "03 —",
    title: "Ética & Direito",
    desc: "Fundamentos jurídicos, legislação vigente, responsabilidade profissional e bem-estar animal.",
    tag: "Jurídico & Ética",
    img: "./src/assets/imgs/75.png",
    alt: "Aspectos Jurídicos e Éticos",
    variant: "light",
  },
  {
    num: "04 —",
    title: "Visão Interdisciplinar",
    desc: "Integração entre ciência, prática clínica, políticas públicas e impacto social dos SAA.",
    tag: "Pesquisa & Ciência",
    img: "./src/assets/imgs/2.png",
    alt: "Visão Interdisciplinar",
    variant: "dark",
  },
];

const STATS: NumberStat[] = [
  { val: 1, suffix: "º", label: "Editora em não ficção", prefix: "" },
  { val: 20, suffix: "+", label: "Anos de experiência" },
  { val: 110, suffix: "+", label: "Livros publicados" },
  { val: 100, suffix: "%", label: "Rigor científico" },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quem pode ser coautor(a) do livro?",
    answer:
      "Profissionais da saúde, educação, terapias integrativas, direito e áreas correlatas; pesquisadores, especialistas e estudantes de pós-graduação com atuação em Serviços Assistidos por Animais (SAA) ou áreas relacionadas.",
  },
  {
    question: "Qual é o processo de submissão de capítulo?",
    answer:
      "Após manifestação de interesse, o autor recebe as diretrizes editoriais com normas de formatação, estrutura e prazo. O capítulo passa por avaliação técnica e revisão pela coordenação antes da aprovação final.",
  },
  {
    question: "A obra tem reconhecimento acadêmico e institucional?",
    answer:
      "Sim. A publicação é coordenada por pesquisadora com titulação de mestre em TAA na Espanha e reconhecida internacionalmente. O livro segue critérios editoriais de excelência e será registrado com ISBN, tendo circulação nacional e internacional.",
  },
  {
    question: "Quais espécies animais são abordadas no livro?",
    answer:
      "A obra contempla múltiplas espécies: cães, felinos, equinos, aves e animais silvestres, sempre respeitando protocolos de bem-estar animal, legislação vigente e diretrizes profissionais.",
  },
  {
    question: "Quais são os benefícios para os coautores participantes?",
    answer:
      "Além do crédito acadêmico e científico, os coautores ganham visibilidade institucional, fortalecimento de marca profissional, posicionamento estratégico no setor e ampliação de networking com profissionais e pesquisadores da área.",
  },
];

const MARQUEE_ITEMS = [
  "Terapia Assistida",
  "Educação Assistida",
  "Bem-Estar Animal",
  "Interdisciplinaridade",
  "Saúde & Reabilitação",
  "Rigor Científico",
  "Direito & Ética",
  "Impacto Social",
];

const BOOK_PILLARS = [
  { icon: "", title: "Múltiplas Espécies", desc: "Cães, felinos, equinos, aves e animais silvestres — cada espécie com protocolos próprios de bem-estar." },
  { icon: "", title: "Evidência Científica", desc: "Estudos de caso, pesquisas e referências internacionais que validam as práticas dos SAA." },
  { icon: "", title: "Responsabilidade Jurídica", desc: "Legislação vigente, aspectos éticos e responsabilidade profissional no contexto brasileiro." },
  { icon: "", title: "Multiprofissional", desc: "Saúde, educação, direito e ciência unidas em prol de uma prática séria e fundamentada." },
  { icon: "", title: "Impacto Social", desc: "Aplicações em contextos clínicos, hospitalares, educacionais e comunitários de todo o país." },
  { icon: "", title: "Legado Acadêmico", desc: "Uma referência editorial que consolida o campo e abre caminhos para futuras pesquisas." },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useRevealObserver(threshold = 0.1) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return progress;
}

function useParallax(speed = 0.3) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) return;
    const fn = () => {
      const rect = el.getBoundingClientRect();
      setOffset((rect.top + rect.height / 2 - window.innerHeight / 2) * speed);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [speed, isMobile]);
  return { ref, offset: isMobile ? 0 : offset };
}

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { ref, count };
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Reveal({
  children, delay = 0, as: Tag = "div", className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; as?: React.ElementType;
  className?: string; direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, visible } = useRevealObserver();
  const getT = () => {
    if (visible) return "none";
    if (direction === "left") return "translateX(-40px)";
    if (direction === "right") return "translateX(40px)";
    if (direction === "scale") return "scale(0.93)";
    return "translateY(30px)";
  };
  return (
    <Tag ref={ref} className={className} style={{
      opacity: visible ? 1 : 0, transform: getT(),
      transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </Tag>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: "3px",
      width: `${progress * 100}%`,
      background: "linear-gradient(90deg, var(--pg-orange), var(--pg-orange2))",
      zIndex: 200, transition: "width .06s linear",
      boxShadow: "0 0 10px var(--pg-orange)",
    }} />
  );
}

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile(900);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = ["O Livro", "Temas", "Coordenação", "FAQ", "Contato"];

  return (
    <>
      <nav className="pg-nav" style={scrolled ? {
        background: "rgba(244,243,239,.96)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)", boxShadow: "0 1px 0 rgba(0,0,0,.07)",
      } : undefined}>
        <div className="pg-nav__logo">
          <img src="src/assets/imgs/logoreabnatale.png" alt="Logo Reab Natale" />
        </div>
        <ul className="pg-nav__links">
          {links.map((item) => (
            <li key={item}><a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>{item}</a></li>
          ))}
        </ul>
        <button className="pg-nav__cta pg-nav__cta--desktop">Quero ser Coautor(a) →</button>
        <button
          className={`pg-nav__burger ${menuOpen ? "pg-nav__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`pg-mobile-drawer ${menuOpen ? "pg-mobile-drawer--open" : ""}`}>
        <ul>
          {links.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button className="pg-btn-primary pg-mobile-drawer__cta" onClick={() => setMenuOpen(false)}>
          Quero ser Coautor(a) →
        </button>
      </div>
      {menuOpen && <div className="pg-drawer-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

function HeroSection() {
  const { ref: bgRef, offset: bgOffset } = useParallax(0.15);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  const fade = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(28px)",
    transition: `opacity .9s ${delay}ms cubic-bezier(.16,1,.3,1), transform .9s ${delay}ms cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <section className="pg-hero" id="inicio">
      <div ref={bgRef as React.RefObject<HTMLDivElement>} className="pg-hero__orb"
        style={{ transform: `translateY(${bgOffset}px)` }} />

      <div className="pg-hero__label" style={fade(100)}>
        <span className="pg-hero__label-tag">✦ Literare Books</span>
        <span className="pg-hero__label-text">Editora número 1 do Brasil</span>
      </div>

      <h1 className="pg-hero__title" style={fade(200)}>
        Seja um<br /><em>Coautor(a)</em><br />Hoje!
      </h1>

      <div className="pg-hero__image-wrap" style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "none" : "translateX(30px) scale(.96)",
        transition: `opacity 1.1s 350ms cubic-bezier(.16,1,.3,1), transform 1.1s 350ms cubic-bezier(.16,1,.3,1)`,
      }}>
        <div className="pg-hero__image-inner">
          <img src="src/assets/imgs/dogherooo.png" alt="Mascote do projeto" />
        </div>
      </div>

      <div className="pg-hero__bottom" style={fade(500)}>
        <button className="pg-btn-primary">Saiba mais <span className="pg-arrow">↗</span></button>
        <div className="pg-hero__stats">
          <div className="pg-hero__stat"><strong>★ 1º</strong>Editora</div>
          <div className="pg-hero__stat"><strong>20+</strong>Anos de exp.</div>
        </div>
      </div>

      <div className="pg-hero__scroll-hint">
        <span>Rolar</span>
        <div className="pg-hero__scroll-line" />
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="pg-marquee-wrap" aria-hidden="true">
      <div className="pg-marquee-track">
        {doubled.map((item, i) => (
          <span key={i}>{item}<span className="pg-dot" /></span>
        ))}
      </div>
    </div>
  );
}

function BookSection() {
  return (
    <section className="pg-book" id="o-livro">
      <div className="pg-book__intro">
        <Reveal direction="left" className="pg-book__intro-left">
          <p className="pg-section-label" style={{ color: "var(--pg-orange)" }}>✦ A Obra</p>
          <h2 className="pg-book__title">
            Serviços<br /><em>Assistidos</em><br />por Animais
          </h2>
          <Reveal delay={100} direction="scale" className="pg-book__cover-wrapper pg-book__cover-wrapper--mobile">
            <img
              src="src/assets/imgs/livro.png"
              alt="Capa do Livro Serviços Assistidos por Animais"
              className="pg-book__cover-img"
            />
          </Reveal>
        </Reveal>

        <Reveal delay={100} direction="scale" className="pg-book__cover-wrapper pg-book__cover-wrapper--desktop">
          <img
            src="src/assets/imgs/FRONT1.png"
            alt="Capa do Livro Serviços Assistidos por Animais"
            className="pg-book__cover-img"
          />
        </Reveal>

        <Reveal delay={150} direction="right" className="pg-book__intro-right">
          <p className="pg-book__subtitle">A Terapia do Amor Interdisciplinar</p>
          <p className="pg-book__desc">
            Uma iniciativa estratégica voltada à consolidação, valorização e expansão
            das Terapias Assistidas por Animais como um campo interdisciplinar de
            excelência — fortalecendo sua legitimidade, padronização e reconhecimento
            institucional no Brasil e no mundo.
          </p>
          <p className="pg-book__desc">
            A obra reúne profissionais, pesquisadores e especialistas de diferentes
            áreas do conhecimento, promovendo a integração entre ciência, prática
            clínica, ética, responsabilidade jurídica e impacto social.
          </p>
          <div className="pg-book__badges">
            <span className="pg-badge"> ISBN Registrado</span>
            <span className="pg-badge"> Circulação Internacional</span>
            <span className="pg-badge"> Coordenação Premiada</span>
          </div>
        </Reveal>
      </div>

      <div className="pg-book__pillars">
        {BOOK_PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 70} direction="up" className="pg-pillar">
            <span className="pg-pillar__icon">{p.icon}</span>
            <h4 className="pg-pillar__title">{p.title}</h4>
            <p className="pg-pillar__desc">{p.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal direction="scale" className="pg-book__quote-wrap">
        <blockquote className="pg-book__quote">
          <span className="pg-book__quote-mark">"</span>
          Mais do que uma publicação, a obra se posiciona como um instrumento de
          formação, referência técnica e construção de legado acadêmico e profissional.
          <cite>— Natale Cotta, Coordenadora Editorial</cite>
        </blockquote>
      </Reveal>
    </section>
  );
}

function AudienceSection() {
  const groups = [
    { label: "Profissionais de saúde", icon: "" },
    { label: "Educadores & pedagogos", icon: "" },
    { label: "Pesquisadores & acadêmicos", icon: "" },
    { label: "Advogados & juristas", icon: "" },
    { label: "Gestores públicos & privados", icon: "" },
    { label: "Terapeutas integrativas", icon: "" },
    { label: "Estudantes de pós-grad.", icon: "" },
    { label: "Instituições & clínicas", icon: "" },
  ];
  return (
    <section className="pg-audience">
      <Reveal className="pg-audience__header">
        <p className="pg-section-label">✦ Para quem é</p>
        <h2 className="pg-section-title">Quem vai<br /><em>impactar</em></h2>
      </Reveal>
      <div className="pg-audience__grid">
        {groups.map((g, i) => (
          <Reveal key={g.label} delay={i * 55} direction="up" className="pg-audience-chip">
            <span className="pg-audience-chip__icon">{g.icon}</span>
            <span>{g.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceCardEl({ card, index }: { card: ServiceCard; index: number }) {
  return (
    <Reveal delay={index * 90} className={`pg-card pg-card--${card.variant}`}>
      <div className="pg-card__img">
        <img src={card.img} alt={card.alt} />
      </div>
      <p className="pg-card__num">{card.num}</p>
      <h3 className="pg-card__title">{card.title}</h3>
      <p className="pg-card__desc">{card.desc}</p>
      <p className="pg-card__price">{card.tag}</p>
    </Reveal>
  );
}

function ServicesSection() {
  return (
    <section className="pg-services" id="temas">
      <div className="pg-services__header">
        <Reveal>
          <p className="pg-section-label">✦ Temas do livro</p>
          <h2 className="pg-section-title">O que<br /><em>abordamos</em></h2>
        </Reveal>
        <Reveal delay={150} className="pg-services__sub">
          <p>Uma obra interdisciplinar que integra ciência, prática clínica, ética, direito e impacto social dos SAA.</p>
        </Reveal>
      </div>
      <div className="pg-cards-grid">
        {SERVICE_CARDS.map((card, i) => <ServiceCardEl key={card.title} card={card} index={i} />)}
      </div>
    </section>
  );
}

function CounterItem({ stat }: { stat: NumberStat }) {
  const { ref, count } = useCounter(stat.val, 2000);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="pg-number-item">
      <span className="pg-number-item__val">{stat.prefix ?? ""}{count}<em>{stat.suffix}</em></span>
      <p className="pg-number-item__label">{stat.label}</p>
    </div>
  );
}

function NumbersSection() {
  return (
    <div className="pg-numbers">
      {STATS.map((stat) => <CounterItem key={stat.label} stat={stat} />)}
    </div>
  );
}

function ProfileSection() {
  const { ref: photoRef, offset: photoOffset } = useParallax(0.12);
  const igSvg = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  return (
    <section className="pg-profile" id="coordenação">
      <Reveal direction="left" className="pg-profile__content">
        <p className="pg-section-label">✦ Coordenação</p>
        <h2 className="pg-profile__name">Natale<br /><em>Cotta</em></h2>
        <p className="pg-profile__bio">
          CEO da ReabiliTAA Ltda, advogada, pesquisadora e mestre em Terapias
          Assistidas por Animais na Espanha. Membro da PATAE Academy Internacional.
          Autora premiada com o título de melhor Apresentação Oral na Conferência
          Internacional sobre TAA em Amsterdã (2026). Responsável pelo Cão de Terapia
          Theo Goldinho e pelos Cães de Tribunal BEN e AURORA.
        </p>
        <div className="pg-profile__tags-row">
          {["Advogada", "Mestre em TAA", "Pesquisadora", "PATAE Academy"].map((t) => (
            <span key={t} className="pg-tag-chip">{t}</span>
          ))}
        </div>
        <div className="pg-profile__socials">
          <a href="https://www.instagram.com/natalecotta" target="_blank" rel="noopener noreferrer" className="pg-social-link">
            <span className="pg-social-link__icon">{igSvg}</span>@natalecotta
          </a>
          <a href="https://www.instagram.com/reabilit.a.a" target="_blank" rel="noopener noreferrer" className="pg-social-link">
            <span className="pg-social-link__icon">{igSvg}</span>@reabilit.a.a
          </a>
        </div>
        <div className="pg-profile__actions">
          <button className="pg-btn-primary">Quero ser Coautor(a) <span className="pg-arrow">↗</span></button>
          <button className="pg-btn-outline">Saiba mais</button>
        </div>
      </Reveal>

      <Reveal delay={200} direction="right" className="pg-profile__photo-wrap">
        <div ref={photoRef as React.RefObject<HTMLDivElement>} className="pg-profile__photo"
          style={{ transform: `translateY(${photoOffset * 0.3}px)` }}>
          <img src="src/assets/imgs/cota6.png" alt="Natale Cotta — Coordenadora" />
        </div>
        <span className="pg-profile__tag">✦ Mestre em TAA</span>
        <div className="pg-profile__years">
          <strong>Coordenadora</strong>
          <span>Editorial</span>
        </div>
      </Reveal>
    </section>
  );
}

function CtaBlock() {
  return (
    <Reveal direction="scale" className="pg-cta-block">
      <div className="pg-cta-block__content">
        <span className="pg-cta-block__tag">✦ Oportunidade única</span>
        <h2 className="pg-cta-block__title">Construa<br /><em>Legado</em><br />Conosco</h2>
        <p className="pg-cta-block__sub">
          Faça parte de uma obra que consolida os Serviços Assistidos por
          Animais como referência científica no Brasil e no mundo. Sua
          experiência merece ser publicada.
        </p>
        <button className="pg-btn-white">Quero participar →</button>
      </div>
      <div className="pg-cta-block__image">
        <img src="src/assets/imgs/doghero2.png" alt="Terapia assistida" />
      </div>
    </Reveal>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setOpenIndex((prev) => (prev === i ? null : i)), []);

  return (
    <section className="pg-faq" id="faq">
      <Reveal className="pg-faq__header">
        <p className="pg-section-label">✦ Dúvidas frequentes</p>
        <h2 className="pg-section-title">FAQ</h2>
      </Reveal>
      <ul className="pg-faq-list">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={i} as="li" delay={i * 55} className="pg-faq-item">
              <button className="pg-faq-item__trigger" aria-expanded={isOpen} onClick={() => toggle(i)}>
                <span className="pg-faq-item__question">{item.question}</span>
                <span className="pg-faq-item__icon" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              <div className="pg-faq-item__body" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="pg-faq-item__inner">
                  <p className="pg-faq-item__answer">{item.answer}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

function Footer() {
  const igSvg = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  return (
    <footer className="pg-footer" id="contato">
      <div className="pg-footer__top">
        <div className="pg-footer__brand">
          <p className="pg-footer__tagline">A Terapia do Amor Interdisciplinar.</p>
        </div>
        <div className="pg-footer__nav-col">
          <h4>O Livro</h4>
          <ul>
            {["Terapia Assistida", "Educação Assistida", "Ética & Direito", "Visão Interdisciplinar"].map(s => (
              <li key={s}><a href="#">{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="pg-footer__nav-col">
          <h4>Projeto</h4>
          <ul>
            {["Sobre o livro", "Coordenação", "FAQ", "Seja Coautor(a)"].map(s => (
              <li key={s}><a href="#">{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="pg-footer__nav-col">
          <h4>Contato & Redes</h4>
          <ul>
            <li><a href="https://www.instagram.com/natalecotta" target="_blank" rel="noopener noreferrer">📸 @natalecotta</a></li>
            <li><a href="https://www.instagram.com/reabilit.a.a" target="_blank" rel="noopener noreferrer">📸 @reabilit.a.a</a></li>
            <li><a href="#">✉️ contato@literarebooks.com.br</a></li>
          </ul>
        </div>
      </div>
      <div className="pg-footer__bottom">
        <span>© 2026 Literare Books. Todos os direitos reservados.</span>
        <div className="pg-footer__social">
          <a href="https://www.instagram.com/natalecotta" target="_blank" rel="noopener noreferrer" aria-label="Instagram Natale Cotta">{igSvg}</a>
          <a href="https://www.instagram.com/reabilit.a.a" target="_blank" rel="noopener noreferrer" aria-label="Instagram ReabiliTAA">{igSvg}</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --pg-orange:  #DE714B;
    --pg-orange2: #e8895f;
    --pg-dark:    #1A1A3B;
    --pg-bg:      #F4F3EF;
    --pg-white:   #FDFCF8;
    --pg-gray:    #8A8A82;
    --pg-shadow:  0 20px 50px rgba(26,26,59,.12);
    --pg-radius:  20px;
    --pg-display: 'Bebas Neue', sans-serif;
    --pg-serif:   'DM Serif Display', serif;
    --pg-body:    'Instrument Sans', sans-serif;
    --pg-nav-h:   72px;
  }

  html { scroll-behavior: smooth; }
  body {
    background-color: var(--pg-bg);
    color: var(--pg-dark);
    font-family: var(--pg-body);
    font-size: clamp(14px, 1.1vw, 17px);
    line-height: 1.6;
    overflow-x: hidden;
  }
  img { display: block; max-width: 100%; height: auto; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: inherit; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--pg-bg); }
  ::-webkit-scrollbar-thumb { background: var(--pg-orange); border-radius: 99px; }

  /* ─── NAV ─────────────────────────────────────────────────────────── */
  .pg-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5vw; height: var(--pg-nav-h);
    transition: background .35s, box-shadow .35s;
  }
  .pg-nav__logo { display: flex; align-items: center; flex-shrink: 0; }
  .pg-nav__logo img { height: 42px; width: auto; max-width: 160px; object-fit: contain; }
  .pg-nav__links { display: flex; gap: 2rem; list-style: none; }
  .pg-nav__links a {
    font-size: .75rem; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--pg-dark); transition: color .2s;
  }
  .pg-nav__links a:hover { color: var(--pg-orange); }
  .pg-nav__cta--desktop {
    background: var(--pg-dark); color: var(--pg-white);
    font-size: .75rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; border: none;
    padding: .65rem 1.4rem; border-radius: 99px;
    transition: background .25s, transform .2s;
    white-space: nowrap;
  }
  .pg-nav__cta--desktop:hover { background: var(--pg-orange); transform: scale(1.04); }

  /* Burger button */
  .pg-nav__burger {
    display: none; flex-direction: column; justify-content: center;
    align-items: center; gap: 5px;
    width: 40px; height: 40px; background: none; border: none;
    padding: 4px; cursor: pointer; z-index: 110;
  }
  .pg-nav__burger span {
    display: block; width: 22px; height: 2px;
    background: var(--pg-dark); border-radius: 2px;
    transition: transform .3s, opacity .3s, width .3s;
    transform-origin: center;
  }
  .pg-nav__burger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pg-nav__burger--open span:nth-child(2) { opacity: 0; width: 0; }
  .pg-nav__burger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile Drawer */
  .pg-mobile-drawer {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: var(--pg-white); z-index: 99;
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; gap: 2rem;
    opacity: 0; pointer-events: none;
    transform: translateY(-20px);
    transition: opacity .35s, transform .35s;
  }
  .pg-mobile-drawer--open { opacity: 1; pointer-events: all; transform: none; }
  .pg-mobile-drawer ul { list-style: none; text-align: center; display: flex; flex-direction: column; gap: .3rem; }
  .pg-mobile-drawer ul a {
    font-family: var(--pg-display); font-size: clamp(2rem, 8vw, 3.5rem);
    text-transform: uppercase; color: var(--pg-dark);
    display: block; padding: .3rem 1rem;
    transition: color .2s;
  }
  .pg-mobile-drawer ul a:hover { color: var(--pg-orange); }
  .pg-mobile-drawer__cta { font-size: .85rem !important; }
  .pg-drawer-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 98;
  }

  /* ─── HERO ────────────────────────────────────────────────────────── */
  .pg-hero {
    min-height: 100svh;
    padding: calc(var(--pg-nav-h) + clamp(2rem,4vh,4rem)) 5vw clamp(3rem,5vh,5rem);
    display: grid;
    grid-template-columns: 1fr 42%;
    grid-template-rows: auto 1fr auto;
    gap: 0 3vw;
    position: relative; overflow: hidden;
    align-items: start;
  }
  .pg-hero__orb {
    position: absolute; width: clamp(300px,50vw,600px); height: clamp(300px,50vw,600px);
    background: radial-gradient(circle, var(--pg-orange2) 0%, transparent 65%);
    opacity: .14; right: 20%; top: 5%; border-radius: 50%;
    filter: blur(70px); pointer-events: none; will-change: transform;
  }
  .pg-hero__label {
    grid-column: 1; align-self: end; margin-bottom: .8rem;
    display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;
  }
  .pg-hero__label-tag {
    background: var(--pg-orange); color: var(--pg-white);
    font-size: .68rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; padding: .3rem .85rem; border-radius: 99px;
  }
  .pg-hero__label-text { font-size: .78rem; color: var(--pg-gray); letter-spacing: .04em; }
  .pg-hero__title {
    grid-column: 1;
    font-family: var(--pg-display);
    font-size: clamp(5rem, 11vw, 13.5rem);
    line-height: .92; letter-spacing: -.01em;
    text-transform: uppercase; color: var(--pg-dark);
    position: relative; z-index: 2;
  }
  .pg-hero__title em {
    font-family: var(--pg-serif); font-style: italic;
    color: var(--pg-orange); font-size: .88em;
    text-transform: none; letter-spacing: -.02em;
  }
  .pg-hero__image-wrap {
    grid-column: 2; grid-row: 1 / 4;
    position: relative; z-index: 3;
    display: flex; align-items: flex-end;
  }
  .pg-hero__image-inner {
    width: 100%;
    height: clamp(420px, 65vh, 660px);
  }
  .pg-hero__image-inner img {
    width: 100%; height: 100%;
    object-fit: contain; object-position: bottom center;
    transition: transform .7s cubic-bezier(.25,.46,.45,.94);
  }
  .pg-hero__image-inner:hover img { transform: scale(1.03) translateY(-6px); }
  .pg-hero__bottom {
    grid-column: 1; display: flex; align-items: center;
    gap: 1.5rem; padding-top: 2rem;
    position: relative; z-index: 2; flex-wrap: wrap;
  }
  .pg-hero__stats { display: flex; gap: 1.4rem; }
  .pg-hero__stat { font-size: .75rem; color: var(--pg-gray); }
  .pg-hero__stat strong { display: block; font-size: 1.1rem; color: var(--pg-dark); font-weight: 700; }
  .pg-hero__scroll-hint {
    position: absolute; bottom: 2rem; left: 5vw;
    display: flex; flex-direction: column; align-items: center; gap: .4rem;
    font-size: .62rem; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: var(--pg-gray); opacity: .6;
    animation: pgScrollHint 2.5s ease-in-out infinite;
  }
  .pg-hero__scroll-line {
    width: 1px; height: 36px;
    background: linear-gradient(to bottom, var(--pg-orange), transparent);
  }
  @keyframes pgScrollHint {
    0%,100% { transform:translateY(0); opacity:.6; }
    50% { transform:translateY(6px); opacity:1; }
  }

  /* ─── BUTTONS ─────────────────────────────────────────────────────── */
  .pg-btn-primary {
    display: inline-flex; align-items: center; gap: .7rem;
    background: var(--pg-orange); color: var(--pg-white);
    font-size: .82rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; border: none;
    padding: .95rem 2rem; border-radius: 99px;
    transition: transform .25s, box-shadow .25s;
    box-shadow: 0 6px 24px rgba(222,113,75,.38);
    white-space: nowrap;
  }
  .pg-btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 38px rgba(222,113,75,.5); }
  .pg-arrow {
    width: 18px; height: 18px; background: rgba(255,255,255,.22);
    border-radius: 50%; display: inline-flex; align-items:center;
    justify-content:center; font-size: .72rem; transition: transform .25s;
    flex-shrink: 0;
  }
  .pg-btn-primary:hover .pg-arrow { transform: translate(3px,-3px); }
  .pg-btn-outline {
    display: inline-flex; align-items: center; gap: .5rem;
    border: 2px solid var(--pg-dark); background: transparent;
    color: var(--pg-dark); font-size: .78rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: .72rem 1.5rem; border-radius: 99px;
    transition: background .2s, color .2s, transform .2s;
    white-space: nowrap;
  }
  .pg-btn-outline:hover { background: var(--pg-dark); color: var(--pg-white); transform: scale(1.03); }
  .pg-btn-white {
    display: inline-flex; align-items: center; gap: .7rem;
    background: var(--pg-white); color: var(--pg-orange);
    font-size: .82rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; border: none;
    padding: .95rem 2rem; border-radius: 99px;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 6px 24px rgba(0,0,0,.16);
    white-space: nowrap;
  }
  .pg-btn-white:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 14px 38px rgba(0,0,0,.2); }

  /* ─── MARQUEE ─────────────────────────────────────────────────────── */
  .pg-marquee-wrap {
    overflow: hidden; background: var(--pg-dark); padding: .8rem 0; white-space: nowrap;
  }
  .pg-marquee-track { display: inline-flex; gap: 2rem; animation: pgMarquee 28s linear infinite; }
  .pg-marquee-wrap:hover .pg-marquee-track { animation-play-state: paused; }
  .pg-marquee-track span {
    font-size: .7rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--pg-white);
    display: inline-flex; align-items: center; gap: .5rem; transition: color .2s;
  }
  .pg-marquee-track span:hover { color: var(--pg-orange); }
  .pg-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--pg-orange); display: inline-block; flex-shrink: 0; }
  @keyframes pgMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ─── SECTION COMMONS ─────────────────────────────────────────────── */
  .pg-section-label {
    font-size: .7rem; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: var(--pg-orange); margin-bottom: .5rem;
  }
  .pg-section-title {
    font-family: var(--pg-display);
    font-size: clamp(2.6rem, 6vw, 6rem);
    line-height: .95; text-transform: uppercase;
  }
  .pg-section-title em {
    font-family: var(--pg-serif); font-style: italic;
    text-transform: none; font-size: .82em; letter-spacing: -.02em;
  }

  /* ─── BOOK SECTION ────────────────────────────────────────────────── */
  .pg-book {
    padding: clamp(4rem,8vh,9rem) 5vw;
    position: relative; overflow: hidden;
    background: var(--pg-dark); color: var(--pg-white);
  }
  .pg-book::before {
    content: ''; position: absolute;
    top: -40%; left: -20%; width: 70vw; height: 70vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(222,113,75,.09) 0%, transparent 65%);
    pointer-events: none;
  }
  .pg-book__intro {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 4vw;
    align-items: center;
    margin-bottom: clamp(3rem,6vh,6rem);
  }
  .pg-book__intro-left { display: flex; flex-direction: column; gap: 0; }
  .pg-book__title {
    font-family: var(--pg-display);
    font-size: clamp(3rem, 7vw, 8rem);
    text-transform: uppercase; line-height: .9;
    margin-top: .5rem;
  }
  .pg-book__title em {
    font-family: var(--pg-serif); font-style: italic;
    color: var(--pg-orange); font-size: .85em;
    text-transform: none; letter-spacing: -.02em;
  }
  /* Book cover */
  .pg-book__cover-wrapper {
    display: flex; justify-content: center; align-items: center;
    flex-shrink: 0;
  }
  .pg-book__cover-wrapper--mobile { display: none; }
  .pg-book__cover-wrapper--desktop { display: flex; }
  .pg-book__cover-img {
    width: clamp(140px, 16vw, 240px);
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08);
    transition: transform .4s, box-shadow .4s;
  }
  .pg-book__cover-img:hover {
    transform: scale(1.04) rotate(-1deg);
    box-shadow: 0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.12);
  }
  .pg-book__intro-right { display: flex; flex-direction: column; }
  .pg-book__subtitle {
    font-size: .75rem; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; color: var(--pg-orange); margin-bottom: 1.1rem;
  }
  .pg-book__desc {
    font-size: .9rem; line-height: 1.8;
    color: rgba(255,255,255,.62); margin-bottom: .9rem;
  }
  .pg-book__badges { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.5rem; }
  .pg-badge {
    display: inline-flex; align-items: center; gap: .35rem;
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.8);
    font-size: .7rem; font-weight: 600; letter-spacing: .07em;
    padding: .38rem .95rem; border-radius: 99px;
    transition: background .2s, border-color .2s;
  }
  .pg-badge:hover { background: rgba(222,113,75,.22); border-color: var(--pg-orange); color: var(--pg-white); }
  .pg-book__pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-bottom: clamp(3rem,6vh,5rem);
  }
  .pg-pillar {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 1.8rem 1.6rem;
    transition: background .3s, border-color .3s, transform .3s;
    position: relative; overflow: hidden;
  }
  .pg-pillar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--pg-orange), transparent);
    opacity: 0; transition: opacity .3s;
  }
  .pg-pillar:hover { background: rgba(255,255,255,.07); border-color: rgba(222,113,75,.28); transform: translateY(-5px); }
  .pg-pillar:hover::after { opacity: 1; }
  .pg-pillar__icon { font-size: 1.8rem; display: block; margin-bottom: .8rem; }
  .pg-pillar__title {
    font-family: var(--pg-display); font-size: 1.2rem;
    text-transform: uppercase; letter-spacing: .06em;
    color: var(--pg-white); margin-bottom: .45rem;
  }
  .pg-pillar__desc { font-size: .8rem; line-height: 1.65; color: rgba(255,255,255,.48); }
  .pg-book__quote-wrap { margin: 0 auto; max-width: 720px; }
  .pg-book__quote {
    font-family: var(--pg-serif); font-style: italic;
    font-size: clamp(1rem, 2vw, 1.5rem);
    line-height: 1.6; color: rgba(255,255,255,.82);
    text-align: center;
    padding: clamp(2rem,4vw,3rem) clamp(1.5rem,4vw,3.5rem);
    background: rgba(255,255,255,.04);
    border-radius: 22px; border: 1px solid rgba(255,255,255,.07);
    position: relative;
  }
  .pg-book__quote-mark {
    font-family: var(--pg-display); font-size: clamp(4rem,7vw,7rem);
    line-height: .6; color: var(--pg-orange); opacity: .28;
    position: absolute; top: 1rem; left: 1.5rem; font-style: normal;
  }
  .pg-book__quote cite {
    display: block; margin-top: 1.1rem;
    font-size: .72rem; font-style: normal; font-family: var(--pg-body);
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--pg-orange); font-weight: 700;
  }

  /* ─── AUDIENCE ────────────────────────────────────────────────────── */
  .pg-audience { padding: clamp(4rem,7vh,8rem) 5vw; background: var(--pg-white); }
  .pg-audience__header { margin-bottom: 3rem; }
  .pg-audience__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .9rem;
  }
  .pg-audience-chip {
    display: flex; align-items: center; gap: .75rem;
    background: var(--pg-bg);
    border: 1.5px solid rgba(0,0,0,.07);
    border-radius: 14px; padding: 1.1rem 1.2rem;
    font-size: .83rem; font-weight: 600; color: var(--pg-dark);
    transition: background .25s, border-color .25s, transform .25s, box-shadow .25s;
    cursor: default;
  }
  .pg-audience-chip:hover {
    background: var(--pg-white); border-color: var(--pg-orange);
    transform: translateY(-3px); box-shadow: 0 8px 24px rgba(222,113,75,.14);
  }
  .pg-audience-chip__icon { font-size: 1.4rem; flex-shrink: 0; }

  /* ─── SERVICES ────────────────────────────────────────────────────── */
  .pg-services { padding: clamp(4rem,7vh,9rem) 5vw; }
  .pg-services__header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: clamp(2.5rem,5vh,4rem); gap: 1.5rem;
  }
  .pg-services__sub { font-size: .88rem; color: var(--pg-gray); max-width: 280px; line-height: 1.65; }

  /* Cards Grid */
  .pg-cards-grid {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(16px, 2vw, 30px);
    justify-content: center;
    align-items: flex-start;
    padding: 1.5rem 0 3rem;
  }
  .pg-card {
    flex: 1 1 220px;
    min-width: 200px;
    max-width: 290px;
    border-radius: var(--pg-radius);
    padding: 1.8rem 1.6rem;
    position: relative;
    box-shadow: var(--pg-shadow);
    transition: transform .35s cubic-bezier(.25,.46,.45,.94), box-shadow .35s;
    cursor: pointer; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .pg-card--light { background: var(--pg-white); }
  .pg-card--orange { background: var(--pg-orange); z-index: 3; }
  .pg-card--dark { background: var(--pg-dark); }

  /* Card tilt — desktop only, controlled via media query */
  .pg-card:nth-child(1) { transform: rotate(-2deg) translateY(10px); }
  .pg-card:nth-child(1):hover { transform: rotate(0deg) translateY(0) scale(1.04); box-shadow: 0 28px 64px rgba(0,0,0,.18); z-index: 10; }
  .pg-card:nth-child(2) { transform: rotate(1.5deg); }
  .pg-card:nth-child(2):hover { transform: rotate(0deg) translateY(-10px) scale(1.05); box-shadow: 0 32px 72px rgba(222,113,75,.38); z-index: 10; }
  .pg-card:nth-child(3) { transform: rotate(2deg) translateY(10px); }
  .pg-card:nth-child(3):hover { transform: rotate(0deg) translateY(0) scale(1.04); box-shadow: 0 28px 64px rgba(0,0,0,.18); z-index: 10; }
  .pg-card:nth-child(4) { transform: rotate(-1.5deg) translateY(14px); }
  .pg-card:nth-child(4):hover { transform: rotate(0deg) translateY(0) scale(1.04); box-shadow: 0 28px 64px rgba(0,0,0,.28); z-index: 10; }

  .pg-card__img {
    width: 100%; height: clamp(140px, 18vw, 180px);
    border-radius: 12px; overflow: hidden; margin-bottom: 1.3rem; flex-shrink: 0;
  }
  .pg-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .pg-card:hover .pg-card__img img { transform: scale(1.07); }
  .pg-card__num {
    font-size: .65rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; margin-bottom: .6rem;
  }
  .pg-card--orange .pg-card__num, .pg-card--dark .pg-card__num { color: rgba(255,255,255,.5); }
  .pg-card__title {
    font-family: var(--pg-display); font-size: clamp(1.3rem, 2vw, 1.7rem);
    text-transform: uppercase; line-height: 1; margin-bottom: .7rem;
  }
  .pg-card--orange .pg-card__title, .pg-card--dark .pg-card__title { color: var(--pg-white); }
  .pg-card__desc { font-size: .78rem; line-height: 1.62; color: var(--pg-gray); flex-grow: 1; }
  .pg-card--orange .pg-card__desc { color: rgba(255,255,255,.75); }
  .pg-card--dark .pg-card__desc { color: rgba(255,255,255,.5); }
  .pg-card__price {
    margin-top: 1.3rem; font-weight: 700; font-size: .7rem;
    letter-spacing: .12em; text-transform: uppercase;
    display: inline-block; padding: .28rem .85rem;
    border-radius: 99px; background: rgba(0,0,0,.06); align-self: flex-start;
  }
  .pg-card--orange .pg-card__price { background: rgba(255,255,255,.2); color: var(--pg-white); }
  .pg-card--dark .pg-card__price { background: rgba(255,255,255,.1); color: rgba(255,255,255,.8); }

  /* ─── NUMBERS ─────────────────────────────────────────────────────── */
  .pg-numbers {
    padding: clamp(3rem,6vh,5rem) 5vw;
    border-top: 1px solid rgba(0,0,0,.08);
    border-bottom: 1px solid rgba(0,0,0,.08);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .pg-number-item { text-align: center; padding: 1.2rem 1rem; border-right: 1px solid rgba(0,0,0,.08); }
  .pg-number-item:last-child { border-right: none; }
  .pg-number-item__val {
    font-family: var(--pg-display);
    font-size: clamp(2.8rem, 5vw, 5.5rem);
    text-transform: uppercase; line-height: 1; color: var(--pg-dark); display: block;
  }
  .pg-number-item__val em { color: var(--pg-orange); font-style: normal; }
  .pg-number-item__label { font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; color: var(--pg-gray); margin-top: .4rem; }

  /* ─── PROFILE ─────────────────────────────────────────────────────── */
  .pg-profile {
    padding: clamp(4rem,7vh,9rem) 5vw;
    display: grid; grid-template-columns: 1fr 44%; gap: 4vw;
    align-items: center; position: relative;
  }
  .pg-profile::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 60% 50%, rgba(222,113,75,.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .pg-profile__content { position: relative; z-index: 1; }
  .pg-profile__name {
    font-family: var(--pg-display);
    font-size: clamp(3rem, 8vw, 8rem);
    text-transform: uppercase; line-height: .9; margin-bottom: 1.1rem;
  }
  .pg-profile__name em { font-family: var(--pg-serif); font-style: italic; color: var(--pg-orange); font-size: .82em; text-transform: none; letter-spacing: -.02em; }
  .pg-profile__bio { font-size: .95rem; line-height: 1.78; color: #555; max-width: 440px; margin-bottom: 1.1rem; }
  .pg-profile__tags-row { display: flex; flex-wrap: wrap; gap: .45rem; margin-bottom: 1.3rem; }
  .pg-tag-chip {
    font-size: .66rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; padding: .28rem .75rem; border-radius: 99px;
    background: rgba(222,113,75,.1); color: var(--pg-orange);
    border: 1px solid rgba(222,113,75,.18); transition: background .2s, color .2s;
  }
  .pg-tag-chip:hover { background: var(--pg-orange); color: var(--pg-white); }
  .pg-profile__socials { display: flex; gap: .75rem; flex-wrap: wrap; margin-bottom: 1.8rem; }
  .pg-social-link {
    display: inline-flex; align-items: center; gap: .5rem;
    border: 1.5px solid rgba(0,0,0,.14); background: var(--pg-white);
    color: var(--pg-dark); font-size: .75rem; font-weight: 600;
    letter-spacing: .04em; padding: .48rem 1rem; border-radius: 99px;
    transition: background .2s, color .2s, border-color .2s, transform .2s;
  }
  .pg-social-link:hover { background: var(--pg-orange); color: var(--pg-white); border-color: var(--pg-orange); transform: translateY(-2px); }
  .pg-social-link__icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pg-profile__actions { display: flex; gap: .9rem; flex-wrap: wrap; }
  .pg-profile__photo-wrap { position: relative; z-index: 1; }
  .pg-profile__photo { width: 100%; overflow: hidden; will-change: transform; }
  .pg-profile__photo img {
    width: 75%; height: auto;
    object-fit: cover; object-position: top center;
    transition: transform .6s;
  }
  .pg-profile__photo:hover img { transform: scale(1.03); }
  .pg-profile__tag {
    position: absolute; top: 2rem; right: -1rem;
    background: var(--pg-orange); color: var(--pg-white);
    font-size: .65rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; padding: .45rem 1rem; border-radius: 99px;
    box-shadow: 0 4px 18px rgba(222,113,75,.38);
  }
  .pg-profile__years {
    position: absolute; bottom: 2rem; left: -1.5rem;
    background: var(--pg-dark); color: var(--pg-white);
    border-radius: 14px; padding: .9rem 1.2rem;
    box-shadow: 0 8px 28px rgba(0,0,0,.2);
  }
  .pg-profile__years strong { display: block; font-family: var(--pg-display); font-size: 1.45rem; line-height: 1.1; color: var(--pg-orange); }
  .pg-profile__years span { font-size: .7rem; color: rgba(255,255,255,.55); }

  /* ─── CTA BLOCK ───────────────────────────────────────────────────── */
  .pg-cta-block {
    margin: clamp(3rem,6vh,5rem) 5vw;
    background: var(--pg-orange); border-radius: 26px;
    padding: clamp(3rem,6vw,6rem) clamp(2rem,6vw,6rem);
    display: grid; grid-template-columns: 1fr 36%; gap: 3vw;
    align-items: center; position: relative; overflow: hidden;
  }
  .pg-cta-block::before {
    content: ''; position: absolute; width: 460px; height: 460px;
    border-radius: 50%; background: rgba(255,255,255,.07);
    top: -160px; right: -90px; pointer-events: none;
  }
  .pg-cta-block::after {
    content: ''; position: absolute; width: 260px; height: 260px;
    border-radius: 50%; background: rgba(255,255,255,.06);
    bottom: -100px; left: 32%; pointer-events: none;
  }
  .pg-cta-block__content { position: relative; z-index: 2; }
  .pg-cta-block__tag {
    display: inline-block; background: rgba(255,255,255,.2); color: var(--pg-white);
    font-size: .68rem; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; padding: .32rem .85rem; border-radius: 99px; margin-bottom: 1.1rem;
  }
  .pg-cta-block__title {
    font-family: var(--pg-display);
    font-size: clamp(3rem, 7vw, 7.5rem);
    text-transform: uppercase; line-height: .9; color: var(--pg-white); margin-bottom: 1.3rem;
  }
  .pg-cta-block__title em { font-family: var(--pg-serif); font-style: italic; text-transform: none; font-size: .8em; letter-spacing: -.02em; }
  .pg-cta-block__sub { font-size: .95rem; color: rgba(255,255,255,.82); max-width: 340px; line-height: 1.72; margin-bottom: 2rem; }
  .pg-cta-block__image {
    position: relative; z-index: 2; overflow: hidden;
    transform: translateY(-1.5rem) rotate(2deg); transition: transform .5s;
  }
  .pg-cta-block__image:hover { transform: translateY(-2.5rem) rotate(0deg); }
  .pg-cta-block__image img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

  /* ─── FAQ ─────────────────────────────────────────────────────────── */
  .pg-faq { padding: clamp(4rem,7vh,9rem) 5vw; max-width: 860px; margin: 0 auto; }
  .pg-faq__header { text-align: center; margin-bottom: 3rem; }
  .pg-faq-list { list-style: none; }
  .pg-faq-item { border-top: 1px solid rgba(0,0,0,.09); }
  .pg-faq-item:last-child { border-bottom: 1px solid rgba(0,0,0,.09); }
  .pg-faq-item__trigger {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between; background: none; border: none;
    padding: 1.4rem 0; text-align: left; cursor: pointer; gap: 1rem;
  }
  .pg-faq-item__question { font-size: .95rem; font-weight: 600; color: var(--pg-dark); line-height: 1.4; transition: color .2s; }
  .pg-faq-item__trigger:hover .pg-faq-item__question { color: var(--pg-orange); }
  .pg-faq-item__icon {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid rgba(0,0,0,.14);
    display: flex; align-items:center; justify-content:center;
    font-size: 1.25rem; font-weight: 300; color: var(--pg-dark);
    transition: background .25s, border-color .25s, transform .3s;
    line-height: 1;
  }
  .pg-faq-item__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s cubic-bezier(.25,.46,.45,.94); }
  .pg-faq-item__inner { overflow: hidden; }
  .pg-faq-item__answer { padding-bottom: 1.4rem; font-size: .88rem; color: var(--pg-gray); line-height: 1.78; max-width: 640px; }

  /* ─── FOOTER ──────────────────────────────────────────────────────── */
  .pg-footer { background: var(--pg-dark); color: var(--pg-white); padding: clamp(3rem,6vh,4rem) 5vw 2rem; }
  .pg-footer__top {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 2.5rem;
    padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,.09);
  }
  .pg-footer__brand { flex: 0 0 auto; }
  .pg-footer__logo { font-family: var(--pg-display); font-size: 1.8rem; letter-spacing: .06em; }
  .pg-footer__logo span { color: var(--pg-orange); }
  .pg-footer__tagline { font-size: .78rem; color: rgba(255,255,255,.42); margin-top: .3rem; }
  .pg-footer__nav-col h4 { font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.38); margin-bottom: .9rem; }
  .pg-footer__nav-col ul { list-style:none; display:flex; flex-direction:column; gap:.55rem; }
  .pg-footer__nav-col a { font-size: .83rem; color: rgba(255,255,255,.68); transition: color .2s; }
  .pg-footer__nav-col a:hover { color: var(--pg-orange); }
  .pg-footer__bottom {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 1rem; padding-top: 2rem;
    font-size: .73rem; color: rgba(255,255,255,.28);
  }
  .pg-footer__social { display:flex; gap:.75rem; }
  .pg-footer__social a {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,.14);
    display:flex; align-items:center; justify-content:center;
    color: rgba(255,255,255,.55);
    transition: background .2s, border-color .2s, transform .2s;
  }
  .pg-footer__social a:hover { background: var(--pg-orange); border-color: var(--pg-orange); color: var(--pg-white); transform: scale(1.14); }

  /* ═══════════════════════════════════════════════════════════════════
     RESPONSIVE — from largest to smallest
  ═══════════════════════════════════════════════════════════════════ */

  /* ── 1280px: Large desktop tweaks ─────────────────────────────────── */
  @media (max-width: 1280px) {
    .pg-book__cover-img { width: clamp(130px, 14vw, 200px); }
  }

  /* ── 1100px: Medium desktop ───────────────────────────────────────── */
  @media (max-width: 1100px) {
    .pg-hero { grid-template-columns: 1fr 38%; }
    .pg-book__pillars { grid-template-columns: repeat(2, 1fr); }
    .pg-audience__grid { grid-template-columns: repeat(2, 1fr); }
    .pg-numbers { grid-template-columns: repeat(2, 1fr); }
    .pg-number-item:nth-child(2) { border-right: none; }
    .pg-number-item:nth-child(3) { border-top: 1px solid rgba(0,0,0,.08); }
  }

  /* ── 960px: Large tablet / small desktop ─────────────────────────── */
  @media (max-width: 960px) {
    :root { --pg-nav-h: 64px; }
    .pg-nav__links { display: none; }
    .pg-nav__cta--desktop { display: none; }
    .pg-nav__burger { display: flex; }
    .pg-nav__logo img { height: 36px; }

    .pg-hero { grid-template-columns: 1fr 40%; padding-top: calc(var(--pg-nav-h) + 2rem); }
    .pg-hero__title { font-size: clamp(4rem, 13vw, 8rem); }
    .pg-hero__image-inner { height: clamp(360px, 55vh, 520px); }

    .pg-book__intro { grid-template-columns: 1fr auto; gap: 3vw; }
    .pg-book__intro-right { grid-column: 1 / -1; }
    .pg-book__cover-wrapper--desktop { grid-column: 2; grid-row: 1; }

    .pg-profile { grid-template-columns: 1fr 42%; gap: 3vw; }

    .pg-cta-block { grid-template-columns: 1fr 40%; }
  }

  /* ── 768px: Tablet portrait ───────────────────────────────────────── */
  @media (max-width: 768px) {
    /* Hero: single column */
    .pg-hero {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto;
      padding-top: calc(var(--pg-nav-h) + 1.5rem);
      min-height: auto;
      padding-bottom: 3rem;
    }
    .pg-hero__label { grid-column: 1; }
    .pg-hero__title { grid-column: 1; font-size: clamp(4rem, 18vw, 8rem); }
    .pg-hero__image-wrap {
      grid-column: 1; grid-row: 3;
      justify-content: center;
      max-width: 380px; margin: 1.5rem auto 0; width: 100%;
    }
    .pg-hero__image-inner { height: clamp(280px, 55vw, 400px); width: 100%; }
    .pg-hero__bottom { grid-column: 1; flex-wrap: wrap; gap: 1rem; }
    .pg-hero__scroll-hint { display: none; }
    .pg-hero__orb { width: 300px; height: 300px; right: 0; opacity: .1; }

    /* Book: single column */
    .pg-book__intro {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .pg-book__cover-wrapper--desktop { display: none; }
    .pg-book__cover-wrapper--mobile { display: flex; margin-top: 1.5rem; }
    .pg-book__cover-img { width: clamp(120px, 35vw, 200px); }
    .pg-book__intro-left { }
    .pg-book__intro-right { grid-column: 1; }

    /* Pillars */
    .pg-book__pillars { grid-template-columns: repeat(2, 1fr); gap: 1rem; }

    /* Audience */
    .pg-audience__grid { grid-template-columns: repeat(2, 1fr); gap: .75rem; }
    .pg-audience-chip { font-size: .8rem; padding: 1rem; }

    /* Services */
    .pg-services__header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .pg-services__sub { max-width: 100%; }
    .pg-cards-grid {
      gap: 1.2rem;
      padding-bottom: 2rem;
    }
    .pg-card {
      flex: 1 1 calc(50% - 1.2rem);
      min-width: 160px;
      max-width: calc(50% - 0.6rem);
      transform: none !important;
    }
    .pg-card:hover { transform: translateY(-6px) scale(1.02) !important; }
    .pg-card__img { height: clamp(120px, 20vw, 160px); }

    /* Numbers */
    .pg-numbers { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 2.5rem 5vw; }
    .pg-number-item { border-right: none; border-bottom: 1px solid rgba(0,0,0,.08); padding: 1rem; }
    .pg-number-item:last-child { border-bottom: none; }

    /* Profile: single column */
    .pg-profile {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .pg-profile__content { order: 2; }
    .pg-profile__photo-wrap { order: 1; max-width: 380px; margin: 0 auto; width: 100%; }
    .pg-profile__photo img { width: 80%; margin: 0 auto; }
    .pg-profile__years { left: 0; bottom: 1.5rem; }
    .pg-profile__tag { right: 0; top: 1.5rem; }
    .pg-profile__bio { max-width: 100%; }
    .pg-profile__actions { justify-content: flex-start; }

    /* CTA */
    .pg-cta-block {
      grid-template-columns: 1fr;
      margin: 3rem 4vw;
      padding: clamp(2.5rem,6vw,4rem);
    }
    .pg-cta-block__image {
      max-width: clamp(200px, 55vw, 300px);
      margin: 0 auto;
      transform: none;
      order: -1;
    }
    .pg-cta-block__image:hover { transform: translateY(-8px); }
    .pg-cta-block__sub { max-width: 100%; }

    /* FAQ */
    .pg-faq { padding: 3rem 5vw; }
    .pg-faq-item__question { font-size: .9rem; }

    /* Footer */
    .pg-footer__top { flex-direction: column; gap: 2rem; }
    .pg-footer__nav-col { min-width: calc(50% - 1.25rem); }
    .pg-footer__bottom { flex-direction: column; text-align: center; }
  }

  /* ── 540px: Large phone ───────────────────────────────────────────── */
  @media (max-width: 540px) {
    :root { --pg-nav-h: 60px; }

    /* Hero */
    .pg-hero { padding: calc(var(--pg-nav-h) + 1rem) 5vw 2.5rem; }
    .pg-hero__title { font-size: clamp(3.5rem, 20vw, 6rem); }
    .pg-hero__image-wrap { max-width: 300px; }
    .pg-hero__image-inner { height: clamp(240px, 60vw, 340px); }
    .pg-hero__bottom { gap: .75rem; }
    .pg-hero__stats { gap: 1rem; }
    .pg-hero__stat strong { font-size: 1rem; }

    /* Book */
    .pg-book__pillars { grid-template-columns: 1fr; }
    .pg-book__quote { padding: 2rem 1.5rem; }
    .pg-book__quote-mark { font-size: 4rem; }
    .pg-book__badges { gap: .45rem; }
    .pg-badge { font-size: .65rem; padding: .32rem .8rem; }

    /* Cards: single column */
    .pg-cards-grid { gap: 1rem; }
    .pg-card {
      flex: 1 1 100%;
      min-width: unset;
      max-width: 100%;
    }
    .pg-card__img { height: clamp(160px, 45vw, 220px); }
    .pg-card__title { font-size: clamp(1.5rem, 5vw, 2rem); }

    /* Audience */
    .pg-audience__grid { grid-template-columns: 1fr; gap: .6rem; }
    .pg-audience-chip { padding: .9rem 1rem; }

    /* Numbers */
    .pg-numbers { grid-template-columns: 1fr 1fr; }

    /* Profile */
    .pg-profile__name { font-size: clamp(2.8rem, 16vw, 5rem); }
    .pg-profile__photo img { width: 90%; }
    .pg-profile__years { left: 0; font-size: .9rem; }
    .pg-profile__tag { font-size: .6rem; right: 0; }
    .pg-profile__actions { flex-direction: column; align-items: flex-start; }
    .pg-btn-primary, .pg-btn-outline { width: 100%; justify-content: center; }

    /* CTA */
    .pg-cta-block { padding: 2.5rem 1.5rem; margin: 2rem 3vw; border-radius: 20px; }
    .pg-cta-block__title { font-size: clamp(2.5rem, 14vw, 4rem); }
    .pg-cta-block__sub { font-size: .88rem; }
    .pg-cta-block__image { max-width: clamp(160px, 50vw, 240px); }
    .pg-btn-white { width: 100%; justify-content: center; }

    /* FAQ */
    .pg-faq { padding: 2.5rem 5vw; }
    .pg-faq-item__icon { width: 30px; height: 30px; font-size: 1.1rem; }

    /* Footer */
    .pg-footer__nav-col { min-width: 100%; }
    .pg-footer__top { gap: 1.5rem; }
  }

  /* ── 380px: Small phone ───────────────────────────────────────────── */
  @media (max-width: 380px) {
    .pg-hero__title { font-size: clamp(3rem, 20vw, 5rem); }
    .pg-hero__image-inner { height: 220px; }
    .pg-hero__label { flex-direction: column; align-items: flex-start; gap: .3rem; }
    .pg-hero__label-text { display: none; }

    .pg-book__cover-img { width: clamp(100px, 30vw, 150px); }

    .pg-numbers { grid-template-columns: 1fr; }
    .pg-number-item { border-right: none; border-bottom: 1px solid rgba(0,0,0,.08); }
    .pg-number-item:last-child { border-bottom: none; }

    .pg-profile__name { font-size: clamp(2.4rem, 15vw, 4rem); }

    .pg-cta-block { margin: 1.5rem 3vw; padding: 2rem 1.2rem; }

    .pg-card__img { height: clamp(140px, 42vw, 200px); }

    .pg-mobile-drawer ul a { font-size: clamp(1.8rem, 9vw, 2.5rem); }
  }
`;

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <ProgressBar progress={progress} />
      <Nav scrolled={scrolled} />
      <HeroSection />
      <MarqueeStrip />
      <BookSection />
      <AudienceSection />
      <ServicesSection />
      <NumbersSection />
      <ProfileSection />
      <CtaBlock />
      <FaqSection />
      <Footer />
    </>
  );
}
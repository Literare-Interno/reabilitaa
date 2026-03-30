import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceCard {
  num: string;
  title: string;
  desc: string;
  tag: string;
  img: string;
  alt: string;
  variant: "light" | "accent" | "dark";
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
    num: "01",
    title: "Terapia Assistida",
    desc: "Intervenções terapêuticas estruturadas com animais para saúde, reabilitação e bem-estar humano.",
    tag: "Saúde & Clínica",
    img: "imgs/at2.png",
    alt: "Terapia Assistida por Animais",
    variant: "light",
  },
  {
    num: "02",
    title: "Educação Assistida",
    desc: "Uso educacional e pedagógico dos animais como facilitadores do aprendizado e inclusão social.",
    tag: "Educação",
    img: "imgs/at3.png",
    alt: "Educação Assistida por Animais",
    variant: "accent",
  },
  {
    num: "03",
    title: "Ética & Direito",
    desc: "Fundamentos jurídicos, legislação vigente, responsabilidade profissional e bem-estar animal.",
    tag: "Jurídico & Ética",
    img: "imgs/at4.png",
    alt: "Aspectos Jurídicos e Éticos",
    variant: "light",
  },
  {
    num: "04",
    title: "Visão Interdisciplinar",
    desc: "Integração entre ciência, prática clínica, políticas públicas e impacto social dos SAA.",
    tag: "Pesquisa & Ciência",
    img: "imgs/at6.png",
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
  { icon: "◈", title: "Múltiplas Espécies", desc: "Cães, felinos, equinos, aves e animais silvestres — cada espécie com protocolos próprios de bem-estar." },
  { icon: "◈", title: "Evidência Científica", desc: "Estudos de caso, pesquisas e referências internacionais que validam as práticas dos SAA." },
  { icon: "◈", title: "Responsabilidade Jurídica", desc: "Legislação vigente, aspectos éticos e responsabilidade profissional no contexto brasileiro." },
  { icon: "◈", title: "Multiprofissional", desc: "Saúde, educação, direito e ciência unidas em prol de uma prática séria e fundamentada." },
  { icon: "◈", title: "Impacto Social", desc: "Aplicações em contextos clínicos, hospitalares, educacionais e comunitários de todo o país." },
  { icon: "◈", title: "Legado Acadêmico", desc: "Uma referência editorial que consolida o campo e abre caminhos para futuras pesquisas." },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useRevealObserver(threshold = 0.12) {
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
  className?: string; direction?: "up" | "left" | "right" | "scale" | "fade";
}) {
  const { ref, visible } = useRevealObserver();
  const getT = () => {
    if (visible) return "none";
    if (direction === "left") return "translateX(-24px)";
    if (direction === "right") return "translateX(24px)";
    if (direction === "scale") return "scale(0.97)";
    if (direction === "fade") return "none";
    return "translateY(20px)";
  };
  return (
    <Tag ref={ref} className={className} style={{
      opacity: visible ? 1 : 0, transform: getT(),
      transition: `opacity 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </Tag>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: "2px",
      width: `${progress * 100}%`,
      background: "var(--pg-orange)",
      zIndex: 200, transition: "width .06s linear",
    }} />
  );
}

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile(960);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = ["O Livro", "Temas", "Coordenação", "FAQ", "Contato"];

  return (
    <>
      <nav className="pg-nav" style={scrolled ? {
        background: "rgba(245,247,252,.97)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 1px 0 rgba(26,26,59,.1)",
      } : undefined}>
        <div className="pg-nav__logo">
          <img src="imgs/logo.png" alt="Logo Reab Natale" />
        </div>
        <ul className="pg-nav__links">
          {links.map((item) => (
            <li key={item}><a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>{item}</a></li>
          ))}
        </ul>
        <a href="https://wa.me/5511978353802?text=Olá,%20quero%20ser%20coautor(a)" target="_blank" rel="noopener noreferrer">
          <button className="pg-nav__cta pg-nav__cta--desktop">Quero ser Coautor(a)</button>
        </a>
        <button
          className={`pg-nav__burger ${menuOpen ? "pg-nav__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`pg-mobile-drawer ${menuOpen ? "pg-mobile-drawer--open" : ""}`}>
        <ul>
          {links.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)}>{item}</a>
            </li>
          ))}
        </ul>
        <button className="pg-btn-primary pg-mobile-drawer__cta" onClick={() => setMenuOpen(false)}>
          Quero ser Coautor(a)
        </button>
      </div>
      {menuOpen && <div className="pg-drawer-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);

  const fade = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(18px)",
    transition: `opacity .95s ${delay}ms cubic-bezier(.22,1,.36,1), transform .95s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  return (
    <section className="pg-hero" id="inicio">
      <div className="pg-hero__bg-rule" />

      <div className="pg-hero__inner">
        <div className="pg-hero__content">
          <div className="pg-hero__eyebrow" style={fade(80)}>
            <span className="pg-hero__eyebrow-line" />
            <span>Literare Books — Editora nº 1 do Brasil</span>
          </div>

          <h1 className="pg-hero__title" style={fade(180)}>
            Seja um<br /><em>Coautor(a)</em>
          </h1>

          <p className="pg-hero__sub" style={fade(300)}>
            Contribua para a obra científica de referência sobre<br />
            Serviços Assistidos por Animais no Brasil e no mundo.
          </p>

          <div className="pg-hero__actions" style={fade(420)}>
            <a href="https://wa.me/5511978353802?text=Olá,%20quero%20ser%20coautor(a)" target="_blank" rel="noopener noreferrer">
              <button className="pg-btn-primary">Saiba mais →</button>
            </a>
            <button className="pg-btn-ghost">Ver a obra</button>
          </div>

          <div className="pg-hero__meta" style={fade(540)}>
            <div className="pg-hero__meta-item">
              <strong>ISBN</strong>
              <span>Registrado</span>
            </div>
            <div className="pg-hero__meta-sep" />
            <div className="pg-hero__meta-item">
              <strong>Circulação</strong>
              <span>Internacional</span>
            </div>
            <div className="pg-hero__meta-sep" />
            <div className="pg-hero__meta-item">
              <strong>20+</strong>
              <span>Anos de exp.</span>
            </div>
          </div>
        </div>

        <div className="pg-hero__visual" style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateX(16px)",
          transition: "opacity 1.1s 300ms cubic-bezier(.22,1,.36,1), transform 1.1s 300ms cubic-bezier(.22,1,.36,1)",
        }}>
          <div className="pg-hero__image-frame">
            <img src="imgs/livro4.png" alt="Mascote do projeto" />
          </div>
          <div className="pg-hero__image-badge">
            <span>A Terapia do Amor Interdisciplinar</span>
          </div>
        </div>
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
          <p className="pg-section-label">A Obra</p>
          <h2 className="pg-book__title">
            Serviços<br /><em>Assistidos</em><br />por Animais
          </h2>
          <Reveal delay={100} direction="scale" className="pg-book__cover-wrapper pg-book__cover-wrapper--mobile">
            <img src="imgs/livro.png" alt="Capa do Livro Serviços Assistidos por Animais" className="pg-book__cover-img" />
          </Reveal>
        </Reveal>

        <Reveal delay={160} direction="right" className="pg-book__intro-right">
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
            <span className="pg-badge">ISBN Registrado</span>
            <span className="pg-badge">Circulação Internacional</span>
            <span className="pg-badge">Coordenação Premiada</span>
          </div>
        </Reveal>
      </div>

      <div className="pg-book__pillars">
        {BOOK_PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 60} direction="up" className="pg-pillar">
            <span className="pg-pillar__icon">{p.icon}</span>
            <h4 className="pg-pillar__title">{p.title}</h4>
            <p className="pg-pillar__desc">{p.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal direction="fade" className="pg-book__quote-wrap">
        <blockquote className="pg-book__quote">
          <p>
            Mais do que uma publicação, a obra se posiciona como um instrumento de
            formação, referência técnica e construção de legado acadêmico e profissional.
          </p>
          <cite>Natale Cotta — Coordenadora Editorial</cite>
        </blockquote>
      </Reveal>
    </section>
  );
}

function AudienceSection() {
  const groups = [
    { label: "Profissionais de saúde" },
    { label: "Educadores & pedagogos" },
    { label: "Pesquisadores & acadêmicos" },
    { label: "Advogados & juristas" },
    { label: "Gestores públicos & privados" },
    { label: "Terapeutas integrativas" },
    { label: "Estudantes de pós-graduação" },
    { label: "Instituições & clínicas" },
  ];
  return (
    <section className="pg-audience">
      <Reveal className="pg-audience__header">
        <p className="pg-section-label">Para quem é</p>
        <h2 className="pg-section-title">Quem vai<br /><em>impactar</em></h2>
      </Reveal>
      <div className="pg-audience__grid">
        {groups.map((g, i) => (
          <Reveal key={g.label} delay={i * 50} direction="up" className="pg-audience-chip">
            <span className="pg-chip-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{g.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceCardEl({ card, index }: { card: ServiceCard; index: number }) {
  return (
    <Reveal delay={index * 80} className={`pg-card pg-card--${card.variant}`}>
      <div className="pg-card__header">
        <span className="pg-card__num">{card.num}</span>
        <span className="pg-card__tag">{card.tag}</span>
      </div>
      <div className="pg-card__img">
        <img src={card.img} alt={card.alt} />
      </div>
      <h3 className="pg-card__title">{card.title}</h3>
      <p className="pg-card__desc">{card.desc}</p>
    </Reveal>
  );
}

function ServicesSection() {
  return (
    <section className="pg-services" id="temas">
      <div className="pg-services__header">
        <Reveal>
          <p className="pg-section-label">Temas do livro</p>
          <h2 className="pg-section-title">O que<br /><em>abordamos</em></h2>
        </Reveal>
        <Reveal delay={140} className="pg-services__sub">
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
  const igSvg = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  return (
    <section className="pg-profile" id="coordenação">
      <Reveal direction="right" className="pg-profile__photo-wrap">
        <div className="pg-profile__photo">
          <img src="imgs/cota6.png" alt="Natale Cotta — Coordenadora" />
        </div>
        <div className="pg-profile__photo-badge">
          <strong>Mestre em TAA</strong>
          <span>Coordenadora Editorial</span>
        </div>
      </Reveal>

      <Reveal delay={160} direction="left" className="pg-profile__content">
        <p className="pg-section-label">Coordenação</p>
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
          <button className="pg-btn-primary">Quero ser Coautor(a) →</button>
          <button className="pg-btn-ghost">Saiba mais</button>
        </div>
      </Reveal>
    </section>
  );
}

function CtaBlock() {
  return (
    <Reveal direction="up" className="pg-cta-block">
      <div className="pg-cta-block__rule" />
      <div className="pg-cta-block__inner">
        <div className="pg-cta-block__content">
          <p className="pg-section-label" style={{ color: "rgba(255,255,255,.5)" }}>Oportunidade única</p>
          <h2 className="pg-cta-block__title">Construa<br /><em>Legado</em><br />Conosco</h2>
          <p className="pg-cta-block__sub">
            Faça parte de uma obra que consolida os Serviços Assistidos por
            Animais como referência científica no Brasil e no mundo. Sua
            experiência merece ser publicada.
          </p>
          <button className="pg-btn-light">Quero participar →</button>
        </div>
        <div className="pg-cta-block__image">
          <img src="imgs/at10.png" alt="Terapia assistida" />
        </div>
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
        <p className="pg-section-label">Dúvidas frequentes</p>
        <h2 className="pg-section-title">FAQ</h2>
      </Reveal>
      <ul className="pg-faq-list">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={i} as="li" delay={i * 50} className="pg-faq-item">
              <button className="pg-faq-item__trigger" aria-expanded={isOpen} onClick={() => toggle(i)}>
                <span className="pg-faq-item__num">{String(i + 1).padStart(2, "0")}</span>
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
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
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
            <li><a href="https://www.instagram.com/natalecotta" target="_blank" rel="noopener noreferrer">@natalecotta</a></li>
            <li><a href="https://www.instagram.com/reabilit.a.a" target="_blank" rel="noopener noreferrer">@reabilit.a.a</a></li>
            <li><a href="#">contato@literarebooks.com.br</a></li>
          </ul>
        </div>
      </div>
      <div className="pg-footer__bottom">
        <span>© 2026 Literare Books. Todos os direitos reservados.</span>
        <div className="pg-footer__social">
          <a href="https://www.instagram.com/natalecotta" target="_blank" rel="noopener noreferrer" aria-label="Instagram">{igSvg}</a>
          <a href="https://www.instagram.com/reabilit.a.a" target="_blank" rel="noopener noreferrer" aria-label="Instagram">{igSvg}</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── ReabiliTAA Institutional Palette ── */
    --pg-navy:    #1A1A3B;   /* Azul Marinho — segurança, confiança, profissionalismo */
    --pg-blue:    #4CAFDF;   /* Azul Claro   — tranquilidade, frescor, clareza       */
    --pg-lilac:   #C2B5D0;   /* Lilás        — criatividade, equilíbrio, espiritualidade */
    --pg-orange:  #DE714B;   /* Laranja      — energia, entusiasmo, acolhimento      */

    /* ── Semantic aliases (mapped to new palette) ── */
    --pg-gold:    var(--pg-orange);   /* primary accent  → laranja   */
    --pg-gold2:   var(--pg-blue);     /* secondary accent → azul claro */
    --pg-dark:    var(--pg-navy);     /* dark bg          → azul marinho */
    --pg-mid:     #2E2E5A;            /* mid tone         → dark navy variant */
    --pg-bg:      #F5F7FC;            /* page background  → very light blue tint */
    --pg-cream:   #EAE7F3;            /* cream sections   → light lilac tint */
    --pg-white:   #FAFBFF;            /* off-white        → cooler white */
    --pg-muted:   #7A7A9D;            /* muted text       → muted navy */
    --pg-rule:    rgba(26,26,59,.1);  /* borders          → navy-tinted */
    --pg-shadow:  0 2px 24px rgba(26,26,59,.1);
    --pg-radius:  4px;
    --pg-serif:   'Cormorant Garant', serif;
    --pg-body:    'Jost', sans-serif;
    --pg-nav-h:   72px;
  }

  html { scroll-behavior: smooth; }
  body {
    background-color: var(--pg-bg);
    color: var(--pg-dark);
    font-family: var(--pg-body);
    font-size: clamp(14px, 1vw, 16px);
    font-weight: 400;
    line-height: 1.7;
    overflow-x: hidden;
  }
  img { display: block; max-width: 100%; height: auto; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--pg-bg); }
  ::-webkit-scrollbar-thumb { background: var(--pg-orange); border-radius: 99px; }

  /* ─── NAV ─────────────────────────────────────────────────────────── */
  .pg-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5vw; height: var(--pg-nav-h);
    transition: background .4s, box-shadow .4s;
  }
  .pg-nav__logo { display: flex; align-items: center; flex-shrink: 0; }
  .pg-nav__logo img { height: 38px; width: auto; max-width: 150px; object-fit: contain; }
  .pg-nav__links { display: flex; gap: 2.5rem; list-style: none; }
  .pg-nav__links a {
    font-size: .72rem; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; color: var(--pg-mid); transition: color .2s;
  }
  .pg-nav__links a:hover { color: var(--pg-orange); }
  .pg-nav__cta--desktop {
    background: var(--pg-navy); color: var(--pg-white);
    font-family: var(--pg-body);
    font-size: .72rem; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; border: none;
    padding: .6rem 1.5rem; border-radius: 2px;
    transition: background .25s;
    white-space: nowrap;
  }
  .pg-nav__cta--desktop:hover { background: var(--pg-orange); }

  .pg-nav__burger {
    display: none; flex-direction: column; justify-content: center;
    align-items: center; gap: 5px;
    width: 40px; height: 40px; background: none; border: none; cursor: pointer;
  }
  .pg-nav__burger span {
    display: block; width: 22px; height: 1.5px;
    background: var(--pg-navy); border-radius: 0;
    transition: transform .3s, opacity .3s, width .3s;
    transform-origin: center;
  }
  .pg-nav__burger--open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .pg-nav__burger--open span:nth-child(2) { opacity: 0; width: 0; }
  .pg-nav__burger--open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .pg-mobile-drawer {
    position: fixed; inset: 0; background: var(--pg-white); z-index: 99;
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; gap: 1.5rem;
    opacity: 0; pointer-events: none;
    transition: opacity .3s;
  }
  .pg-mobile-drawer--open { opacity: 1; pointer-events: all; }
  .pg-mobile-drawer ul { list-style: none; text-align: center; display: flex; flex-direction: column; gap: .1rem; }
  .pg-mobile-drawer ul a {
    font-family: var(--pg-serif); font-size: clamp(2rem, 8vw, 3.5rem);
    font-weight: 600; color: var(--pg-navy);
    display: block; padding: .25rem 1rem; transition: color .2s;
  }
  .pg-mobile-drawer ul a:hover { color: var(--pg-orange); }
  .pg-mobile-drawer__cta { font-size: .8rem !important; }
  .pg-drawer-overlay { position: fixed; inset: 0; background: rgba(26,26,59,.2); z-index: 98; }

  /* ─── HERO ────────────────────────────────────────────────────────── */
  .pg-hero {
    min-height: 100svh;
    padding-top: var(--pg-nav-h);
    position: relative;
    border-bottom: 1px solid var(--pg-rule);
  }
  .pg-hero__bg-rule {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(160deg, var(--pg-cream) 0%, var(--pg-bg) 55%);
    pointer-events: none; z-index: 0;
  }
  .pg-hero__inner {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 44%;
    gap: 0; align-items: center;
    min-height: calc(100svh - var(--pg-nav-h));
    padding: clamp(3rem,6vh,5rem) 5vw clamp(3rem,5vh,4rem);
  }
  .pg-hero__content { display: flex; flex-direction: column; gap: 0; padding-right: 4vw; }
  .pg-hero__eyebrow {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.8rem;
    font-size: .7rem; font-weight: 500; letter-spacing: .18em;
    text-transform: uppercase; color: var(--pg-muted);
  }
  .pg-hero__eyebrow-line {
    display: block; width: 32px; height: 1px;
    background: var(--pg-orange); flex-shrink: 0;
  }
  .pg-hero__title {
    font-family: var(--pg-serif);
    font-size: clamp(4rem, 8vw, 9rem);
    font-weight: 600;
    line-height: .95; letter-spacing: -.01em;
    color: var(--pg-navy); margin-bottom: 1.8rem;
  }
  .pg-hero__title em {
    font-style: italic; color: var(--pg-orange);
    font-weight: 400;
  }
  .pg-hero__sub {
    font-size: clamp(.88rem, 1.1vw, 1.05rem);
    font-weight: 300; color: var(--pg-muted);
    line-height: 1.75; margin-bottom: 2.5rem;
    max-width: 420px;
  }
  .pg-hero__actions { display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
  .pg-hero__meta {
    display: flex; align-items: center; gap: 1.5rem;
    padding-top: 2rem;
    border-top: 1px solid var(--pg-rule);
  }
  .pg-hero__meta-item { display: flex; flex-direction: column; gap: .1rem; }
  .pg-hero__meta-item strong { font-size: .82rem; font-weight: 600; color: var(--pg-navy); }
  .pg-hero__meta-item span { font-size: .7rem; font-weight: 400; color: var(--pg-muted); }
  .pg-hero__meta-sep { width: 1px; height: 28px; background: var(--pg-rule); flex-shrink: 0; }

  .pg-hero__visual { position: relative; display: flex; align-items: flex-end; justify-content: center; }
  .pg-hero__image-frame {
    width: 100%;
    height: clamp(400px, 62vh, 640px);
    position: relative;
  }
  .pg-hero__image-frame img {
    width: 100%; height: 100%;
    object-fit: contain; object-position: bottom center;
    transition: transform .8s cubic-bezier(.25,.46,.45,.94);
  }
  .pg-hero__image-frame:hover img { transform: scale(1.02) translateY(-4px); }
  .pg-hero__image-badge {
    position: absolute; bottom: 2.5rem; left: -1rem;
    background: var(--pg-navy); color: rgba(255,255,255,.7);
    font-size: .65rem; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; padding: .6rem 1.1rem;
    border-left: 2px solid var(--pg-orange);
    max-width: 200px; line-height: 1.5;
  }

  /* ─── BUTTONS ─────────────────────────────────────────────────────── */
  .pg-btn-primary {
    display: inline-flex; align-items: center; gap: .5rem;
    background: var(--pg-navy); color: var(--pg-white);
    font-family: var(--pg-body);
    font-size: .75rem; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; border: none;
    padding: .85rem 1.8rem; border-radius: 2px;
    transition: background .25s, transform .2s;
    white-space: nowrap;
  }
  .pg-btn-primary:hover { background: var(--pg-orange); transform: translateY(-1px); }
  .pg-btn-ghost {
    display: inline-flex; align-items: center; gap: .5rem;
    border: 1px solid rgba(26,26,59,.18); background: transparent;
    color: var(--pg-mid); font-family: var(--pg-body);
    font-size: .75rem; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase;
    padding: .85rem 1.6rem; border-radius: 2px;
    transition: border-color .2s, color .2s;
    white-space: nowrap;
  }
  .pg-btn-ghost:hover { border-color: var(--pg-orange); color: var(--pg-orange); }
  .pg-btn-light {
    display: inline-flex; align-items: center; gap: .5rem;
    background: var(--pg-white); color: var(--pg-navy);
    font-family: var(--pg-body);
    font-size: .75rem; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; border: none;
    padding: .85rem 1.8rem; border-radius: 2px;
    transition: background .2s, transform .2s;
    white-space: nowrap;
  }
  .pg-btn-light:hover { background: var(--pg-cream); transform: translateY(-1px); }

  /* ─── MARQUEE ─────────────────────────────────────────────────────── */
  .pg-marquee-wrap {
    overflow: hidden; background: var(--pg-navy); padding: .75rem 0; white-space: nowrap;
  }
  .pg-marquee-track { display: inline-flex; gap: 2rem; animation: pgMarquee 32s linear infinite; }
  .pg-marquee-track span {
    font-size: .65rem; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(255,255,255,.4);
    display: inline-flex; align-items: center; gap: .7rem; transition: color .2s;
  }
  .pg-marquee-track span:hover { color: var(--pg-blue); }
  .pg-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--pg-orange); display: inline-block; flex-shrink: 0; }
  @keyframes pgMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ─── SECTION COMMONS ─────────────────────────────────────────────── */
  .pg-section-label {
    font-size: .65rem; font-weight: 600; letter-spacing: .2em;
    text-transform: uppercase; color: var(--pg-orange); margin-bottom: .7rem;
    display: flex; align-items: center; gap: .8rem;
  }
  .pg-section-label::before {
    content: ''; display: block; width: 20px; height: 1px; background: var(--pg-orange); flex-shrink: 0;
  }
  .pg-section-title {
    font-family: var(--pg-serif);
    font-size: clamp(2.6rem, 5.5vw, 6rem);
    font-weight: 600;
    line-height: .95; letter-spacing: -.02em;
  }
  .pg-section-title em {
    font-style: italic; font-weight: 400; color: var(--pg-orange);
  }

  /* ─── BOOK SECTION ────────────────────────────────────────────────── */
  .pg-book {
    padding: clamp(4rem,8vh,9rem) 5vw;
    background: var(--pg-navy); color: var(--pg-white);
    position: relative;
  }
  .pg-book__intro {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 5vw;
    align-items: center;
    margin-bottom: clamp(3.5rem,7vh,6rem);
    padding-bottom: clamp(3.5rem,7vh,6rem);
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .pg-book__intro-left { display: flex; flex-direction: column; }
  .pg-book__intro-left .pg-section-label { color: var(--pg-blue); }
  .pg-book__intro-left .pg-section-label::before { background: var(--pg-blue); }
  .pg-book__title {
    font-family: var(--pg-serif);
    font-size: clamp(2.8rem, 6vw, 7rem);
    font-weight: 600; line-height: .92;
    letter-spacing: -.02em; margin-top: .5rem;
  }
  .pg-book__title em { font-style: italic; color: var(--pg-blue); font-weight: 400; }
  .pg-book__cover-wrapper { display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
  .pg-book__cover-wrapper--mobile { display: none; }
  .pg-book__cover-wrapper--desktop { display: flex; }
  .pg-book__cover-img {
    width: clamp(130px, 14vw, 220px);
    box-shadow: 0 20px 60px rgba(0,0,0,.5), 4px 0 0 0 var(--pg-orange);
    transition: transform .4s, box-shadow .4s;
  }
  .pg-book__cover-img:hover {
    transform: scale(1.03);
    box-shadow: 0 30px 80px rgba(0,0,0,.65), 4px 0 0 0 var(--pg-orange);
  }
  .pg-book__intro-right { display: flex; flex-direction: column; }
  .pg-book__subtitle {
    font-size: .68rem; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--pg-blue); margin-bottom: 1.2rem;
  }
  .pg-book__desc { font-size: .9rem; line-height: 1.82; color: rgba(255,255,255,.55); margin-bottom: .85rem; font-weight: 300; }
  .pg-book__badges { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.6rem; }
  .pg-badge {
    display: inline-flex; align-items: center;
    border: 1px solid rgba(76,175,223,.25);
    color: rgba(76,175,223,.7);
    font-size: .65rem; font-weight: 500; letter-spacing: .1em;
    padding: .3rem .9rem;
    transition: border-color .2s, color .2s;
  }
  .pg-badge:hover { border-color: var(--pg-blue); color: var(--pg-blue); }
  .pg-book__pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    margin-bottom: clamp(3rem,6vh,5rem);
    border: 1px solid rgba(255,255,255,.07);
  }
  .pg-pillar {
    padding: 2rem 1.8rem;
    border-right: 1px solid rgba(255,255,255,.07);
    border-bottom: 1px solid rgba(255,255,255,.07);
    transition: background .3s;
  }
  .pg-pillar:nth-child(3n) { border-right: none; }
  .pg-pillar:nth-child(4), .pg-pillar:nth-child(5), .pg-pillar:nth-child(6) { border-bottom: none; }
  .pg-pillar:hover { background: rgba(76,175,223,.06); }
  .pg-pillar__icon { font-size: .9rem; display: block; margin-bottom: 1rem; color: var(--pg-blue); }
  .pg-pillar__title {
    font-family: var(--pg-serif); font-size: 1.1rem; font-weight: 600;
    color: var(--pg-white); margin-bottom: .5rem; letter-spacing: -.01em;
  }
  .pg-pillar__desc { font-size: .78rem; line-height: 1.7; color: rgba(255,255,255,.4); font-weight: 300; }
  .pg-book__quote-wrap { max-width: 660px; }
  .pg-book__quote {
    font-family: var(--pg-serif); font-style: italic;
    font-size: clamp(1rem, 1.8vw, 1.35rem);
    line-height: 1.65; color: rgba(255,255,255,.7);
    padding-left: 1.8rem;
    border-left: 2px solid var(--pg-orange);
    font-weight: 400;
  }
  .pg-book__quote p { margin-bottom: 1rem; }
  .pg-book__quote cite {
    display: block;
    font-size: .65rem; font-style: normal; font-family: var(--pg-body);
    letter-spacing: .15em; text-transform: uppercase;
    color: var(--pg-blue); font-weight: 500;
  }

  /* ─── AUDIENCE ────────────────────────────────────────────────────── */
  .pg-audience { padding: clamp(4rem,7vh,8rem) 5vw; background: var(--pg-white); }
  .pg-audience__header { margin-bottom: 3rem; }
  .pg-audience__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--pg-rule);
  }
  .pg-audience-chip {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.4rem 1.5rem;
    border-right: 1px solid var(--pg-rule);
    border-bottom: 1px solid var(--pg-rule);
    font-size: .83rem; font-weight: 500; color: var(--pg-mid);
    transition: background .2s, color .2s;
    cursor: default;
  }
  .pg-audience-chip:nth-child(4n) { border-right: none; }
  .pg-audience-chip:nth-child(5), .pg-audience-chip:nth-child(6),
  .pg-audience-chip:nth-child(7), .pg-audience-chip:nth-child(8) { border-bottom: none; }
  .pg-audience-chip:hover { background: var(--pg-bg); color: var(--pg-orange); }
  .pg-chip-num {
    font-family: var(--pg-serif); font-size: .75rem; font-weight: 400;
    color: var(--pg-orange); flex-shrink: 0; min-width: 22px;
  }

  /* ─── SERVICES ────────────────────────────────────────────────────── */
  .pg-services { padding: clamp(4rem,7vh,9rem) 5vw; }
  .pg-services__header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: clamp(2.5rem,5vh,4rem); gap: 1.5rem;
  }
  .pg-services__sub { font-size: .85rem; color: var(--pg-muted); max-width: 300px; line-height: 1.7; font-weight: 300; }

  .pg-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--pg-rule);
  }
  .pg-card {
    padding: 2rem 1.8rem 2.5rem;
    border-right: 1px solid var(--pg-rule);
    display: flex; flex-direction: column;
    transition: background .3s;
    cursor: pointer; position: relative; overflow: hidden;
  }
  .pg-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--pg-orange); transform: scaleX(0); transform-origin: left;
    transition: transform .35s cubic-bezier(.25,.46,.45,.94);
  }
  .pg-card:hover::after { transform: scaleX(1); }
  .pg-card:last-child { border-right: none; }
  .pg-card--light { background: var(--pg-white); }
  .pg-card--light:hover { background: var(--pg-bg); }
  .pg-card--accent { background: var(--pg-navy); }
  .pg-card--accent:hover { background: #22226A; }
  .pg-card--dark { background: var(--pg-cream); }
  .pg-card--dark:hover { background: #DDD7EA; }

  .pg-card__header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .pg-card__num {
    font-family: var(--pg-serif); font-size: .9rem; font-weight: 400;
    color: var(--pg-orange);
  }
  .pg-card--accent .pg-card__num { color: var(--pg-blue); }
  .pg-card--dark .pg-card__num { color: var(--pg-navy); }
  .pg-card__tag {
    font-size: .6rem; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; color: var(--pg-muted);
    border: 1px solid var(--pg-rule); padding: .2rem .6rem;
  }
  .pg-card--accent .pg-card__tag { color: rgba(255,255,255,.35); border-color: rgba(255,255,255,.12); }
  .pg-card--dark .pg-card__tag { color: var(--pg-mid); border-color: rgba(26,26,59,.15); }

  .pg-card__img {
    width: 100%; aspect-ratio: 4/3;
    overflow: hidden; margin-bottom: 1.5rem; flex-shrink: 0;
  }
  .pg-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.25,.46,.45,.94); }
  .pg-card:hover .pg-card__img img { transform: scale(1.05); }

  .pg-card__title {
    font-family: var(--pg-serif);
    font-size: clamp(1.3rem, 1.8vw, 1.7rem);
    font-weight: 600; line-height: 1.1;
    letter-spacing: -.01em;
    margin-bottom: .75rem; color: var(--pg-navy);
  }
  .pg-card--accent .pg-card__title { color: var(--pg-white); }
  .pg-card--dark .pg-card__title { color: var(--pg-navy); }
  .pg-card__desc {
    font-size: .8rem; line-height: 1.68; color: var(--pg-muted);
    flex-grow: 1; font-weight: 300;
  }
  .pg-card--accent .pg-card__desc { color: rgba(255,255,255,.45); }

  /* ─── NUMBERS ─────────────────────────────────────────────────────── */
  .pg-numbers {
    padding: clamp(3rem,5vh,5rem) 5vw;
    border-top: 1px solid var(--pg-rule);
    border-bottom: 1px solid var(--pg-rule);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .pg-number-item {
    text-align: center; padding: 2rem 1rem;
    border-right: 1px solid var(--pg-rule);
    transition: background .2s;
  }
  .pg-number-item:hover { background: var(--pg-white); }
  .pg-number-item:last-child { border-right: none; }
  .pg-number-item__val {
    font-family: var(--pg-serif);
    font-size: clamp(3rem, 5vw, 5.5rem);
    font-weight: 600; line-height: 1; color: var(--pg-navy); display: block;
    letter-spacing: -.02em;
  }
  .pg-number-item__val em { color: var(--pg-orange); font-style: italic; font-weight: 400; }
  .pg-number-item__label {
    font-size: .68rem; letter-spacing: .14em;
    text-transform: uppercase; color: var(--pg-muted);
    margin-top: .5rem; font-weight: 400;
  }

  /* ─── PROFILE ─────────────────────────────────────────────────────── */
  .pg-profile {
    padding: clamp(4rem,7vh,9rem) 5vw;
    display: grid; grid-template-columns: 40% 1fr; gap: 6vw;
    align-items: center;
    background: var(--pg-cream);
    border-top: 1px solid var(--pg-rule);
    border-bottom: 1px solid var(--pg-rule);
  }
  .pg-profile__photo-wrap { position: relative; }
  .pg-profile__photo { width: 100%; overflow: hidden; }
  .pg-profile__photo img {
    width: 88%; height: auto; display: block;
    object-fit: cover; object-position: top center;
    filter: grayscale(15%);
    transition: filter .4s;
  }
  .pg-profile__photo:hover img { filter: grayscale(0%); }
  .pg-profile__photo-badge {
    position: absolute; bottom: 0; right: 0;
    background: var(--pg-navy); color: var(--pg-white);
    padding: 1.2rem 1.5rem;
    border-top: 2px solid var(--pg-orange);
  }
  .pg-profile__photo-badge strong { display: block; font-family: var(--pg-serif); font-size: 1.1rem; font-weight: 600; color: var(--pg-blue); }
  .pg-profile__photo-badge span { font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.45); }

  .pg-profile__content { }
  .pg-profile__name {
    font-family: var(--pg-serif);
    font-size: clamp(3rem, 7vw, 8rem);
    font-weight: 600; line-height: .9;
    letter-spacing: -.02em; margin-bottom: 1.5rem;
  }
  .pg-profile__name em { font-style: italic; color: var(--pg-orange); font-weight: 400; display: block; }
  .pg-profile__bio {
    font-size: .9rem; line-height: 1.82; color: var(--pg-mid);
    max-width: 480px; margin-bottom: 1.5rem; font-weight: 300;
  }
  .pg-profile__tags-row { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.5rem; }
  .pg-tag-chip {
    font-size: .62rem; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; padding: .3rem .8rem;
    background: rgba(222,113,75,.08); color: var(--pg-orange);
    border: 1px solid rgba(222,113,75,.2);
    transition: background .2s, color .2s;
  }
  .pg-tag-chip:hover { background: var(--pg-orange); color: var(--pg-white); }
  .pg-profile__socials { display: flex; gap: .6rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .pg-social-link {
    display: inline-flex; align-items: center; gap: .5rem;
    border: 1px solid rgba(26,26,59,.12); background: var(--pg-white);
    color: var(--pg-mid); font-size: .72rem; font-weight: 500;
    letter-spacing: .04em; padding: .45rem 1rem;
    transition: background .2s, color .2s, border-color .2s;
  }
  .pg-social-link:hover { background: var(--pg-navy); color: var(--pg-white); border-color: var(--pg-navy); }
  .pg-social-link__icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pg-profile__actions { display: flex; gap: .8rem; flex-wrap: wrap; }

  /* ─── CTA BLOCK ───────────────────────────────────────────────────── */
  .pg-cta-block {
    margin: 0;
    background: var(--pg-navy);
    position: relative; overflow: hidden;
  }
  .pg-cta-block__rule {
    height: 3px;
    background: linear-gradient(90deg, var(--pg-orange) 0%, var(--pg-blue) 50%, transparent 100%);
  }
  .pg-cta-block__inner {
    display: grid; grid-template-columns: 1fr 36%; gap: 4vw;
    align-items: center;
    padding: clamp(4rem,7vh,7rem) 5vw;
  }
  .pg-cta-block__content { position: relative; z-index: 2; }
  .pg-cta-block__content .pg-section-label { color: rgba(255,255,255,.35); }
  .pg-cta-block__content .pg-section-label::before { background: rgba(255,255,255,.35); }
  .pg-cta-block__title {
    font-family: var(--pg-serif);
    font-size: clamp(3rem, 7vw, 7.5rem);
    font-weight: 600; line-height: .9;
    letter-spacing: -.02em; color: var(--pg-white); margin-bottom: 1.5rem;
  }
  .pg-cta-block__title em { font-style: italic; font-weight: 400; color: var(--pg-blue); display: block; }
  .pg-cta-block__sub {
    font-size: .92rem; color: rgba(255,255,255,.5);
    max-width: 380px; line-height: 1.78; margin-bottom: 2.5rem; font-weight: 300;
  }
  .pg-cta-block__image {
    position: relative; z-index: 2; overflow: hidden;
    opacity: .8;
    transition: opacity .4s;
  }
  .pg-cta-block__image:hover { opacity: 1; }
  .pg-cta-block__image img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

  /* ─── FAQ ─────────────────────────────────────────────────────────── */
  .pg-faq { padding: clamp(4rem,7vh,9rem) 5vw; max-width: 900px; margin: 0 auto; }
  .pg-faq__header { margin-bottom: 3.5rem; }
  .pg-faq-list { list-style: none; border-top: 1px solid var(--pg-rule); }
  .pg-faq-item { border-bottom: 1px solid var(--pg-rule); }
  .pg-faq-item__trigger {
    width: 100%; display: flex; align-items: center;
    gap: 1.5rem; background: none; border: none;
    padding: 1.5rem 0; text-align: left; cursor: pointer;
  }
  .pg-faq-item__num {
    font-family: var(--pg-serif); font-size: .85rem; font-weight: 400;
    color: var(--pg-orange); flex-shrink: 0; min-width: 24px;
  }
  .pg-faq-item__question {
    font-size: .92rem; font-weight: 500; color: var(--pg-navy);
    line-height: 1.4; flex-grow: 1; transition: color .2s;
  }
  .pg-faq-item__trigger:hover .pg-faq-item__question { color: var(--pg-orange); }
  .pg-faq-item__icon {
    width: 28px; height: 28px; flex-shrink: 0;
    border: 1px solid rgba(26,26,59,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 300; color: var(--pg-mid);
    transition: background .2s, color .2s, transform .3s;
    line-height: 1;
  }
  .pg-faq-item__trigger:hover .pg-faq-item__icon { background: var(--pg-orange); border-color: var(--pg-orange); color: var(--pg-white); }
  .pg-faq-item__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s cubic-bezier(.25,.46,.45,.94); }
  .pg-faq-item__inner { overflow: hidden; }
  .pg-faq-item__answer {
    padding: 0 0 1.5rem 3rem;
    font-size: .87rem; color: var(--pg-muted); line-height: 1.8; font-weight: 300;
  }

  /* ─── FOOTER ──────────────────────────────────────────────────────── */
  .pg-footer { background: var(--pg-navy); color: var(--pg-white); padding: clamp(3rem,5vh,4rem) 5vw 2rem; }
  .pg-footer__top {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 2.5rem;
    padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .pg-footer__brand { flex: 0 0 auto; }
  .pg-footer__tagline { font-size: .75rem; color: rgba(255,255,255,.3); margin-top: .3rem; letter-spacing: .05em; font-weight: 300; }
  .pg-footer__nav-col h4 {
    font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(255,255,255,.28); margin-bottom: 1rem; font-weight: 500;
  }
  .pg-footer__nav-col ul { list-style: none; display: flex; flex-direction: column; gap: .5rem; }
  .pg-footer__nav-col a { font-size: .8rem; color: rgba(255,255,255,.5); transition: color .2s; font-weight: 300; }
  .pg-footer__nav-col a:hover { color: var(--pg-blue); }
  .pg-footer__bottom {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 1rem; padding-top: 2rem;
    font-size: .68rem; color: rgba(255,255,255,.2); letter-spacing: .05em;
  }
  .pg-footer__social { display: flex; gap: .5rem; }
  .pg-footer__social a {
    width: 32px; height: 32px; border: 1px solid rgba(255,255,255,.1);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,.4);
    transition: background .2s, border-color .2s, color .2s;
  }
  .pg-footer__social a:hover { background: var(--pg-orange); border-color: var(--pg-orange); color: var(--pg-white); }

  /* ═══════════════════════════════════════════════════════════════════
     RESPONSIVE
  ═══════════════════════════════════════════════════════════════════ */

  @media (max-width: 1280px) {
    .pg-cards-grid { grid-template-columns: repeat(2, 1fr); }
    .pg-card:nth-child(2) { border-right: none; }
    .pg-card:nth-child(1), .pg-card:nth-child(2) { border-bottom: 1px solid var(--pg-rule); }
    .pg-card:nth-child(3), .pg-card:nth-child(4) { border-bottom: none; }
    .pg-card:nth-child(4) { border-right: none; }
    .pg-card:nth-child(3) { border-right: 1px solid var(--pg-rule); }
  }

  @media (max-width: 1100px) {
    .pg-hero__inner { grid-template-columns: 1fr 40%; }
    .pg-book__pillars { grid-template-columns: repeat(2, 1fr); }
    .pg-book__pillars .pg-pillar:nth-child(2) { border-right: none; }
    .pg-book__pillars .pg-pillar:nth-child(odd) { border-right: 1px solid rgba(255,255,255,.07); }
    .pg-book__pillars .pg-pillar:nth-child(5), .pg-book__pillars .pg-pillar:nth-child(6) { border-bottom: none; }
    .pg-book__pillars .pg-pillar:nth-child(3), .pg-book__pillars .pg-pillar:nth-child(4) { border-bottom: 1px solid rgba(255,255,255,.07); }
    .pg-audience__grid { grid-template-columns: repeat(2, 1fr); }
    .pg-audience-chip:nth-child(4n) { border-right: 1px solid var(--pg-rule); }
    .pg-audience-chip:nth-child(2n) { border-right: none; }
    .pg-audience-chip:nth-child(5), .pg-audience-chip:nth-child(6),
    .pg-audience-chip:nth-child(7), .pg-audience-chip:nth-child(8) { border-bottom: 1px solid var(--pg-rule); }
    .pg-audience-chip:nth-child(7), .pg-audience-chip:nth-child(8) { border-bottom: none; }
    .pg-numbers { grid-template-columns: repeat(2, 1fr); }
    .pg-number-item:nth-child(2) { border-right: none; }
    .pg-number-item:nth-child(3) { border-top: 1px solid var(--pg-rule); }
    .pg-profile { grid-template-columns: 42% 1fr; }
  }

  @media (max-width: 960px) {
    :root { --pg-nav-h: 64px; }
    .pg-nav__links { display: none; }
    .pg-nav__cta--desktop { display: none; }
    .pg-nav__burger { display: flex; }

    .pg-hero__inner { grid-template-columns: 1fr 40%; }
    .pg-hero__title { font-size: clamp(3.5rem, 12vw, 7rem); }

    .pg-book__intro { grid-template-columns: 1fr auto; }
    .pg-book__intro-right { grid-column: 1 / -1; }
    .pg-book__cover-wrapper--desktop { grid-column: 2; grid-row: 1; }

    .pg-cta-block__inner { grid-template-columns: 1fr 38%; }
  }

  @media (max-width: 768px) {
    .pg-hero__inner {
      grid-template-columns: 1fr;
      padding-top: 2rem; padding-bottom: 3rem;
    }
    .pg-hero__content { padding-right: 0; order: 1; }
    .pg-hero__visual { order: 2; max-width: 360px; margin: 0 auto; width: 100%; }
    .pg-hero__image-frame { height: clamp(260px, 55vw, 380px); }
    .pg-hero__image-badge { display: none; }
    .pg-hero__sub { max-width: 100%; }

    .pg-book__intro { grid-template-columns: 1fr; }
    .pg-book__cover-wrapper--desktop { display: none; }
    .pg-book__cover-wrapper--mobile { display: flex; margin: 1.5rem 0 0; }
    .pg-book__cover-img { width: clamp(110px, 32vw, 180px); }
    .pg-book__intro-right { grid-column: 1; }
    .pg-book__pillars { grid-template-columns: 1fr; }
    .pg-book__pillars .pg-pillar { border-right: none !important; }

    .pg-audience__grid { grid-template-columns: 1fr; }
    .pg-audience-chip { border-right: none !important; }
    .pg-audience-chip:nth-child(n) { border-bottom: 1px solid var(--pg-rule) !important; }
    .pg-audience-chip:last-child { border-bottom: none !important; }

    .pg-services__header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .pg-services__sub { max-width: 100%; }
    .pg-cards-grid { grid-template-columns: 1fr; }
    .pg-card { border-right: none !important; border-bottom: 1px solid var(--pg-rule) !important; }
    .pg-card:last-child { border-bottom: none !important; }
    .pg-card__img { aspect-ratio: 16/9; }

    .pg-numbers { grid-template-columns: repeat(2, 1fr); }
    .pg-number-item { border-right: none; border-bottom: 1px solid var(--pg-rule); }
    .pg-number-item:nth-child(odd) { border-right: 1px solid var(--pg-rule); }
    .pg-number-item:nth-child(3), .pg-number-item:nth-child(4) { border-bottom: none; }

    .pg-profile { grid-template-columns: 1fr; gap: 3rem; }
    .pg-profile__photo-wrap { max-width: 380px; width: 100%; margin: 0 auto; }
    .pg-profile__bio { max-width: 100%; }
    .pg-profile__photo img { width: 100%; }

    .pg-cta-block__inner { grid-template-columns: 1fr; padding: 3rem 5vw 2rem; }
    .pg-cta-block__image { max-width: 260px; margin: 0 auto; order: -1; }
    .pg-cta-block__sub { max-width: 100%; }

    .pg-faq { padding: 3rem 5vw; }
    .pg-faq__header { margin-bottom: 2rem; }

    .pg-footer__top { flex-direction: column; gap: 1.5rem; }
    .pg-footer__bottom { flex-direction: column; text-align: center; }
  }

  @media (max-width: 540px) {
    :root { --pg-nav-h: 60px; }
    .pg-hero__title { font-size: clamp(3rem, 18vw, 5.5rem); }
    .pg-hero__visual { max-width: 280px; }
    .pg-numbers { grid-template-columns: 1fr; }
    .pg-number-item { border-right: none !important; border-bottom: 1px solid var(--pg-rule); }
    .pg-number-item:last-child { border-bottom: none; }
    .pg-profile__name { font-size: clamp(2.8rem, 16vw, 5rem); }
    .pg-profile__actions { flex-direction: column; align-items: flex-start; }
    .pg-btn-primary, .pg-btn-ghost { width: 100%; justify-content: center; }
    .pg-btn-light { width: 100%; justify-content: center; }
    .pg-faq-item__answer { padding-left: 2.5rem; }
    .pg-footer__nav-col { min-width: 100%; }
    .pg-book__quote { padding-left: 1.2rem; }
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
// HackSimulator.nl — PDF Template v1.1
// Gebruik: typst compile juridische-gids.typ
//
// Huisstijl gebaseerd op styles/main.css + docs/style-guide.md

// === KLEUREN (uit main.css design system) ===
#let hs-bg = rgb("#0d1117")          // --color-bg (GitHub dark)
#let hs-bg-secondary = rgb("#161b22") // --color-bg-modal
#let hs-text = rgb("#c9d1d9")        // --color-text (soft white)
#let hs-text-dim = rgb("#8b949e")    // --color-text-dim
#let hs-accent = rgb("#9fef00")      // --color-prompt (HTB Neon Lime)
#let hs-success = rgb("#3fb950")     // --color-success
#let hs-error = rgb("#f85149")       // --color-error
#let hs-warning = rgb("#d29922")     // amber voor warnings

// === COVER PAGE ===
#let cover-page(title: "", subtitle: "", version: "1.0", date: "april 2026") = {
  page(fill: hs-bg, margin: (x: 50pt, y: 60pt))[
    #set text(fill: hs-text)

    #v(1fr)

    // Logo + Brand (zelfde stijl als website navbar)
    #grid(
      columns: (auto, auto),
      column-gutter: 12pt,
      align: (center + horizon, left + horizon),
      image("logo.svg", width: 56pt),
      [
        #text(font: "DejaVu Sans Mono", size: 22pt, fill: hs-text, weight: "bold")[HackSimulator]#text(font: "DejaVu Sans Mono", size: 22pt, fill: hs-accent, weight: "bold")[.nl]
      ],
    )
    #v(24pt)

    // Terminal prompt decoratie
    #text(font: "DejaVu Sans Mono", size: 11pt, fill: hs-text-dim)[
      user\@hacksimulator:\~\$
    ]
    #v(8pt)

    // Titel
    #text(font: "DejaVu Sans Mono", size: 28pt, fill: hs-accent, weight: "bold")[
      #title
    ]
    #v(12pt)

    // Subtitel
    #text(size: 14pt, fill: hs-text)[
      #subtitle
    ]
    #v(8pt)

    // Versie + datum
    #text(size: 10pt, fill: hs-text-dim)[
      Versie #version · #date
    ]

    #v(1fr)

    // Horizontale lijn
    #line(length: 100%, stroke: 0.5pt + hs-accent)
    #v(8pt)

    // Branding
    #text(font: "DejaVu Sans Mono", size: 11pt, fill: hs-accent)[
      HackSimulator.nl
    ]
    #h(1fr)
    #text(size: 9pt, fill: hs-text-dim)[
      Browser-based terminal simulator voor ethisch hacken
    ]
  ]
}

// === DOCUMENT SETUP ===
#let hacksimulator-doc(
  title: "",
  subtitle: "",
  version: "1.0",
  date: "april 2026",
  body,
) = {
  // Cover page
  cover-page(title: title, subtitle: subtitle, version: version, date: date)

  // Document instellingen voor binnenwerk
  set page(
    paper: "a4",
    margin: (top: 70pt, bottom: 70pt, left: 55pt, right: 55pt),
    fill: white,
    footer: context {
      set text(size: 8pt, fill: luma(140))
      [
        #text(font: "DejaVu Sans Mono", fill: hs-accent.darken(30%))[HackSimulator.nl]
        #h(1fr)
        #title
        #h(1fr)
        #counter(page).display("1")
      ]
    },
  )

  // Typografie
  set text(font: "Liberation Sans", size: 10.5pt, fill: luma(30))
  set par(leading: 0.7em, justify: true)

  // Headings
  set heading(numbering: none)
  show heading.where(level: 1): it => {
    // Hoofdsecties beginnen altijd op een nieuwe pagina
    // weak: true voorkomt dubbele pagebreaks als we al bovenaan staan
    pagebreak(weak: true)
    block(
      width: 100%,
      below: 10pt,
    )[
      #text(size: 18pt, fill: hs-bg, weight: "bold")[#it.body]
      #v(2pt)
      #line(length: 100%, stroke: 1.5pt + hs-accent)
    ]
  }

  show heading.where(level: 2): it => {
    v(12pt)
    // breakable: false houdt de heading + ruimte erna bij elkaar
    // zodat een heading nooit alleen onderaan een pagina staat
    block(below: 8pt, breakable: false)[
      #text(size: 14pt, fill: hs-bg, weight: "bold")[#it.body]
      // Onzichtbare ruimte zodat er altijd minstens ~2 regels
      // content na de heading past, anders schuift alles naar de volgende pagina
      #v(24pt)
    ]
  }

  show heading.where(level: 3): it => {
    v(8pt)
    block(below: 6pt, breakable: false)[
      #text(size: 12pt, fill: hs-accent.darken(40%), weight: "bold")[#it.body]
      #v(18pt)
    ]
  }

  // Code blokken — donkere achtergrond, terminal-stijl
  show raw.where(block: true): it => {
    block(
      width: 100%,
      fill: hs-bg,
      stroke: 0.5pt + hs-bg-secondary,
      radius: 4pt,
      inset: 10pt,
      above: 8pt,
      below: 8pt,
    )[
      #set text(font: "DejaVu Sans Mono", size: 9pt, fill: hs-text)
      #it
    ]
  }

  // Inline code
  show raw.where(block: false): it => {
    box(
      fill: luma(235),
      radius: 2pt,
      inset: (x: 3pt, y: 1pt),
    )[
      #set text(font: "DejaVu Sans Mono", size: 9.5pt, fill: luma(40))
      #it
    ]
  }

  // Tabellen
  set table(
    stroke: 0.5pt + luma(200),
    inset: 7pt,
    fill: (_, y) => if y == 0 { hs-accent.darken(30%) },
  )
  // Header tekst: wit + bold
  show table.cell.where(y: 0): set text(fill: white, weight: "bold", size: 9.5pt)

  // Links
  show link: it => {
    text(fill: hs-accent.darken(20%))[#underline[#it]]
  }

  // Blockquotes (> tekst)
  show quote: it => {
    block(
      width: 100%,
      inset: (left: 12pt, y: 8pt, right: 8pt),
      stroke: (left: 3pt + hs-accent),
      fill: hs-accent.lighten(92%),
      radius: (right: 4pt),
    )[
      #set text(size: 10pt)
      #it.body
    ]
  }

  // Horizontale lijn
  set line(stroke: 0.5pt + luma(200))

  body
}

// === HELPER FUNCTIES ===

// [TIP] blok
#let tip(body) = {
  block(
    width: 100%,
    fill: hs-success.lighten(90%),
    stroke: (left: 3pt + hs-success),
    radius: (right: 4pt),
    inset: 10pt,
    above: 8pt,
    below: 8pt,
  )[
    #text(font: "DejaVu Sans Mono", size: 9pt, fill: hs-success.darken(20%), weight: "bold")[\[TIP\] ]
    #text(size: 10pt)[#body]
  ]
}

// [!] warning blok
#let warning(body) = {
  block(
    width: 100%,
    fill: hs-error.lighten(92%),
    stroke: (left: 3pt + hs-error),
    radius: (right: 4pt),
    inset: 10pt,
    above: 8pt,
    below: 8pt,
  )[
    #text(font: "DejaVu Sans Mono", size: 9pt, fill: hs-error.darken(10%), weight: "bold")[\[!\] ]
    #text(size: 10pt)[#body]
  ]
}

// Belangrijk / let op blok
#let letop(body) = {
  block(
    width: 100%,
    fill: hs-warning.lighten(90%),
    stroke: (left: 3pt + hs-warning),
    radius: (right: 4pt),
    inset: 10pt,
    above: 8pt,
    below: 8pt,
  )[
    #text(font: "DejaVu Sans Mono", size: 9pt, fill: hs-warning.darken(20%), weight: "bold")[\[LET OP\] ]
    #text(size: 10pt)[#body]
  ]
}

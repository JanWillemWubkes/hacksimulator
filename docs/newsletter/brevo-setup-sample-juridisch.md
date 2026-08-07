# Brevo-setup — lead magnet "Juridische Gids sample"

**Doel:** wie zich inschrijft op `/sample-juridisch.html` krijgt een welkomstmail over de
**juridische** gids — met de juiste PDF en een cross-sell naar `yzdtfx`, niet naar het
pentest-playbook.

**Status (7 aug 2026):** formulier aangemaakt, `action`-URL staat op de pagina, E2E-poort groen.
**Nog te doen: Stap 2 (template) en Stap 3 (automation).** Tot die twee klaar zijn krijgt een
juridisch-inschrijver *geen* welkomstmail — de bevestigingsmail komt wel, en de PDF staat
sowieso al in het success-panel.

Dit document is self-contained — je kunt het uitvoeren zonder andere context.

---

## De bug die dit oplost

`sample-juridisch.html` postte naar **hetzelfde Brevo-formulier** als `sample-pentest.html` —
byte-identieke `action`-URL. De welkomst-automation draait op een *Form submitted*-trigger, en
tags zijn in Brevo géén automation-criterium (zie `brevo-setup-sample-pentest.md`, Stap 3).

Gevolg: Brevo **kon** de twee instromen niet onderscheiden. Iedereen die de juridische sample
aanvroeg kreeg `welkomstmail-sample-pentest.html`: verkeerd onderwerp, verkeerde PDF, en een
cross-sell naar `wmvpx` (playbook) in plaats van `yzdtfx` (juridische gids).

De bezoeker had zijn PDF op dat moment al via het success-panel, dus er ging geen download
verloren. Maar `sample-juridisch.html` belooft letterlijk *"We mailen 'm ook zodra je je
inschrijving bevestigt"* — en die belofte werd gebroken.

---

## Wat er al klaar is (repo, Sessie 212)

- [x] `docs/newsletter/welkomstmail-sample-juridisch.html` — de mail, klaar om te importeren
- [x] Downloadknop levert `juridische-gids-sample.pdf` (6 pagina's, 82 KB) onder zijn eigen naam
- [x] E2E-dekking voor de juridische funnel in `tests/e2e/lead-magnet.spec.js`

**Nog niet gedaan, want dat kan pas ná stap 1 hieronder:** de `action`-URL op
`sample-juridisch.html:158` wijst nog naar het gedeelde pentest-formulier.

---

## Poort vooraf — controleer dit vóór je begint

Brevo free staat **2.000 contacten in automation** toe. Over het *aantal* workflows doet de
documentatie geen harde uitspraak, en er draaien er al twee (hoofdnieuwsbrief + sample-pentest).

**Controleer bij Stap 3 dat een derde automation daadwerkelijk aangemaakt kan worden.**
Blokkeert Brevo dat: **stop en meld het.** Niet omheen werken — de terugvalroute is één neutrale
gedeelde mail met beide downloadknoppen, en dat is een scope-beslissing, geen technische.

---

## Stap 1 — Formulier aanmaken ✅ (gedaan 7 aug 2026)

> **De Messages-stap is geen cosmetica — de "Success message" is wat je bezoeker leest.**
> `src/ui/brevo-submit.js:39-42` zet `json.message` uit Brevo's antwoord in het success-panel en
> overschrijft daarmee de hardcoded tekst in de HTML. Bij een echte inschrijving geverifieerd
> (7 aug 2026): het panel toonde de string uit Brevo, niet die uit `sample-juridisch.html:148`.
> Laat je hier het Engelse default staan, dan leest je bezoeker dat op een Nederlandse pagina.
>
> De andere drie zijn minder kritisch: bij leeg EMAIL, een ongeldig formaat en een gevulde
> honeypot antwoordt Brevo `{"success":true}` **zonder** message, en blijft de HTML-tekst staan.
> Vul ze toch in het Nederlands in — het kost niets en dekt de gevallen die we niet gemeten
> hebben. De HTML-tekst is het vangnet, niet de hoofdcopy.
>
> **En zet reCAPTCHA niet aan.** Drie redenen: `brevo-submit.js` doet de POST zelf en stuurt
> geen captcha-token mee; de CSP (`netlify.toml:127`) staat `google.com/recaptcha` niet toe als
> scriptbron; en het honeypot-veld `email_address_check` doet het spamwerk al.
>
> Het uiterlijk uit de Design-stap ("Newsletter", "SUBSCRIBE", …) komt nooit op de site — we
> lenen alleen de `action`-URL. Wat er in Design wél toe doet is het **veld**: alleen `EMAIL`.


> **Volgorde:** form eerst, automation daarna. De automation-trigger verwijst naar dit form; je
> kunt geen lege form-referentie maken. (Zelfde volgorde-val als `brevo-setup-sample-pentest.md`.)

1. Brevo → **Contacts** → **Forms** → **Create a new subscription form**
2. Type: **Subscription form**
3. Naam: **`Sample Juridisch embed`**
4. **Lists:** `hacksimulator-main` — **dezelfde lijst als de andere twee formulieren.**
   Eén lijst = één double opt-in. Bij een aparte lijst moet een inschrijver twee keer
   bevestigen. (Sessie 126-patroon.)
5. **Fields:** alleen **EMAIL** (geen voornaam — laagdrempelig)
6. **Double opt-in:** AAN (AVG-verplicht). Gebruik de bestaande bevestigingsmail, of dupliceer
   die van het pentest-formulier.
7. **Locale:** `nl`
8. Save → **Share**-tab → kopieer de **HTML embed code**

Uit die embed-code haal je de `action`-URL. Die vervangt de huidige `action` op
**`sample-juridisch.html:158`**. Verder verandert er niets aan de pagina — de `#sib-form`-,
`#error-message`- en `#success-message`-ID's blijven zoals ze zijn; `src/ui/brevo-submit.js`
is form-agnostisch en gaat op `form.id`, niet op de URL.

**Uitgevoerd:** token `MUIFAGIf…` staat op de pagina; de volledige embed is bewaard als
`sample-juridisch-embed-form.html` (bron van waarheid voor de URL, net als bij pentest).
De E2E-test *"elke sample post naar een ánder Brevo-formulier"* is hiermee groen.

---

## Stap 2 — Template uploaden

1. Brevo → **Campaigns** → **Email templates** → **New template**
2. Naam: **`welkomstmail-sample-juridisch`**
3. Design editor → **Import HTML** — **niet** de drag-drop editor
4. Open `docs/newsletter/welkomstmail-sample-juridisch.html`, kopieer **alle inhoud**, plak in Brevo
5. **Subject:** `Je juridische sample staat klaar [TIP] hoofdstuk 1 en 2 van de volledige gids`
6. **Preview text:** `Hacken is niet per definitie illegaal — ongeautoriseerd hacken is dat wél.`
7. **Van-naam:** `HackSimulator.nl` · **Van-adres:** `contact@hacksimulator.nl`
8. Save & Activate

> **Kritiek:** gebruik **Import HTML**. De dark-mode-overrides en Outlook-conditionals
> overleven de drag-drop editor niet. De mail draagt de Sessie 206-mobielfixes
> (gesplitste `.code-block`/`.code-inline`, inline kleuren omdat de Gmail-app
> `prefers-color-scheme` niet ondersteunt) — die gaan verloren als de editor de HTML herschrijft.

---

## Stap 3 — Automation bouwen

1. Brevo → **Automations** → **Create a new automation** → **Create from scratch**
   → *hier valt de poort: lukt het aanmaken van een derde automation?*
2. Naam: **`Sample Juridisch — welkomstflow`**
3. **Entry point (Trigger):** sidebar **Forms → Form submitted** → selecteer
   **`Sample Juridisch embed`** (uit Stap 1)
4. **Actie: Send an email** → template **`welkomstmail-sample-juridisch`** (uit Stap 2)
   - **⚠️ Check:** klik het **prullenbak-icoontje** naast het default template en koppel opnieuw
     aan jouw template — anders deployt Brevo de lege variant
5. Save → **Activate**

### Waarom hier géén "Stap 3b" nodig is

Bij de pentest-setup moest de hoofd-welkomstautomation worden omgezet van een list-trigger naar
een form-trigger, anders kreeg een sample-inschrijver twee welkomstmails.

Dat is al gebeurd. De huidige situatie:

| Automation | Trigger |
|---|---|
| Hoofdnieuwsbrief | Form submitted op het homepage/blog-formulier |
| Sample Pentest | Form submitted op `Sample Pentest embed` |
| **Sample Juridisch (nieuw)** | Form submitted op `Sample Juridisch embed` |

Drie formulieren, drie automations, geen overlap → geen dubbele mails. **Wel testen, niet
aannemen** — dat is precies wat Stap 4 doet.

---

## Stap 4 — Testen

**Juridische flow:**
1. Ga naar `https://hacksimulator.nl/sample-juridisch.html`, schrijf in met een testadres
2. Success-panel → download → bestand heet **`juridische-gids-sample.pdf`** en opent op
   "Ethisch Hacken & de Nederlandse Wet" (6 pagina's)
3. Bevestig de opt-in-mail
4. Verwacht **precies één** mail, met:
   - onderwerp over de juridische gids
   - `> Bestand klaargezet: juridische-gids-sample.pdf` in de groene balk
   - downloadknop → de juridische PDF
   - cross-sell → `gumroad.com/l/yzdtfx`

**Regressie op de pentest-flow** (ander testadres):
5. Zelfde op `/sample-pentest.html` → 9 pagina's, `wmvpx`, en géén tweede mail

Komt de mail niet aan: **Automations → jouw automation → Logs**. Meest voorkomende oorzaak is
dat de automation niet op **Active** staat, of dat de actie nog het default template gebruikt.

---

## Stap 5 — Repo bijwerken en de gate groen maken ✅ (gedaan 7 aug 2026)

De `action`-URL staat op `sample-juridisch.html:158` en de suite is groen:
54 passed / 6 skipped / 0 failed over chromium, firefox en webkit (de 6 skips zijn de
Content-Disposition-tests, die alleen tegen productie zinvol zijn).

De poort die overblijft is menselijk, niet geautomatiseerd: **is de mail daadwerkelijk
verzonden en klopte hij?** Dat kan alleen Stap 4 beantwoorden.

---

## Waarom deze route, en niet een van de andere twee

Vastgelegd zodat dit over vijf sessies niet opnieuw als "openstaand" opduikt.

| Overwogen | Waarom niet gekozen |
|---|---|
| **Eén neutrale mail met beide downloadknoppen** (~15 min) | Goedkoper, maar de cross-sell-knop moet dan neutraal of dubbel. Die knop is precies wat dit experiment moet meten. |
| **Hidden field + attribuut-split in één automation** | Zelfde bouwtijd als deze route, plus een onzekerheid: of het `serve`-endpoint een extra veld accepteert dat niet in de form-definitie staat. Meer risico, geen extra opbrengst. |

**Wat dit moet uitwijzen:** het pentest-playbook was het enige product met een eigen funnel, en
het enige dat los verkocht. De juridische gids is inhoudelijk het sterkste product en had géén
funnel. Als hij mét dezelfde behandeling nog steeds niet verkoopt, ligt het aan het onderwerp en
niet aan de toeleiding — dat is de hele reden dat deze pagina bestaat. Een gedeelde mail met een
verwaterde cross-sell zou dat onmeetbaar maken.

Vergelijk na ~2 weken: inschrijvingen per formulier in Brevo, en Gumroad-verkopen van `yzdtfx`
vóór en ná.

---

## Meetpunten (GA4, client-side)

| Event / attribuut | Waarde |
|---|---|
| `data-newsletter-location` | `sample_juridisch` |
| `data-lead-download` | `juridisch` |
| `data-cta-location` (success-panel) | `sample_juridisch_success_panel` |
| `data-cta-location` (cross-sell) | `sample_juridisch_crosssell` |
| `data-lead-magnet` (vanaf gidsen.html) | `juridisch_sample` |

> De pentest-variant gebruikt `sample_success_panel` zonder product-infix. Asymmetrisch, maar
> bewust niet hernoemd: dat breekt de historische continuïteit van de enige funnel die al data
> heeft.

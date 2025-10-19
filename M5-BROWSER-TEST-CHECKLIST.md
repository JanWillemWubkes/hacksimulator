# M5 Cross-Browser Testing Checklist

**Project:** HackSimulator.nl
**Live URL:** https://famous-frangollo-b5a758.netlify.app/
**Test Date:** _____________
**Tester:** _____________

---

## 📋 Testing Matrix Overview

| Browser | Version | Desktop | Mobile | Status | Critical Bugs |
|---------|---------|---------|--------|--------|---------------|
| Chrome Windows | Latest | [ ] | N/A | ⬜ Pending | |
| Chrome macOS | Latest | [ ] | N/A | ⬜ Pending | |
| Firefox Windows | Latest | [ ] | N/A | ⬜ Pending | |
| Safari macOS | Latest | [ ] | N/A | ⬜ Pending | |
| Edge Windows | Latest | [ ] | N/A | ⬜ Pending | |
| Mobile Safari | iOS 16+ | N/A | [ ] | ⬜ Pending | |
| Chrome Mobile | Android 12+ | N/A | [ ] | ⬜ Pending | |

**Status Legend:**
- ⬜ Pending (not tested)
- 🟡 In Progress
- ✅ Passed (no critical bugs)
- ⚠️ Passed with issues (minor bugs)
- ❌ Failed (critical bugs blocking)

---

## 🎯 Test Scenarios

### Section 1: Initial Load & Core Functionality

#### 1.1 Page Load
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| URL loads (HTTP 200) | Page displays within 3 sec | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| No console errors | Console clean (or expected warnings only) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CSS loads correctly | Terminal UI visible, green text on black | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| JavaScript loads | Terminal prompt visible, cursor blinking | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Legal modal shows | "Belangrijke Melding" modal displays on first visit | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```
Chrome Win:

Chrome Mac:

Firefox:

Safari:

Edge:

iOS Safari:

Android Chrome:

```

---

#### 1.2 Onboarding Flow
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Welcome message displays | 5 lines: welcome + instructions + help hint | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Legal modal closeable | Click "Ik begrijp het" → modal closes | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cookie banner appears | Banner shows after 2 sec delay | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Return visit (no onboarding) | Reload page → no welcome message, direct to terminal | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

### Section 2: Terminal Core Functionality

#### 2.1 Input & Output
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Type in terminal | Characters appear as you type | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Enter executes command | `help` → shows command list | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Output displays correctly | Green text, monospace font, readable | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Scrolling works | Long output scrolls, latest visible | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Input focus management | Click anywhere → input refocuses | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cursor visible | Blinking cursor in input field | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 2.2 History Navigation
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Arrow Up (↑) | Shows previous command in history | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | N/A (mobile) |
| Arrow Down (↓) | Shows next command in history | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | N/A (mobile) |
| Empty history | Arrow keys do nothing (no errors) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | N/A |
| History persists | Reload page → history still available | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

### Section 3: Command Testing (30 Commands)

**Test Approach:** Test representative commands from each category. Full test = all 30 commands.

#### 3.1 System Commands (7 commands)
**Priority:** 🔴 Critical

| Command | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `help` | Shows categorized command list (4 categories) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `clear` | Clears terminal output, shows fresh prompt | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `man help` | Shows manual page in Dutch | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `history` | Shows command history list | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `history -c` | Clears history, shows confirmation | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `echo test` | Prints "test" to output | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `date` | Shows current date/time in Dutch | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `whoami` | Shows username "ethicalhacker" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 3.2 Filesystem Commands (11 commands)
**Priority:** 🔴 Critical

| Command | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `pwd` | Shows current directory (e.g., `/home/ethicalhacker`) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ls` | Lists files in current directory | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ls -l` | Detailed listing with permissions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ls -a` | Shows hidden files (.ssh, .bash_history) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `cd Documents` | Changes to Documents, prompt updates | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `cd ..` | Goes to parent directory | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `cd ~` | Goes to home directory | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `cat /etc/passwd` | Shows file contents with inline Dutch explanations | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `mkdir testdir` | Creates directory, persists after reload | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `touch testfile.txt` | Creates empty file | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `rm testfile.txt` | Removes file, shows confirmation | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `rm -r testdir` | Removes directory recursively | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `cp file1 file2` | Copies file | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `mv file1 file2` | Moves/renames file | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `find passwd` | Finds files matching pattern | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `grep root /etc/passwd` | Searches in file, shows matching lines | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 3.3 Network Commands (6 commands)
**Priority:** 🟡 High

| Command | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `ping google.com` | Shows simulated ping response with latency | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `nmap 192.168.1.1` | Port scan output with inline Dutch explanations + tip | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ifconfig` | Network interface info (IP, MAC, etc.) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `netstat` | Network statistics (active connections) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `whois google.com` | Domain registration info | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `traceroute google.com` | Network path with hop-by-hop info | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 3.4 Security Commands (5 commands)
**Priority:** 🟡 High

| Command | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `hashcat [hash]` | Shows warning + simulated hash cracking | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `hydra target.com` | Legal warning → confirmation prompt → simulated brute force | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `sqlmap http://test.com` | SQL injection simulation with educational output | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `metasploit` | Framework intro (simulated msfconsole) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `nikto http://test.com` | Web vulnerability scan output | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 3.5 Special Commands
**Priority:** 🔴 Critical

| Command | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `reset` | Restores filesystem to original state, shows confirmation | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Invalid command (e.g., `asdf`) | Fuzzy match suggestion: "Bedoelde je: [cmd]?" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

### Section 4: Help System (3-Tier)

#### 4.1 Tier 1: Fuzzy Matching
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Type `nap` (typo for nmap) | Suggests "Bedoelde je: nmap?" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Type `catt` (typo for cat) | Suggests "Bedoelde je: cat?" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Type `hlep` (typo for help) | Suggests "Bedoelde je: help?" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

#### 4.2 Tier 2: Progressive Hints
**Priority:** 🟢 Medium

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Make same error twice | After 2nd error, shows hint with example | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

#### 4.3 Tier 3: Man Pages
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| `man nmap` | Shows full manual page in Dutch | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `man invalidcmd` | Error: "Geen handleiding beschikbaar voor: invalidcmd" | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| All 30 commands have man pages | Test 5 random commands: man [cmd] → shows Dutch manual | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

### Section 5: Persistence & State Management

#### 5.1 localStorage Persistence
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Create file → reload | `touch test.txt` → F5 → `ls` shows test.txt | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Create dir → reload | `mkdir testdir` → F5 → `ls` shows testdir | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Change dir → reload | `cd Documents` → F5 → prompt shows Documents | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Command history → reload | Execute 5 commands → F5 → ↑ shows history | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Legal accepted → reload | Accept legal modal → F5 → modal doesn't show | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cookie consent → reload | Accept cookies → F5 → banner doesn't show | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 5.2 localStorage Disabled (Edge Case)
**Priority:** 🟢 Medium

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Disable localStorage → test | Commands still work, no persistence (graceful degradation) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**How to test:** Chrome DevTools → Application → Storage → Block localStorage → Reload page

---

### Section 6: Mobile-Specific Tests

#### 6.1 Mobile Layout & Responsiveness
**Priority:** 🔴 Critical (iOS Safari & Android Chrome only)

| Test | Expected Result | iOS Safari | Android Chrome |
|------|-----------------|------------|----------------|
| Portrait mode (320px) | Terminal fits screen, no horizontal scroll | [ ] | [ ] |
| Landscape mode | Terminal adjusts, remains readable | [ ] | [ ] |
| Output width | Max 40 chars per line on mobile | [ ] | [ ] |
| Font size readable | 14px minimum, no squinting needed | [ ] | [ ] |
| Touch targets (buttons) | Min 44x44px, easy to tap (legal modal, cookie banner) | [ ] | [ ] |
| Virtual keyboard | Keyboard shows when tapping terminal, doesn't break layout | [ ] | [ ] |
| iOS zoom prevention | Tap input → no zoom (font-size: 16px) | [ ] | [ ] |
| Scrolling smooth | `-webkit-overflow-scrolling: touch` works | [ ] | [ ] |
| Pull-to-refresh disabled | Swipe down → no browser refresh | [ ] | [ ] |

**Notes:**
```
iOS Safari:

Android Chrome:

```

---

#### 6.2 Mobile Touch Interaction
**Priority:** 🟡 High

| Test | Expected Result | iOS Safari | Android Chrome |
|------|-----------------|------------|----------------|
| Tap to focus input | Tap terminal → input focuses, keyboard shows | [ ] | [ ] |
| Tap outside input | Tap output area → input refocuses | [ ] | [ ] |
| Long-press text | Select/copy output text works | [ ] | [ ] |
| Pinch zoom | Pinch zoom works (accessibility) | [ ] | [ ] |

**Notes:**
```


```

---

### Section 7: Legal & Compliance

#### 7.1 Legal Modal
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| First visit → modal shows | "Belangrijke Melding" modal displays immediately | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Modal content readable | Dutch text, clear warning, links to legal docs | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| "Ik begrijp het" button | Click → modal closes, terminal accessible | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Button has shake animation | Button wiggles on hover (desktop) | [ ] | [ ] | [ ] | [ ] | [ ] | N/A | N/A |

**Notes:**
```


```

---

#### 7.2 Cookie Consent Banner
**Priority:** 🔴 Critical (AVG Compliance)

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Banner timing | Appears 2 sec after legal modal closed | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Banner content | Dutch text, clear explanation, Accept/Decline buttons | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Accept button | Click → banner disappears, consent saved | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Decline button | Click → banner disappears, no tracking | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Persistence | Reload page → banner doesn't show again | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 7.3 Legal Documents
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Privacy Policy link | Footer link → `/assets/legal/privacy.html` loads | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Terms of Service link | Footer link → `/assets/legal/terms.html` loads | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cookie Policy link | Footer link → `/assets/legal/cookies.html` loads | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| All docs in Dutch | Legal docs are in Nederlands (AVG requirement) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

### Section 8: Analytics & Tracking

#### 8.1 Event Tracking (if GA4 configured)
**Priority:** 🟢 Medium (can wait until GA4 ID is added)

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Consent required | No tracking before cookie consent | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Accept → tracking starts | After accept, events fire (check DevTools Network) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Command executed event | Execute command → GA4 event fires (no command args!) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Session start/end | Page load/unload → GA4 events fire | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**How to verify:** Chrome DevTools → Network tab → Filter: `google-analytics.com` → See requests

**Notes:**
```


```

---

### Section 9: Performance & Optimization

#### 9.1 Load Performance
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Load time (4G simulation) | Page interactive < 3 sec | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Bundle size | Total payload < 500 KB | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| First Contentful Paint | FCP < 2 sec | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Largest Contentful Paint | LCP < 2.5 sec | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cumulative Layout Shift | CLS < 0.1 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**How to test:** Chrome DevTools → Lighthouse → Run audit (mobile + desktop)

**Notes:**
```


```

---

#### 9.2 Memory & Resource Usage
**Priority:** 🟢 Medium

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Long session (100+ commands) | No memory leaks, terminal remains responsive | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| localStorage quota | Filesystem + history < 1 MB (test with DevTools) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**How to test:** Chrome DevTools → Performance → Record → Execute 100 commands → Check heap size

**Notes:**
```


```

---

### Section 10: Accessibility

#### 10.1 Keyboard Navigation
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Tab navigation | Tab → focuses legal modal button, cookie buttons, footer links | [ ] | [ ] | [ ] | [ ] | [ ] | N/A | N/A |
| Focus indicators visible | Focused elements have visible outline (2px solid) | [ ] | [ ] | [ ] | [ ] | [ ] | N/A | N/A |
| Enter activates buttons | Focus button → Enter → activates | [ ] | [ ] | [ ] | [ ] | [ ] | N/A | N/A |
| Esc closes modals | Legal modal → Esc → (modal should close or stay, define expected) | [ ] | [ ] | [ ] | [ ] | [ ] | N/A | N/A |

**Notes:**
```


```

---

#### 10.2 Visual Accessibility
**Priority:** 🟢 Medium

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Color contrast | Green text on black ≥ 4.5:1 ratio | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| 200% zoom | Page readable at 200% browser zoom | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Font scaling | Respects user font size preferences | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**How to test contrast:** Browser DevTools → Inspect element → Check computed color values → Use contrast checker (webaim.org/resources/contrastchecker)

**Notes:**
```


```

---

#### 10.3 Screen Reader (Known Limitations)
**Priority:** 🟢 Low (terminal UI inherently limited for screen readers)

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Terminal input label | Screen reader announces input field purpose | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Output readable | Screen reader can read terminal output (basic) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Note:** Full screen reader support is POST-MVP. Basic usability is acceptable for MVP.

**Notes:**
```


```

---

### Section 11: Security

#### 11.1 Content Security Policy
**Priority:** 🟡 High

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| CSP headers present | Check DevTools Network → Response headers → `Content-Security-Policy` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| No CSP violations | Console shows no CSP errors | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 11.2 Input Sanitization (XSS Prevention)
**Priority:** 🔴 Critical

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Type `<script>alert('XSS')</script>` | No alert fires, script tag escaped in output | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Type `<img src=x onerror=alert('XSS')>` | No alert, HTML escaped | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Type `echo <b>test</b>` | Output shows escaped HTML, not bold text | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

#### 11.3 External Links Security
**Priority:** 🟢 Medium

| Test | Expected Result | Chrome Win | Chrome Mac | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|-----------------|------------|------------|---------|--------|------|------------|----------------|
| Footer links (if external) | `rel="noopener noreferrer"` present | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Notes:**
```


```

---

## 🐛 Bug Report Template

**Use this template to report bugs found during testing:**

```markdown
### Bug #[number]

**Severity:** [P0 Critical / P1 High / P2 Medium / P3 Low]
**Browser:** [Chrome Win / Firefox / Safari / etc.]
**Status:** [🔴 Open / 🟡 In Progress / ✅ Fixed]

**Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshot/Video:**
[Attach if possible]

**Console Errors:**
```
[Paste console errors here]
```

**Workaround:**
[Temporary fix if available]

**Fix Priority:**
- [ ] Launch blocker (must fix before go-live)
- [ ] Post-launch fix (can ship with this bug)
```

---

## 📊 Test Results Summary

**Completion Date:** _____________
**Total Tests:** ___ / ___
**Pass Rate:** ___%

### Critical Issues (P0)
```
[List all P0 bugs that block launch]
```

### High Priority Issues (P1)
```
[List all P1 bugs]
```

### Medium/Low Issues (P2-P3)
```
[List all P2-P3 bugs - can be deferred]
```

### Browser Compatibility Summary
```
Chrome Windows: ✅ / ⚠️ / ❌
Chrome macOS:   ✅ / ⚠️ / ❌
Firefox:        ✅ / ⚠️ / ❌
Safari:         ✅ / ⚠️ / ❌
Edge:           ✅ / ⚠️ / ❌
iOS Safari:     ✅ / ⚠️ / ❌
Android Chrome: ✅ / ⚠️ / ❌
```

### Go/No-Go Decision
- [ ] ✅ **GO** - All critical bugs fixed, ready for launch
- [ ] ⚠️ **GO with caveats** - Minor issues present, acceptable for MVP
- [ ] ❌ **NO-GO** - Critical bugs present, not ready for launch

**Justification:**
```


```

---

## 📝 Notes & Observations

**General Observations:**
```


```

**Performance Notes:**
```


```

**UX Feedback:**
```


```

**Recommendations:**
```


```

---

**Document Version:** 1.0
**Created:** [Date]
**Last Updated:** [Date]
**Tester:** [Name]

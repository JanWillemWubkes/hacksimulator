# Manual Performance Testing Protocol

**Document Version:** 1.0
**Created:** 2025-12-18
**Milestone:** M5 Testing & Launch
**Purpose:** Step-by-step procedures for manual performance testing

---

## Overview

This document provides detailed procedures for manual performance tests that cannot be automated with Playwright. These tests require human observation and Chrome DevTools profiling.

**Total Duration:** ~55 minutes
- Memory Leak Detection: 45 min (30 min test + 15 min analysis)
- Network Throttling Verification: 10 min

---

## Test 1: Memory Leak Detection

**Duration:** 45 minutes
**Tool:** Chrome DevTools
**Purpose:** Detect memory leaks from event listeners, detached DOM, heap growth

---

### Prerequisites

- [ ] Chrome browser installed (latest version)
- [ ] Test URL accessible: https://famous-frangollo-b5a758.netlify.app/
- [ ] Quiet environment (no other tabs/apps consuming resources)
- [ ] Performance results template ready (`docs/testing/performance-results.md`)

---

### Setup Phase (5 minutes)

1. **Open Chrome Incognito**
   ```bash
   # Linux
   google-chrome --incognito

   # macOS
   open -a "Google Chrome" --args --incognito

   # Windows
   start chrome --incognito
   ```

2. **Navigate to test URL**
   - URL: `https://famous-frangollo-b5a758.netlify.app/`
   - Wait for page to fully load

3. **Accept legal modal**
   - Click "Ik begrijp het - Verder" button
   - Wait for modal to disappear

4. **Open Chrome DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
   - Keep DevTools open for entire test

5. **Enable Performance Monitor**
   - Press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) to open Command Palette
   - Type: `performance monitor`
   - Select: "Show Performance Monitor"

6. **Configure metrics**
   - In Performance Monitor panel, check:
     - ✅ JS heap size
     - ✅ DOM Nodes
     - ✅ JS event listeners
   - Uncheck all other metrics (reduce noise)

---

### Baseline Phase (2 minutes)

1. **Wait for stabilization**
   - Let the page sit idle for 1 full minute
   - Don't interact with terminal
   - Watch Performance Monitor for stability

2. **Record baseline metrics**
   - After 1 minute, note values in `performance-results.md`:
     ```
     Baseline:
     - JS Heap: _____ MB
     - DOM Nodes: _____
     - Event Listeners: _____ (expected: ~45)
     ```

3. **Verify baseline is reasonable**
   - JS Heap: Should be 5-15 MB (typical for SPA)
   - Event Listeners: Should be ~45 (singleton pattern + document listeners)
   - If values are anomalous, restart test

---

### Test Execution Phase (30 minutes)

**Command Loop Sequence (15 commands per loop):**

```bash
1.  help
2.  ls
3.  cd /home/hacker
4.  pwd
5.  touch test_<N>.txt          # N = loop number (1-5)
6.  cat test_<N>.txt
7.  mkdir dir_<N>
8.  mv test_<N>.txt dir_<N>/
9.  find /home -name "*.txt"
10. grep "test" /home
11. nmap 192.168.1.1
12. ping google.com
13. whoami
14. history
15. clear
```

**Execution Instructions:**

1. **Loop 1** (0-6 min)
   - Execute commands 1-15 above
   - Replace `<N>` with `1` (e.g., `touch test_1.txt`)
   - Type each command manually (no copy-paste)
   - Wait ~1 second between commands
   - After command 15 (clear), wait 1 full minute

2. **Record Loop 1 metrics** (6 min mark)
   ```
   Loop 1:
   - JS Heap: _____ MB
   - DOM Nodes: _____
   - Event Listeners: _____
   ```

3. **Loop 2** (6-12 min)
   - Repeat commands 1-15
   - Replace `<N>` with `2`
   - Wait 1 minute after clear

4. **Record Loop 2 metrics** (12 min mark)
   ```
   Loop 2:
   - JS Heap: _____ MB
   - DOM Nodes: _____
   - Event Listeners: _____
   ```

5. **Loop 3** (12-18 min)
   - Repeat commands 1-15
   - Replace `<N>` with `3`
   - Wait 1 minute

6. **Record Loop 3 metrics** (18 min mark)

7. **Loop 4** (18-24 min)
   - Repeat commands 1-15
   - Replace `<N>` with `4`
   - Wait 1 minute

8. **Record Loop 4 metrics** (24 min mark)

9. **Loop 5** (24-30 min)
   - Repeat commands 1-15
   - Replace `<N>` with `5`
   - Wait 1 minute

10. **Record Loop 5 metrics** (30 min mark)

---

### Heap Snapshot Analysis Phase (8 minutes)

1. **Take heap snapshot** (30 min mark)
   - DevTools → Memory tab
   - Select: "Heap snapshot"
   - Click: "Take snapshot"
   - Wait for snapshot to complete (~10-30 seconds)

2. **Filter: Detached DOM trees**
   - In snapshot view, Class filter box
   - Type: `Detached`
   - Count detached DOM tree nodes
   - Record: `Detached DOM: ___ nodes`
   - **Expected:** 0 (or <10 is acceptable)
   - **Fail if:** ≥50 nodes

3. **Filter: Event listeners**
   - Clear filter box
   - Type: `EventListener`
   - Look for duplicate listeners on same element
   - Check `#terminal-input` specifically
   - Record: `Terminal input listeners: ___ (expected: ~8)`
   - **Expected:** Keydown, input, click, paste, focus, blur (~8 total)
   - **Fail if:** >20 listeners (indicates duplication)

4. **Check for memory leaks**
   - Look for objects with unexpectedly high retained size
   - Common leak sources:
     - Modal DOM nodes not garbage collected
     - Event listeners on destroyed elements
     - setTimeout/setInterval not cleared
   - Record any suspicious patterns

---

### Calculate Results & Verdict

1. **Calculate heap growth percentage**
   ```
   Heap Growth % = ((Loop 5 Heap - Baseline Heap) / Baseline Heap) * 100
   ```

2. **Calculate event listener change**
   ```
   Listener Change = Loop 5 Listeners - Baseline Listeners
   ```

3. **Determine verdict**

   **✅ PASS if:**
   - Heap growth < 10%
   - Event listener change: ± 2
   - Detached DOM: 0 nodes
   - No duplicate listeners detected

   **⚠️ WARNING if:**
   - Heap growth: 10-15%
   - Event listener change: ± 3-5
   - Detached DOM: 1-50 nodes
   - Minor duplication detected (not on critical elements)

   **❌ FAIL if:**
   - Heap growth > 15%
   - Event listener change: > ±5
   - Detached DOM: ≥50 nodes
   - Severe listener duplication (terminal input >20)

---

### Expected Outcomes & Known Patterns

**Based on code review (src/ui/input.js, etc.):**

1. **Event listeners should be stable**
   - Singleton pattern used (InputHandler exported as `new InputHandler()`)
   - `init()` called once in main.js
   - Listeners attached once in `_attachListeners()` (line 63-104)
   - **Expected:** PASS (stable listener count)

2. **Heap growth should be minimal**
   - No dynamic component creation/destruction
   - Command history capped at 100 entries
   - VFS state grows linearly (tested separately)
   - **Expected:** PASS (<10% growth)

3. **Possible leak sources:**
   - Modals: feedback.js, onboarding.js, legal.js
   - If modals re-created on each open: potential detached DOM
   - **Monitor:** Modal usage during test (minimize if possible)

---

### Troubleshooting

**If test is interrupted:**
- Restart from Setup Phase
- Don't try to continue from middle of test
- Consistency is critical for leak detection

**If Performance Monitor values fluctuate wildly:**
- Close other Chrome tabs
- Disable browser extensions
- Check system resources (RAM, CPU)
- Restart Chrome and try again

**If heap snapshot fails to load:**
- Heap may be too large (>500 MB)
- Indicates severe memory leak
- Record as CRITICAL FAIL
- Skip snapshot analysis, document heap size

---

## Test 2: Network Throttling Verification

**Duration:** 10 minutes
**Tool:** Chrome DevTools
**Purpose:** Validate Playwright automated test results with manual observation

---

### Setup (2 minutes)

1. **Open Chrome** (can use normal mode, not incognito)
   - Navigate to: `https://famous-frangollo-b5a758.netlify.app/`
   - Don't interact yet

2. **Open DevTools**
   - Press `F12`
   - Navigate to: **Network** tab

3. **Configure Network tab**
   - ✅ Check: "Disable cache"
   - Throttling dropdown: Select "Slow 4G"
   - (Alternative: "Custom" → 4 Mbps down, 3 Mbps up, 20ms RTT)

---

### Test Execution (3 minutes)

1. **Hard refresh page**
   - Press: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows/Linux)
   - Watch Network panel populate

2. **Wait for page to fully load**
   - Blue line: DOMContentLoaded
   - Red line: Load event
   - Wait until network activity stops (~5-10 seconds)

3. **Record Network metrics**
   ```
   Network Tab (bottom bar):
   - Finish time: _____ s
   - DOMContentLoaded: _____ s (blue line)
   - Load: _____ s (red line)
   - Requests: _____
   - Transferred: _____ KB
   ```

---

### Performance Tab Analysis (5 minutes)

1. **Switch to Performance tab**
   - Click: "Performance" tab in DevTools

2. **Start recording**
   - Click: Record button (circle icon)
   - Refresh page again: `Cmd+Shift+R` / `Ctrl+Shift+R`
   - Let page fully load
   - Click: Stop button

3. **Locate LCP metric**
   - In timeline, find section: "Timings"
   - Locate: LCP (Largest Contentful Paint)
   - Hover over LCP marker to see value
   - Record: `LCP: _____ ms`

4. **Alternative: Performance Insights**
   - If available, click "Performance Insights" tab
   - Check "Insights" panel for LCP value
   - More user-friendly than raw timeline

---

### Cross-Check with Automated Tests

1. **Open automated test results**
   - File: `docs/testing/performance-results.md`
   - Section: "Load Time Metrics (Chromium 4G)"

2. **Compare LCP values**
   ```
   Automated LCP: _____ ms (from Playwright test)
   Manual LCP:    _____ ms (from DevTools)
   Difference:    ± _____ ms
   ```

3. **Determine verdict**
   - **✅ PASS:** Difference < 500ms (acceptable variance)
   - **⚠️ WARNING:** Difference 500-1000ms (investigate caching)
   - **❌ FAIL:** Difference > 1000ms (test methodology issue)

---

### Expected Results

**Typical Metrics (4G throttling):**
- Finish time: 2.5-3.5s
- DOMContentLoaded: 1.5-2.5s
- Load: 2.0-3.0s
- LCP: 1.5-2.5s (should match automated test ±500ms)

**If metrics significantly differ from automated:**
- Check throttling is enabled
- Check cache is disabled
- Verify same network conditions (Slow 4G preset)
- Compare with Firefox baseline (no throttling) for sanity check

---

## Results Documentation

After completing both tests, fill out the template:

**File:** `docs/testing/performance-results.md`

**Required sections:**
1. Section 2.1: Memory Leak Detection metrics table
2. Section 2.1: Heap Snapshot Analysis
3. Section 2.1: Overall Verdict (Pass/Warning/Fail)
4. Section 2.2: Network Throttling Verification metrics
5. Section 2.2: Cross-Check with Automated Tests
6. Section 5: Overall Verdict (select one checkbox)
7. Section 6: Next Steps (check applicable actions)

---

## Time Tracking

| Phase                          | Est. Time | Actual Time |
|--------------------------------|-----------|-------------|
| Memory Test Setup              | 5 min     | _____       |
| Memory Test Baseline           | 2 min     | _____       |
| Memory Test Execution (5 loops)| 30 min    | _____       |
| Heap Snapshot Analysis         | 8 min     | _____       |
| Network Test Setup             | 2 min     | _____       |
| Network Test Execution         | 3 min     | _____       |
| Network Performance Analysis   | 5 min     | _____       |
| **TOTAL**                      | **55 min**| **_____**   |

---

## Appendix A: Command Loop Cheat Sheet

```bash
# Loop 1-5: Replace <N> with loop number

help
ls
cd /home/hacker
pwd
touch test_<N>.txt
cat test_<N>.txt
mkdir dir_<N>
mv test_<N>.txt dir_<N>/
find /home -name "*.txt"
grep "test" /home
nmap 192.168.1.1
ping google.com
whoami
history
clear

# Wait 1 minute, record metrics, repeat
```

---

## Appendix B: Metric Recording Template

Copy this to a scratch file during test:

```markdown
### Memory Leak Test Data

**Baseline (1 min):**
- Heap: _____ MB
- DOM: _____
- Listeners: _____

**Loop 1 (6 min):**
- Heap: _____ MB (Δ: +_____%)
- DOM: _____ (Δ: +_____)
- Listeners: _____ (Δ: +_____)

**Loop 2 (12 min):**
- Heap: _____ MB (Δ: +_____%)
- DOM: _____ (Δ: +_____)
- Listeners: _____ (Δ: +_____)

**Loop 3 (18 min):**
- Heap: _____ MB (Δ: +_____%)
- DOM: _____ (Δ: +_____)
- Listeners: _____ (Δ: +_____)

**Loop 4 (24 min):**
- Heap: _____ MB (Δ: +_____%)
- DOM: _____ (Δ: +_____)
- Listeners: _____ (Δ: +_____)

**Loop 5 (30 min):**
- Heap: _____ MB (Δ: +_____%)
- DOM: _____ (Δ: +_____)
- Listeners: _____ (Δ: +_____)

**Heap Snapshot:**
- Detached DOM: _____ nodes
- Terminal input listeners: _____
- Duplicates found: Yes/No

**Verdict:** Pass / Warning / Fail
```

---

**End of Manual Protocol**
**Document maintained by:** HackSimulator.nl Development Team
**Last reviewed:** 2025-12-18

#!/usr/bin/env python3
"""Leest DMARC-aggregaatrapporten (.xml / .xml.gz / .zip) en vat ze samen.

Gebruik:  python3 .claude/plans/dmarc-rapport.py [map]   (default: ~/Documenten)

Groepeert NIET op een lijst van bekende IP's maar op de DMARC-uitkomst: elke bron
die niet slaagt moet zich verantwoorden, ook een die we nog nooit zagen. Een
lijst-gebaseerde filter zou alleen die lijst bewaken, niet de klasse.
"""
import sys, gzip, zipfile, io, os, glob
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime, timezone

DOMEIN = "hacksimulator.nl"

def lees_bestanden(map_pad):
    """Levert (bestandsnaam, xml-bytes) voor elk rapport dat we kunnen openen."""
    patronen = ["*.xml", "*.xml.gz", "*.zip", "*!*"]
    gezien, uit = set(), []
    for pat in patronen:
        for pad in glob.glob(os.path.join(map_pad, pat)):
            if pad in gezien or os.path.isdir(pad):
                continue
            gezien.add(pad)
            naam = os.path.basename(pad)
            try:
                if pad.endswith(".gz"):
                    uit.append((naam, gzip.open(pad, "rb").read()))
                elif pad.endswith(".zip"):
                    with zipfile.ZipFile(pad) as z:
                        for lid in z.namelist():
                            if lid.endswith(".xml"):
                                uit.append((f"{naam}:{lid}", z.read(lid)))
                else:
                    rauw = open(pad, "rb").read()
                    if rauw.lstrip()[:5] == b"<?xml":
                        uit.append((naam, rauw))
            except Exception as e:
                print(f"  [!] kon {naam} niet lezen: {e}", file=sys.stderr)
    return uit

def tekst(node, pad, default=""):
    el = node.find(pad)
    return el.text.strip() if el is not None and el.text else default

def main():
    map_pad = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Documenten")
    if not os.path.isdir(map_pad):
        print(f"[FOUT] map bestaat niet: {map_pad}"); return 2

    bestanden = lees_bestanden(map_pad)
    bronnen = defaultdict(lambda: {"n": 0, "dkim": set(), "spf": set(),
                                   "sel": set(), "spfdom": set(), "dmarc": set()})
    providers, periodes, beleid = set(), [], set()
    rapporten = 0

    for naam, rauw in bestanden:
        try:
            root = ET.fromstring(rauw)
        except ET.ParseError:
            continue
        if root.tag != "feedback":
            continue
        dom = tekst(root, "policy_published/domain")
        if dom and dom != DOMEIN:
            continue
        rapporten += 1
        providers.add(tekst(root, "report_metadata/org_name", "?"))
        b = tekst(root, "report_metadata/date_range/begin")
        e = tekst(root, "report_metadata/date_range/end")
        if b and e:
            periodes.append((int(b), int(e)))
        beleid.add("p={} sp={} pct={} adkim={} aspf={}".format(
            tekst(root, "policy_published/p", "?"), tekst(root, "policy_published/sp", "-"),
            tekst(root, "policy_published/pct", "?"), tekst(root, "policy_published/adkim", "r"),
            tekst(root, "policy_published/aspf", "r")))

        for rec in root.findall("record"):
            ip = tekst(rec, "row/source_ip", "?")
            n = int(tekst(rec, "row/count", "0") or 0)
            d = tekst(rec, "row/policy_evaluated/dkim", "?")
            s = tekst(rec, "row/policy_evaluated/spf", "?")
            info = bronnen[ip]
            info["n"] += n
            info["dkim"].add(d); info["spf"].add(s)
            # DMARC slaagt zodra EEN van beide aligned pass geeft
            info["dmarc"].add("pass" if (d == "pass" or s == "pass") else "fail")
            for dk in rec.findall("auth_results/dkim"):
                sel = tekst(dk, "selector"); res = tekst(dk, "result")
                if sel: info["sel"].add(f"{sel}={res}")
            for sp in rec.findall("auth_results/spf"):
                info["spfdom"].add(tekst(sp, "domain"))

    # --- zelfbewakende tak: lege populatie is geen groen resultaat ---
    if rapporten == 0:
        print(f"[FOUT] geen DMARC-rapporten voor {DOMEIN} gevonden in {map_pad}")
        print("       (verwacht .xml, .xml.gz of .zip; een lege uitkomst is hier")
        print("        niet te onderscheiden van 'alles in orde' — dus geen oordeel)")
        return 2

    dagen = "?"
    if periodes:
        v, t = min(p[0] for p in periodes), max(p[1] for p in periodes)
        fmt = lambda ts: datetime.fromtimestamp(ts, timezone.utc).strftime("%-d %b %Y")
        dagen = max(1, round((t - v) / 86400))
        periode_str = f"{fmt(v)} t/m {fmt(t)} ({dagen} dag{'en' if dagen != 1 else ''})"
    else:
        periode_str = "onbekend"

    geslaagd = {ip: i for ip, i in bronnen.items() if i["dmarc"] == {"pass"}}
    gefaald  = {ip: i for ip, i in bronnen.items() if "fail" in i["dmarc"]}
    tot = sum(i["n"] for i in bronnen.values())

    print(f"DMARC-rapporten voor {DOMEIN}")
    print(f"  {rapporten} rapport(en) van {len(providers)} provider(s): {', '.join(sorted(providers))}")
    print(f"  Periode: {periode_str}")
    print(f"  Berichten: {tot}")
    for b in sorted(beleid):
        print(f"  Beleid in rapporten: {b}")

    def toon(titel, groep):
        print(f"\n{titel}")
        if not groep:
            print("  (geen)"); return
        for ip, i in sorted(groep.items(), key=lambda kv: -kv[1]["n"]):
            sel = ",".join(sorted(i["sel"])) or "-"
            sd  = ",".join(sorted(x for x in i["spfdom"] if x)) or "-"
            print(f"  {ip:<18} {i['n']:>5} bericht(en)")
            print(f"  {'':<18}   DKIM {'/'.join(sorted(i['dkim']))}  (selector {sel})")
            print(f"  {'':<18}   SPF  {'/'.join(sorted(i['spf']))}  (envelope-domein {sd})")

    toon("BRONNEN DIE DMARC HALEN", geslaagd)
    toon("BRONNEN DIE DMARC NIET HALEN  <- deze moeten zich verantwoorden", gefaald)

    print("\nOORDEEL")
    blok = []
    if gefaald:
        blok.append(f"{len(gefaald)} bron(nen) halen DMARC niet ({sum(i['n'] for i in gefaald.values())} berichten).")
        blok.append("Zoek uit of dat een eigen verzendpad is dat je vergat, of spoofing.")
        blok.append("Is het spoofing, dan is dat juist een argument VOOR quarantine.")
    else:
        blok.append("Geen enkele bron faalt. Alles wat namens je domein verstuurde, was van jou.")
    if isinstance(dagen, int) and dagen < 7:
        blok.append(f"Dekking is nog kort ({dagen} dag(en)) -- een wekelijkse nieuwsbrief kan buiten beeld vallen.")
    if len(providers) < 2:
        blok.append(f"Slechts {len(providers)} rapporterende provider. Meer providers = meer zicht op ander verkeer.")
    if tot < 20:
        blok.append(f"Weinig volume ({tot} berichten) -- genoeg om paden te bevestigen, dun voor een trend.")
    for r in blok:
        print(f"  - {r}")

    klaar = (not gefaald) and isinstance(dagen, int) and dagen >= 7 and len(providers) >= 2
    print()
    print("  => Klaar voor p=quarantine; pct=25" if klaar
          else "  => Nog niet overtuigend genoeg; zie punten hierboven")
    return 0

sys.exit(main())

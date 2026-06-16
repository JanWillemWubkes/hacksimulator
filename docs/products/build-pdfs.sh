#!/bin/bash
# HackSimulator.nl — PDF Build Script
#
# Provenance / artifact-flow:
#   bron      : docs/products/*.typ  (getrackt in git — single source of truth)
#   build     : docs/products/*.pdf  (output van dit script; NIET getrackt — zie .gitignore)
#   geserveerd: assets/samples/pentest-playbook-sample.pdf  (lead-magnet, wél getrackt)
# De volledige product-PDF's worden naar Gumroad geupload; de *.pdf hier zijn herbouwbaar.
#
# Vereist: typst (https://github.com/typst/typst)
#
# Installatie:
#   cargo install typst-cli
#   OF download binary: https://github.com/typst/typst/releases
#
# Gebruik:
#   cd docs/products/
#   chmod +x build-pdfs.sh
#   ./build-pdfs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check of typst geinstalleerd is
if ! command -v typst &> /dev/null; then
    echo "[!] typst is niet geinstalleerd."
    echo ""
    echo "Installeer via een van deze methoden:"
    echo "  1. cargo install typst-cli"
    echo "  2. Download binary: https://github.com/typst/typst/releases"
    echo "  3. Arch Linux: sudo pacman -S typst"
    echo "  4. macOS: brew install typst"
    exit 1
fi

echo "=== HackSimulator PDF Builder ==="
echo ""

# Logo: kopieer de canonieke brand-SVG naar de build-dir.
# Single source of truth = assets/brand/logo.svg; docs/products/logo.svg is
# build-managed (gitignored) zodat het logo niet op meerdere plekken hoeft te syncen.
echo "[*] Logo synchroniseren uit assets/brand/logo.svg"
cp ../../assets/brand/logo.svg logo.svg

# Compileer alle guides + sample
for file in juridische-gids.typ pentest-playbook.typ leerplan.typ pentest-playbook-sample.typ; do
    name="${file%.typ}"
    echo "[*] Compileer: $file → ${name}.pdf"
    typst compile "$file" "${name}.pdf"
done

echo ""
echo "[OK] Alle PDF's gegenereerd:"
ls -lh *.pdf 2>/dev/null
echo ""
echo "Upload de 3 betaalde PDF's naar Gumroad. Zie gumroad-listings.md voor instructies."
echo "Kopieer pentest-playbook-sample.pdf naar assets/samples/ voor de lead magnet."

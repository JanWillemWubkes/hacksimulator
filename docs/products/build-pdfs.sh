#!/bin/bash
# HackSimulator.nl — PDF Build Script
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

# Compileer alle guides
for file in juridische-gids.typ pentest-playbook.typ leerplan.typ; do
    name="${file%.typ}"
    echo "[*] Compileer: $file → ${name}.pdf"
    typst compile "$file" "${name}.pdf"
done

echo ""
echo "[OK] Alle PDF's gegenereerd:"
ls -lh *.pdf 2>/dev/null
echo ""
echo "Upload deze PDF's naar Gumroad. Zie gumroad-listings.md voor instructies."

#!/usr/bin/env bash
# Verifieert de mail-DNS van hacksimulator.nl na de Zoho-wissel.
D=hacksimulator.nl; R=@8.8.8.8; pass=0; fail=0
ok()   { printf '[OK]   %-34s %s\n' "$1" "$(head -1 <<<"$2")"; pass=$((pass+1)); }
bad()  { printf '[FOUT] %-34s kreeg: %s\n' "$1" "$(head -1 <<<"${2:-<leeg>}")"; fail=$((fail+1)); }
has()  { if grep -qE "$2" <<<"$3"; then ok "$1" "$3"; else bad "$1" "$3"; fi; }
hasnt(){ if grep -qE "$2" <<<"$3"; then bad "$1" "$3"; else ok "$1" "${3:-<geen>}"; fi; }

mx=$(dig $R MX $D +short); txt=$(dig $R TXT $D +short); dmarc=$(dig $R TXT _dmarc.$D +short)
spf=$(grep 'v=spf1' <<<"$txt"); dkim=$(dig $R TXT zoho._domainkey.$D +short)

has   "MX wijst naar Zoho"        'mx[23]?\.zoho\.eu'       "$mx"
hasnt "MX niet meer TransIP"      'transip'                 "$mx"
has   "SPF bevat zoho.eu"         'include:zoho\.eu'        "$spf"
has   "SPF bevat Brevo (KRITIEK)" 'include:spf\.brevo\.com' "$spf"
hasnt "SPF zonder transip-include" '_spf\.transip\.email'   "$spf"
has   "SPF nog softfail ~all"     '~all'                    "$spf"
# DKIM: meet de echte sleutellengte i.p.v. alleen "is er iets"
if [ -z "$dkim" ]; then
  bad "Zoho DKIM aanwezig" "<leeg>"
else
  pub=$(tr -d '"\n ' <<<"$dkim" | sed -n 's/.*p=\([A-Za-z0-9+/=]*\).*/\1/p')
  bits=$(printf '%s' "$pub" | base64 -d 2>/dev/null \
         | openssl rsa -pubin -inform DER -text -noout 2>/dev/null \
         | sed -n 's/.*Public-Key: (\([0-9]*\) bit).*/\1/p')
  if [ "$bits" = "2048" ]; then ok "Zoho DKIM 2048-bit, sleutel heel" "$bits bit"
  elif [ "$bits" = "1024" ]; then ok "Zoho DKIM 1024-bit (werkt, zwakker)" "$bits bit"
  else bad "Zoho DKIM ONGELDIG of afgekapt" "p= is ${#pub} tekens, niet decodeerbaar"; fi
fi
has   "Brevo DKIM 1 intact"       'dkim\.brevo\.com'        "$(dig $R CNAME brevo1._domainkey.$D +short)"
has   "Brevo DKIM 2 intact"       'dkim\.brevo\.com'        "$(dig $R CNAME brevo2._domainkey.$D +short)"
has   "DMARC rua naar dmarc@"     'rua=mailto:dmarc@'       "$dmarc"
has   "Site nog op Netlify"       '^75\.2\.60\.5'           "$(dig $R A $D +short)"
has   "Google-verificatie intact" 'google-site-verification' "$(grep google <<<"$txt")"

echo "-----------------------------------------------------------"
echo "geslaagd: $pass   mislukt: $fail"
[ $fail -eq 0 ] && echo "ALLES GOED" || echo "NOG NIET KLAAR - zie [FOUT] hierboven"

#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-https://www.lucasanna.eu}"
URLS=(
  "/creazione-siti-web-sassari/"
  "/creazione-siti-web-sassari-sardegna/"
  "/creazione-siti-web-ecommerce/"
  "/realizzazione-siti-web-sardegna/"
  "/web-design-agency-sassari/"
  "/preventivi-sito-web/"
  "/preventivi-siti-web/"
  "/seo-e-posizionamento-sui-motori-di-ricerca/"
  "/grafica-sassari-design-unico-per-il-successo/"
  "/grafica-webdesign-sassari/"
  "/servizi/"
  "/Listino-Servizi-Web-LS-Web-Design-Agency.pdf"
)
for u in "${URLS[@]}"; do
  echo "==> $BASE$u"
  curl -sI "$BASE$u" | awk 'BEGIN{IGNORECASE=1} /^HTTP|^location:|^cache-control:|^x-vercel/'
  echo
done

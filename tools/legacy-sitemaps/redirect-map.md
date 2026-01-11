# Redirect Map - Strategia Finale

## A) URL COMMERCIALI → LS Web Agency (301)

Tutti gli URL commerciali vengono reindirizzati con 301 verso lswebagency.com per evitare cannibalizzazione SEO.

| Old Path | Destination | Note |
|----------|-------------|------|
| `/servizi` | `https://www.lswebagency.com/` | Home LS (servizi generici) |
| `/servizi/` | `https://www.lswebagency.com/` | Variante con slash |
| `/creazione-siti-web-ecommerce` | `https://www.lswebagency.com/` | E-commerce → LS |
| `/creazione-siti-web-ecommerce/` | `https://www.lswebagency.com/` | Variante |
| `/creazione-siti-web-sassari-sardegna` | `https://www.lswebagency.com/` | Locale → LS |
| `/creazione-siti-web-sassari-sardegna/` | `https://www.lswebagency.com/` | Variante |
| `/grafica-sassari-design-unico-per-il-successo` | `https://www.lswebagency.com/` | Grafica → LS |
| `/grafica-sassari-design-unico-per-il-successo/` | `https://www.lswebagency.com/` | Variante |
| `/grafica-webdesign-sassari` | `https://www.lswebagency.com/` | Web design → LS |
| `/grafica-webdesign-sassari/` | `https://www.lswebagency.com/` | Variante |
| `/realizzazione-siti-web-sardegna` | `https://www.lswebagency.com/` | Realizzazione → LS |
| `/realizzazione-siti-web-sardegna/` | `https://www.lswebagency.com/` | Variante |
| `/portfolio-category/grafica` | `https://www.lswebagency.com/` | Category commerciale → LS |
| `/portfolio-category/grafica/` | `https://www.lswebagency.com/` | Variante |
| `/portfolio/abacos-womens-clothing-ecommerce` | `https://www.lswebagency.com/` | Portfolio commerciale → LS |
| `/portfolio/abacos-womens-clothing-ecommerce/` | `https://www.lswebagency.com/` | Variante |
| `/realizzazione-siti-web-sassari-:slug*` | `https://www.lswebagency.com/` | Wildcard pattern |
| `/realizzazione-siti-web-:slug*` | `https://www.lswebagency.com/` | Wildcard pattern |

**Totale redirect commerciali: 18** (8 URL × 2 varianti + 2 wildcard)

---

## B) URL PORTFOLIO Item → Decisione

### KEEP/RECREATE (da trasformare in case study)

Vedi `portfolio-shortlist.md` per la lista completa (5-10 item selezionati).

**Esempio già mappato:**
- `/portfolio/patrizia-sabbadin-counselor-sassari` → `/case-studies/psicologa-sassari/` ✅

### GONE (404/410)

Tutti gli altri portfolio item non inclusi nella shortlist vengono lasciati senza redirect per evitare soft-404.

**Totale portfolio item: 20**
- **Da salvare: 5-10** (vedi shortlist)
- **Da lasciare 404: 10-15**

---

## C) URL TAG/CATEGORY → Decisione

### GONE (404/410) - Default

Tutti i tag e category di portfolio vengono lasciati senza redirect per evitare soft-404 e mantenere il focus su portfolio personale.

**Tag (14 totali):**
- `/portfolio-tag/abbigliamento-donna/` → **GONE**
- `/portfolio-tag/arte/` → **GONE**
- `/portfolio-tag/blog/` → **GONE**
- `/portfolio-tag/chiaroveggenza/` → **GONE**
- `/portfolio-tag/counselor/` → **GONE**
- `/portfolio-tag/dentista/` → **GONE**
- `/portfolio-tag/eventi/` → **GONE**
- `/portfolio-tag/hemp/` → **GONE**
- `/portfolio-tag/immobiliare/` → **GONE**
- `/portfolio-tag/musica/` → **GONE**
- `/portfolio-tag/natura/` → **GONE**
- `/portfolio-tag/psicologa/` → **GONE**
- `/portfolio-tag/ristorante/` → **GONE**
- `/portfolio-tag/sport/` → **GONE**

**Category (3 totali, 1 già commerciale):**
- `/portfolio-category/e-commerce/` → **GONE**
- `/portfolio-category/logo-design/` → **GONE**
- `/portfolio-category/web-design/` → **GONE** (nota: grafica è commerciale, già redirect)

**Eccezioni:** Nessuna. Tutti i tag/category vanno in 404/410.

---

## D) PERSONA/UTILITY → Decisione

### KEEP (mantenere/ricreare)

| Old Path | New Path | Action | Note |
|----------|----------|--------|------|
| `/` | `/` | KEEP | Home, nessun redirect |
| `/chi-sono-luca-sanna` | `/metodo/` | REDIRECT 301 | Cambio path, redirect interno |
| `/chi-sono-luca-sanna/` | `/metodo/` | REDIRECT 301 | Variante |
| `/privacy-policy` | `/privacy-policy/` | KEEP | Ricreare in Astro, stesso path |

**Totale redirect persona: 2** (solo chi-sono → metodo)

---

## E) ALTRO → Decisione

| Old Path | Action | Note |
|----------|--------|------|
| `/5-motivi-scegliere-agenzia-web/` | **GONE** | Contenuto commerciale, non rilevante per portfolio |
| `/grazie/` | **GONE** | Pagina utility, non critica |
| `/web-design-reponsive/` | **GONE** | Contenuto commerciale |

**Totale ALTRO: 3** → Tutti GONE (404/410)

---

## Riepilogo Redirect in vercel.json

- **COMMERCIALI → LS:** 18 redirect (8 URL + varianti + wildcard)
- **PERSONA:** 2 redirect (chi-sono → metodo)
- **PORTFOLIO:** Solo 1 redirect confermato (patrizia → psicologa-sassari), altri da shortlist
- **TAG/CATEGORY:** 0 redirect (tutti GONE)
- **UTILITY:** 0 redirect (mantenere stesso path)
- **ALTRO:** 0 redirect (tutti GONE)

**Totale redirect finali: ~21-26** (dipende da shortlist portfolio)

---

## Note Strategiche

1. **Evitare soft-404:** Non fare redirect massivi di portfolio/tag verso home o /case-studies/ generico
2. **Evitare cannibalizzazione:** Tutti i commerciali vanno verso LS, non verso lucasanna.eu
3. **Focus portfolio personale:** Solo case study selezionati, non tutti i portfolio item
4. **404 accettabili:** Tag/category e portfolio non selezionati vanno in 404/410 (normale per rebrand)






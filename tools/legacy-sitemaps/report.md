# Report Legacy URLs

## Statistiche

- **Totale URL**: 51
- **COMMERCIALE**: 8
- **PORTFOLIO**: 37
- **PERSONA**: 2
- **UTILITY**: 1
- **ALTRO**: 3

## A) URL Commerciali (da reindirizzare a LS Web Agency)

- `/creazione-siti-web-ecommerce/` → https://www.lswebagency.com/
- `/creazione-siti-web-sassari-sardegna/` → https://www.lswebagency.com/
- `/grafica-sassari-design-unico-per-il-successo/` → https://www.lswebagency.com/
- `/grafica-webdesign-sassari/` → https://www.lswebagency.com/
- `/portfolio-category/grafica/` → https://www.lswebagency.com/
- `/portfolio/abacos-womens-clothing-ecommerce/` → https://www.lswebagency.com/
- `/realizzazione-siti-web-sardegna/` → https://www.lswebagency.com/
- `/servizi/` → https://www.lswebagency.com/

## B) URL Utility (da mantenere/ricreare in Astro)

- `/privacy-policy/` → /privacy-policy/

## C) URL Portfolio (da revisionare - mapping verso /case-studies/)

- `/portfolio-category/e-commerce/` → TODO
- `/portfolio-category/logo-design/` → TODO
- `/portfolio-category/web-design/` → TODO
- `/portfolio-tag/abbigliamento-donna/` → TODO
- `/portfolio-tag/arte/` → TODO
- `/portfolio-tag/blog/` → TODO
- `/portfolio-tag/chiaroveggenza/` → TODO
- `/portfolio-tag/counselor/` → TODO
- `/portfolio-tag/dentista/` → TODO
- `/portfolio-tag/eventi/` → TODO
- `/portfolio-tag/hemp/` → TODO
- `/portfolio-tag/immobiliare/` → TODO
- `/portfolio-tag/musica/` → TODO
- `/portfolio-tag/natura/` → TODO
- `/portfolio-tag/psicologa/` → TODO
- `/portfolio-tag/ristorante/` → TODO
- `/portfolio-tag/sport/` → TODO
- `/portfolio/asd-sandalyon-sassari/` → TODO
- `/portfolio/canapalandia/` → TODO
- `/portfolio/cd-cover-the-temponauts/` → TODO
... e altri 17 URL portfolio

## D) URL Persona (da mantenere/ricreare)

- `/` → /
- `/chi-sono-luca-sanna/` → /metodo/ (REVIEW - verificare se esiste pagina equivalente)

## E) URL Altri (da revisionare)

- `/5-motivi-scegliere-agenzia-web/` → GONE (404/410)
- `/grazie/` → GONE (404/410)
- `/web-design-reponsive/` → GONE (404/410)

## Note

- **COMMERCIALI**: Tutti gli URL commerciali devono essere reindirizzati con 301 verso lswebagency.com (vedi vercel.json)
- **PORTFOLIO**: Richiedono mappatura manuale degli slug verso /case-studies/[slug] - NON creare redirect automatici
- **PERSONA**: Verificare se esistono pagine equivalenti in Astro, altrimenti ricreare
- **UTILITY**: Ricreare pagine in Astro mantenendo stesso path
- **ALTRO**: Valutare caso per caso, probabilmente 404/410


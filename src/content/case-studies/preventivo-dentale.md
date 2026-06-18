---
title: "PreventivoDentale.it"
client: "PreventivoDentale.it"
sector: "Healthcare e lead generation"
services: ["Web Design", "UX/UI", "Sviluppo Web"]
stack: ["Astro", "Supabase", "JavaScript", "CRM"]
tags: ["Astro", "UX/UI", "CRM"]
excerpt: "Piattaforma pilota per raccogliere richieste preliminari di trattamenti odontoiatrici e organizzarle in un flusso operativo chiaro."
featured: true
externalUrl: "https://preventivodentale.it"
cover: "/images/case-studies/dentista-digitale.png"
---

## Contesto

PreventivoDentale.it è una piattaforma in fase pilota per raccogliere richieste preliminari di trattamenti odontoiatrici. Il servizio non sostituisce una visita medica, non garantisce diagnosi online né preventivi certi: organizza le informazioni del paziente e, quando possibile, propone un abbinamento con strutture compatibili.

Il contesto richiede copy prudente, flussi chiari e tracciabilità delle richieste, in un settore dove promesse eccessive possono generare aspettative errate.

## Obiettivo

Progettare un percorso guidato che aiuti l’utente a descrivere il proprio caso in pochi minuti, con codice pratica, aggiornamenti sullo stato e comunicazione trasparente sui limiti del servizio. Parallelamente, strutturare un backend operativo per valutazione, assegnazione e follow-up lato cliniche.

## Approccio

Ho definito un modulo multi-step con domande progressive su trattamento, zona e informazioni utili, evitando linguaggio che suggerisca risultati garantiti. La homepage e le FAQ spiegano esplicitamente che il preventivo definitivo dipende dalla valutazione in studio.

Lato tecnico ho separato frontend pubblico, area cliniche e flusso dati verso Supabase, con logiche CRM per gestire stati della richiesta senza esporre dati sensibili in modo disordinato.

## Soluzione

Sito Astro con componenti React per form, dashboard e widget di stato. UX orientata alla chiarezza: badge informativi, timeline del processo, messaggi di servizio in fase pilota.

Integrazione con database per persistenza richieste, codice pratica e possibile assegnazione a strutture. Il copy è allineato al flusso reale: richiesta → organizzazione → valutazione → eventuale contatto clinico, senza promettere tempi fissi o esiti certi.

## Risultati

La piattaforma consente di raccogliere richieste più ordinate rispetto a moduli generici, con tracciamento tramite codice pratica. Il paziente capisce meglio cosa aspettarsi; il team può valutare i casi con informazioni strutturate.

Il progetto resta pilota: copertura geografica e disponibilità strutture possono variare. Il design comunica questo limite invece di nasconderlo.

## Cosa rifarei oggi

Rafforzerei test end-to-end sul flusso post-invio e sulla pagina stato, per ridurre richieste di supporto ripetitive. Valuterei anche una versione più snella del modulo mobile, mantenendo però tutti i campi necessari alla qualificazione preliminare.

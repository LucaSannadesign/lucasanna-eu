export interface PortfolioProject {
  slug: string;
  title: string;
  descriptor: string;
  category: string;
  status: string;
  year: string;
  intro: string;
  problem: string;
  approach: string[];
  implementation: string[];
  learning: string;
  stack: string[];
  demoUrl?: string;
  demoLabel?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'preventivodentale',
    title: 'PreventivoDentale',
    descriptor: 'Dal primo contatto a un percorso digitale tracciabile.',
    category: 'Product design / Web application',
    status: 'Prodotto online · sviluppo iterativo',
    year: '2026',
    intro: 'Una piattaforma per raccogliere richieste preliminari in ambito odontoiatrico, organizzarle e accompagnare le persone attraverso un percorso comprensibile, con stato della pratica consultabile.',
    problem: 'Trasformare una richiesta complessa e delicata in un flusso guidato, riducendo ambiguità, passaggi superflui e aspettative non realistiche.',
    approach: [
      'Scomposizione della richiesta in passaggi leggibili, con microcopy e avanzamento espliciti.',
      'Gestione degli stati, dei consensi e delle validazioni, con una distinzione chiara fra invio della richiesta e valutazione clinica.',
      'Interfacce responsive per chi invia la richiesta e per chi la gestisce.'
    ],
    implementation: [
      'Astro con componenti React per le interazioni, API applicative e Supabase.',
      'Form progressivo, codice pratica e consultazione dello stato della richiesta.',
      'Attenzione alle verifiche dei flussi critici, alla separazione fra interfaccia e logica applicativa e alle autorizzazioni.'
    ],
    learning: 'Il valore del front-end non è soltanto la schermata finale: è rendere esplicite condizioni, errori, attese e passaggi di responsabilità.',
    stack: ['Astro', 'React', 'TypeScript', 'Supabase', 'UX writing'],
    demoUrl: 'https://www.preventivodentale.it/',
    demoLabel: 'Esplora il prodotto'
  },
  {
    slug: 'lughe',
    title: 'LUGHE',
    descriptor: 'Progettare un percorso digitale di esplorazione immobiliare.',
    category: 'Product discovery / Front-end UX',
    status: 'Pilota · prodotto in evoluzione',
    year: '2026',
    intro: 'Un progetto di property intelligence pensato per aiutare le persone a orientarsi fra informazioni immobiliari e richieste, a partire da un’esperienza di esplorazione guidata.',
    problem: 'Passare da una proposta complessa a un’interfaccia comprensibile, che mostri il valore del servizio prima di chiedere impegno o dati all’utente.',
    approach: [
      'Definizione del percorso utente fra esplorazione, comprensione del valore e azione successiva.',
      'Progettazione di interfacce leggibili per una prima validazione del prodotto.',
      'Separazione fra presentazione pubblica, strumenti operativi e funzionalità non ancora abilitate.'
    ],
    implementation: [
      'Architettura front-end leggera e orientata al mobile.',
      'Prototipazione e verifica dei percorsi di interazione con scenari di prova.',
      'Attenzione a stati del servizio, accessi e progressione controllata del pilota.'
    ],
    learning: 'Un prodotto convincente deve essere utile già nell’esplorazione: il form è una conseguenza del valore percepito, non il suo sostituto.',
    stack: ['JavaScript', 'HTML / CSS', 'UX prototyping', 'Product thinking'],
  },
  {
    slug: 'yoartly',
    title: 'YoArtly',
    descriptor: 'Un’identità creativa tradotta in un’esperienza digitale.',
    category: 'Brand experience / Front-end',
    status: 'Progetto in evoluzione',
    year: '2026',
    intro: 'Un universo editoriale e creativo rivolto a bambini e famiglie, con un sito che collega identità visiva, storytelling, contenuti e percorsi di scoperta.',
    problem: 'Creare un’interfaccia coerente con un brand espressivo e riconoscibile, senza sacrificare gerarchia dei contenuti, leggibilità e chiarezza delle azioni.',
    approach: [
      'Traduzione dell’identità di marca in regole visive e componenti ripetibili.',
      'Gerarchia distinta fra presentazione del brand, progetti editoriali e sezioni di prodotto.',
      'Progettazione degli stati pre-lancio e delle comunicazioni sulle disponibilità.'
    ],
    implementation: [
      'Sito Astro con layout responsive e componenti riutilizzabili.',
      'Pagine di presentazione, navigazione tematica e preparazione di percorsi e-commerce.',
      'Verifiche preventive dei flussi di acquisto in ambiente di prova, senza presumere transazioni attive.'
    ],
    learning: 'Un linguaggio visivo ricco funziona quando mantiene una struttura prevedibile e facile da usare, anche su schermi piccoli.',
    stack: ['Astro', 'CSS', 'Design system', 'Responsive UI', 'Brand design'],
    demoUrl: 'https://yoartlyplay.com/',
    demoLabel: 'Esplora il progetto'
  }
];

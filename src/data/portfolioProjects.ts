export interface PortfolioProject {
  slug: string;
  title: string;
  descriptor: string;
  category: string;
  status: string;
  year: string;
  intro: string;
  role: string;
  problem: string;
  approach: string[];
  implementation: string[];
  verification: string;
  learning: string;
  stack: string[];
  demoUrl?: string;
  demoLabel?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'preventivodentale',
    title: 'PreventivoDentale',
    descriptor: 'Un funnel multi-step per richieste odontoiatriche, validazioni e stati applicativi.',
    category: 'Web application / UX engineering',
    status: 'Sito online · funzionalità in evoluzione',
    year: '2026',
    intro: 'Una piattaforma che guida la raccolta preliminare di richieste odontoiatriche. Il progetto unisce un form progressivo per gli utenti e strumenti di gestione delle pratiche, mantenendo distinta la richiesta di informazioni da una valutazione clinica.',
    role: 'Definizione dei percorsi utente, direzione UX/UI e lavoro sul front-end applicativo e sulle integrazioni, con particolare attenzione agli stati e alla comprensibilità del processo.',
    problem: 'Raccogliere dati utili senza trasformare un primo contatto in un questionario opaco. Un percorso delicato richiede indicazioni chiare su consenso, errori di compilazione, stato della richiesta e passaggi successivi.',
    approach: [
      'Suddivisione del form in passaggi progressivi: trattamento richiesto, urgenza e informazioni preliminari.',
      'Microcopy che separa il semplice invio della richiesta da eventuali valutazioni e decisioni successive.',
      'Progettazione di stati di caricamento, validazione, conferma ed errore, anche da smartphone.'
    ],
    implementation: [
      'Astro, componenti React e TypeScript per le interazioni; API applicative e Supabase per i dati.',
      'Flussi di form, identificazione della pratica e consultazione del suo stato.',
      'Gestione dei consensi e studio di controlli autorizzativi e tracciamento per le operazioni sensibili.'
    ],
    verification: 'Il sito pubblico è distinto dalle funzionalità ancora sottoposte a collaudo. Selezione delle cliniche, autorizzazioni e invii operativi non vengono presentati come processi automaticamente disponibili o già validati in produzione.',
    learning: 'Lavorare sul front-end significa anche rendere visibili le condizioni che regolano ogni azione: cosa è stato ricevuto, cosa è in verifica e quali passaggi non sono ancora autorizzati.',
    stack: ['Astro', 'React', 'TypeScript', 'Supabase', 'UX writing'],
    demoUrl: 'https://www.preventivodentale.it/',
    demoLabel: 'Visita il sito'
  },
  {
    slug: 'lughe',
    title: 'LUGHE',
    descriptor: 'Dall’esplorazione immobiliare all’interfaccia di un servizio in fase pilota.',
    category: 'Product discovery / Front-end UX',
    status: 'Pilota · prodotto in evoluzione',
    year: '2026',
    intro: 'Un progetto di property intelligence per orientarsi fra informazioni immobiliari e percorsi di richiesta. Il lavoro si concentra sul mostrare il valore dell’esplorazione prima di chiedere dati personali.',
    role: 'Progettazione dell’esperienza, definizione delle priorità del pilota e sviluppo di interfacce di esplorazione e strumenti operativi.',
    problem: 'Tradurre un servizio complesso in un percorso digitale che l’utente possa capire e valutare senza partire da un modulo di contatto.',
    approach: [
      'Esplorazione come primo passo, con informazioni e CTA inserite nel momento appropriato.',
      'Distinzione fra funzioni pubbliche, area operativa e operazioni che richiedono autorizzazione.',
      'Verifica dei percorsi su casi e scenari di prova, senza presentare il pilota come servizio completo.'
    ],
    implementation: [
      'Interfacce mobile-first con HTML, CSS e JavaScript.',
      'Prototipi per l’esplorazione di annunci e le transizioni verso le richieste.',
      'Organizzazione di stati e azioni dell’interfaccia per una progressiva validazione del prodotto.'
    ],
    verification: 'Il progetto è in fase pilota. Le prove su annunci e percorsi non equivalgono a una garanzia di copertura del mercato o all’attivazione generale di invii e servizi commerciali.',
    learning: 'La CTA funziona meglio quando segue una dimostrazione di valore: l’interfaccia deve permettere una prima scoperta utile, non limitarsi a chiedere dati.',
    stack: ['JavaScript', 'HTML / CSS', 'UX prototyping', 'Product thinking']
  },
  {
    slug: 'yoartly',
    title: 'YoArtly',
    descriptor: 'Identità creativa, componenti Astro e percorsi editoriali per bambini e famiglie.',
    category: 'Brand experience / Front-end',
    status: 'Progetto editoriale in evoluzione',
    year: '2026',
    intro: 'Un progetto creativo e narrativo che mette in relazione identità visiva, contenuti per bambini e famiglie e sito editoriale. L’obiettivo è far riconoscere il brand e orientare la scoperta dei contenuti.',
    role: 'Direzione dell’identità visiva, progettazione UX/UI e sviluppo delle pagine front-end con attenzione alla coerenza fra brand e interfaccia.',
    problem: 'Trasferire un universo grafico espressivo sul web senza perdere leggibilità, navigazione prevedibile e chiarezza fra contenuti editoriali e azioni legate ai prodotti.',
    approach: [
      'Traduzione di logo, colori e linguaggio illustrativo in regole visive ripetibili.',
      'Separazione dei percorsi fra presentazione del brand, contenuti e prodotti.',
      'Microcopy e stati di disponibilità coerenti con la fase di sviluppo del progetto.'
    ],
    implementation: [
      'Astro, CSS responsive e componenti di pagina riutilizzabili.',
      'Layout e gerarchie tipografiche progettati per schermi piccoli.',
      'Preparazione e verifica in ambiente di prova dei passaggi collegati all’acquisto.'
    ],
    verification: 'La presenza del sito non implica che tutte le funzionalità commerciali siano già attive. Le verifiche dei percorsi di acquisto in prova non vengono descritte come transazioni reali.',
    learning: 'Un’identità visiva forte ha bisogno di regole: riconoscibilità e libertà espressiva funzionano meglio con una struttura dei contenuti stabile.',
    stack: ['Astro', 'CSS', 'Design system', 'Responsive UI', 'Brand design'],
    demoUrl: 'https://yoartlyplay.com/',
    demoLabel: 'Visita il progetto'
  }
];

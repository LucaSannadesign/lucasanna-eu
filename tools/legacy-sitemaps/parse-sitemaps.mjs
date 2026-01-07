#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sitemapsDir = __dirname;
const projectRoot = join(__dirname, '../..');

// Leggi tutti i file XML nella directory
const sitemapFiles = [
	'page-sitemap.xml',
	'ohio_portfolio-sitemap.xml',
	'ohio_portfolio_category-sitemap.xml',
	'ohio_portfolio_tags-sitemap.xml'
];

// Estrai tutti gli URL dai file XML
function extractUrls() {
	const allUrls = new Set();
	
	for (const file of sitemapFiles) {
		const filePath = join(sitemapsDir, file);
		try {
			const content = readFileSync(filePath, 'utf-8');
			// Regex robusta per estrarre contenuti tra <loc>...</loc>
			const urlMatches = content.matchAll(/<loc>(.*?)<\/loc>/gi);
			for (const match of urlMatches) {
				const url = match[1].trim();
				if (url) {
					allUrls.add(url);
				}
			}
		} catch (error) {
			console.error(`Errore leggendo ${file}:`, error.message);
		}
	}
	
	return Array.from(allUrls).sort();
}

// Classifica un URL secondo le regole specificate
function classifyUrl(url) {
	const urlObj = new URL(url);
	const path = urlObj.pathname.toLowerCase();
	
	// A) COMMERCIALE
	const commercialKeywords = [
		'servizi',
		'preventivi',
		'creazione-siti',
		'realizzazione-siti',
		'ecommerce',
		'grafica',
		'seo',
		'siti-web'
	];
	
	if (commercialKeywords.some(keyword => path.includes(keyword))) {
		let destination = 'https://www.lswebagency.com/';
		if (path.includes('preventivi')) {
			destination = 'https://www.lswebagency.com/contatti';
		}
		return {
			category: 'COMMERCIALE',
			action: 'REDIRECT',
			destination
		};
	}
	
	// C) PORTFOLIO
	if (path.includes('ohio_portfolio') || 
		path.includes('/portfolio/') || 
		path.includes('/portfolio-') || 
		path.includes('/project/')) {
		return {
			category: 'PORTFOLIO',
			action: 'REVIEW',
			destination: 'TODO'
		};
	}
	
	// D) PERSONA
	const personaKeywords = ['chi-sono', 'about', 'bio'];
	if (personaKeywords.some(keyword => path.includes(keyword))) {
		return {
			category: 'PERSONA',
			action: 'KEEP',
			destination: '/metodo/', // o / se esiste pagina about
			note: 'REVIEW - verificare se esiste pagina equivalente'
		};
	}
	
	// B) UTILITY
	const utilityKeywords = ['privacy-policy', 'cookie-policy', 'terms'];
	if (utilityKeywords.some(keyword => path.includes(keyword))) {
		return {
			category: 'UTILITY',
			action: 'KEEP',
			destination: path // same url
		};
	}
	
	// Home
	if (path === '/' || path === '') {
		return {
			category: 'PERSONA',
			action: 'KEEP',
			destination: '/'
		};
	}
	
	// E) ALTRO
	return {
		category: 'ALTRO',
		action: 'REVIEW',
		destination: null
	};
}

// Genera path relativo da URL completo
function getRelativePath(url) {
	try {
		const urlObj = new URL(url);
		return urlObj.pathname;
	} catch {
		return url;
	}
}

// Normalizza path per vercel.json (rimuove trailing slash se presente, ma lo gestiamo con entrambe le varianti)
function normalizePath(path) {
	return path.replace(/\/$/, '');
}

// Main
const urls = extractUrls();
console.log(`📋 Trovati ${urls.length} URL unici\n`);

const classified = urls.map(url => {
	const classification = classifyUrl(url);
	const path = getRelativePath(url);
	return {
		url,
		path,
		...classification
	};
});

// Statistiche
const stats = {
	total: classified.length,
	COMMERCIALE: classified.filter(c => c.category === 'COMMERCIALE').length,
	PORTFOLIO: classified.filter(c => c.category === 'PORTFOLIO').length,
	PERSONA: classified.filter(c => c.category === 'PERSONA').length,
	UTILITY: classified.filter(c => c.category === 'UTILITY').length,
	ALTRO: classified.filter(c => c.category === 'ALTRO').length
};

// Genera JSON
const jsonOutput = {
	stats,
	urls: classified
};
writeFileSync(
	join(sitemapsDir, 'legacy-urls.json'),
	JSON.stringify(jsonOutput, null, 2),
	'utf-8'
);

// Genera CSV
const csvHeader = 'old_url,path,category,action,destination\n';
const csvRows = classified.map(c => {
	const url = c.url.replace(/,/g, '%2C');
	const path = c.path.replace(/,/g, '%2C');
	const dest = (c.destination || '').replace(/,/g, '%2C');
	return `${url},${path},${c.category},${c.action},${dest}`;
}).join('\n');
writeFileSync(
	join(sitemapsDir, 'legacy-urls.csv'),
	csvHeader + csvRows,
	'utf-8'
);

// Genera Report Markdown
const commercialUrls = classified.filter(c => c.category === 'COMMERCIALE');
const portfolioUrls = classified.filter(c => c.category === 'PORTFOLIO');
const personaUrls = classified.filter(c => c.category === 'PERSONA');
const utilityUrls = classified.filter(c => c.category === 'UTILITY');
const altroUrls = classified.filter(c => c.category === 'ALTRO');

const report = `# Report Legacy URLs

## Statistiche

- **Totale URL**: ${stats.total}
- **COMMERCIALE**: ${stats.COMMERCIALE}
- **PORTFOLIO**: ${stats.PORTFOLIO}
- **PERSONA**: ${stats.PERSONA}
- **UTILITY**: ${stats.UTILITY}
- **ALTRO**: ${stats.ALTRO}

## A) URL Commerciali (da reindirizzare a LS Web Agency)

${commercialUrls.length > 0 
	? commercialUrls.map(c => `- \`${c.path}\` → ${c.destination}`).join('\n')
	: '- Nessun URL commerciale trovato'}

## B) URL Utility (da mantenere/ricreare in Astro)

${utilityUrls.length > 0 
	? utilityUrls.map(c => `- \`${c.path}\` → ${c.destination}`).join('\n')
	: '- Nessun URL utility trovato'}

## C) URL Portfolio (da revisionare - mapping verso /case-studies/)

${portfolioUrls.length > 0 
	? portfolioUrls.slice(0, 20).map(c => `- \`${c.path}\` → ${c.destination || 'TODO'}`).join('\n') + 
		(portfolioUrls.length > 20 ? `\n... e altri ${portfolioUrls.length - 20} URL portfolio` : '')
	: '- Nessun URL portfolio trovato'}

## D) URL Persona (da mantenere/ricreare)

${personaUrls.length > 0 
	? personaUrls.map(c => `- \`${c.path}\` → ${c.destination}${c.note ? ` (${c.note})` : ''}`).join('\n')
	: '- Nessun URL persona trovato'}

## E) URL Altri (da revisionare)

${altroUrls.length > 0 
	? altroUrls.map(c => `- \`${c.path}\` → ${c.destination || 'GONE (404/410)'}`).join('\n')
	: '- Nessun URL altro trovato'}

## Note

- **COMMERCIALI**: Tutti gli URL commerciali devono essere reindirizzati con 301 verso lswebagency.com (vedi vercel.json)
- **PORTFOLIO**: Richiedono mappatura manuale degli slug verso /case-studies/[slug] - NON creare redirect automatici
- **PERSONA**: Verificare se esistono pagine equivalenti in Astro, altrimenti ricreare
- **UTILITY**: Ricreare pagine in Astro mantenendo stesso path
- **ALTRO**: Valutare caso per caso, probabilmente 404/410

`;
writeFileSync(
	join(sitemapsDir, 'report.md'),
	report,
	'utf-8'
);

// Genera redirects per vercel.json (solo COMMERCIALI)
const redirects = [];
const processedPaths = new Set();

commercialUrls.forEach(item => {
	const path = normalizePath(item.path);
	// Aggiungi sia con che senza trailing slash per copertura completa
	if (!processedPaths.has(path)) {
		redirects.push({
			source: path,
			destination: item.destination,
			permanent: true
		});
		// Aggiungi anche con trailing slash se il path originale non è root
		if (path !== '' && path !== '/') {
			redirects.push({
				source: path + '/',
				destination: item.destination,
				permanent: true
			});
		}
		processedPaths.add(path);
	}
});

// Leggi vercel.json esistente e mantieni solo redirect non commerciali esistenti
// (es. redirect persona, wildcard, ecc.)
let vercelConfig = { redirects: [] };
try {
	const vercelJsonPath = join(projectRoot, 'vercel.json');
	const existingContent = readFileSync(vercelJsonPath, 'utf-8');
	const existingConfig = JSON.parse(existingContent);
	// Mantieni solo redirect esistenti che NON sono commerciali (wildcard, persona, portfolio già mappati)
	const existingNonCommercial = (existingConfig.redirects || []).filter(r => {
		// Mantieni wildcard e redirect interni (persona/portfolio già mappati)
		return r.source.includes(':slug*') || 
		       r.destination.startsWith('/') ||
		       r.destination.includes('/case-studies/');
	});
	vercelConfig.redirects = [...existingNonCommercial, ...redirects];
} catch (error) {
	// Se non esiste, crea nuovo
	vercelConfig.redirects = redirects;
}

// Scrivi vercel.json
const vercelJsonPath = join(projectRoot, 'vercel.json');
writeFileSync(
	vercelJsonPath,
	JSON.stringify(vercelConfig, null, '\t'),
	'utf-8'
);

console.log('✅ File generati:');
console.log(`  - ${join(sitemapsDir, 'legacy-urls.json')}`);
console.log(`  - ${join(sitemapsDir, 'legacy-urls.csv')}`);
console.log(`  - ${join(sitemapsDir, 'report.md')}`);
console.log(`  - ${vercelJsonPath}`);
console.log('\n📊 Statistiche:');
console.log(JSON.stringify(stats, null, 2));
console.log(`\n🔀 Redirect generati per vercel.json: ${redirects.length} (${commercialUrls.length} URL commerciali)`);

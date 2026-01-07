#!/usr/bin/env node
/**
 * Script per iniettare campo cover nei case studies se manca
 * Logica: slug match -> alias map -> fallback wp-portfolio-images.json
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

const caseStudiesDir = join(rootDir, 'src/content/case-studies');
const imagesDir = join(rootDir, 'public/images/case-studies');
const outputDir = join(__dirname);

// Alias map per matching immagini
const aliasMap = {
	'bandevenflow': 'even-flow-band-web-site',
	'abacos-womens-clothing': 'abacos-womens-clothing-ecommerce',
	'estrella-yoruba-tarot': 'soluzioni-digitali-intuitive-per-la-chiaroveggenza-estrella-yoruba-tarot',
	'psicologa-sassari': 'patrizia-sabbadin-counselor-sassari',
	'valeria-chelo': 'valeriachelo-psicologa-sassari',
	'marcella-masia': 'marcella-masia-artista'
};

// Estensioni supportate
const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];

function findImageFile(slug) {
	// a) Cerca file con stesso slug
	for (const ext of imageExts) {
		const filePath = join(imagesDir, `${slug}${ext}`);
		if (existsSync(filePath)) {
			return `/images/case-studies/${slug}${ext}`;
		}
	}
	
	// b) Prova alias map
	const alias = aliasMap[slug];
	if (alias) {
		for (const ext of imageExts) {
			const filePath = join(imagesDir, `${alias}${ext}`);
			if (existsSync(filePath)) {
				return `/images/case-studies/${alias}${ext}`;
			}
		}
	}
	
	// c) Fallback: cerca in wp-portfolio-images.json
	try {
		const wpImagesPath = join(outputDir, 'wp-portfolio-images.json');
		if (existsSync(wpImagesPath)) {
			const wpImages = JSON.parse(readFileSync(wpImagesPath, 'utf-8'));
			const match = wpImages.find(item => {
				const itemSlug = item.slug || '';
				return itemSlug === slug || itemSlug.includes(slug) || slug.includes(itemSlug);
			});
			if (match && match.outFile) {
				// Converti da /public/images/... a /images/...
				const path = match.outFile.replace(/^\/public/, '');
				if (existsSync(join(rootDir, 'public', path.replace(/^\//, '')))) {
					return path;
				}
			}
		}
	} catch (error) {
		console.warn(`Errore lettura wp-portfolio-images.json: ${error.message}`);
	}
	
	return null;
}

function extractFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: content };
	
	const frontmatterText = match[1];
	const body = match[2];
	const frontmatter = {};
	
	// Simple YAML parsing
	for (const line of frontmatterText.split('\n')) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) continue;
		const key = line.slice(0, colonIndex).trim();
		let value = line.slice(colonIndex + 1).trim();
		
		// Remove quotes
		if ((value.startsWith('"') && value.endsWith('"')) || 
		    (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		
		// Handle arrays
		if (value.startsWith('[') && value.endsWith(']')) {
			value = value.slice(1, -1)
				.split(',')
				.map(v => v.trim().replace(/^["']|["']$/g, ''));
		}
		
		// Handle booleans
		if (value === 'true') value = true;
		else if (value === 'false') value = false;
		// Handle numbers
		else if (/^\d+$/.test(value)) value = parseInt(value, 10);
		
		frontmatter[key] = value;
	}
	
	return { frontmatter, body };
}

function upsertFrontmatter(md, key, value) {
	if (!md.startsWith('---')) {
		return `---\n${key}: ${JSON.stringify(value)}\n---\n\n${md}`;
	}
	
	const end = md.indexOf('\n---', 3);
	if (end === -1) return md;
	
	const fm = md.slice(0, end + 4);
	const body = md.slice(end + 4);
	
	const re = new RegExp(`^${key}:.*$`, 'm');
	if (re.test(fm)) {
		// Già presente, non modificare
		return md;
	}
	
	// Aggiungi prima della chiusura ---
	return fm.replace(/\n---\s*$/, `\n${key}: ${JSON.stringify(value)}\n---\n`) + body;
}

const report = {
	processed: [],
	skipped: [],
	added: [],
	notFound: []
};

const files = readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'));

for (const file of files) {
	const slug = file.replace(/\.md$/, '');
	const filePath = join(caseStudiesDir, file);
	const content = readFileSync(filePath, 'utf-8');
	const { frontmatter } = extractFrontmatter(content);
	
	report.processed.push({ slug, file });
	
	// Se cover già presente, skip
	if (frontmatter.cover) {
		report.skipped.push({ slug, file, reason: 'cover already present' });
		continue;
	}
	
	// Cerca immagine
	const coverPath = findImageFile(slug);
	
	if (coverPath) {
		const updated = upsertFrontmatter(content, 'cover', coverPath);
		writeFileSync(filePath, updated, 'utf-8');
		report.added.push({ slug, file, cover: coverPath });
		console.log(`✓ ${file} -> ${coverPath}`);
	} else {
		report.notFound.push({ slug, file });
		console.warn(`⚠ ${file} -> nessuna immagine trovata`);
	}
}

// Scrivi report
writeFileSync(
	join(outputDir, 'inject-covers.report.json'),
	JSON.stringify(report, null, 2),
	'utf-8'
);

console.log(`\n📊 Report:`);
console.log(`  Processati: ${report.processed.length}`);
console.log(`  Aggiunti: ${report.added.length}`);
console.log(`  Saltati (già presente): ${report.skipped.length}`);
console.log(`  Non trovati: ${report.notFound.length}`);

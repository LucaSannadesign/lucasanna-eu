#!/usr/bin/env node
/**
 * Script per sincronizzare immagini case studies da WordPress
 * TASK 1-6: Inventario, matching, download immagini, aggiornamento case studies
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const caseStudiesDir = join(rootDir, 'src/content/case-studies');
const outputDir = join(__dirname);
const imagesDir = join(rootDir, 'public/images/case-studies');

// Utility functions
function normalizeSlug(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeTitle(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function tokenOverlap(str1, str2) {
	const tokens1 = new Set(str1.split(/\s+/).filter(t => t.length > 2));
	const tokens2 = new Set(str2.split(/\s+/).filter(t => t.length > 2));
	const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
	const union = new Set([...tokens1, ...tokens2]);
	return union.size > 0 ? intersection.size / union.size : 0;
}

function extractFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: content };
	
	const frontmatterText = match[1];
	const body = match[2];
	const frontmatter = {};
	
	// Simple YAML parsing for our use case
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

// TASK 1: Inventario case studies locali
function getLocalCaseStudies() {
	const caseStudies = [];
	
	// Read all markdown files in the directory
	const files = readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'));
	
	for (const file of files) {
		const slug = basename(file, '.md');
		const filePath = join(caseStudiesDir, file);
		
		const content = readFileSync(filePath, 'utf-8');
		const { frontmatter } = extractFrontmatter(content);
		
		caseStudies.push({
			slug,
			title: frontmatter.title || '',
			cover: frontmatter.cover || null,
			client: frontmatter.client || '',
			year: frontmatter.year || null
		});
	}
	
	return caseStudies;
}

// TASK 2: Scarica e parsare sitemap WordPress
async function getWPPortfolioUrls() {
	const sitemapUrl = 'https://www.lucasanna.eu/ohio_portfolio-sitemap.xml';
	
	try {
		const response = await fetch(sitemapUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; CaseStudySync/1.0)'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const xml = await response.text();
		const urls = [];
		
		// Parse XML sitemap - extract <loc> tags
		const locMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
		for (const match of locMatches) {
			const url = match[1].trim();
			if (url && url.includes('/portfolio/')) {
				urls.push(url);
			}
		}
		
		return urls;
	} catch (error) {
		console.error(`Errore nel download sitemap: ${error.message}`);
		return [];
	}
}

// TASK 3: Matching locale -> WP
async function fetchWPTitle(url) {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; CaseStudySync/1.0)'
			}
		});
		
		if (!response.ok) return null;
		
		const html = await response.text();
		
		// Extract title from <title> tag
		const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
		if (titleMatch) {
			return titleMatch[1].trim();
		}
		
		// Try h1
		const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
		if (h1Match) {
			return h1Match[1].trim();
		}
		
		return null;
	} catch (error) {
		console.error(`Errore fetch ${url}: ${error.message}`);
		return null;
	}
}

async function matchCaseStudies(localStudies, wpUrls) {
	const mapping = {};
	const unmatched = [];
	
	// Manual mapping for known matches
	const manualMapping = {
		'abacos-womens-clothing': 'abacos-womens-clothing-ecommerce',
		'bandevenflow': 'even-flow-band-web-site',
		'estrella-yoruba-tarot': 'soluzioni-digitali-intuitive-per-la-chiaroveggenza-estrella-yoruba-tarot',
		'marcella-masia': 'marcella-masia-artista',
		'valeria-chelo': 'valeriachelo-psicologa-sassari',
		'asd-sandalyon-sassari': 'asd-sandalyon-sassari',
		'noi-e-dessy': 'noi-e-dessy',
		'noi-e-biasi': 'noi-e-biasi'
	};
	
	// Apply manual mappings first
	for (const local of localStudies) {
		const manualSlug = manualMapping[local.slug];
		if (manualSlug) {
			// Try to find URL that contains the manual slug
			const wpUrl = wpUrls.find(url => {
				const urlLower = url.toLowerCase();
				const slugLower = manualSlug.toLowerCase();
				return urlLower.includes(slugLower);
			});
			if (wpUrl) {
				mapping[local.slug] = {
					wpUrl,
					matchType: 'manual',
					confidence: 1.0
				};
			}
		}
	}
	
	for (const local of localStudies) {
		// Skip if already matched manually
		if (mapping[local.slug]) continue;
		let bestMatch = null;
		let bestScore = 0;
		let matchType = null;
		
		// Try slug match first
		const normalizedSlug = normalizeSlug(local.slug);
		
		for (const wpUrl of wpUrls) {
			const urlSlug = normalizeSlug(wpUrl.split('/').pop() || '');
			
			// Exact match
			if (urlSlug === normalizedSlug) {
				bestMatch = wpUrl;
				bestScore = 1.0;
				matchType = 'slug';
				break;
			}
			
			// Partial match: local slug contained in WP slug or vice versa
			if (urlSlug && normalizedSlug) {
				if (urlSlug.includes(normalizedSlug) || normalizedSlug.includes(urlSlug)) {
					// Calculate overlap score
					const commonWords = normalizedSlug.split('-').filter(w => urlSlug.includes(w));
					const score = commonWords.length / Math.max(normalizedSlug.split('-').length, urlSlug.split('-').length);
					if (score > bestScore && score >= 0.5) {
						bestMatch = wpUrl;
						bestScore = score;
						matchType = 'slug';
					}
				}
			}
		}
		
		// If slug match not good enough, try title match
		if (bestScore < 0.7) {
			const normalizedTitle = normalizeTitle(local.title);
			
			for (const wpUrl of wpUrls) {
				if (wpUrl === bestMatch) continue; // Already checked
				
				const wpTitle = await fetchWPTitle(wpUrl);
				if (!wpTitle) continue;
				
				const normalizedWPTitle = normalizeTitle(wpTitle);
				const similarity = tokenOverlap(normalizedTitle, normalizedWPTitle);
				
				if (similarity > 0.5 && similarity > bestScore) {
					bestMatch = wpUrl;
					bestScore = similarity;
					matchType = 'title';
				}
			}
		}
		
		if (bestMatch && bestScore >= 0.5) {
			mapping[local.slug] = {
				wpUrl: bestMatch,
				matchType,
				confidence: bestScore
			};
		} else {
			unmatched.push({
				slug: local.slug,
				title: local.title
			});
		}
	}
	
	return { mapping, unmatched };
}

// TASK 4: Estrazione immagine principale
function extractImageFromHTML(html, baseUrl) {
	// Priority 1: og:image
	let match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
	if (match) {
		return new URL(match[1], baseUrl).href;
	}
	
	// Priority 2: twitter:image
	match = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
	if (match) {
		return new URL(match[1], baseUrl).href;
	}
	
	// Priority 3: wp-post-image or featured image classes
	match = html.match(/<img[^>]*class=["'][^"']*wp-post-image[^"']*["'][^>]*src=["']([^"']+)["']/i);
	if (match) {
		return new URL(match[1], baseUrl).href;
	}
	
	// Priority 4: First significant image in content
	match = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
	if (match) {
		const imgUrl = match[1];
		// Skip very small images (likely icons)
		if (!imgUrl.includes('icon') && !imgUrl.includes('logo') && !imgUrl.match(/\d+x\d+\.(png|jpg|jpeg)$/i)) {
			return new URL(imgUrl, baseUrl).href;
		}
	}
	
	return null;
}

async function downloadImage(imageUrl, outputPath) {
	try {
		const response = await fetch(imageUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; CaseStudySync/1.0)'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		
		const buffer = await response.arrayBuffer();
		writeFileSync(outputPath, Buffer.from(buffer));
		
		return true;
	} catch (error) {
		console.error(`Errore download ${imageUrl}: ${error.message}`);
		return false;
	}
}

async function extractAndDownloadImages(mapping) {
	const report = [];
	
	// Ensure images directory exists
	if (!existsSync(imagesDir)) {
		mkdirSync(imagesDir, { recursive: true });
	}
	
	for (const [slug, match] of Object.entries(mapping)) {
		try {
			const response = await fetch(match.wpUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; CaseStudySync/1.0)'
				}
			});
			
			if (!response.ok) {
				report.push({
					slug,
					wpUrl: match.wpUrl,
					status: 'error',
					error: `HTTP ${response.status}`
				});
				continue;
			}
			
			const html = await response.text();
			const imageUrl = extractImageFromHTML(html, match.wpUrl);
			
			if (!imageUrl) {
				report.push({
					slug,
					wpUrl: match.wpUrl,
					status: 'no_image',
					note: 'Nessuna immagine trovata'
				});
				continue;
			}
			
			// Determine extension
			const urlExt = extname(new URL(imageUrl).pathname) || '.jpg';
			const ext = urlExt.toLowerCase();
			const outputPath = join(imagesDir, `${slug}${ext}`);
			
			// Try to get scaled version if available
			let finalImageUrl = imageUrl;
			if (imageUrl.includes('-scaled.')) {
				finalImageUrl = imageUrl;
			} else if (imageUrl.match(/-\d+x\d+\.(jpg|jpeg|png)$/i)) {
				// Already dimensioned, use as is
				finalImageUrl = imageUrl;
			} else {
				// Try to find scaled version
				const baseUrl = imageUrl.replace(/\.[^.]+$/, '');
				const scaledUrl = `${baseUrl}-scaled${ext}`;
				// We'll try the original first, scaled if original fails
				finalImageUrl = imageUrl;
			}
			
			const success = await downloadImage(finalImageUrl, outputPath);
			
			if (success) {
				const stats = statSync(outputPath);
				if (stats.size === 0) {
					report.push({
						slug,
						wpUrl: match.wpUrl,
						imageUrl: finalImageUrl,
						status: 'error',
						error: 'File scaricato vuoto'
					});
				} else {
					report.push({
						slug,
						wpUrl: match.wpUrl,
						imageUrl: finalImageUrl,
						file: `/images/case-studies/${slug}${ext}`,
						status: 'success',
						size: stats.size
					});
				}
			} else {
				report.push({
					slug,
					wpUrl: match.wpUrl,
					imageUrl: finalImageUrl,
					status: 'error',
					error: 'Download fallito'
				});
			}
		} catch (error) {
			report.push({
				slug,
				wpUrl: match.wpUrl,
				status: 'error',
				error: error.message
			});
		}
	}
	
	return report;
}

// TASK 5: Aggiorna case studies con immagini
function updateCaseStudyWithImage(slug, imagePath) {
	const filePath = join(caseStudiesDir, `${slug}.md`);
	if (!existsSync(filePath)) {
		console.warn(`File non trovato: ${filePath}`);
		return false;
	}
	
	const content = readFileSync(filePath, 'utf-8');
	const { frontmatter, body } = extractFrontmatter(content);
	
	// Update cover field
	frontmatter.cover = imagePath;
	
	// Rebuild frontmatter
	const frontmatterLines = [];
	for (const [key, value] of Object.entries(frontmatter)) {
		if (Array.isArray(value)) {
			frontmatterLines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
		} else if (typeof value === 'string') {
			frontmatterLines.push(`${key}: "${value}"`);
		} else if (typeof value === 'boolean') {
			frontmatterLines.push(`${key}: ${value}`);
		} else if (typeof value === 'number') {
			frontmatterLines.push(`${key}: ${value}`);
		} else {
			frontmatterLines.push(`${key}: "${String(value)}"`);
		}
	}
	
	const newContent = `---\n${frontmatterLines.join('\n')}\n---\n\n${body}`;
	writeFileSync(filePath, newContent, 'utf-8');
	
	return true;
}

// Main execution
async function main() {
	console.log('🚀 Inizio sincronizzazione case studies...\n');
	
	// TASK 1
	console.log('📋 TASK 1: Inventario case studies locali...');
	const localStudies = getLocalCaseStudies();
	writeFileSync(
		join(outputDir, 'local-case-studies.json'),
		JSON.stringify(localStudies, null, 2),
		'utf-8'
	);
	console.log(`   ✓ Trovati ${localStudies.length} case studies locali\n`);
	
	// TASK 2
	console.log('🌐 TASK 2: Download sitemap WordPress...');
	const wpUrls = await getWPPortfolioUrls();
	writeFileSync(
		join(outputDir, 'wp-portfolio-urls.json'),
		JSON.stringify(wpUrls, null, 2),
		'utf-8'
	);
	console.log(`   ✓ Trovati ${wpUrls.length} URL portfolio WordPress\n`);
	
	// TASK 3
	console.log('🔗 TASK 3: Matching locale -> WP...');
	const { mapping, unmatched } = await matchCaseStudies(localStudies, wpUrls);
	writeFileSync(
		join(outputDir, 'mapping.json'),
		JSON.stringify(mapping, null, 2),
		'utf-8'
	);
	writeFileSync(
		join(outputDir, 'unmatched.json'),
		JSON.stringify(unmatched, null, 2),
		'utf-8'
	);
	console.log(`   ✓ Matchati ${Object.keys(mapping).length} case studies`);
	console.log(`   ⚠ Non matchati: ${unmatched.length}\n`);
	
	// TASK 4
	console.log('🖼️  TASK 4: Estrazione e download immagini...');
	const report = await extractAndDownloadImages(mapping);
	
	// Generate report
	const reportMarkdown = `# Report Download Immagini Case Studies

Generato: ${new Date().toISOString()}

## Riepilogo
- Case studies processati: ${report.length}
- Successo: ${report.filter(r => r.status === 'success').length}
- Errori: ${report.filter(r => r.status === 'error').length}
- Nessuna immagine: ${report.filter(r => r.status === 'no_image').length}

## Dettagli

${report.map(r => {
	const lines = [
		`### ${r.slug}`,
		`- **WP URL**: ${r.wpUrl}`,
		r.imageUrl ? `- **Image URL**: ${r.imageUrl}` : '',
		r.file ? `- **File salvato**: ${r.file}` : '',
		r.size ? `- **Dimensione**: ${r.size} bytes` : '',
		`- **Status**: ${r.status}`,
		r.error ? `- **Errore**: ${r.error}` : '',
		r.note ? `- **Note**: ${r.note}` : ''
	].filter(Boolean).join('\n');
	return lines;
}).join('\n\n')}
`;
	
	writeFileSync(
		join(outputDir, 'assets-report.md'),
		reportMarkdown,
		'utf-8'
	);
	console.log(`   ✓ Report generato\n`);
	
	// TASK 5
	console.log('📝 TASK 5: Aggiornamento case studies con immagini...');
	let updated = 0;
	for (const item of report) {
		if (item.status === 'success' && item.file) {
			if (updateCaseStudyWithImage(item.slug, item.file)) {
				updated++;
			}
		}
	}
	console.log(`   ✓ Aggiornati ${updated} case studies\n`);
	
	console.log('✅ Sincronizzazione completata!');
	console.log(`\n📁 File generati in: ${outputDir}`);
}

main().catch(error => {
	console.error('❌ Errore:', error);
	process.exit(1);
});


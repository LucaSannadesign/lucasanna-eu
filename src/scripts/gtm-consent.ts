/**
 * Google Tag Manager - Consent-gated loader
 * Carica GTM solo dopo consenso analytics=true
 */

const STORAGE_KEY = 'cookie_consent_v1';
const GTM_ID = 'GTM-TL3R3CWW';
let gtmLoaded = false;

function loadGTM() {
	if (gtmLoaded) return;
	
	// Inizializza dataLayer
	window.dataLayer = window.dataLayer || [];
	
	// Snippet GTM
	(function(w: any, d: Document, s: string, l: string, i: string) {
		w[l] = w[l] || [];
		w[l].push({
			'gtm.start': new Date().getTime(),
			event: 'gtm.js'
		});
		const f = d.getElementsByTagName(s)[0];
		const j = d.createElement(s) as HTMLScriptElement;
		const dl = l != 'dataLayer' ? '&l=' + l : '';
		j.async = true;
		j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
		if (f && f.parentNode) {
			f.parentNode.insertBefore(j, f);
		}
	})(window, document, 'script', 'dataLayer', GTM_ID);

	// Noscript iframe
	const noscriptContainer = document.getElementById('gtm-noscript');
	if (noscriptContainer && !noscriptContainer.querySelector('iframe')) {
		const iframe = document.createElement('iframe');
		iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
		iframe.height = '0';
		iframe.width = '0';
		iframe.style.display = 'none';
		iframe.style.visibility = 'hidden';
		noscriptContainer.appendChild(iframe);
	}

	gtmLoaded = true;
}

function checkConsent() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return false;

		const consent = JSON.parse(stored);
		return consent.analytics === true;
	} catch {
		return false;
	}
}

// Carica GTM se consenso già presente
if (checkConsent()) {
	loadGTM();
}

// Ascolta evento consenso
window.addEventListener('cookie:consent', ((e: CustomEvent) => {
	if (e.detail.analytics === true) {
		loadGTM();
	}
}) as EventListener);


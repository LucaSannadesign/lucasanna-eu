/**
 * Motion utilities for header auto-hide and scroll reveal
 * Lightweight, accessible, no dependencies
 */

let lastScrollY = 0;
let ticking = false;
const SCROLL_THRESHOLD = 20;
const SCROLL_DELTA_THRESHOLD = 10;
const SCROLLED_STATE_THRESHOLD = 24;

/**
 * Initialize header auto-hide on scroll
 */
export function initHeaderAutoHide(): void {
	const header = document.getElementById('header');
	if (!header) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function updateHeader(): void {
		if (!header) return;

		const currentScrollY = window.scrollY;
		const scrollDelta = currentScrollY - lastScrollY;
		const menuOpen = document.documentElement.dataset.menuOpen === 'true';

		// Update "scrolled" visual state (border/shadow) regardless of motion settings
		if (currentScrollY > SCROLLED_STATE_THRESHOLD) {
			header.setAttribute('data-header-state', 'scrolled');
		} else {
			header.setAttribute('data-header-state', 'transparent');
		}

		// If menu is open, keep header visible and do not auto-hide
		if (menuOpen) {
			header.classList.remove('is-hidden');
			lastScrollY = currentScrollY;
			ticking = false;
			return;
		}

		// Reduced motion: keep header visible (but keep scrolled state above)
		if (prefersReducedMotion) {
			header.classList.remove('is-hidden');
			lastScrollY = currentScrollY;
			ticking = false;
			return;
		}

		// Always show header near top
		if (currentScrollY < SCROLL_THRESHOLD) {
			header.classList.remove('is-hidden');
			lastScrollY = currentScrollY;
			ticking = false;
			return;
		}

		// Only update if delta is significant (avoid flicker)
		if (Math.abs(scrollDelta) < SCROLL_DELTA_THRESHOLD) {
			ticking = false;
			return;
		}

		// Hide on scroll down, show on scroll up
		if (scrollDelta > 0) {
			// Scrolling down
			header.classList.add('is-hidden');
		} else {
			// Scrolling up
			header.classList.remove('is-hidden');
		}

		lastScrollY = currentScrollY;
		ticking = false;
	}

	function onScroll(): void {
		if (!ticking) {
			window.requestAnimationFrame(updateHeader);
			ticking = true;
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	// Initial state
	updateHeader();
}

/**
 * Initialize scroll reveal animations
 */
export function initReveal(): void {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) {
		// Show all elements immediately
		document.querySelectorAll('.reveal').forEach((el) => {
			el.classList.add('is-visible');
		});
		return;
	}

	const observerOptions: IntersectionObserverInit = {
		rootMargin: '0px 0px -10% 0px',
		threshold: 0.1,
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				// Unobserve after revealing (once)
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe all reveal elements
	document.querySelectorAll('.reveal').forEach((el) => {
		observer.observe(el);
	});

	// Handle stagger delays for grid items
	document.querySelectorAll('.stagger > .reveal').forEach((el, index) => {
		const delay = Math.min(index * 40, 120); // Max 120ms delay
		(el as HTMLElement).style.transitionDelay = `${delay}ms`;
	});
}


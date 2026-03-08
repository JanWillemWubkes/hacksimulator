/**
 * FAQ Accordion functionality
 * Handles expand/collapse of FAQ items on all pages (landing, contact, terminal)
 * Uses exclusive accordion pattern: only one item open at a time
 */

(function() {
  'use strict';

  function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (!faqQuestions.length) return;

    faqQuestions.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        const faqItem = this.closest('.faq-item');
        const isOpen = faqItem.classList.contains('open');

        // Close all other open items first
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== faqItem) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        faqItem.classList.toggle('open');

        // Update aria-expanded attribute
        this.setAttribute('aria-expanded', !isOpen);

        // Remove focus to prevent mobile keyboard from opening
        this.blur();
      });
    });
  }

  /**
   * Scroll Hint — fade out when education section becomes visible.
   * Uses IntersectionObserver (no scroll listeners, no performance cost).
   */
  function initScrollHint() {
    const hint = document.querySelector('.scroll-hint');
    const education = document.querySelector('.terminal-education');

    if (!hint || !education) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        hint.classList.add('hidden');
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(education);
  }

  // Run immediately since defer already waits for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFaqAccordion();
      initScrollHint();
    });
  } else {
    initFaqAccordion();
    initScrollHint();
  }
})();

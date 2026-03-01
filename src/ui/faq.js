/**
 * FAQ Accordion functionality
 * Handles expand/collapse of FAQ items on landing and terminal pages
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
      });
    });
  }

  function initTerminalFaqAccordion() {
    const faqContainer = document.querySelector('.terminal-edu-faq');
    if (!faqContainer) return;

    const detailsElements = faqContainer.querySelectorAll('details');

    detailsElements.forEach(details => {
      details.addEventListener('toggle', function() {
        if (!this.open) return;

        detailsElements.forEach(other => {
          if (other !== details && other.open) {
            other.removeAttribute('open');
          }
        });
      });
    });
  }

  // Run immediately since defer already waits for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFaqAccordion();
      initTerminalFaqAccordion();
    });
  } else {
    initFaqAccordion();
    initTerminalFaqAccordion();
  }
})();

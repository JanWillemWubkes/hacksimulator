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
   * Edu Scroll Animations — fade+slide+blur entrance for education cards.
   * Same IntersectionObserver pattern as landing-demo.js:initScrollAnimations().
   */
  function initEduScrollAnimations() {
    const selectors = [
      '.edu-command-card',
      '.edu-step',
      '.terminal-edu-faq .faq-item',
      '.terminal-edu-blog-links a'
    ];
    const elements = document.querySelectorAll(selectors.join(', '));
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
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
      initEduScrollAnimations();
    });
  } else {
    initFaqAccordion();
    initScrollHint();
    initEduScrollAnimations();
  }
})();

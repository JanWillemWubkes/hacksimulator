/**
 * Blog Theme Toggle
 * Lightweight theme management for blog pages
 * CSP-compliant external module (no inline scripts)
 * Syncs with main app via localStorage.theme
 */

class BlogTheme {
  constructor() {
    this.html = document.documentElement;
    this.themeToggle = document.querySelector('.theme-toggle');
    this.progressBar = document.querySelector('.reading-progress');
  }

  init() {
    // Load theme from localStorage (default: dark)
    this.loadTheme();

    // Setup theme toggle listener
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Setup reading progress bar (article pages only)
    if (this.progressBar) {
      this.initProgressBar();
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  applyTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    this.updateToggleUI(theme);
  }

  updateToggleUI(theme) {
    document.querySelectorAll('.toggle-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme);
    });
  }

  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  initProgressBar() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      this.progressBar.style.width = scrolled + '%';
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BlogTheme().init();
  });
} else {
  new BlogTheme().init();
}

export default BlogTheme;

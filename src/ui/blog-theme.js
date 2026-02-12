/**
 * BlogReadingProgress - Reading progress bar for blog posts
 *
 * Theme toggle is handled by navbar.js via init-components.js.
 * This file only manages the reading progress indicator.
 */
class BlogReadingProgress {
  constructor() {
    this.progressBar = document.querySelector('.reading-progress');
  }

  init() {
    if (this.progressBar) {
      this.initProgressBar();
    }
  }

  initProgressBar() {
    window.addEventListener('scroll', () => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      this.progressBar.style.width = progress + '%';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BlogReadingProgress().init();
  });
} else {
  new BlogReadingProgress().init();
}

export default BlogReadingProgress;

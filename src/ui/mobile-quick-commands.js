// Mobile Quick Commands - Sessie 101
// Tappable command buttons below terminal input on mobile devices
// Pattern: IIFE to avoid global scope pollution (architecture-patterns.md)
(function() {
    'use strict';

    var container = document.getElementById('mobile-quick-commands');
    if (!container) return;

    container.addEventListener('click', function(e) {
        var btn = e.target.closest('.quick-cmd-btn');
        if (!btn) return;

        // Modal protection pattern (architecture-patterns.md #2)
        if (document.querySelector('.modal.active')) return;

        var command = btn.dataset.command;
        var input = document.getElementById('terminal-input');
        if (!input) return;

        // Set input value using native setter (works with all frameworks)
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        ).set;
        nativeInputValueSetter.call(input, command);
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Simulate Enter keypress to execute command
        input.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
        }));

        // Keep focus on input for next interaction
        input.focus();
    });
})();

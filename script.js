/**
 * CSS Handbook - Interactive Learning Platform
 * Features: Theme toggle, search, collapsible sections, progress tracking,
 * keyboard shortcuts, responsive design, and interactive code editor
 */

class CSSHandbook {
    constructor() {
        this.currentTheme = 'light';
        this.searchData = [];
        this.readingProgress = this.loadReadingProgress();
        this.isSearchOpen = false;
        this.isSidebarOpen = window.innerWidth > 768;

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupSearch();
        this.setupSidebar();
        this.setupCollapsibleSections();
        this.setupProgressTracking();
        this.setupKeyboardShortcuts();
        this.setupInteractiveEditor();
        this.setupChallengeEditor();
        this.setupModule2Editor();
        this.setupModule3Editor();
        this.setupScrollAnimations();
        this.setupResponsiveHandlers();
        this.indexContent();

        // Initialize components
        this.updateProgressBar();
        this.highlightCurrentSection();

        console.log('CSS Handbook initialized successfully!');
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('css-handbook-theme') || 'light';

        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(this.currentTheme);
            localStorage.setItem('css-handbook-theme', this.currentTheme);
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `${theme}-theme`;

        // Update syntax highlighting theme
        const prismTheme = document.querySelector('link[href*="prism"]');
        if (prismTheme) {
            if (theme === 'dark') {
                prismTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
            } else {
                prismTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
            }
        }
    }

    // Search Functionality
    setupSearch() {
        const searchToggle = document.getElementById('search-toggle');
        const searchModal = document.getElementById('search-modal');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        searchToggle.addEventListener('click', () => this.openSearch());

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                this.closeSearch();
            }
        });

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Close search on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchOpen) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        const searchModal = document.getElementById('search-modal');
        const searchInput = document.getElementById('search-input');

        this.isSearchOpen = true;
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    }

    closeSearch() {
        const searchModal = document.getElementById('search-modal');
        const searchInput = document.getElementById('search-input');

        this.isSearchOpen = false;
        searchModal.classList.remove('active');
        searchInput.value = '';
        document.getElementById('search-results').innerHTML = '';
    }

    performSearch(query) {
        const searchResults = document.getElementById('search-results');

        if (!query.trim()) {
            searchResults.innerHTML = '';
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result"><p>No results found</p></div>';
            return;
        }

        searchResults.innerHTML = results.map(result => `
            <div class="search-result" onclick="app.navigateToSection('${result.id}')">
                <h4>${result.title}</h4>
                <p>${result.content.substring(0, 100)}...</p>
            </div>
        `).join('');
    }

    navigateToSection(sectionId) {
        this.closeSearch();

        const section = document.getElementById(sectionId);
        if (section) {
            // Open the collapsible section if it's closed
            const collapsibleSection = section.closest('.collapsible-section');
            if (collapsibleSection) {
                this.toggleSection(collapsibleSection);
            }

            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth' });

            // Update reading progress
            this.updateReadingProgress(sectionId);
        }
    }

    // Sidebar Management
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        mobileMenuToggle.addEventListener('click', () => this.toggleSidebar());

        // Setup navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);

                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    this.toggleSidebar(false);
                }
            });
        });
    }

    toggleSidebar(force = null) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (force !== null) {
            this.isSidebarOpen = force;
        } else {
            this.isSidebarOpen = !this.isSidebarOpen;
        }

        if (this.isSidebarOpen) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('active');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('active');
            mainContent.classList.add('expanded');
        }
    }

    // Collapsible Sections
    setupCollapsibleSections() {
        const sectionHeaders = document.querySelectorAll('.section-header');

        sectionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.collapsible-section');
                this.toggleSection(section);
            });
        });

        // Open first section by default
        const firstSection = document.querySelector('.collapsible-section');
        if (firstSection) {
            this.toggleSection(firstSection, true);
        }
    }

    toggleSection(section, forceOpen = false) {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');

        if (forceOpen || !content.classList.contains('active')) {
            header.classList.add('active');
            content.classList.add('active');
            content.style.display = 'block';
        } else {
            header.classList.remove('active');
            content.classList.remove('active');
            content.style.display = 'none';
        }
    }

    // Progress Tracking
    setupProgressTracking() {
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.highlightCurrentSection();
        });
    }

    updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    highlightCurrentSection() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });

            this.updateReadingProgress(currentSection);
        }
    }

    updateReadingProgress(sectionId) {
        if (!this.readingProgress.includes(sectionId)) {
            this.readingProgress.push(sectionId);
            this.saveReadingProgress();
        }
    }

    loadReadingProgress() {
        const saved = localStorage.getItem('css-handbook-progress');
        return saved ? JSON.parse(saved) : [];
    }

    saveReadingProgress() {
        localStorage.setItem('css-handbook-progress', JSON.stringify(this.readingProgress));
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K: Open search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }

            // Ctrl+B: Toggle sidebar
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.toggleSidebar();
            }

            // Ctrl+D: Toggle theme
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.getElementById('theme-toggle').click();
            }

            // ?: Show shortcuts help
            if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                this.toggleShortcutsHelp();
            }
        });
    }

    toggleShortcutsHelp() {
        const shortcutsHelp = document.getElementById('shortcuts-help');
        shortcutsHelp.classList.toggle('show');

        // Hide after 3 seconds
        if (shortcutsHelp.classList.contains('show')) {
            setTimeout(() => {
                shortcutsHelp.classList.remove('show');
            }, 3000);
        }
    }

    // Interactive Editor
    setupInteractiveEditor() {
        const cssEditor = document.getElementById('css-editor');
        const preview = document.querySelector('.editor-preview');

        if (cssEditor && preview) {
            cssEditor.addEventListener('input', (e) => {
                this.updatePreview(e.target.value, preview);
            });

            // Initial preview
            this.updatePreview(cssEditor.value, preview);
        }

        // Color editor
        const colorEditor = document.getElementById('color-editor');
        const colorPreview = colorEditor?.closest('.interactive-editor')?.querySelector('.editor-preview');

        if (colorEditor && colorPreview) {
            colorEditor.addEventListener('input', (e) => {
                this.updatePreview(e.target.value, colorPreview);
            });
            this.updatePreview(colorEditor.value, colorPreview);
        }

        // Calc editor
        const calcEditor = document.getElementById('calc-editor');
        const calcPreview = calcEditor?.closest('.interactive-editor')?.querySelector('.editor-preview');

        if (calcEditor && calcPreview) {
            calcEditor.addEventListener('input', (e) => {
                this.updatePreview(e.target.value, calcPreview);
            });
            this.updatePreview(calcEditor.value, calcPreview);
        }

        // Module 2 selector editor
        const selectorEditor = document.getElementById('selector-editor');
        const selectorPreview = selectorEditor?.closest('.interactive-editor')?.querySelector('.editor-preview');

        if (selectorEditor && selectorPreview) {
            selectorEditor.addEventListener('input', (e) => {
                this.updatePreview(e.target.value, selectorPreview);
            });
            this.updatePreview(selectorEditor.value, selectorPreview);
        }
    }

    updatePreview(css, preview) {
        // Create a style element
        let styleElement = preview.querySelector('style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            preview.appendChild(styleElement);
        }

        styleElement.textContent = css;
    }

    // Challenge Editor
    setupChallengeEditor() {
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-challenge-editor');
        const resultFrame = document.getElementById('result-frame');

        if (htmlEditor && cssEditor && resultFrame) {
            // Initial code execution
            this.runChallengeCode();
        }
    }

    runCode() {
        this.runChallengeCode();
    }

    runChallengeCode() {
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-challenge-editor');
        const resultFrame = document.getElementById('result-frame');

        if (!htmlEditor || !cssEditor || !resultFrame) return;

        const html = htmlEditor.value;
        const css = cssEditor.value;

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        resultFrame.srcdoc = fullHTML;
    }

    // Module 2 Editor
    setupModule2Editor() {
        const htmlEditor = document.getElementById('module2-html-editor');
        const cssEditor = document.getElementById('module2-css-editor');
        const resultFrame = document.getElementById('module2-result-frame');

        if (htmlEditor && cssEditor && resultFrame) {
            // Add event listeners for real-time updates
            htmlEditor.addEventListener('input', () => this.runModule2Code());
            cssEditor.addEventListener('input', () => this.runModule2Code());

            this.runModule2Code();
        }
    }

    runModule2Code() {
        const htmlEditor = document.getElementById('module2-html-editor');
        const cssEditor = document.getElementById('module2-css-editor');
        const resultFrame = document.getElementById('module2-result-frame');

        if (!htmlEditor || !cssEditor || !resultFrame) return;

        const html = htmlEditor.value;
        const css = cssEditor.value;

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        resultFrame.srcdoc = fullHTML;
    }

    // Module 3 Editor
    setupModule3Editor() {
        const htmlEditor = document.getElementById('module3-html-editor');
        const cssEditor = document.getElementById('module3-css-editor');
        const resultFrame = document.getElementById('module3-result-frame');

        if (htmlEditor && cssEditor && resultFrame) {
            // Add event listeners for real-time updates
            htmlEditor.addEventListener('input', () => this.runModule3Code());
            cssEditor.addEventListener('input', () => this.runModule3Code());

            this.runModule3Code();
        }
    }

    runModule3Code() {
        const htmlEditor = document.getElementById('module3-html-editor');
        const cssEditor = document.getElementById('module3-css-editor');
        const resultFrame = document.getElementById('module3-result-frame');

        if (!htmlEditor || !cssEditor || !resultFrame) return;

        const html = htmlEditor.value;
        const css = cssEditor.value;

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        resultFrame.srcdoc = fullHTML;
    }

    // Tab Management
    showTab(tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-button');

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'result') {
            this.runChallengeCode();
        }
    }

    showModule2Tab(tabName) {
        const tabs = document.querySelectorAll('#module2 .tab-content');
        const buttons = document.querySelectorAll('#module2 .tab-button');

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        document.getElementById(`module2-${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'result') {
            this.runModule2Code();
        }
    }

    showModule3Tab(tabName) {
        const tabs = document.querySelectorAll('#module3 .tab-content');
        const buttons = document.querySelectorAll('#module3 .tab-button');

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        document.getElementById(`module3-${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'result') {
            this.runModule3Code();
        }
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }

    // Responsive Handlers
    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && !this.isSidebarOpen) {
                this.toggleSidebar(true);
            } else if (window.innerWidth <= 768 && this.isSidebarOpen) {
                this.toggleSidebar(false);
            }
        });
    }

    // Content Indexing for Search
    indexContent() {
        const sections = document.querySelectorAll('.content-section, .collapsible-section');

        sections.forEach(section => {
            const header = section.querySelector('h1, h2, .section-header');
            const content = section.textContent;

            if (header && content) {
                this.searchData.push({
                    id: section.id || header.id,
                    title: header.textContent.trim(),
                    content: content.trim()
                });
            }
        });
    }
}

// Quiz functionality
function checkQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const results = document.getElementById('quiz-results');

    let score = 0;
    const total = 2;

    if (q1 && q1.value === 'b') score++;
    if (q2 && q2.value === 'b') score++;

    const percentage = (score / total) * 100;

    results.innerHTML = `
        <h4>Results: ${score}/${total} (${percentage}%)</h4>
        <p>Correct answers:</p>
        <ul>
            <li>1. Cascading Style Sheets</li>
            <li>2. Better maintainability and reusability</li>
        </ul>
    `;

    results.className = `quiz-results ${percentage >= 70 ? 'correct' : 'incorrect'}`;
}

// Module 2 Quiz
function checkModule2Quiz() {
    const q1 = document.querySelector('input[name="q2_1"]:checked');
    const q2 = document.querySelector('input[name="q2_2"]:checked');
    const results = document.getElementById('module2-quiz-results');

    let score = 0;
    const total = 2;

    if (q1 && q1.value === 'b') score++;
    if (q2 && q2.value === 'b') score++;

    const percentage = (score / total) * 100;

    results.innerHTML = `
        <h4>Results: ${score}/${total} (${percentage}%)</h4>
        <p>Correct answers:</p>
        <ul>
            <li>1. IDs are unique, classes can be reused</li>
            <li>2. div p selects all p inside div, div > p only direct children</li>
        </ul>
    `;

    results.className = `quiz-results ${percentage >= 70 ? 'correct' : 'incorrect'}`;
}

// Module 3 Quiz
function checkModule3Quiz() {
    const q1 = document.querySelector('input[name="q3_1"]:checked');
    const q2 = document.querySelector('input[name="q3_2"]:checked');
    const results = document.getElementById('module3-quiz-results');

    let score = 0;
    const total = 2;

    if (q1 && q1.value === 'a') score++;
    if (q2 && q2.value === 'b') score++;

    const percentage = (score / total) * 100;

    results.innerHTML = `
        <h4>Results: ${score}/${total} (${percentage}%)</h4>
        <p>Correct answers:</p>
        <ul>
            <li>1. em is relative to parent, rem to root element</li>
            <li>2. rgba() doesn't affect child elements</li>
        </ul>
    `;

    results.className = `quiz-results ${percentage >= 70 ? 'correct' : 'incorrect'}`;
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CSSHandbook();

    // Make functions globally available
    window.checkQuiz = checkQuiz;
    window.checkModule2Quiz = checkModule2Quiz;
    window.checkModule3Quiz = checkModule3Quiz;
    window.showTab = (tabName) => app.showTab(tabName);
    window.showModule2Tab = (tabName) => app.showModule2Tab(tabName);
    window.showModule3Tab = (tabName) => app.showModule3Tab(tabName);
    window.runCode = () => app.runCode();
    window.runModule2Code = () => app.runModule2Code();
    window.runModule3Code = () => app.runModule3Code();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

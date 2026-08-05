/**
 * Main JavaScript for Md Khalid's Portfolio
 * Features: Scroll reveal animations, typed hero subtitle, sticky header,
 * mobile drawer toggle, active menu indicator, smooth scroll, and back to top button.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initTypingEffect();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
});

/* ==========================================================================
   1. Header Scroll & Active Link Indicator
   ========================================================================== */
function initHeader() {
    const header = document.querySelector('.header-nav');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.meno a');

    window.addEventListener('scroll', () => {
        // Toggle scrolled class for navbar backdrop glass effect
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Highlight active nav link on scroll
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.meno');
    const navLinks = document.querySelectorAll('.meno a, .meno button');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    });
}

/* ==========================================================================
   3. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. Typing Animation Effect for Hero Subtitle
   ========================================================================== */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
        'Frontend Web Developer',
        'UI/UX Design Enthusiast',
        'React & Node.js Specialist',
        'Passionate Code Creator'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   5. Smooth Scroll Navigation
   ========================================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   6. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   7. Contact Form Handling & Toast Notification
   ========================================================================== */
function initContactForm() {
    const contactForm = document.querySelector('.form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = contactForm.querySelector('input[type="text"]:nth-of-type(1)');
        const emailInput = contactForm.querySelector('input[type="email"], input[type="text"]:nth-of-type(2)');
        const messageInput = contactForm.querySelector('textarea');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            showToast('Please fill out all fields in the contact form.', 'warning');
            return;
        }

        // Simulate form submission success
        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
    });
}

function showToast(message, type = 'info') {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        document.body.appendChild(toast);
    }

    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

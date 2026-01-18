// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon based on current theme
    updateThemeToggleIcon(savedTheme);
}

function updateThemeToggleIcon(theme) {
    if (theme === 'dark') {
        themeToggle.querySelector('.sun-icon').style.display = 'inline';
        themeToggle.querySelector('.moon-icon').style.display = 'none';
    } else {
        themeToggle.querySelector('.sun-icon').style.display = 'none';
        themeToggle.querySelector('.moon-icon').style.display = 'inline';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle icon
    updateThemeToggleIcon(newTheme);
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.2;
    const followerSpeed = 0.1;
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    followerX += (mouseX - followerX) * followerSpeed;
    followerY += (mouseY - followerY) * followerSpeed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Navigation Hide/Show on Scroll
let lastScrollTop = 0;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const layers = document.querySelectorAll('.parallax-layer');
    
    layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.3;
        layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Hero Text Animation
document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const subtitle = document.querySelector('.hero-subtitle');
    
    words.forEach(word => {
        const delay = parseFloat(word.getAttribute('data-delay')) * 1000;
        setTimeout(() => {
            word.style.animationDelay = '0s';
            word.style.opacity = '0';
            word.style.animation = 'wordReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        }, delay);
    });
});

// Particle Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const floatX = (Math.random() - 0.5) * 200;
        const floatY = -Math.random() * 300 - 100;
        const delay = Math.random() * 10;
        const duration = 15 + Math.random() * 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.setProperty('--float-x', floatX + 'px');
        particle.style.setProperty('--float-y', floatY + 'px');
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.classList.contains('impact-card')) {
                animateCounter(entry.target);
            }
            
            if (entry.target.classList.contains('plant-stage')) {
                entry.target.style.animation = `growPlant 2s ease forwards`;
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.reveal-text, .reveal-line, .skill-card, .project-card, .impact-card, .plant-stage').forEach(el => {
    observer.observe(el);
});

// Counter Animation
function animateCounter(card) {
    const numberElement = card.querySelector('.impact-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    const target = parseInt(numberElement.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    numberElement.dataset.animated = 'true';
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            numberElement.textContent = target;
            clearInterval(timer);
        } else {
            numberElement.textContent = Math.floor(current);
        }
    }, 16);
}

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const username = 'Manvanth-Gowda-M';
    const projectsGrid = document.getElementById('projectsGrid');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        projectsGrid.innerHTML = '';
        
        repos.forEach((repo, index) => {
            const projectCard = createProjectCard(repo, index);
            projectsGrid.appendChild(projectCard);
            
            setTimeout(() => {
                observer.observe(projectCard);
            }, 100);
        });
        
        // Initialize Framer Motion animations after projects are loaded
        setTimeout(initFramerMotion, 200);
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = `
            <div class="project-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-secondary);">Projects are being cultivated. Visit <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-green);">GitHub</a> to explore.</p>
            </div>
        `;
    }
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card animate-on-scroll';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    const description = repo.description || 'A project cultivated with care and attention to detail.';
    const language = repo.language || 'Code';
    
    const emojis = ['🌱', '🌿', '🌾', '🌳', '🍃', '🌻'];
    const emoji = emojis[index % emojis.length];
    
    // Add Framer Motion attributes for animation
    card.setAttribute('data-framer-motion', 'true');
    card.setAttribute('data-framer-initial', 'hidden');
    card.setAttribute('data-framer-animate', 'visible');
    card.setAttribute('data-framer-variants', JSON.stringify({
        hidden: { opacity: 0, y: 20, scale: 0.95, rotate: -2 },
        visible: { opacity: 1, y: 0, scale: 1, rotate: 0 },
        hover: {
            y: -8,
            scale: 1.02,
            boxShadow: '0 12px 24px rgba(44, 62, 46, 0.15)',
            transition: {
                duration: 0.4,
                ease: [0.175, 0.885, 0.32, 1.275]
            }
        }
    }));
    card.setAttribute('data-framer-transition', JSON.stringify({
        duration: 0.6,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: index * 0.1
    }));

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        if (typeof window.framerMotion !== 'undefined') {
            window.framerMotion.animate(card, 'hover');
        }
    });

    card.addEventListener('mouseleave', () => {
        if (typeof window.framerMotion !== 'undefined') {
            window.framerMotion.animate(card, 'visible');
        }
    });

    card.innerHTML = `
        <div class="project-image">${emoji}</div>
        <div class="project-content">
            <h3 class="project-title">${repo.name}</h3>
            <p class="project-description">${description}</p>
            <div class="project-tags">
                ${language ? `<span class="project-tag">${language}</span>` : ''}
                ${repo.stargazers_count > 0 ? `<span class="project-tag">⭐ ${repo.stargazers_count}</span>` : ''}
                ${repo.forks_count > 0 ? `<span class="project-tag">🍴 ${repo.forks_count}</span>` : ''}
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                <span>View Project</span>
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>
    `;
    
    return card;
}

// Initialize Framer Motion for project cards
function initFramerMotion() {
    // Check if Framer Motion is loaded
    if (typeof window.framerMotion !== 'undefined') {
        // Auto-animate all elements with framer motion attributes
        document.querySelectorAll('[data-framer-motion]').forEach(element => {
            try {
                const initial = element.getAttribute('data-framer-initial');
                const animate = element.getAttribute('data-framer-animate');
                const variants = JSON.parse(element.getAttribute('data-framer-variants'));
                const transition = JSON.parse(element.getAttribute('data-framer-transition'));
                
                // Apply Framer Motion animation
                window.framerMotion.animate(element, animate, {
                    initial: initial,
                    variants: variants,
                    transition: transition
                });
                
                // Set initial state
                Object.assign(element.style, {
                    opacity: 0,
                    transform: 'translateY(20px) scale(0.95) rotate(-2deg)',
                    transition: 'none'
                });
                
                // Trigger animation after a small delay
                setTimeout(() => {
                    Object.assign(element.style, {
                        opacity: 1,
                        transform: 'translateY(0) scale(1) rotate(0)',
                        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    });
                }, 100);
                
            } catch (error) {
                console.error('Error initializing Framer Motion:', error);
            }
        });
    } else {
        console.warn('Framer Motion not loaded, falling back to CSS animations');
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Plant Growth Animation Trigger
const growthAnimation = document.querySelector('.growth-animation');
if (growthAnimation) {
    const growthObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stages = entry.target.querySelectorAll('.plant-stage');
                stages.forEach((stage, index) => {
                    setTimeout(() => {
                        stage.style.opacity = '1';
                        stage.style.animation = `growPlant 2s ease forwards`;
                    }, index * 500);
                });
                growthObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    growthObserver.observe(growthAnimation);
}

// Magnetic Button Effect
const buttons = document.querySelectorAll('.cta-button, .social-link');

buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// Skill Card Rotation Effect
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Add revealing line animation on scroll
const revealLines = document.querySelectorAll('.reveal-line');
const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, { threshold: 0.5 });

revealLines.forEach(line => lineObserver.observe(line));

// Initialize
initTheme();
fetchGitHubProjects();

// Add animation classes after page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Throttle scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScrollAnimations();
            ticking = false;
        });
        ticking = true;
    }
});

function updateScrollAnimations() {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-percentage', scrollPercentage);
}

// Easter egg: Konami code for special animation
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        celebrateGrowth();
    }
});

function celebrateGrowth() {
    const colors = ['#4A7C59', '#7D5E3F', '#D4A574', '#A8C5D1'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = '-20px';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.borderRadius = '50%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10001';
            particle.style.animation = 'fall 3s ease-out forwards';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 50);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(${window.innerHeight + 50}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add smooth reveal for sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    sectionObserver.observe(section);
});

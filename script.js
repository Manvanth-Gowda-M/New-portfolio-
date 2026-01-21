document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Custom Cursor (Desktop only)
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if (dot && outline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            dot.style.opacity = '1';
            outline.style.opacity = '1';
            
            dot.style.transform = `translate(${posX}px, ${posY}px)`;
            
            // Outline follows with a slight delay
            outline.animate({
                transform: `translate(${posX - 16}px, ${posY - 16}px)`
            }, { duration: 500, fill: 'forwards' });
        });
        
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            outline.style.opacity = '0';
        });

        // Hover effects
        const links = document.querySelectorAll('a, button, .project-card, .skill-card');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                outline.style.transform = 'scale(1.5)';
                outline.style.borderColor = 'var(--accent)';
                outline.style.backgroundColor = 'var(--accent-glow)';
            });
            link.addEventListener('mouseleave', () => {
                outline.style.transform = 'scale(1)';
                outline.style.borderColor = 'var(--accent)';
                outline.style.backgroundColor = 'transparent';
            });
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Navbar Scroll Effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // GitHub Projects Fetching with Error Handling
    async function fetchProjects() {
        const repoFullNames = [
            'NextGenXplorer/NutriGuideFLU',
            'Manvanth-Gowda-M/SmartResource1',
            'NextGenXplorer/Kannadakey',
            'Manvanth-Gowda-M/Prompt-enhancer',
            'Manvanth-Gowda-M/FusionbotX-',
            'Manvanth-Gowda-M/Reshme_Info_collegeproj'
        ];
        const grid = document.getElementById('projectsGrid');
        
        try {
            const repoPromises = repoFullNames.map(name => 
                fetch(`https://api.github.com/repos/${name}`).then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch ${name}`);
                    return res.json();
                })
            );
            
            const repos = await Promise.all(repoPromises);
            
            grid.innerHTML = ''; // Clear loader
            
            repos.forEach((repo, index) => {
                const card = createProjectCard(repo, index);
                grid.appendChild(card);
                
                // Add "motion" effect (tilt)
                addMotionEffect(card);
            });

            // Apply beautiful Framer Motion-style animations using Motion One
            animateProjectCards();
        } catch (error) {
            console.error('Error fetching projects:', error);
            createFallbackProjects(grid);
        }
    }

    function addMotionEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update CSS variables for shine effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            if (window.innerWidth < 768) return; // Skip tilt on mobile
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    }

    function createProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.cursor = 'pointer';
        card.dataset.index = index;
        
        const description = repo.description || 'Modern software solution built with engineering excellence.';
        const language = repo.language || 'Code';
        
        card.innerHTML = `
            <div class="project-header">
                <div class="project-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" class="project-link-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    </a>
                    ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo" class="project-link-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 22 3 22 10"></polyline><line x1="10" y1="14" x2="22" y2="2"></line></svg>
                    </a>` : ''}
                </div>
            </div>
            <div class="project-body">
                <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                <p class="project-description">${description}</p>
            </div>
            <div class="project-footer">
                <span class="project-tag">${language}</span>
                ${repo.stargazers_count > 0 ? `<span class="project-tag">⭐ ${repo.stargazers_count}</span>` : ''}
            </div>
        `;
        
        // Add click handler to make entire card clickable
        card.addEventListener('click', (e) => {
            // Don't redirect if clicking on the link icons
            if (!e.target.closest('.project-link-icon')) {
                window.open(repo.html_url, '_blank', 'noopener,noreferrer');
            }
        });
        
        return card;
    }

    function createFallbackProjects(grid) {
        const fallbackProjects = [
            {
                name: 'NutriGuideFLU',
                description: 'A comprehensive nutrition guide application built with Flutter.',
                language: 'Flutter',
                html_url: 'https://github.com/NextGenXplorer/NutriGuideFLU',
                homepage: ''
            },
            {
                name: 'SmartResource1',
                description: 'Intelligent resource management system for optimized performance.',
                language: 'Python',
                html_url: 'https://github.com/Manvanth-Gowda-M/SmartResource1',
                homepage: ''
            },
            {
                name: 'Kannadakey',
                description: 'Specialized keyboard and input solution for Kannada language.',
                language: 'Java',
                html_url: 'https://github.com/NextGenXplorer/Kannadakey',
                homepage: ''
            },
            {
                name: 'Prompt-enhancer',
                description: 'AI-driven tool to refine and optimize prompts for better LLM results.',
                language: 'JavaScript',
                html_url: 'https://github.com/Manvanth-Gowda-M/Prompt-enhancer',
                homepage: ''
            },
            {
                name: 'FusionbotX-',
                description: 'Advanced multi-functional bot for seamless automation.',
                language: 'Python',
                html_url: 'https://github.com/Manvanth-Gowda-M/FusionbotX-',
                homepage: ''
            },
            {
                name: 'Reshme_Info_collegeproj',
                description: 'Educational college project providing detailed silk industry information.',
                language: 'PHP',
                html_url: 'https://github.com/Manvanth-Gowda-M/Reshme_Info_collegeproj',
                homepage: ''
            }
        ];

        grid.innerHTML = '';
        
        fallbackProjects.forEach((project, index) => {
            const card = createProjectCard(project, index);
            grid.appendChild(card);
            addMotionEffect(card);
        });

        // Apply animations after fallback projects are loaded
        animateProjectCards();
    }

    // Beautiful Framer Motion-style animations using Motion One
    function animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        if (!cards.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Respect user's preference - show cards immediately without animation
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'none';
            });
            return;
        }

        // Check if Motion library is loaded
        if (typeof Motion === 'undefined') {
            console.warn('Motion library not loaded, using fallback animation');
            // Fallback: simple opacity animation
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            return;
        }

        const isMobile = window.innerWidth < 768;

        // Set initial state for all cards
        cards.forEach(card => {
            card.style.opacity = '0';
            // Simpler animation for mobile performance
            if (isMobile) {
                card.style.transform = 'translateY(40px) scale(0.95)';
            } else {
                card.style.transform = 'translateY(80px) scale(0.9) rotateX(10deg)';
            }
        });

        // Use Motion One's stagger API for beautiful sequential animations
        Motion.animate(
            '.project-card',
            {
                opacity: [0, 1],
                transform: isMobile 
                    ? [
                        'translateY(40px) scale(0.95)',
                        'translateY(0px) scale(1)'
                    ]
                    : [
                        'translateY(80px) scale(0.9) rotateX(10deg)',
                        'translateY(0px) scale(1) rotateX(0deg)'
                    ],
                filter: isMobile ? undefined : ['blur(10px)', 'blur(0px)']
            },
            {
                duration: isMobile ? 0.6 : 0.8,
                delay: Motion.stagger(0.12, { start: 0.2 }),
                easing: [0.22, 0.61, 0.36, 1] // Custom cubic-bezier for smooth motion
            }
        );

        // Animate individual card elements with stagger (only on desktop for performance)
        if (!isMobile) {
            cards.forEach((card, cardIndex) => {
                const icon = card.querySelector('.project-icon');
                const title = card.querySelector('.project-title');
                const description = card.querySelector('.project-description');
                const footer = card.querySelector('.project-footer');
                
                // Animate card internals with additional stagger
                const cardDelay = 0.2 + (cardIndex * 0.12);
                
                if (icon) {
                    Motion.animate(
                        icon,
                        {
                            scale: [0.5, 1.1, 1],
                            rotate: [0, 10, 0],
                            opacity: [0, 1]
                        },
                        {
                            duration: 0.6,
                            delay: cardDelay + 0.1,
                            easing: [0.34, 1.56, 0.64, 1] // Spring-like easing
                        }
                    );
                }
                
                if (title) {
                    Motion.animate(
                        title,
                        {
                            opacity: [0, 1],
                            x: [-20, 0]
                        },
                        {
                            duration: 0.5,
                            delay: cardDelay + 0.2,
                            easing: 'ease-out'
                        }
                    );
                }
                
                if (description) {
                    Motion.animate(
                        description,
                        {
                            opacity: [0, 1],
                            y: [10, 0]
                        },
                        {
                            duration: 0.5,
                            delay: cardDelay + 0.3,
                            easing: 'ease-out'
                        }
                    );
                }
                
                if (footer) {
                    const tags = footer.querySelectorAll('.project-tag');
                    if (tags.length > 0) {
                        Motion.animate(
                            tags,
                            {
                                opacity: [0, 1],
                                scale: [0.8, 1],
                                y: [10, 0]
                            },
                            {
                                duration: 0.4,
                                delay: Motion.stagger(0.08, { start: cardDelay + 0.4 }),
                                easing: 'ease-out'
                            }
                        );
                    }
                }
            });
        }

        // Add scroll-triggered animations for cards that might be below fold
        const scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.style.opacity === '0') {
                        const index = parseInt(entry.target.dataset.index || 0);
                        
                        Motion.animate(
                            entry.target,
                            {
                                opacity: [0, 1],
                                transform: [
                                    'translateY(60px) scale(0.95)',
                                    'translateY(0px) scale(1)'
                                ]
                            },
                            {
                                duration: 0.7,
                                delay: index * 0.1,
                                easing: [0.22, 0.61, 0.36, 1]
                            }
                        );
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        cards.forEach(card => scrollObserver.observe(card));
    }

    fetchProjects();

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Performance: Parallax for Hero
    const mesh = document.querySelector('.mesh-gradient');
    if (mesh) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            mesh.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // Form Submission (Enhanced)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            // Show sending state
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#4ade80';
                btn.style.color = '#000';
                showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1000);
        });
    }

    function showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            ${type === 'success' 
                ? 'background-color: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3);'
                : 'background-color: rgba(248, 113, 113, 0.1); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3);'
            }
        `;
        
        const form = document.querySelector('.contact-form');
        form.appendChild(message);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
});

/* ==========================================================================
   ENVIT ENVIRONMENTAL CONSULTING AGENCY - CUSTOM JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Central Theme Mode & LTR/RTL Layout Persistent Setup
    const themeBtns = document.querySelectorAll('#theme-toggle-btn, .mobile-theme-btn');
    const rtlBtns = document.querySelectorAll('#rtl-toggle-btn, .mobile-rtl-btn');

    // Retrieve previous preferences from local storage
    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentDir = localStorage.getItem('dir') || 'ltr';

    // Apply saved layout direction
    document.documentElement.setAttribute('dir', currentDir);
    updateRtlButtonIcons(currentDir);

    // Apply saved color theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-sun"></i>');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-moon"></i>');
    }

    // Toggle color theme
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeBtns.forEach(b => b.innerHTML = '<i class="fas fa-moon"></i>');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeBtns.forEach(b => b.innerHTML = '<i class="fas fa-sun"></i>');
            }
        });
    });

    // Toggle layout direction (LTR/RTL)
    rtlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            const newDir = isRtl ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlButtonIcons(newDir);
        });
    });

    function updateRtlButtonIcons(direction) {
        rtlBtns.forEach(btn => {
            if (direction === 'rtl') {
                btn.style.color = 'var(--color-secondary)';
                btn.title = 'Switch to LTR';
            } else {
                btn.style.color = '';
                btn.title = 'Switch to RTL';
            }
        });
    }

    // 2. Sticky Navigation & Scroll Fade-In Animations
    const header = document.querySelector('header');
    const faders = document.querySelectorAll('.fade-in');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Fade-in scroll animations
    const fadeOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    faders.forEach(fader => {
        fadeObserver.observe(fader);
    });

    // 3. Mobile Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            // Lock/unlock page scroll
            document.body.classList.toggle('nav-open', isOpen);
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.removeAttribute('style'));
            });
        });
    }

    // 4. Tab Filter for Sector Expertise (Homepage)
    const sectorTabs = document.querySelectorAll('.sector-tab');
    const sectorContents = document.querySelectorAll('.sector-tab-content');

    if (sectorTabs.length && sectorContents.length) {
        sectorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                
                sectorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                sectorContents.forEach(content => {
                    if (content.id === target) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // 5. Why Choose Us Statistics Counters
    const counters = document.querySelectorAll('.stat-number');
    const speed = 100;

    const startCounters = () => {
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-target');
                const text = counter.innerText;
                const current = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                const suffix = text.replace(/[0-9]/g, '');

                const increment = value / speed;

                if (current < value) {
                    const nextValue = Math.ceil(current + increment);
                    counter.innerText = (nextValue > value ? value : nextValue) + suffix;
                    setTimeout(animate, 20);
                } else {
                    counter.innerText = value + suffix;
                }
            };
            animate();
        });
    };

    if (counters.length) {
        const statsSection = document.querySelector('.why-grid') || document.querySelector('.stats-grid');
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    // 6. Testimonial Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const track = document.querySelector('.testimonial-track');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (slides.length && track && dotsContainer) {
        let currentIndex = 0;

        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        const goToSlide = (index) => {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        // Auto slide
        let slideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, 6000);

        const carousel = document.querySelector('.testimonial-carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }, 6000);
        });
    }

    // 7. Accordions (FAQ / Services)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = item.querySelector('.accordion-content');
                const isActive = item.classList.contains('active');

                const parent = item.parentElement;
                parent.querySelectorAll('.accordion-item').forEach(sibling => {
                    sibling.classList.remove('active');
                    sibling.querySelector('.accordion-content').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // 8. Projects Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = 'fadeIn 0.4s ease forwards';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 9. Form File Upload
    const fileInput = document.querySelector('input[type="file"]');
    const uploadWrapper = document.querySelector('.form-file-upload');
    const uploadText = document.querySelector('.upload-text');

    if (fileInput && uploadWrapper && uploadText) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                uploadText.innerText = `Selected file: ${fileName}`;
                uploadWrapper.style.borderColor = 'var(--color-primary)';
                uploadWrapper.style.backgroundColor = 'var(--bg-secondary)';
            } else {
                uploadText.innerText = 'Drag & drop your files here or click to browse';
                uploadWrapper.style.borderColor = '';
                uploadWrapper.style.backgroundColor = '';
            }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadWrapper.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadWrapper.style.borderColor = 'var(--color-primary)';
                uploadWrapper.style.backgroundColor = 'var(--bg-secondary)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadWrapper.addEventListener(eventName, (e) => {
                e.preventDefault();
                if (!fileInput.files.length) {
                    uploadWrapper.style.borderColor = '';
                    uploadWrapper.style.backgroundColor = '';
                }
            }, false);
        });
    }

    // 10. Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#EF4444';
                    setTimeout(() => { input.style.borderColor = ''; }, 3000);
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';

                setTimeout(() => {
                    alert('Thank you! Your Environmental Assessment request has been submitted successfully. A specialist will review your files and contact you shortly.');
                    contactForm.reset();
                    if (uploadText) {
                        uploadText.innerText = 'Drag & drop your files here or click to browse';
                        uploadWrapper.style.borderColor = '';
                        uploadWrapper.style.backgroundColor = '';
                    }
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1800);
            }
        });
    }

    // 11. Navigation Dropdown Toggle
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    const dropdownMenu = document.querySelector('.nav-dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isShown = dropdownMenu.classList.contains('show');
            dropdownMenu.classList.toggle('show', !isShown);
            dropdownToggle.classList.toggle('active', !isShown);
            dropdownToggle.setAttribute('aria-expanded', !isShown);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownToggle.classList.remove('active');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 12. Scroll To Top Button logic
    const scrollTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

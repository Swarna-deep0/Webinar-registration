// Advanced Webinar Registration Form JavaScript
class WebinarForm {
    constructor() {
        this.form = document.getElementById('webinarForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercent = document.getElementById('progressPercent');
        this.successMessage = document.getElementById('successMessage');
        
        this.fields = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            company: document.getElementById('company'),
            interest: document.querySelectorAll('input[name="interest"]')
        };
        
        this.totalFields = Object.keys(this.fields).length;
        this.completedFields = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupProgressTracking();
        this.setupAnimations();
        this.setupAccessibility();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Input field events
        Object.values(this.fields).forEach(field => {
            if (field.length) { // For radio buttons
                field.forEach(radio => {
                    radio.addEventListener('change', this.handleFieldChange.bind(this));
                });
            } else { // For regular inputs
                field.addEventListener('input', this.handleFieldInput.bind(this));
                field.addEventListener('blur', this.validateField.bind(this));
                field.addEventListener('focus', this.handleFieldFocus.bind(this));
            }
        });
        
        // Interest option animations
        const interestOptions = document.querySelectorAll('.interest-option');
        interestOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectInterest(option);
            });
        });
        
        // Parallax effect for form
        this.setupParallaxEffect();
    }
    
    setupFormValidation() {
        this.validators = {
            fullName: (value) => {
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
                return null;
            },
            
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return null;
            },
            
            phone: (value) => {
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid phone number';
                return null;
            },
            
            company: (value) => {
                if (!value.trim()) return 'Company/Organization is required';
                if (value.trim().length < 2) return 'Company name must be at least 2 characters';
                return null;
            }
        };
    }
    
    setupProgressTracking() {
        this.updateProgress();
    }
    
    setupAnimations() {
        // Stagger form field animations
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${(index + 3) * 100}ms`;
        });
        
        // Add typing animation to inputs
        Object.values(this.fields).forEach(field => {
            if (!field.length) { // Skip radio buttons
                field.addEventListener('input', () => {
                    this.addTypingEffect(field);
                });
            }
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and descriptions
        Object.entries(this.fields).forEach(([key, field]) => {
            if (!field.length) {
                field.setAttribute('aria-describedby', `${key}-error`);
            }
        });
        
        // Keyboard navigation for interest options
        const interestOptions = document.querySelectorAll('.interest-option');
        interestOptions.forEach((option, index) => {
            option.setAttribute('tabindex', '0');
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
    }
    
    setupParallaxEffect() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.visme_d');
            const speed = scrolled * 0.5;
            
            parallax.style.transform = `translateY(${speed}px)`;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }
    
    handleFieldInput(e) {
        const field = e.target;
        this.clearFieldError(field);
        this.updateProgress();
        
        // Real-time validation for better UX
        if (field.value.trim().length > 0) {
            setTimeout(() => {
                this.validateField(e);
            }, 500);
        }
    }
    
    handleFieldFocus(e) {
        const field = e.target;
        const fieldGroup = field.closest('.form-group');
        
        // Add focus animation
        fieldGroup.style.transform = 'scale(1.02)';
        fieldGroup.style.transition = 'transform 0.2s ease';
        
        // Add focus ring animation
        const focusRing = document.createElement('div');
        focusRing.className = 'absolute inset-0 rounded-xl border-2 border-blue-400 animate-pulse-ring pointer-events-none';
        field.parentElement.appendChild(focusRing);
        
        setTimeout(() => {
            if (focusRing.parentElement) {
                focusRing.remove();
            }
        }, 2000);
    }
    
    handleFieldChange(e) {
        this.updateProgress();
    }
    
    validateField(e) {
        const field = e.target;
        const fieldName = field.id;
        const validator = this.validators[fieldName];
        
        if (!validator) return true;
        
        const error = validator(field.value);
        
        if (error) {
            this.showFieldError(field, error);
            return false;
        } else {
            this.showFieldSuccess(field);
            return true;
        }
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.error-message');
        const errorSpan = errorElement.querySelector('span');
        
        errorSpan.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Add shake animation
        field.classList.add('error-shake');
        setTimeout(() => {
            field.classList.remove('error-shake');
        }, 500);
    }
    
    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        this.clearFieldError(field);
    }
    
    clearFieldError(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.error-message');
        
        errorElement.classList.add('hidden');
        field.classList.remove('error');
    }
    
    selectInterest(option) {
        // Remove selection from all options
        document.querySelectorAll('.interest-option').forEach(opt => {
            opt.classList.remove('selected');
            const div = opt.querySelector('div');
            div.style.background = 'rgba(255, 255, 255, 0.1)';
            div.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            div.style.transform = 'scale(1)';
        });
        
        // Add selection to clicked option
        option.classList.add('selected');
        const div = option.querySelector('div');
        div.style.background = 'rgba(59, 130, 246, 0.2)';
        div.style.borderColor = '#3b82f6';
        div.style.transform = 'scale(1.05)';
        
        // Check the radio button
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        
        this.updateProgress();
    }
    
    updateProgress() {
        let completed = 0;
        
        // Check text inputs
        ['fullName', 'email', 'phone', 'company'].forEach(fieldName => {
            if (this.fields[fieldName].value.trim()) {
                completed++;
            }
        });
        
        // Check interest selection
        const selectedInterest = document.querySelector('input[name="interest"]:checked');
        if (selectedInterest) {
            completed++;
        }
        
        const percentage = Math.round((completed / this.totalFields) * 100);
        
        // Animate progress bar
        this.progressBar.style.width = `${percentage}%`;
        
        // Animate percentage text
        this.animateNumber(this.progressPercent, parseInt(this.progressPercent.textContent), percentage);
        
        this.completedFields = completed;
    }
    
    animateNumber(element, from, to) {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.round(from + (to - from) * this.easeOutCubic(progress));
            element.textContent = `${currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    addTypingEffect(field) {
        field.style.transform = 'translateY(-1px)';
        setTimeout(() => {
            field.style.transform = 'translateY(0)';
        }, 100);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        ['fullName', 'email', 'phone', 'company'].forEach(fieldName => {
            const field = this.fields[fieldName];
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });
        
        // Check interest selection
        const selectedInterest = document.querySelector('input[name="interest"]:checked');
        if (!selectedInterest) {
            this.showGlobalError('Please select your area of interest');
            isValid = false;
        }
        
        if (!isValid) {
            this.shakeForm();
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Simulate API call
            await this.simulateFormSubmission();
            
            // Show success
            this.showSuccess();
            
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('loading');
        this.submitBtn.querySelector('.btn-text').textContent = 'Registering...';
        
        // Add loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        this.form.appendChild(overlay);
    }
    
    hideLoadingState() {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('loading');
        
        const overlay = this.form.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    async simulateFormSubmission() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure (90% success rate)
        if (Math.random() > 0.9) {
            throw new Error('Network error');
        }
        
        return { success: true, message: 'Registration successful!' };
    }
    
    showSuccess() {
        // Update button
        this.submitBtn.querySelector('.btn-text').textContent = 'Registered Successfully!';
        this.submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Show success message
        this.successMessage.classList.remove('hidden');
        this.successMessage.classList.add('show', 'success-bounce');
        
        // Add confetti effect
        this.createConfetti();
        
        // Reset form after delay
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }
    
    createConfetti() {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * 100}vw;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
        
        // Add confetti animation
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Reset button
        this.submitBtn.querySelector('.btn-text').textContent = 'Register Now';
        this.submitBtn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        
        // Hide success message
        this.successMessage.classList.add('hidden');
        this.successMessage.classList.remove('show', 'success-bounce');
        
        // Reset progress
        this.updateProgress();
        
        // Clear field states
        Object.values(this.fields).forEach(field => {
            if (!field.length) {
                field.classList.remove('success', 'error');
                this.clearFieldError(field);
            }
        });
        
        // Reset interest options
        document.querySelectorAll('.interest-option').forEach(option => {
            option.classList.remove('selected');
            const div = option.querySelector('div');
            div.style.background = 'rgba(255, 255, 255, 0.1)';
            div.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            div.style.transform = 'scale(1)';
        });
    }
    
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideInUp';
        errorDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    showGlobalError(message) {
        this.showError(message);
    }
    
    shakeForm() {
        const form = document.querySelector('.visme_d');
        form.classList.add('error-shake');
        setTimeout(() => {
            form.classList.remove('error-shake');
        }, 500);
    }
}

// Enhanced form interactions
class FormEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardShortcuts();
        this.setupMouseEffects();
        this.setupPerformanceOptimizations();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const form = document.getElementById('webinarForm');
                form.dispatchEvent(new Event('submit'));
            }
            
            // Escape to clear current field
            if (e.key === 'Escape' && document.activeElement.classList.contains('form-input')) {
                document.activeElement.value = '';
                document.activeElement.dispatchEvent(new Event('input'));
            }
        });
    }
    
    setupMouseEffects() {
        // Add magnetic effect to submit button
        const submitBtn = document.getElementById('submitBtn');
        
        submitBtn.addEventListener('mousemove', (e) => {
            const rect = submitBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.15;
            const moveY = y * 0.15;
            
            submitBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.transform = 'translate(0, 0)';
        });
    }
    
    setupPerformanceOptimizations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slideInUp');
                }
            });
        }, observerOptions);
        
        // Observe form groups
        document.querySelectorAll('.form-group').forEach(group => {
            observer.observe(group);
        });
        
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Handle responsive adjustments
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        // Adjust animations for mobile
        const isMobile = window.innerWidth < 768;
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach((group, index) => {
            if (isMobile) {
                group.style.animationDelay = `${index * 50}ms`;
            } else {
                group.style.animationDelay = `${(index + 3) * 100}ms`;
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form
    const webinarForm = new WebinarForm();
    
    // Initialize enhancements
    const formEnhancements = new FormEnhancements();
    
    // Add some easter eggs for fun
    let clickCount = 0;
    document.querySelector('.form-title').addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 2000);
            clickCount = 0;
        }
    });
    
    console.log('🎉 Advanced Webinar Registration Form Loaded!');
});
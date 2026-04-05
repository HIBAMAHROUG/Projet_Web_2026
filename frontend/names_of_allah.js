// ============================================
// Asma' Allah Al-99 - Enhanced 3D Animations
// Smooth scroll effects, 3D transforms, and immersive interactions
// ============================================

/**
 * Main initialization - runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌙 Asma Allah Al-99 - Initializing animations...');
  
  // Initialize all animation systems
  initMeaningDisplay();
  initScrollAnimations();
  add3DHoverEffects();
  addClickRippleEffects();
  enhanceAccessibility();
  setupDeviceOptimizations();
  
  console.log('✨ All enhancements loaded successfully');
});

// ============================================
// MEANING DISPLAY - Show Arabic names & meanings
// Dual display: English/Arabic + Meaning on hover
// ============================================
function initMeaningDisplay() {
  const listItems = document.querySelectorAll('ol li');
  
  listItems.forEach(item => {
    // Get Arabic name and meaning from data attributes
    const arabicName = item.getAttribute('data-arabic');
    const meaning = item.getAttribute('data-meaning');
    
    if (arabicName && meaning) {
      // Create meaning element
      const meaningElement = document.createElement('span');
      meaningElement.className = 'meaning';
      meaningElement.textContent = meaning;
      item.appendChild(meaningElement);
      
      // Add title attribute for accessibility and tooltip
      item.setAttribute('title', `${arabicName}: ${meaning}`);
    }
  });
  
  console.log('📖 Arabic names and meanings initialized');
}

// ============================================
// SCROLL ANIMATIONS - Fade-in entries
// Uses IntersectionObserver for performance
// ============================================
function initScrollAnimations() {
  const listItems = document.querySelectorAll('ol li');
  
  // Configure intersection observer options
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };
  
  /**
   * Intersection Observer callback
   * Adds 'visible' class to trigger fade-in animation
   */
  const observerCallback = (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation start for sequential effect
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Unobserve after animation to save performance
          observer.unobserve(entry.target);
        }, index * 35);  // 35ms delay creates flowing effect
      }
    });
  };
  
  // Create and start observing
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  listItems.forEach((item, index) => {
    // Store index for CSS animation delay
    item.style.setProperty('--index', index);
    observer.observe(item);
  });
  
  console.log(`📜 Scroll animations initialized for ${listItems.length} items`);
}

// ============================================
// 3D HOVER EFFECTS - Perspective transforms
// Creates depth illusion with mouse tracking
// ============================================
function add3DHoverEffects() {
  const listItems = document.querySelectorAll('ol li');
  
  listItems.forEach(item => {
    /**
     * Mouse move handler - calculates rotation based on cursor position
     * Only applies on desktop (non-touch) devices
     */
    item.addEventListener('mousemove', (e) => {
      // Check if device supports hover (is not touch-only)
      if (!window.matchMedia('(hover: hover)').matches) return;
      
      const rect = item.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate mouse position relative to item center
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      
      // Convert to rotation angles (range: -8deg to +8deg)
      const rotateY = (x / centerX) * 8;
      const rotateX = -(y / centerY) * 8;
      
      // Apply 3D perspective transform
      item.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateY(-8px) 
        translateZ(20px)
      `;
      
      // Also slightly rotate counter for added depth
      const counter = item.querySelector('::before');
      if (counter) {
        item.style.setProperty('--counter-rotation', `${rotateY * 0.5}deg`);
      }
    });
    
    /**
     * Mouse leave handler - smoothly reset to neutral position
     */
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
      item.style.setProperty('--counter-rotation', '0deg');
    });
    
    /**
     * Focus handler - for keyboard navigation
     */
    item.addEventListener('focus', () => {
      item.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(0deg) translateY(-6px) translateZ(15px)';
    });
    
    item.addEventListener('blur', () => {
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
    });
  });
  
  console.log('🎯 3D hover effects applied');
}

// ============================================
// CLICK RIPPLE EFFECTS - Material Design style
// Visual feedback on user interaction
// ============================================
function addClickRippleEffects() {
  const listItems = document.querySelectorAll('ol li');
  
  listItems.forEach(item => {
    /**
     * Click handler - creates animated ripple
     */
    item.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      // Get click coordinates relative to item
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Position ripple at click point
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      // Add ripple to DOM and start animation
      this.appendChild(ripple);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });
  
  console.log('💫 Click ripple effects enabled');
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// Keyboard navigation and screen reader support
// ============================================
function enhanceAccessibility() {
  const listItems = document.querySelectorAll('ol li');
  
  listItems.forEach((item, index) => {
    // Make items keyboard focusable
    item.setAttribute('tabindex', '0');
    
    // Add ARIA labels for screen readers
    const itemNumber = index + 1;
    const itemText = item.textContent.trim();
    item.setAttribute('aria-label', `Name ${itemNumber}: ${itemText}`);
    
    /** Keyboard event handler
     * Allows Enter/Space to trigger click
     */
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
        // Visual feedback
        item.style.transform = 'perspective(1000px) scale(0.98)';
        setTimeout(() => {
          item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }, 100);
      }
    });
  });
  
  console.log('♿ Accessibility features enabled');
}

// ============================================
// DEVICE OPTIMIZATIONS
// Adapts animations for mobile/tablet devices
// ============================================
function setupDeviceOptimizations() {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const isMobileSize = window.matchMedia('(max-width: 768px)').matches;
  
  if (isTouchDevice) {
    // Disable complex 3D on touch to improve performance
    document.body.classList.add('touch-device');
    console.log('📱 Touch device detected - optimized animations applied');
  }
  
  if (isMobileSize) {
    // Reduce animation delays on mobile for snappier feel
    const listItems = document.querySelectorAll('ol li');
    listItems.forEach((item, index) => {
      item.style.setProperty('--index', Math.floor(index / 2)); // Faster stagger
    });
    console.log('📲 Mobile optimizations applied');
  }
  
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    console.log('🎬 Reduced motion preference respected');
  }
}

// ============================================
// ADVANCED FEATURES (Optional)
// ============================================

/**
 * Parallax scroll effect on header
 * Creates depth as user scrolls
 */
function initHeaderParallax() {
  const header = document.querySelector('.header-section');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxAmount = scrolled * 0.3; // Adjust for stronger effect
    header.style.transform = `translateY(${parallaxAmount}px)`;
  });
}

/**
 * Count-up animation for page load
 * Displays running numbers 1-99
 */
function animateCounters() {
  const counters = document.querySelectorAll('li::before');
  let hasAnimated = false;
  
  window.addEventListener('scroll', () => {
    if (hasAnimated) return;
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    
    // Start animation when container enters viewport
    if (containerRect.top < window.innerHeight * 0.75) {
      hasAnimated = true;
      // Could add counter animation here
    }
  }, { once: true });
}

/**
 * Light/Dark mode toggle
 * Respects system preference but allows user override
 */
function setupThemeToggle() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  prefersDark.addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  console.log('%c🌙 Asma Allah Al-99 - Debug Mode', 'color: #1a472a; font-size: 14px; font-weight: bold;');
  console.log('Features loaded:');
  console.log('  ✓ Scroll fade-in animations');
  console.log('  ✓ 3D perspective hover effects');
  console.log('  ✓ Click ripple feedback');
  console.log('  ✓ Keyboard accessibility');
  console.log('  ✓ Device optimizations');
  console.log('  ✓ Reduced motion support');
}

// Optional: Uncomment to enable advanced features
// initHeaderParallax();
// animateCounters();
// setupThemeToggle();

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export class AnimationController {
  constructor() {
    this.tl = gsap.timeline();
    this.init();
  }

  init() {
    this.setupScrollTriggers();
    this.setupPageLoadAnimations();
    this.setupHoverAnimations();
    this.setupTypewriterEffect();
  }

  setupPageLoadAnimations() {
    // Hero section entrance
    this.tl
      .from('.profile-avatar', {
        scale: 0,
        rotation: 180,
        duration: 1,
        ease: 'back.out(1.7)'
      })
      .from('.profile-name', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.5')
      .from('.profile-title', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.profile-bio', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .from('.profile-actions .btn-primary, .profile-actions .btn-secondary', {
        scale: 0,
        rotation: 360,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.2');

    // Navigation entrance
    gsap.from('.nav-link', {
      y: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.5
    });
  }

  setupScrollTriggers() {
    // Filter tabs animation
    gsap.from('.tab-btn', {
      scrollTrigger: {
        trigger: '.filter-tabs',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Project cards staggered animation
    gsap.from('.pinterest-card', {
      scrollTrigger: {
        trigger: '.masonry-grid',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: {
        amount: 1.5,
        from: 'random'
      },
      ease: 'power2.out'
    });

    // Parallax effect for hero background
    gsap.to('.profile-hero', {
      scrollTrigger: {
        trigger: '.profile-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      yPercent: -50,
      ease: 'none'
    });

    // Skills animation in about modal
    ScrollTrigger.create({
      trigger: '.skill-tags',
      start: 'top 80%',
      onEnter: () => this.animateSkills()
    });
  }

  setupHoverAnimations() {
    // Project card hover effects
    document.addEventListener('mouseenter', (e) => {
      if (e.target.closest('.pinterest-card')) {
        const card = e.target.closest('.pinterest-card');
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.card-overlay'), {
          opacity: 1,
          duration: 0.3
        });
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target.closest('.pinterest-card')) {
        const card = e.target.closest('.pinterest-card');
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.card-overlay'), {
          opacity: 0,
          duration: 0.3
        });
      }
    }, true);

    // Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });
  }

  setupTypewriterEffect() {
    const titles = [
      'Aspiring Software Developer',
      'Full-Stack Engineer',
      'UI/UX Enthusiast',
      'Problem Solver'
    ];
    
    let currentIndex = 0;
    
    const typewriterLoop = () => {
      const titleElement = document.querySelector('.profile-title');
      if (!titleElement) return;
      
      gsap.to(titleElement, {
        text: titles[currentIndex],
        duration: 2,
        ease: 'none',
        onComplete: () => {
          setTimeout(() => {
            currentIndex = (currentIndex + 1) % titles.length;
            typewriterLoop();
          }, 3000);
        }
      });
    };
    
    setTimeout(typewriterLoop, 2000);
  }

  animateSkills() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    gsap.from(skillTags, {
      scale: 0,
      rotation: 180,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });
  }

  // Modal animations
  animateModalOpen(modal) {
    gsap.set(modal, { display: 'block' });
    
    gsap.from(modal, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    gsap.from(modal.querySelector('.modal-content'), {
      scale: 0.8,
      y: 50,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
  }

  animateModalClose(modal) {
    gsap.to(modal.querySelector('.modal-content'), {
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: 'power2.in'
    });
    
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        modal.style.display = 'none';
      }
    });
  }

  // Loading animation
  showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="loading-text">Loading...</div>
      </div>
    `;
    document.body.appendChild(loader);
    
    gsap.from(loader, {
      opacity: 0,
      duration: 0.3
    });
    
    return loader;
  }

  hideLoadingAnimation(loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        loader.remove();
      }
    });
  }

  // Smooth scroll to element
  scrollToElement(target, offset = 0) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: target,
        offsetY: offset
      },
      ease: 'power2.inOut'
    });
  }
}

// Create singleton instance
export const animationController = new AnimationController();
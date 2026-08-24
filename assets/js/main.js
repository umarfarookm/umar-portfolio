/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Custom Portfolio Modal
   */

  // Function to open custom modal
  window.openCustomModal = function(imageSrc, title, descriptionClass) {
    const modal = document.getElementById('customPortfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    // Set image
    modalImage.src = imageSrc;
    modalImage.alt = title;

    // Set title
    modalTitle.textContent = title;

    // Get and set description from hidden div
    const descElement = document.querySelector('.' + descriptionClass);
    if (descElement) {
      modalDescription.innerHTML = descElement.innerHTML;
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Function to close custom modal
  window.closeCustomModal = function() {
    const modal = document.getElementById('customPortfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCustomModal();
    }
  });

  // Close modal on outside click
  document.getElementById('customPortfolioModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeCustomModal();
    }
  });

  // Initialize portfolio preview links with custom modal
  document.querySelectorAll('.preview-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const imageSrc = this.getAttribute('href');
      const title = this.getAttribute('title');
      const dataCustom = this.getAttribute('data-custom-modal');
      const isTabbedModal = this.getAttribute('data-tabbed-modal');

      if (isTabbedModal) {
        // Use tabbed modal for grouped items
        openTabbedModal(title, dataCustom);
      } else if (dataCustom) {
        // Use custom modal
        openCustomModal(imageSrc, title, dataCustom);
      }
    });
  });

  /**
   * Portfolio Image Carousel
   */
  function initCarousel(carouselElement) {
    const slides = carouselElement.querySelectorAll('.portfolio-carousel-slide');
    const dots = carouselElement.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let intervalId;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
      });

      if (slides[index]) {
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
      }
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function startCarousel() {
      intervalId = setInterval(nextSlide, 3000);
    }

    function stopCarousel() {
      clearInterval(intervalId);
    }

    // Initialize first slide
    showSlide(0);
    startCarousel();

    // Pause on hover
    carouselElement.addEventListener('mouseenter', stopCarousel);
    carouselElement.addEventListener('mouseleave', startCarousel);

    // Manual navigation via dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSlide = index;
        showSlide(currentSlide);
        stopCarousel();
        startCarousel();
      });
    });
  }

  // Initialize all carousels
  document.querySelectorAll('.portfolio-carousel').forEach(carousel => {
    initCarousel(carousel);
  });

  /**
   * Tabbed Modal for Grouped Portfolio Items
   */
  window.openTabbedModal = function(title, modalClass) {
    const modal = document.getElementById('customPortfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalTabs = document.getElementById('modalTabs');
    const modalDescription = document.getElementById('modalDescription');

    // Add class to identify this as a tabbed modal
    modal.classList.add('tabbed-modal');

    modalTitle.textContent = title;

    const descElement = document.querySelector('.' + modalClass);
    if (descElement) {
      const descClone = descElement.cloneNode(true);

      // Extract tabs from the cloned content
      const tabsContainer = descClone.querySelector('.modal-tabs');
      const tabContents = descClone.querySelectorAll('.modal-tab-content');

      if (tabsContainer && tabContents.length > 0) {
        // Move tabs to header
        modalTabs.innerHTML = '';
        modalTabs.appendChild(tabsContainer);

        // Put tab contents in description area
        modalDescription.innerHTML = '';
        tabContents.forEach(content => {
          modalDescription.appendChild(content);
        });

        // Get the updated references after moving to modal
        const tabButtons = modalTabs.querySelectorAll('.modal-tab-btn');
        const newTabContents = modalDescription.querySelectorAll('.modal-tab-content');

        function switchTab(index) {
          // Remove active class from all
          tabButtons.forEach(b => b.classList.remove('active'));
          newTabContents.forEach(c => c.classList.remove('active'));

          // Add active to clicked
          if (tabButtons[index]) tabButtons[index].classList.add('active');
          if (newTabContents[index]) {
            newTabContents[index].classList.add('active');

            // Update the left side image with the tab's variant image
            // Try to find image with class first, then fall back to first img tag
            let tabImage = newTabContents[index].querySelector('.tab-variant-image');
            if (!tabImage) {
              // Get first image that's not a tech icon
              const images = newTabContents[index].querySelectorAll('img');
              for (let img of images) {
                if (!img.classList.contains('tech-icon')) {
                  tabImage = img;
                  break;
                }
              }
            }

            if (tabImage && modalImage) {
              modalImage.src = tabImage.src;
              modalImage.alt = tabImage.alt;
              modalImage.style.display = 'block';
              // Hide the image in the content area (it's shown on the left)
              tabImage.style.display = 'none';
            }
          }
        }

        tabButtons.forEach((btn, index) => {
          btn.addEventListener('click', () => switchTab(index));
        });

        // Activate first tab by default
        switchTab(0);
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Update close modal to reset layout
  const originalCloseModal = window.closeCustomModal;
  window.closeCustomModal = function() {
    const modal = document.getElementById('customPortfolioModal');
    const modalTabs = document.getElementById('modalTabs');
    const modalDescription = document.getElementById('modalDescription');

    // Remove tabbed-modal class
    modal.classList.remove('tabbed-modal');

    // Clear tabs from header
    if (modalTabs) {
      modalTabs.innerHTML = '';
    }

    // Reset only the main tab images to be visible again (tech icons should stay visible)
    if (modalDescription) {
      const tabImages = modalDescription.querySelectorAll('.modal-tab-content > img:first-of-type');
      tabImages.forEach(img => {
        if (!img.classList.contains('tech-icon')) {
          img.style.display = '';
        }
      });
    }

    originalCloseModal();
  };

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
        getSortData: {
          date: '[data-date]'
        },
        sortAscending: {
          date: false
        }
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });


  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formStatus = document.getElementById("form-status");

    const setStatus = (message, isError) => {
      formStatus.textContent = message;
      formStatus.classList.toggle('is-error', !!isError);
    };

    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById('name-field').value.trim();
      const email = document.getElementById('email-field').value.trim();
      const subject = document.getElementById('subject-field').value.trim();
      const message = document.getElementById('message-field').value.trim();

      const missing = [
        [name, 'name-field'],
        [email, 'email-field'],
        [subject, 'subject-field'],
        [message, 'message-field']
      ].find(([value]) => !value);

      if (missing) {
        setStatus("Please fill in every field before sending.", true);
        document.getElementById(missing[1]).focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("That email address does not look right. Please check it.", true);
        document.getElementById('email-field').focus();
        return;
      }

      const mailSubject = `Portfolio enquiry: ${subject}`;
      const mailBody = `${message}\n\n--\nFrom: ${name}\nEmail: ${email}`;

      setStatus("Opening your email app. If nothing happens, email umarfarookbtech@gmail.com directly.");

      window.location.href = "mailto:umarfarookbtech@gmail.com" +
        "?subject=" + encodeURIComponent(mailSubject) +
        "&body=" + encodeURIComponent(mailBody);
    });
  }


  const d = new Date();
  document.getElementById("yearSpan").innerHTML = d.getFullYear().toString();

})();

import "./style.css";

// Capture initial hash before updateActiveLink() modifies it
const initialHash = window.location.hash;

(function () {
  const navLinks = document.querySelectorAll('#site-nav a[href*="#"]');
  const sections = [];

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    const targetId = href.slice(href.indexOf("#") + 1);
    const section =
      document.querySelector(`[name="${targetId}"]`)?.closest("section") ||
      document.querySelector(`#${targetId}`)?.closest("section") ||
      document.querySelector(`section:has([name="${targetId}"])`) ||
      document.querySelector(`section:has(#${targetId})`);
    if (section) {
      sections.push({ link, section, targetId });
    }
  });

  let currentActive = null;

  function updateActiveLink() {
    // Use a small offset from the top of the viewport for detection
    const detectionPoint = window.scrollY + 80;

    let activeItem = null;
    for (const item of sections) {
      const rect = item.section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;

      // Find the last section whose top is at or above the detection point
      if (sectionTop <= detectionPoint) {
        activeItem = item;
      }
    }

    if (activeItem !== currentActive) {
      if (currentActive) {
        currentActive.link.classList.remove("nav-active");
      }
      if (activeItem) {
        activeItem.link.classList.add("nav-active");
        history.replaceState(null, "", "#" + activeItem.targetId);
      } else {
        history.replaceState(null, "", window.location.pathname);
      }
      currentActive = activeItem;
    }
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();
})();

(function () {
  const navToggle = document.getElementById("nav-toggle");
  const navLabel = document.querySelector('label[for="nav-toggle"]');
  const nav = document.getElementById("main-nav");
  const backdrop = document.getElementById("nav-backdrop");

  if (!navToggle || !navLabel || !nav) {
    return;
  }

  // Make label keyboard accessible
  navLabel.setAttribute("tabindex", "0");

  // Get all focusable elements in the page
  const focusableSelectors =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  // Update state and manage focus trap
  function updateAriaState() {
    const isOpen = navToggle.checked;
    navLabel.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen && window.innerWidth < 768) {
      // Store the currently focused element
      previouslyFocusedElement = document.activeElement;

      // Get focusable elements within the menu and the close button
      const navLinks = Array.from(nav.querySelectorAll(focusableSelectors));
      focusableElements = [navLabel, ...navLinks];
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Make main content inert (prevent tabbing)
      document.body.setAttribute("data-nav-open", "true");

      // Focus the close button
      setTimeout(() => navLabel.focus(), 100);
    } else {
      // Remove inert state
      document.body.removeAttribute("data-nav-open");

      // Restore focus to previously focused element
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
      previouslyFocusedElement = null;
    }
  }

  navToggle.addEventListener("change", updateAriaState);

  // Keyboard support for the label
  navLabel.addEventListener("keydown", function (e) {
    // Space or Enter to toggle
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      navToggle.checked = !navToggle.checked;
      updateAriaState();
    }
  });

  // Focus trap - handle Tab key when menu is open
  document.addEventListener("keydown", function (e) {
    // Close menu with Escape key
    if (e.key === "Escape" && navToggle.checked) {
      navToggle.checked = false;
      updateAriaState();
      return;
    }

    // Focus trap with Tab key when menu is open
    if (
      e.key === "Tab" &&
      navToggle.checked &&
      window.innerWidth < 768 &&
      focusableElements.length > 0
    ) {
      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  });

  // Close menu when clicking a link
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navToggle.checked) {
        navToggle.checked = false;
        updateAriaState();
      }
    });
  });

  // Close menu when clicking backdrop
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      if (navToggle.checked) {
        navToggle.checked = false;
        updateAriaState();
      }
    });
  }
})();

(function () {
  const navEntry = performance.getEntriesByType("navigation")[0];
  const isLinkNavigation = navEntry && navEntry.type === "navigate";

  if (isLinkNavigation && initialHash) {
    const targetId = initialHash.slice(1);
    const target =
      document.querySelector(`[name="${targetId}"]`) ||
      document.getElementById(targetId);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView();
      }, 0);
    }
  }
})();

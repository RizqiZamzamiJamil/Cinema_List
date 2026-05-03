import { onBeforeUnmount, ref } from 'vue';

export function useScrollSpy(sections) {
  const activeSection = ref(sections[0]?.id || '');
  let sectionObserver;
  let scrollFrame;

  function setActiveSection(id) {
    activeSection.value = id;
  }

  function updateActiveSectionFromScroll() {
    const offset = 130;
    let current = sections[0]?.id || '';

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && element.getBoundingClientRect().top <= offset) {
        current = section.id;
      }
    });

    activeSection.value = current;
  }

  function setupActiveSectionObserver() {
    sectionObserver?.disconnect();
    sectionObserver = new IntersectionObserver(
      () => updateActiveSectionFromScroll(),
      {
        rootMargin: '-32% 0px -52% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) sectionObserver.observe(element);
    });
  }

  function syncHashTarget() {
    const id = window.location.hash.replace('#', '');
    if (!sections.some((section) => section.id === id)) {
      updateActiveSectionFromScroll();
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: Math.max(element.offsetTop - 88, 0),
        behavior: 'auto',
      });
      activeSection.value = id;
      window.setTimeout(updateActiveSectionFromScroll, 150);
      window.setTimeout(updateActiveSectionFromScroll, 650);
    }
  }

  function handleScrollSpy() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      updateActiveSectionFromScroll();
      scrollFrame = null;
    });
  }

  function startScrollSpy() {
    setupActiveSectionObserver();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    window.addEventListener('hashchange', syncHashTarget);
    syncHashTarget();
  }

  function stopScrollSpy() {
    sectionObserver?.disconnect();
    window.removeEventListener('scroll', handleScrollSpy);
    window.removeEventListener('hashchange', syncHashTarget);
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
  }

  onBeforeUnmount(stopScrollSpy);

  return {
    activeSection,
    setActiveSection,
    startScrollSpy,
    setupActiveSectionObserver,
    syncHashTarget,
  };
}

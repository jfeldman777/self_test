document.addEventListener('DOMContentLoaded', function() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    const section = header.closest('.accordion-section');
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.section-icon');
    
    header.addEventListener('click', function() {
      if (content.classList.contains('section-collapsed')) {
        // Expand
        content.classList.remove('section-collapsed');
        icon.textContent = '▲';
      } else {
        // Collapse
        content.classList.add('section-collapsed');
        icon.textContent = '▼';
      }
    });
  });
});


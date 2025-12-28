document.addEventListener('DOMContentLoaded', function() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    const section = header.closest('.accordion-section');
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.section-icon');
    const title = header.querySelector('.section-title');
    
    // Get first line of content for preview
    const firstItem = content.querySelector('ol > li:first-child, ul > li:first-child, p:first-child');
    let previewText = '';
    if (firstItem) {
      previewText = firstItem.textContent.trim().replace(/\s+/g, ' ');
    }
    
    // Create preview element after title
    const preview = document.createElement('span');
    preview.className = 'section-preview';
    preview.textContent = ' — ' + previewText;
    title.appendChild(preview);
    
    header.addEventListener('click', function() {
      if (content.classList.contains('section-collapsed')) {
        // Expand
        content.classList.remove('section-collapsed');
        icon.textContent = '▲';
        preview.style.display = 'none';
      } else {
        // Collapse
        content.classList.add('section-collapsed');
        icon.textContent = '▼';
        preview.style.display = 'inline';
      }
    });
  });
});


let zoomLevel = 1;

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
    if (event.key === '+' || event.key === '=') {
      zoomLevel += 0.1;
      document.body.style.transform = `scale(${zoomLevel})`;
    } else if (event.key === '-' || event.key === '_') {
      zoomLevel -= 0.1;
      document.body.style.transform = `scale(${zoomLevel})`;
    } else if (event.key === '0' || event.key === ')') {
      zoomLevel = 1;
      document.body.style.transform = `scale(${zoomLevel})`;
    } else if (event.key.toLowerCase() === 'r') {
      location.reload();
    }
  }
});

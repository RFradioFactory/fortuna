export const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme') || 'auto';
  const next = current === 'auto' ? 'light' : (current === 'light' ? 'dark' : 'auto');
  
  if (next === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', next);
  }
  
  localStorage.setItem('theme_mode', next);
};

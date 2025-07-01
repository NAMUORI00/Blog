function switchTheme() {
  const currentStyle = currentTheme()
  if (currentStyle === 'light') {
    setTheme('dark')
    setIconTheme('dark')
  }
  else {
    setTheme('light')
    setIconTheme('light')
  }
}

function setTheme(style) {
  document.querySelectorAll('.isInitialToggle').forEach(elem => {
    elem.classList.remove('isInitialToggle');
  });
  document.documentElement.setAttribute('data-color-mode', style);
  localStorage.setItem('data-color-mode', style);
}

function setIconTheme(theme) {
  const twitterIconElement = document.getElementById('twitter-icon')
  const githubIconElement = document.getElementById('github-icon')
  const emailIconElement = document.getElementById('email-icon')
  const websiteIconElement = document.getElementById('website-icon')
  
  if (twitterIconElement) {
    if (theme === 'light') {
      twitterIconElement.setAttribute("fill", "black")
    } else if (theme === 'dark') {
      twitterIconElement.setAttribute("fill", "white")
    }
  }

  if (githubIconElement) {
    if (theme === 'light') {
      githubIconElement.removeAttribute('color')
      githubIconElement.removeAttribute('class')
    } else if (theme === 'dark') {
      githubIconElement.setAttribute('class', 'octicon')
      githubIconElement.setAttribute('color', '#f0f6fc')
    }
  }

  if (emailIconElement) {
    if (theme === 'light') {
      emailIconElement.removeAttribute('color')
      emailIconElement.removeAttribute('class')
      emailIconElement.setAttribute('fill', '#24292e')
    } else if (theme === 'dark') {
      emailIconElement.removeAttribute('fill')
      emailIconElement.setAttribute('class', 'octicon')
      emailIconElement.setAttribute('color', '#f0f6fc')
    }
  }

  if (websiteIconElement) {
    if (theme === 'light') {
      websiteIconElement.removeAttribute('color')
      websiteIconElement.removeAttribute('class')
      websiteIconElement.setAttribute('fill', '#24292e')
    } else if (theme === 'dark') {
      websiteIconElement.removeAttribute('fill')
      websiteIconElement.setAttribute('class', 'octicon')
      websiteIconElement.setAttribute('color', '#f0f6fc')
    }
  }
}

function currentTheme() {
  const localStyle = localStorage.getItem('data-color-mode');
  const systemStyle = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return localStyle || systemStyle;
}

(() => {
  const theme = currentTheme();
  setTheme(theme);
  setIconTheme(theme);
})();

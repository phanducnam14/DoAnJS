const root = document.getElementById('frontendRoot');

const partials = [
  './partials/auth-screen.html',
  './partials/app-shell.html'
];

const scripts = [
  './js/app-core.js',
  './js/app-marketplace.js',
  './js/app-services.js',
  './js/app-init.js'
];

async function loadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Khong the tai tai nguyen: ${url}`);
  }

  return response.text();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Khong the tai file script: ${src}`));
    document.body.appendChild(script);
  });
}

async function bootstrap() {
  try {
    const fragments = await Promise.all(partials.map(loadText));
    root.innerHTML = fragments.join('\n');

    for (const src of scripts) {
      await loadScript(src);
    }
  } catch (error) {
    root.innerHTML = `
      <main style="padding:24px;font-family:Segoe UI,sans-serif;">
        <h1>Frontend khong the khoi dong</h1>
        <p>${error.message}</p>
      </main>
    `;
  }
}

bootstrap();

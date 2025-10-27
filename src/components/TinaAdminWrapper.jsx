// src/components/TinaAdminWrapper.jsx
import { TinaCMS } from 'tinacms';
import config from '../../tina/config.js';

class LocalClient {
  async request(query, { variables } = {}) {
    if (query.includes('mutation')) {
      const { file, content } = variables.input;
      const res = await fetch('/___tina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, content }),
      });
      return res.json();
    }
    return { data: {} };
  }
}

export default function TinaAdminWrapper() {
  return <div id="tina-root" style={{ height: '100vh' }} />;
}

// Inicializa fora do React
if (typeof window !== 'undefined') {
  const initTina = () => {
    if (window.tinaReady && window.TinaAdmin) {
      const client = new LocalClient();
      const cms = new TinaCMS({
        enabled: true,
        sidebar: true,
        schema: config.schema,
        client,
      });

      cms.enable();

      new window.TinaAdmin({
        cms,
        container: document.getElementById('tina-root'),
      });

      const loading = document.getElementById('tina-loading');
      if (loading) loading.remove();
    } else {
      setTimeout(initTina, 100);
    }
  };

  // Aguarda o script do CDN
  window.addEventListener('load', () => {
    setTimeout(initTina, 500);
  });
}
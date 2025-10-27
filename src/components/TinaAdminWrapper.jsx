// src/components/TinaAdminWrapper.jsx
import { TinaCMS } from 'tinacms';
import schema from '../../tina/schema.json' with { type: 'json' };

class LocalClient {
  async request(query, { variables } = {}) {
    if (query.includes('mutation')) {
      const { file, content } = variables.input;

      try {
        // Lê o arquivo original
        const response = await fetch(file);
        const original = await response.text();

        // Regex para capturar o conteúdo entre {/* tina-body */} e {/* /tina-body */}
        const bodyRegex = /\/\* tina-body \*\/([\s\S]*?)\/\* \/tina-body \*\//;
        const match = original.match(bodyRegex);

        let newContent;
        if (match) {
          // Preserva tudo, só troca o meio
          newContent = original.replace(
            bodyRegex,
            `/* tina-body */\n${content}\n/* /tina-body */`
          );
        } else {
          // Se não tiver o bloco, adiciona no final do frontmatter
          newContent = original.replace(
            /(---\s*[\s\S]*?\s*---)/,
            `$1\n\n/* tina-body */\n${content}\n/* /tina-body */`
          );
        }

        // Salva com o layout preservado
        const res = await fetch('/___tina', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file, content: newContent }),
        });
        return res.json();
      } catch (error) {
        console.error('Erro ao preservar layout:', error);
        return { error: error.message };
      }
    }
    return { data: {} };
  }
}

export default function TinaAdminWrapper() {
  return <div id="tina-root" style={{ height: '100vh' }} />;
}

// Inicializa no cliente
if (typeof window !== 'undefined') {
  const initTina = () => {
    if (window.tinaReady && window.TinaAdmin) {
      const client = new LocalClient();
      const cms = new TinaCMS({
        enabled: true,
        sidebar: true,
        schema: schema,
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

  window.addEventListener('load', () => {
    setTimeout(initTina, 500);
  });
}

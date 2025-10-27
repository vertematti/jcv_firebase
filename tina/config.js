// tina/config.ts
import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Páginas",
        path: "src/pages",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            // Mapeia caminho do arquivo para URL
            const path = document._sys.relativePath
              .replace(/^src\/pages\//, "/")
              .replace(/\/index\.mdx$/, "/")
              .replace(/\.mdx$/, "");

            if (path.startsWith("pt/")) return `/${path}`;
            if (path.startsWith("en/")) return `/${path}`;
            return path === "" ? "/pt/" : path;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conteúdo",
            isBody: true,
          },
        ],
      },
    ],
  },
});
import fs from "node:fs"; // index.html 읽기 위함.
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
const isTest = process.env.VITEST;


// SSR 앱을 빌드할 때, 메인 서버를 완전히 제어하고 Vite를 프로덕션 환경에서 분리하고자 한다면, Vite를 미들웨어 모드로 사용

export async function createServer(
  root = process.cwd(), // node명령을 호출한 작업디렉터리의 절대경로 출력, __dirname 은 해당 모듈의 경로를 출력
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(resolve("dist/client/ssr-manifest.json"), "utf-8")
      )
    : {};

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      base: "/",
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // Vite를 미들웨어로 사용합니다.
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      "/",
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }
  // 서버에서 렌더링된 HTML을 제공하기 위해 * 핸들러를 구현
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;

      // index.html의 app 부분에 rendered content 넣음.
      if (!isProd) {
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
      } else {
        template = indexProd;
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const [appHtml, productListHtml, preloadLinks] = await render(url, manifest);
      // 렌더링된 HTML을 템플릿에 주입합니다.
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--product-list-->`, productListHtml);
      // 렌더링된 HTML을 응답으로 전송합니다.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(6173, () => {
      console.log(process.env.NODE_ENV);
      console.log("http://localhost:6173");
    })
  );
}
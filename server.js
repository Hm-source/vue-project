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
    // nodejs 웹서버에서 압축하여 데이터 웹 브라우저에 전송, 브라우저가 압축 해제해서 사용. (compression 미들웨어 사용.)
    //Content-Encoding: gzip 임.
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
        // 1. index.html 파일을 읽어들입니다.
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        // 2. Vite의 HTML 변환 작업을 통해 Vite HMR 클라이언트를 주입하고,
        //    Vite 플러그인의 HTML 변환도 적용합니다.
        template = await vite.transformIndexHtml(url, template);
        // 3. 서버의 진입점(Entry)을 로드합니다.
        //    vite.ssrLoadModule은 Node.js에서 사용할 수 있도록 ESM 소스 코드를 자동으로 변환합니다.
        //    추가적인 번들링이 필요하지 않으며, HMR과 유사한 동작을 수행합니다.

        render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
      } else {
        template = indexProd;
        render = (await import("./dist/server/entry-server.js")).render;
      }
      console.log('server.js',url, manifest);
      // 4. 앱의 HTML을 렌더링합니다.
        //    이는 entry-server.js에서 내보낸(Export) `render` 함수가
        //    renderToString()과 같은 적절한 프레임워크의 SSR API를 호출한다고 가정합니다.
      const [appHtml, preloadLinks] = await render(url, manifest);
      // 5. 렌더링된 HTML을 템플릿에 주입합니다.
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml);
        // .replace(`<!--product-list-->`, productListHtml);
      // 6. 렌더링된 HTML을 응답으로 전송합니다.
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
      console.log("http://localhost:6173");
    })
  );
}
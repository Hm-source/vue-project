// 프레임워크의 SSR API를 사용해 앱을 렌더링하는 스크립트
import { basename } from "node:path";
import { renderToString } from "vue/server-renderer";
import { createApp } from "./main";
// import ProductsList from './components/ProductsList.vue';

// import { createVNode } from 'vue';


// server.js 에서 render, renderPreloadLinks 사용하여 html, preloadLinks 를 rendering하도록 함.
export async function render(url, manifest) {
  const { app, router } = createApp();
    // ProductList 컴포넌트를 렌더링에 포함시킴
  // const productList = createVNode(ProductsList);
  console.log('entry-server', url);
  // const productListHtml = await renderToString(productList);
  await router.push(url);
  await router.isReady();
  const ctx = {};


  const html = await renderToString(app, ctx);
  // console.log(html);
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
  return [html, preloadLinks];
}

function renderPreloadLinks(modules, manifest) {
  let links = "";
  const seen = new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    return "";
  }
}
import './assets/main.css'

//main.js
import { createPinia } from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";
import { createRouter } from "./router";

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();
	app.use(pinia);
	const router = createRouter();
	app.use(router);
	return { app, router };
}

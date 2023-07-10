// 환경에 구애받지 않는(Env-agnostic) 범용 앱 코드로 내보내는(Export) 스크립트
import './assets/main.css'

//main.js
import { createPinia } from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";
import { createRouter } from "./router";

// createSSRApp 및 createRouter 기능을 사용하여 애플리케이션의 SSR 버전을 생성하고 라우터 인스턴스를 설정
// 라우터에서 Vue를 로드하지 않기 때문에 HTML은 클라이언트에서 완전히 정적입니다.

// 클라이언트 측 앱을 대화형으로 만들기 위해 Vue는 하이드레이트 단계를 수행해야 합니다. 

export function createApp() {
	// SSR Hydration 모드에서 애플리케이션 인스턴스를 생성
	const app = createSSRApp(App);
	const pinia = createPinia();
	app.use(pinia);
	const router = createRouter();
	app.use(router);
	return { app, router };
}

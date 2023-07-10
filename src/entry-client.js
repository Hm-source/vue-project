// 앱을 DOM 엘리먼트에 마운트하는 스크립트
import { createApp } from "./main";
// main의 createApp을 사용해서 hydrated한다.
// server 에서 받은 html을 hydrated함.
// hydrating : 다이나믹 DOM은 리렌더링없이 사용자와 상호작용
const { app, router } = createApp();
// 하이드레이트하는 동안 서버에서 실행된 것과 동일한 Vue 앱을 만들고 
// 제어해야 하는 DOM 노드에 각 컴포넌트를 일치시키고 DOM 이벤트 핸들러를 연결합니다.
router.isReady().then(() => {
  // app 컨테이너 요소에 애플리케이션 인스턴스를 탑재합니다.
  app.mount("#app");
  console.log("hydrated");
});
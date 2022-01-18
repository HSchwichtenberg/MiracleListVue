import { ref } from "vue";
import { LoginInfo } from "./MiracleListProxyV2";

/**
 * Globaler Anwendungszustand mit statischen Mitgliedern
 * Alternative Flux via Vuex4 für Vue.js 3.x https://next.vuex.vuejs.org/
 */
export class AppState {
 public static Backend;

 public static CurrentLoginInfo = ref<LoginInfo | null>();

 public static get Username(): string {
  return AppState.CurrentLoginInfo.value?.username ?? "";
 }
 
 public static get Token(): string {
  return AppState.CurrentLoginInfo.value?.token ?? "";
 }

 public static get Authenticated(): boolean {
  return AppState.Token != "";
 }

 public static StateHasChanged = new Event('StateHasChanged');
 public static DispatchStateHasChanged = () => window.dispatchEvent(AppState.StateHasChanged);
}
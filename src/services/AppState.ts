import { LoginInfo } from "./MiracleListProxyV2";

/**
 * Globaler Anwendungszustand mit statischen Mitgliedern
 * Alternative Flux via Vuex4 für Vue.js 3.x https://next.vuex.vuejs.org/
 */
export class AppState {
  public static Backend;

  public static CurrentLoginInfo: LoginInfo | null = new LoginInfo();

  public static get Authenticated(): boolean {
    return this.Token != "";
  }
  public static get Username(): string {
    return this.CurrentLoginInfo?.username ?? "";
  }
   public static get Token(): string {
    return this.CurrentLoginInfo?.token ?? "";
  }

  public static StateHasChanged = new Event('StateHasChanged');
  public static DispatchStateHasChanged = ()=> window.dispatchEvent(AppState.StateHasChanged);
}

  // test : number = 0;

  // test1()
  // {

  // }
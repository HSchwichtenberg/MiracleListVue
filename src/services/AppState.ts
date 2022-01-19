import { computed, ref } from "vue";
import { LoginInfo } from "./MiracleListProxyV2";
import * as signalR from "@microsoft/signalr";
import { HubConnectionState } from '@microsoft/signalr';

/**
 * Globaler Anwendungszustand mit statischen Mitgliedern
 * Alternative Flux via Vuex4 für Vue.js 3.x https://next.vuex.vuejs.org/
 */
export class AppState {

 // Reactive Properties
 public static CurrentLoginInfo = ref<LoginInfo | null>();
 public static Username = computed(()=> AppState.CurrentLoginInfo.value?.username ?? "");
 
 // Normale Properties
 public static get Token(): string {
  return AppState.CurrentLoginInfo.value?.token ?? "";
 }
 public static get Authenticated(): boolean {
  return AppState.Token != "";
 }

 // Sprint 5: SignalR
 public static HubConnection = ref<signalR.HubConnection | null>();
 public static HubConnected = computed(()=> (AppState.HubConnection.value != null && AppState.HubConnection.value!.state == HubConnectionState.Connected));

}
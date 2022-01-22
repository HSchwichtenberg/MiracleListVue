import { MiracleListProxy, LoginInfo } from '@/services/MiracleListProxyV2'
import { AppState } from './AppState';

export class AuthenticationManager {

  constructor() {
    console.log("AuthenticationManager.CTOR");
  }

  STORAGE_KEY = 'Token';

  public async Login(username: string, password: string): Promise<string> {
    let result = "Unknown Login Error";

    const l = new LoginInfo();
    l.clientID = process.env.VUE_APP_ENV_ClientID;
    l.username = username;
    l.password = password;

    console.log("AuthenticationManager: Login...", l)
    const c = new MiracleListProxy(process.env.VUE_APP_ENV_Backend);
    // TODO: inject("proxy"); // geht hier nicht :-(
    await c.login(l)
      .then(r => {
        if (!r.message) {
          AppState.CurrentLoginInfo.value = r;
          localStorage.setItem(this.STORAGE_KEY, r.token!.toString());
          console.log("AuthenticationManager: Login OK!", r)
          result = "";
        }
        else {
         console.warn("AuthenticationManager: Login NOT OK!", r)
          AppState.CurrentLoginInfo.value = null;
          localStorage.removeItem(this.STORAGE_KEY);
          result = r.message;
        }
      })
      .catch(err => { console.error("AuthenticationManager: Login ERROR", err); });

      console.log(result);
    return result;
  }

  // Neu in Sprint 4
  public Logout() {
    AppState.CurrentLoginInfo.value = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Neu in Sprint 4
  public async CheckLocalTokenValid(): Promise<boolean> {
    let result = false;
    const token: string | null = localStorage.getItem(this.STORAGE_KEY);
    if (token) {
      // Es gibt ein Token im Local Storage. Nachfrage beim Server, ob noch gültig.
      console.log(`AuthenticationManager: Checking local token ${token}...`);
      const l = new LoginInfo()
      l.token = token;
      l.clientID = process.env.VUE_APP_ENV_ClientID;
      AppState.CurrentLoginInfo.value = await new MiracleListProxy(process.env.VUE_APP_ENV_Backend).login(l);
      if (AppState.CurrentLoginInfo == null || !AppState.CurrentLoginInfo.value.token) { // Token ungültig!
        console.warn(`AuthenticationManager: Token not valid: ${AppState.CurrentLoginInfo.value.message}!`);
        localStorage.removeItem(this.STORAGE_KEY);
        AppState.CurrentLoginInfo.value = null;
      }
      else { // Token gültig!
        console.log(`AuthenticationManager: Found valid Token: ${AppState.CurrentLoginInfo.value.token} for User: ${AppState.CurrentLoginInfo.value.username}`);
        result = true;
      }
    }
    else {
      console.log(`AuthenticationManager: No local token!`);
    }
    return result;
  }
}
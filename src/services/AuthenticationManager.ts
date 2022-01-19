import { MiracleListProxy, LoginInfo } from '@/services/MiracleListProxyV2'
import { AppState } from './AppState';

export class AuthenticationManager {

  constructor() {
    console.info("AuthenticationManager.CTOR");
  }

  public async LoginDebug(): Promise<boolean> {
    return await this.Login(process.env.VUE_APP_ENV_DebugUser, process.env.VUE_APP_ENV_DebugPassword);
  }

  STORAGE_KEY = 'Token';

  public async Login(username: string, password: string): Promise<boolean> {
    let result = false;

    const l = new LoginInfo();
    l.clientID = process.env.VUE_APP_ENV_ClientID;
    l.username = username;
    l.password = password;

    console.info("AuthenticationManager: Login...", l)
    const c = new MiracleListProxy(process.env.VUE_APP_ENV_Backend);
    // TODO: inject("proxy"); // geht hier nicht :-(
    await c.login(l)
      .then(r => {
        if (!r.message) {
          AppState.CurrentLoginInfo.value = r;
          localStorage.setItem(this.STORAGE_KEY, r.token!.toString());
          console.info("AuthenticationManager: Login OK!", r)
          result = true;
        }
        else {
         console.warn("AuthenticationManager: Login NOT OK!", r)
          AppState.CurrentLoginInfo.value = null;
          localStorage.removeItem(this.STORAGE_KEY);
        }
      })
      .catch(err => { console.error("AuthenticationManager: Login ERROR", err); });

      console.log(result);
    return result;
  }

  // Neu in Teil 4
  public Logout() {
    AppState.CurrentLoginInfo.value = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Neu in Teil 4
  public async CheckLocalTokenValid(): Promise<boolean> {
    let result = false;
    const token: string | null = localStorage.getItem(this.STORAGE_KEY);
    if (token) {
      // Es gibt ein Token im Local Storage. Nachfrage beim Server, ob noch gültig.
      console.info(`AuthenticationManager: Checking local token ${token}...`);
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
        console.info(`AuthenticationManager: Found valid Token: ${AppState.CurrentLoginInfo.value.token} for User: ${AppState.CurrentLoginInfo.value.username}`);
        result = true;
      }
    }
    else {
      console.info(`AuthenticationManager: No local token!`);
    }
    return result;
  }
}
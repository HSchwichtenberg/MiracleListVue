import { MiracleListProxy, LoginInfo } from '@/services/MiracleListProxyV2'
import { AppState } from './AppState';

export class AuthenticationManager {
  DebugUser = "ihre@email.de";
  DebugPassword = "geheim"; // :-)
  ClientID = "11111111-1111-1111-1111-111111111111"; // TODO: Hier Ihre persönliche Client-ID eintragen! http://miraclelistbackend.azurewebsites.net/clientid/WD
  Backend = "";

  constructor(backend: string) {
    console.warn("AuthenticationManager.CTOR", backend);
    this.Backend = backend;
  }

  public async LoginDebug(): Promise<boolean> {
    return await this.Login(this.DebugUser, this.DebugPassword);
  }

  STORAGE_KEY = 'Token';

  public async Login(username: string, password: string): Promise<boolean> {
    let result = false;

    const l = new LoginInfo();
    l.clientID = this.ClientID;
    l.username = username;
    l.password = password;

    console.log("AuthenticationManager: Login OK!", l)
    const c = new MiracleListProxy(this.Backend);
    // TODO: inject("proxy"); // geht hier nicht :-(
    await c.login(l)
      .then(r => {
        if (!r.message) {
          AppState.CurrentLoginInfo = r;
          localStorage.setItem(this.STORAGE_KEY, r.token!.toString());
          console.log("AuthenticationManager: Login OK!", r)
          result = true;
        }
        else {
          AppState.CurrentLoginInfo = null;
          localStorage.removeItem(this.STORAGE_KEY);
        }
        AppState.DispatchStateHasChanged();
      })
      .catch(err => { console.error(err); });

    return result;
  }

  // Neu in Teil 4
  public Logout() {
    AppState.CurrentLoginInfo = null;
    localStorage.removeItem(this.STORAGE_KEY);
    AppState.DispatchStateHasChanged();
  }

  // Neu in Teil 4
  public async CheckLocalTokenValid(): Promise<boolean> {
    let result = false;
    const token: string | null = localStorage.getItem(this.STORAGE_KEY);
    if (token) {
      // Es gibt ein Token im Local Storage. Nachfrage beim Server, ob noch gültig.
      console.log(`AuthenticationManager: Checking local token ${token}...`);
      const l = new LoginInfo()
      l.token = token;
      l.clientID = this.ClientID;
      AppState.CurrentLoginInfo = await new MiracleListProxy(this.Backend).login(l);
      if (AppState.CurrentLoginInfo == null || !AppState.CurrentLoginInfo.token) { // Token ungültig!
        console.log(`AuthenticationManager: Token not valid: ${AppState.CurrentLoginInfo.message}!`);
        localStorage.removeItem(this.STORAGE_KEY);
        AppState.CurrentLoginInfo = null;
      }
      else { // Token gültig!
        console.log(`AuthenticationManager: Found valid Token: ${AppState.CurrentLoginInfo!.token} for User: ${AppState.CurrentLoginInfo!.username}`);
        result = true;
      }
    }
    else {
      console.log(`AuthenticationManager: No local token!`);
    }
    AppState.DispatchStateHasChanged();
    return result;
  }
}
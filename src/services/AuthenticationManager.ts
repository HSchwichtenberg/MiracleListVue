import { MiracleListProxy, LoginInfo } from "@/services/MiracleListProxyV2";

export class AuthenticationManager {
 constructor() {
  console.log("AuthenticationManager.CTOR");
 }

 /** nur in Sprint 2+3 zur einfacheren Entwicklung */
 public async LoginDebug(): Promise<LoginInfo | null> {
  const l = new LoginInfo();
  l.clientID = process.env.VUE_APP_ENV_ClientID;
  l.username = process.env.VUE_APP_ENV_DebugUser;
  l.password = process.env.VUE_APP_ENV_DebugPassword;

  try {
  const proxy = new MiracleListProxy(process.env.VUE_APP_ENV_Backend); 
  const loginInfo = await proxy.login(l);
  console.log("AuthenticationManager: Login result", l);
  return loginInfo;
  } catch (error) {
   console.error(error);
   return null;
  }
 }
}
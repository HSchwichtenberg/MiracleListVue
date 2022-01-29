// Jest Unit Tests für MiracleList Login.vue
// https://nightwatchjs.org/guide

import { flushPromises, shallowMount } from "@vue/test-utils";
import Login from "@/views/Login.vue";

// Eigenes Mock-Objekt
// export class AuthenticationManagerMock {
//  constructor(public loginOK: string = "") {}
//  public async Login(username: string, password: string): Promise<string> {
//   return this.loginOK;
//  }
//  public async CheckLocalTokenValid(): Promise<boolean> {
//   return false;
//  }
// }

// Jest-basiertes Mock-Objekt
const AuthenticationManagerMock = {
 Login: jest.fn(),
 CheckLocalTokenValid: jest.fn().mockResolvedValue(false),
};

// Modul via Jest mocken
jest.mock("vue-router", () => ({
 useRouter: () => ({
  push: jest.fn(),
 }),
 useRoute: () => ({
  path: "/",
 }),
}));

// Hilfsfunktion für Tests
async function DoLogin(wrapper, username, password) {
 // Prüfe Überschrift
 expect(wrapper.get(".panel-heading").text()).toEqual("User Login");
 // Loginformular ausfüllen
 await wrapper.find("input[name=username]").setValue(username);
 await wrapper.find("input[name=password]").setValue(password);
 // Anmelden
 await wrapper.find("button[type=submit]").trigger("click");
}

describe("Login Test", () => {
 
 it("Login Error", async () => {
  const errortext = "Login Error!";
  AuthenticationManagerMock.Login.mockResolvedValueOnce(errortext);

  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer Fehlertext liefern bei Login
     AuthenticationManager: AuthenticationManagerMock,
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "unittest", "falschesKennwort");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // prüfe Aufrufe
  expect(AuthenticationManagerMock.CheckLocalTokenValid).toHaveBeenCalledTimes(1);
  expect(AuthenticationManagerMock.Login).toHaveBeenCalledTimes(1);
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual(errortext);
 });

 it("Login leer", async () => {
  AuthenticationManagerMock.CheckLocalTokenValid;
  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer "" ==OK liefern bei Login
     AuthenticationManager: AuthenticationManagerMock,
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "", "");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // prüfe Aufrufe
  expect(AuthenticationManagerMock.CheckLocalTokenValid).toHaveBeenCalledTimes(1);
  expect(AuthenticationManagerMock.Login).toHaveBeenCalledTimes(0);
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("Username and Password required!");
 });

 it("Login OK", async () => {
  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer "" == OK liefern bei Login
     AuthenticationManager: AuthenticationManagerMock,
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "Benutzername", "Kennwort");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // prüfe Aufrufe
  expect(AuthenticationManagerMock.CheckLocalTokenValid).toHaveBeenCalledTimes(1);
  expect(AuthenticationManagerMock.Login).toHaveBeenCalledTimes(1);
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("");
 });

}); // Ende der Test Suite "Login Test"
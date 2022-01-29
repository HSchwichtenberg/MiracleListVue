// Jest Unit Tests für MiracleList Login.vue
// https://nightwatchjs.org/guide

import { flushPromises, shallowMount } from "@vue/test-utils";
import Login from "@/views/Login.vue";

// Eigenes Mock-Objekt
export class AuthenticationManagerMock {
 constructor(public loginOK: string = "") {}
 public async Login(username: string, password: string): Promise<string> {
  return this.loginOK;
 }
 public async CheckLocalTokenValid(): Promise<boolean> {
  return false;
 }
}

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

describe("Login test", () => {
 it("Login Error", async () => {
  const errortext = "Login Error!";
  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer Fehlertext liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(errortext),
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "unittest", "falschesKennwort");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual(errortext);
 });

 it("Login leer", async () => {
  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer "" ==OK liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(""),
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "", "");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("Username and Password required!");
 });

 it("Login OK", async () => {
  const wrapper = shallowMount(Login, {
   global: {
    provide: {
     // wird immer "" == OK liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(""),
    },
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "Benutzername", "Kennwort");
  // wichtig, da der Klick auf #login asynchron behandelt wird!
  await flushPromises();
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("");
 });
}); // ende describe()

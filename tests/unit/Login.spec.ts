// Jest Unit Tests für MiracleList Login.vue
// https://nightwatchjs.org/guide

import { mount } from "@vue/test-utils";
import Login from "@/views/Login.vue";

// jest.retryTimes(1);

export class AuthenticationManagerMock {
 constructor(public loginOK: boolean) {}
 public async Login(username: string, password: string): Promise<boolean> {
  return this.loginOK;
 }
 public async CheckLocalTokenValid(): Promise<boolean> {
  return false;
 }
}

jest.mock('vue-router', () => ({
 useRouter: () => ({
   push: jest.fn()
 })
}));


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
  const wrapper = mount(Login, {
   global: {
    provide: {
     // wird immer false liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(false),
    },
    mocks: {},
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "unittest", "falschesKennwort");
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("Login Error!");
 });

 it("Login leer", async () => {
  const wrapper = mount(Login, {
   global: {
    provide: {
     // wird immer false liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(false),
    },
    mocks: {},
   },
  });
  // Anmeldeformular ausfüllen
  DoLogin(wrapper, "", "");
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("Username and Password required!");
 });
});

it("Login OK", async () => {
 const wrapper = mount(Login, {
  global: {
   provide: {
    // wird immer false liefern bei Login
    AuthenticationManager: new AuthenticationManagerMock(true),
   },
   mocks: {},
  },
 });
 // Anmeldeformular ausfüllen
 DoLogin(wrapper, "x", "x");
 // Prüfe Ergebnis
 expect(wrapper.get("#errorMsg").text()).toEqual("");
});
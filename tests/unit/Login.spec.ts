import { mount } from "@vue/test-utils";
import Login from "@/views/Login.vue";

jest.retryTimes(1);

export class AuthenticationManagerMock {
 constructor(public loginOK: boolean) {}
 public async Login(username: string, password: string): Promise<boolean> {
  return this.loginOK;
 }
 public async CheckLocalTokenValid(): Promise<boolean> {
  return false;
 }
}

// jest.mock('vue-router', () => ({
//  useRouter: () => ({
//    push: jest.fn()
//  })
// }));

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
  // Prüfe Überschrift
  expect(wrapper.get(".panel-heading").text()).toEqual("User Login");
  // Loginformular ausfüllen
  await wrapper.find("input[name=username]").setValue("unittest");
  await wrapper.find("input[name=password]").setValue("falschesKennwort");
  await wrapper.find("button[type=submit]").trigger("click");
  // Prüfe Ergebnis
  expect(wrapper.get("#errorMsg").text()).toEqual("Login Error!");
 });

 it("Login OK", async () => {
  const wrapper = mount(Login, {
   global: {
    provide: {
     // wird immer true liefern bei Login
     AuthenticationManager: new AuthenticationManagerMock(true),
    },
    mocks: {},
   },
  });

  // Prüfe Überschrift
  expect(wrapper.get(".panel-heading").text()).toEqual("User Login");
  // Loginformular ausfüllen
  await wrapper.find("input[name=username]").setValue("unittest");
  await wrapper.find("input[name=password]").setValue("richtigesKennwort");
  // Prüfe Ergebnis
  await wrapper.find("button[type=submit]").trigger("click");
 });
});

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
     AuthenticationManager: new AuthenticationManagerMock(false),
    },
    mocks: {},
   },
  });

  console.log("WRAPPER", wrapper);
  expect(wrapper.get(".panel-heading").text()).toEqual("User Login");

  await wrapper.find("input[name=username]").setValue("unittest");
  await wrapper.find("input[name=password]").setValue("unsinn");
  await wrapper.find("button[type=submit]").trigger("click");
  expect(wrapper.get("#errorMsg").text()).toEqual("Login Error!");
 });

 it("Login OK", async () => {


  const wrapper = mount(Login, {
   global: {
    provide: {
     AuthenticationManager: new AuthenticationManagerMock(true),
    },
    mocks: {},
   },
  });

  console.log("WRAPPER", wrapper);
  expect(wrapper.get(".panel-heading").text()).toEqual("User Login");

  await wrapper.find("input[name=username]").setValue("unittest");
  await wrapper.find("input[name=password]").setValue("unsinn");
  await wrapper.find("button[type=submit]").trigger("click");

 });
});

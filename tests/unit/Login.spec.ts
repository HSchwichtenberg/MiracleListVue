import { mount } from '@vue/test-utils'
import Login from '@/views/Login.vue'
import { AuthenticationManager } from '@/services/AuthenticationManager';

jest.retryTimes(1);

export class AuthenticationManagerMock {
 public async Login(username: string, password: string): Promise<boolean> {
 return true;
 }

 public async CheckLocalTokenValid(): Promise<boolean> { return false; }
}

describe('Login test', () => {
  it('renders props.msg when passed', async () => {

   const mockRoute = {
    params: {
      id: 1
    }
  }

   const mockRouter = {
    path: "/"
  }

    const wrapper = mount(Login, {
     global: {
      provide: {
       AuthenticationManager : new AuthenticationManagerMock(),
      },
      mocks: {
        useRoute: mockRouter,
        $route: mockRoute,
        $router: mockRouter
      }
    }});

    console.log("WRAPPER",wrapper);
    expect(wrapper.get(".panel-heading").text()).toEqual("User Login");

    await wrapper.find('input[name=username]').setValue('unittest')
    await wrapper.find('input[name=password]').setValue('unittest+init')
    await wrapper.find('button[type=submit]').trigger('click')
  })
})

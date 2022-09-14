import { shallowMount, mount } from '@vue/test-utils'
import UserStatus from '@/components/UserStatus.vue'
import { vi,describe, it, expect, afterEach } from "vitest";
describe('UserStatus not logged in', () => {
  it("UserStatus shows You're not signed in", () => {
    const name = 'max mustermann'

    const wrapper = mount(UserStatus, {
     Username: { name }
    })

    expect(wrapper.text()).toMatch("You're not signed in!")
    expect(wrapper.get('#C_Username').text()).toBe("You're not signed in!")
  })
})

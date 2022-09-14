import Login from "@/views/Login.vue";
import { vi,describe, it, expect, afterEach, test } from "vitest";

describe("Diagnose1", () => {
  it("1+1 != 3", () => {
  //console.log(vi);

    expect(1+1).not.toBe(3);  
  });
});

test("Diagnose2", () => {
 it("1+1 == 2", () => {
 // console.log(vi);
   expect(1+1).toBe(2)
 });
});
/* eslint-disable @typescript-eslint/no-explicit-any */
// STUB — demo game ran via old Parse backend; no equivalent endpoint on new backend yet.

const DemoApi = {
  fetchDemoGame: async (): Promise<any> =>
    Promise.resolve({ success: false as const, data: null }),
}

export default DemoApi

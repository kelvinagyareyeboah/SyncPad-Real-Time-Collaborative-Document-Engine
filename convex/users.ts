import { query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async () => {
    return { _id: "demo-user", name: "Demo User", email: "demo@syncpad.dev", image: null };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async () => {
    return [{ _id: "demo-user", name: "Demo User", image: null }];
  },
});

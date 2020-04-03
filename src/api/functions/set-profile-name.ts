declare module WAPI {
  const setMyName: (newName: string) => void;
}

/**
 * Sets current user profile name
 * @param name
 */
export async function setProfileName(name: string) {
  return await this.page.evaluate(
    ({ name }) => {
      WAPI.setMyName(name);
    },
    { name }
  );
}

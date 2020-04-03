declare module WAPI {
  const setMyStatus: (to: string) => void;
}

/**
 * Sets current user profile status
 * @param status
 */
export async function setProfileStatus(status: string) {
  return await this.page.evaluate(
    ({ status }) => {
      WAPI.setMyStatus(status);
    },
    { status }
  );
}

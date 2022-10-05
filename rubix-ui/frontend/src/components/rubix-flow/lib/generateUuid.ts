export const generateUuid = () => {
  let uuid = (1e7 + -1e3 + -4e3 + -8e3 + -1e11)
    .toString()
    .replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  return uuid.split("-").join("");
};

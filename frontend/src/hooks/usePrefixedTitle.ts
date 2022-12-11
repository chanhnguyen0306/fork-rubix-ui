import { useState } from "react";

const useTitlePrefix = (title = "") => {
  const [prefixedTitle, updateTitlePrefix] = useState(title as string);

  const addPrefix = (prefix = "") => {
    if (prefix) {
      const t = prefix + " | " + title;
      updateTitlePrefix(t);
    }
  };

  return { prefixedTitle, addPrefix };
};

export default useTitlePrefix;

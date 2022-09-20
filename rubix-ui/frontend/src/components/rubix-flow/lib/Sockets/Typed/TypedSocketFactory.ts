import Socket from "../Socket";
import BooleanSocket from "./BooleanSocket";
import NumberSocket from "./NumberSocket";
import StringSocket from "./StringSocket";

export const createTypedSocket = (
  valueTypeName: string,
  name: string
): Socket => {
  switch (valueTypeName) {
    case "string":
      return new StringSocket(name);
    case "number":
      return new NumberSocket(name);
    case "boolean":
      return new BooleanSocket(name);
    default:
      throw new Error(`unsupported valueTypeName: ${valueTypeName}`);
  }
};

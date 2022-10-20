import { useCallback } from "react";
import { useReactFlow } from "react-flow-renderer/nocss";

export const useChangeNodeData = (id: string) => {
  const instance = useReactFlow();

  return useCallback(
    (key: string, value: any) => {
      instance.setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id !== id) return n;
          return {
            ...n,
            data: {
              ...n.data,
              [key]: value,
            },
          };
        })
      );
    },
    [instance, id]
  );
};

export const useChangeNodeProprerties = (id: string) => {
  const instance = useReactFlow();

  return useCallback(
    (key: string, value: any) => {
      instance.setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id !== id) return n;
          return {
            ...n,
            [key]: value,
          };
        })
      );
    },
    [instance, id]
  );
};

export const useChangeNode = (id: string) => {
  const instance = useReactFlow();

  return useCallback(
    (updateNode: any) => {
      instance.setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id !== id) return n;
          return {
            ...updateNode,
          };
        })
      );
    },
    [instance, id]
  );
};
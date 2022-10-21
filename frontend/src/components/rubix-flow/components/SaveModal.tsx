import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useEdges, useNodes } from "react-flow-renderer/nocss";
import { FlowFactory } from "../factory";
import { NodeJSON } from "../lib";
import { flowToBehave } from "../transformers/flowToBehave";
import { Modal } from "./Modal";

export type SaveModalProps = { open?: boolean; onClose: () => void };

export const SaveModal: FC<SaveModalProps> = ({ open = false, onClose }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [nodeRender, setNodeRender] = useState("");

  const edges = useEdges();
  const nodes = useNodes();

  const flow = useMemo(() => flowToBehave(nodes, edges), [nodes, edges]);

  const handleCopy = () => {
    ref.current?.select();
    document.execCommand("copy");
    ref.current?.blur();
    setCopied(true);
    setInterval(() => {
      setCopied(false);
    }, 1000);
  };

  const handleNodeRender = () => {
    const selectedNodes: NodeJSON[] = flow.nodes.filter(item => item.settings?.selected);
    const newNodes: NodeJSON[] = selectedNodes.length === 0 ? flow.nodes : selectedNodes;

    newNodes.map((item) => {
      if (item.settings && "selected" in item.settings) delete item.settings.selected;
      return newNodes;
    });

    setNodeRender(JSON.stringify({ nodes: newNodes }, null, 2));
  };

  useEffect(() => {
    handleNodeRender();
  }, [flow]);

  return (
    <Modal
      title="Save Graph"
      actions={[
        { label: "Cancel", onClick: onClose },
        { label: copied ? "Copied" : "Copy", onClick: handleCopy },
      ]}
      open={open}
      onClose={onClose}
    >
      <textarea
        ref={ref}
        className="border border-gray-300 p-2"
        defaultValue={nodeRender}
        style={{ height: "50vh", width: "500px" }}
      />
    </Modal>
  );
};

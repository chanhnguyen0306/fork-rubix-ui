import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useEdges, useNodes } from "react-flow-renderer/nocss";
import { flowToBehave } from "../transformers/flowToBehave";
import { Modal } from "./Modal";

export type SaveModalProps = { open?: boolean; onClose: () => void };

export const SaveModal: FC<SaveModalProps> = ({ open = false, onClose }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [nodeRender, setNodeRender] = useState('');

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

  useEffect(() => {
    const _nodes = flow.nodes.filter((item) => {
      const isSelected = item.settings.selected;
      delete item.settings;

      return isSelected && item;
    });

    const newNodes = _nodes.length === 0 ? flow : { nodes: _nodes };

    setNodeRender(JSON.stringify(newNodes, null, 2));
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

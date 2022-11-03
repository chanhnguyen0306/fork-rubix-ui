import { useState } from "react";
import { JsonTable } from "react-json-to-html";
import { JsonModal } from "./components/JsonModal";

export const UserGuide = () => {
  const [isOpenJsonModal, setIsOpenJsonModal] = useState<boolean>(false);
  const [json, setJson] = useState<object>({});

  const handleToggleModal = () => {
    setIsOpenJsonModal((p) => !p);
  };

  const handleSubmitModal = (value: string) => {
    setJson(JSON.parse(value));
    handleToggleModal();
  };

  return (
    <>
      <div className="z-[1] text-black">
        <button
          className="flex text-white p-2 mb-3 rounded cursor-pointer bg-blue-400 hover:bg-blue-500"
          onClick={handleToggleModal}
        >
          Input Json
        </button>
        <JsonTable json={json} />
      </div>
      <JsonModal
        open={isOpenJsonModal}
        onSubmit={handleSubmitModal}
        onClose={handleToggleModal}
      />
    </>
  );
};

export default UserGuide;

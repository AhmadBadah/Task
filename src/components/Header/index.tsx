import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useEdgesState, useNodesState, useReactFlow } from "reactflow";
import useAppDispatch from "../../hooks/useAppDispatch";
import useTypedSelector from "../../hooks/useTypedSelector";
import { setFlowFile, updateNodeName } from "../../store/Slice/home";
import saveToJson from "../../utils/saveToJson";

export interface Position {
  x: number;
  y: number;
}

export interface Data {
  label: string;
}

export interface PositionAbsolute {
  x: number;
  y: number;
}

export interface Node {
  width: number;
  height: number;
  id: string;
  type: string;
  position: Position;
  data: Data;
  selected: boolean;
  positionAbsolute: PositionAbsolute;
  dragging: boolean;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface RootObject {
  nodes: Node[];
  edges: any[];
  viewport: Viewport;
}

const Header = ({ reactFlowInstance }: any) => {
  const { selectedNode } = useTypedSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const [nodeName, setNodeName] = useState<string>(
    selectedNode.data.label || ""
  );

  const onChangeName = useCallback((val: any) => {
    setNodeName(val.target.value);
  }, []);

  const updateNode = useCallback(() => {
    console.log("nodeName: ", nodeName);
    dispatch(updateNodeName(nodeName));
  }, [nodeName]);

  useEffect(() => {
    if (selectedNode.data.label) {
      setNodeName(selectedNode.data.label);
    }
  }, [selectedNode.data.label]);

  const onUpload = useCallback((e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      if (e?.target?.result) {
        const result = JSON.parse(`${e.target.result}`);
        dispatch(setFlowFile(result));
      }
    };
  }, []);

  const onDownload = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      saveToJson(`${Math.random()}.json`, flow);
    }
  }, [reactFlowInstance]);

  return (
    <div className="d-flex justify-content-between align-items-end flex-wrap pb-3">
      {selectedNode.id !== "-1" && (
        <div className="mb-3 mb-md-0">
          <p className="my-2">Node Text</p>
          <div className="d-flex align-items-center">
            <Form.Control
              className="w-100"
              type="text"
              value={nodeName}
              onChange={onChangeName}
              placeholder="Node Name"
            />
            <Button onClick={updateNode} className="mx-3">
              Update
            </Button>
          </div>
        </div>
      )}
      <div className="d-flex align-items-center">
        <label className="custom-file-upload">
          <input type={"file"} onChange={onUpload} />
          Upload
        </label>
        <Button onClick={onDownload} className="mx-3">
          Download
        </Button>
      </div>
    </div>
  );
};

export default Header;

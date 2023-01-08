import { createSlice } from "@reduxjs/toolkit";
import { Node } from "reactflow";
import { INode } from "../../models";

interface HomeState {
  selectedNode: Node<INode>;
  flowFile: any;
}

const initialState: HomeState = {
  selectedNode: {
    id: "-1",
    data: { label: "" },
    position: { x: 0, y: 0 },
  },
  flowFile: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    updateNodeName: (state, action) => {
      state.selectedNode.data.label = action.payload;
    },
    setFlowFile: (state, action) => {
      state.flowFile = action.payload;
    },
    resetNode: (state) => {
      state.selectedNode = {
        id: "-1",
        data: { label: "" },
        position: { x: 0, y: 0 },
      };
    },
  },
});

export const { setNode, updateNodeName, resetNode, setFlowFile } =
  homeSlice.actions;

export default homeSlice.reducer;

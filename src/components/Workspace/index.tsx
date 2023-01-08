import React, { DragEvent, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import useAppDispatch from "../../hooks/useAppDispatch";
import useTypedSelector from "../../hooks/useTypedSelector";
import { INode } from "../../models";
import { setNode } from "../../store/Slice/home";

const initialNodes: Node<INode>[] = [];

const initialEdges: Edge[] = [];

const Workspace = ({ reactFlowInstance, setReactFlowInstance }: any) => {
  const dispatch = useAppDispatch();
  const { selectedNode, flowFile } = useTypedSelector((state) => state.home);
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setViewport } = useReactFlow();
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, n: Node<INode>) => {
      dispatch(setNode(n));
    },
    [dispatch]
  );

  useEffect(() => {
    if (selectedNode.data.label) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === selectedNode.id) {
          const updatedNode = {
            ...node,
            data: { ...node.data, label: selectedNode.data.label },
          };
          return updatedNode;
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  }, [selectedNode.data.label, nodes, selectedNode.id, setNodes]);

  useEffect(() => {
    if (flowFile) {
      const { x = 0, y = 0, zoom = 1 } = flowFile.viewport;
      setNodes(flowFile.nodes || []);
      setEdges(flowFile.edges || []);
      setViewport({ x, y, zoom });
    }
  }, [flowFile]);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds?.left,
        y: event.clientY - reactFlowBounds?.top,
      });
      const newNode = {
        id: `${Math.random()}_node`,
        type,
        position,
        data: { label: `${type} node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        unselectable="off"
        onNodesDelete={(nodes) => {
          console.log({ nodes });
        }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Workspace;

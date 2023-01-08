import { FC, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Header, Sidebar, Workspace } from "../../components";
import { INode } from "../../models";

const initialNodes: Node<INode>[] = [];

const initialEdges: Edge[] = [];

const Home: FC = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  return (
    <ReactFlowProvider>
      <Container className="d-flex flex-column app" style={{ flex: 1 }}>
        <Header
          setNodes={setNodes}
          setEdges={setEdges}
          reactFlowInstance={reactFlowInstance}
        />
        <Row
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderTopColor: "#000",
            borderTopStyle: "solid",
          }}
        >
          <Col
            className="order-2 order-md-1"
            xs={12}
            md={9}
            style={{
              borderRightWidth: 1,
              minHeight: 500,
              borderRightColor: "#000",
              borderRightStyle: "solid",
            }}
          >
            <Workspace
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              setReactFlowInstance={setReactFlowInstance}
              reactFlowInstance={reactFlowInstance}
            />
          </Col>
          <Col className="order-1 order-md-2" xs={12} md={3}>
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </ReactFlowProvider>
  );
};

export default Home;

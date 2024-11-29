import React, { useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type FlowchartNode = Node;
type FlowchartEdge = Edge;

interface FlowChartProps {
  initialElements: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { label: string };
  }>;
  onAddChoice: (chapterId: number) => void;
  onAddChapter: (choiceId: number) => void;
}

const CustomNode = ({
  data,
}: {
  data: {
    label: string;
    type?: "story" | "chapter" | "choice";
    onAddChoice?: () => void;
    onAddChapter?: () => void;
  };
}) => (
  <div className="">
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />

    <div className="flex flex-col gap-2">
      <div className="text-xl">{data.label}</div>

      {data.type === "chapter" && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            data.onAddChoice?.();
          }}
        >
          <Plus className="w-4 h-4" />
          Add Choice
        </Button>
      )}

      {data.type === "choice" && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            data.onAddChapter?.();
          }}
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </Button>
      )}
    </div>
  </div>
);

const FlowChart: React.FC<FlowChartProps> = ({
  initialElements,
  onAddChoice,
  onAddChapter,
}) => {
  const [elements, setElements] =
    useState<(FlowchartNode | FlowchartEdge)[]>(initialElements);

  useEffect(() => {
    setElements(initialElements);
  }, [initialElements]);

  const onConnect = (params: Connection) =>
    setElements((els) => addEdge(params, els as FlowchartEdge[]));

  const nodes = elements
    .filter((el): el is FlowchartNode => !("source" in el))
    .map((node) => ({
      ...node,
      type: "custom",
      draggable: false,
      data: {
        ...node.data,
        onAddChoice:
          node.data.type === "chapter"
            ? () => onAddChoice(parseInt(node.id.split("-")[1]))
            : undefined,
        onAddChapter:
          node.data.type === "choice"
            ? () => onAddChapter(parseInt(node.id.split("-")[1]))
            : undefined,
      },
    }));

  const edges = elements
    .filter((el): el is FlowchartEdge => "source" in el)
    .map((edge) => ({
      ...edge,
      type: "bezier",
    }));

  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <ReactFlowProvider>
      <div className="text-black w-full h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          panOnScroll
          zoomOnScroll
          panOnDrag={true}
          elementsSelectable={true}
          nodesDraggable={false}
          minZoom={0.2}
          maxZoom={2}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;

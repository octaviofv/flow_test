<template>
  <div class="flowchart-container" :style="containerStyle">
    <div class="flowchart-wrapper">
      <Sidebar class="flowchart-sidebar" />
      <VueFlow
        v-if="initialized"
        v-model="elements"
        :default-zoom="defaultZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :fit-view-on-init="true"
        :nodes-draggable="!isEditing"
        :nodes-connectable="!isEditing"
        :elements-selectable="!isEditing"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :auto-connect="{ type: 'smoothstep' }"
        class="flowchart"
        :default-edge-options="defaultEdgeOptions"
        direction="TB"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        @nodeClick="onNodeClick"
        @connect="onConnect"
        @paneClick="onPaneClick"
        @dragover="onDragOver"
        @drop="onDrop"
        @nodeDragStop="onNodeDragStop"
        @nodesDelete="onNodesDelete"
        @edgesDelete="onEdgesDelete"
      >
        <template #node-custom="nodeProps">
          <CustomNode v-bind="nodeProps" @update:data="onNodeDataUpdate" />
        </template>
        <template #node-comment="nodeProps">
          <CommentNode v-bind="nodeProps" @update:data="onNodeDataUpdate" />
        </template>
        <template #node-conditional="nodeProps">
          <ConditionalNode v-bind="nodeProps" @update:data="onNodeDataUpdate" />
        </template>

        <Background :pattern-color="backgroundColor" :gap="backgroundGap" />
        <Controls />
        <MiniMap v-if="showMinimap" />
        
        <!-- Controles de Zoom personalizados -->
        <Panel class="zoom-controls" position="bottom-right">
          <button 
            @click="zoomIn" 
            class="zoom-btn zoom-in"
            title="Acercar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button 
            @click="zoomOut" 
            class="zoom-btn zoom-out"
            title="Alejar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button 
            @click="fitViewToContent" 
            class="zoom-btn fit-view"
            title="Ajustar vista"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </Panel>
      </VueFlow>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  VueFlow, 
  useVueFlow,
  Background, 
  Controls, 
  MiniMap, 
  Panel 
} from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import CustomNode from './components/CustomNode.vue';
import CommentNode from './components/CommentNode.vue';
import ConditionalNode from './components/ConditionalNode.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'FlowChart',
  components: {
    VueFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    CustomNode,
    CommentNode,
    ConditionalNode,
    Sidebar,
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event', 'update:content'],
  setup(props, { emit }) {
    const initialized = ref(false);
    const elements = ref([]);
    const selectedNode = ref(null);

    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState?.isEditing;
      /* wwEditor:end */
      return false;
    });

    const defaultEdgeOptions = {
      type: 'smoothstep',
      animated: true,
      style: { 
        strokeWidth: 2,
        stroke: '#3B82F6'
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#3B82F6',
      },
    };

    const { 
      findNode, 
      addNodes, 
      addEdges, 
      removeNodes, 
      project,
      fitView,
      zoomIn: vueFlowZoomIn,
      zoomOut: vueFlowZoomOut,
      zoomTo,
      getViewport,
      getNodes,
      getEdges,
    } = useVueFlow({
      defaultEdgeOptions,
    });

    const containerStyle = computed(() => ({
      height: props.content?.height || '600px',
      backgroundColor: props.content?.backgroundColor || '#fafafa',
    }));

    const defaultZoom = computed(() => props.content?.defaultZoom || 1);
    const minZoom = computed(() => props.content?.minZoom || 0.1);
    const maxZoom = computed(() => props.content?.maxZoom || 4);
    const backgroundGap = computed(() => props.content?.backgroundGap || 20);
    const showMinimap = computed(() => props.content?.showMinimap ?? true);
    const backgroundColor = computed(() => props.content?.backgroundColor || '#fafafa');
    const initialNodeValue = computed(() => props.content?.initialNodeValue || {
      "nodes": [
        {
          "type": "custom",
          "dimensions": {
            "width": 280,
            "height": 96
          },
          "handleBounds": {
            "source": [
              {
                "id": "right",
                "position": "right",
                "x": 278,
                "y": 45,
                "width": 6,
                "height": 6
              },
              {
                "id": "bottom",
                "position": "bottom",
                "x": 137,
                "y": 94,
                "width": 6,
                "height": 6
              }
            ],
            "target": [
              {
                "id": "top",
                "position": "top",
                "x": 137,
                "y": -4,
                "width": 6,
                "height": 6
              },
              {
                "id": "left",
                "position": "left",
                "x": -4,
                "y": 45,
                "width": 6,
                "height": 6
              }
            ]
          },
          "computedPosition": {
            "x": -125.17520353434588,
            "y": -66.91720503768197,
            "z": 0
          },
          "selected": false,
          "dragging": false,
          "resizing": false,
          "initialized": true,
          "data": {
            "label": "Entrada",
            "content": "Información de entrada",
            "number": "1",
            "backgroundColor": "#E3F2FD",
            "toolName": "Sin herramienta"
          },
          "events": {},
          "id": "input",
          "position": {
            "x": -125.17520353434588,
            "y": -66.91720503768197
          },
          "size": {
            "width": 280,
            "height": 100
          },
          "handles": {
            "source": [
              "bottom"
            ],
            "target": [
              "top"
            ]
          }
        }
      ],
      "edges": []
    });

    const defaultFlowData = initialNodeValue;

    // Update flowData when nodes or edges change
    watch([() => getNodes().value, () => getEdges().value], ([nodes, edges]) => {
      const flowData = {
        nodes,
        edges
      };

      const stringifiedData = JSON.stringify(flowData);
      
      if (stringifiedData !== props.content.flowData) {
        const updatedContent = {
          ...props.content,
          flowData: stringifiedData
        };
        emit('update:content', updatedContent);
        // Emit flowSaved event with the updated flow data
        emit('trigger-event', { 
          name: 'flowSaved', 
          event: { flowData }
        });
      }
    }, { deep: true });

    onMounted(() => {
      try {
        if (props.content?.flowData) {
          const parsedData = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData;
          
          elements.value = [
            ...parsedData.nodes,
            ...parsedData.edges
          ];
        } else {
          elements.value = [
            ...defaultFlowData.value.nodes,
            ...defaultFlowData.value.edges
          ];
        }
        initialized.value = true;
        
        setTimeout(() => {
          fitView({ padding: 0.2 });
        }, 100);
      } catch (error) {
        console.error('Error initializing flow data:', error);
        elements.value = [];
        initialized.value = true;
      }
    });

    const generateId = () => `node_${Date.now()}`;

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
      const data = JSON.parse(event.dataTransfer.getData('application/vueflow'));
      const position = project({ x: event.clientX, y: event.clientY });

      const newNode = {
        id: generateId(),
        ...data,
        position,
        data: {
          ...data.data,
          content: data.data?.content || 'Nuevo Nodo',
        }
      };

      addNodes([newNode]);
      emit('trigger-event', { name: 'nodeAdded', event: { node: newNode } });
    };

    const onNodeClick = (event, node) => {
      selectedNode.value = node;
      emit('trigger-event', { name: 'nodeSelected', event: { node } });
    };

    const onConnect = (connection) => {
      if (connection?.source && connection?.target) {
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          ...connection,
          type: 'smoothstep',
          animated: true,
        };
        
        addEdges([newEdge]);
        emit('trigger-event', { name: 'connectionCreated', event: { connection: newEdge } });
      }
    };

    const onPaneClick = () => {
      selectedNode.value = null;
      emit('trigger-event', { name: 'selectionCleared' });
    };

    const onNodeDragStop = (event, node) => {
      const updatedNode = findNode(node.id);
      if (updatedNode) {
        emit('trigger-event', { name: 'nodeMoved', event: { node: updatedNode } });
      }
    };

    const onNodesDelete = (nodes) => {
      nodes.forEach(node => {
        emit('trigger-event', { name: 'nodeDeleted', event: { nodeId: node.id } });
      });
    };

    const onEdgesDelete = (edges) => {
      edges.forEach(edge => {
        emit('trigger-event', { name: 'edgeDeleted', event: { edgeId: edge.id } });
      });
    };

    const onNodeDataUpdate = (nodeId, newData) => {
      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...newData };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
      }
    };

    const deleteSelected = () => {
      if (selectedNode.value) {
        removeNodes([selectedNode.value.id]);
        selectedNode.value = null;
        emit('trigger-event', { name: 'nodeDeleted' });
      }
    };

    const updateNodeData = (nodeId, data) => {
      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...data };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
      }
    };

    const zoomIn = () => {
      vueFlowZoomIn();
    };

    const zoomOut = () => {
      vueFlowZoomOut();
    };

    const fitViewToContent = () => {
      fitView({ padding: 0.2, duration: 300 });
    };

    return {
      elements,
      initialized,
      isEditing,
      containerStyle,
      defaultZoom,
      minZoom,
      maxZoom,
      backgroundGap,
      showMinimap,
      backgroundColor,
      initialNodeValue,
      defaultEdgeOptions,
      onNodeClick,
      onConnect,
      onPaneClick,
      deleteSelected,
      updateNodeData,
      onDragOver,
      onDrop,
      onNodeDragStop,
      onNodesDelete,
      onEdgesDelete,
      onNodeDataUpdate,
      zoomIn,
      zoomOut,
      fitViewToContent,
    };
  },
};
</script>

<style lang="scss" scoped>
.flowchart-container {
  width: 100%;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.flowchart-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.flowchart-sidebar {
  flex-shrink: 0;
  height: 100%;
  border-right: 1px solid #ddd;
  order: 1;
}

.flowchart {
  flex-grow: 1;
  height: 100%;
  order: 2;

  :deep(.vue-flow__node) {
    width: auto;
    height: auto;
  }

  :deep(.vue-flow__handle) {
    width: 8px;
    height: 8px;
    background: #2196F3;
    border: 2px solid white;
  }

  :deep(.vue-flow__edge-path) {
    stroke: #2196F3;
    stroke-width: 2;
  }
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);

  .zoom-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #374151;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
      color: #111827;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    svg {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }
  }

  .zoom-in svg {
    color: #10b981;
  }

  .zoom-out svg {
    color: #f59e0b;
  }

  .fit-view svg {
    color: #3b82f6;
  }
}
</style>

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
      console.log('🔍 WATCHER DISPARADO:', {
        initialized: initialized.value,
        nodesCount: nodes?.length || 0,
        edgesCount: edges?.length || 0,
        timestamp: new Date().toLocaleTimeString(),
        trigger: 'CAMBIO EN NODES/EDGES DETECTADO'
      });

      if (!initialized.value || !nodes || !edges) {
        console.log('❌ WATCHER CANCELADO - Condiciones no cumplidas:', {
          initialized: initialized.value,
          hasNodes: !!nodes,
          hasEdges: !!edges
        });
        return;
      }
      
      const flowData = {
        nodes,
        edges
      };

      const stringifiedData = JSON.stringify(flowData);
      
      console.log('📊 DATOS ACTUALES DEL FLOW:', {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
        flowDataSize: stringifiedData.length + ' caracteres'
      });

      // 📋 MOSTRAR TODO EL FLOWDATA COMPLETO EN TEXTO
      console.log('📋 FLOWDATA COMPLETO (TEXTO):', stringifiedData);
      console.log('📋 FLOWDATA COMPLETO (OBJETO):', JSON.stringify(flowData, null, 2));
      
      // 🔍 DESGLOSE DETALLADO DE CADA NODO
      console.log('🔍 DESGLOSE DE NODOS:');
      nodes.forEach((node, index) => {
        console.log(`   Nodo ${index + 1}:`, {
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
          size: node.size,
          style: node.style
        });
      });

      // 🔗 DESGLOSE DETALLADO DE CADA EDGE
      if (edges.length > 0) {
        console.log('🔗 DESGLOSE DE EDGES:');
        edges.forEach((edge, index) => {
          console.log(`   Edge ${index + 1}:`, {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            style: edge.style
          });
        });
      } else {
        console.log('🔗 NO HAY EDGES ACTUALMENTE');
      }

      console.log('🔄 COMPARANDO CON FLOWDATA ANTERIOR:', {
        tieneFlowDataAnterior: !!props.content.flowData,
        sonIguales: stringifiedData === props.content.flowData,
        flowDataAnteriorSize: props.content.flowData?.length || 0 + ' caracteres'
      });
      
      if (stringifiedData !== props.content.flowData) {
        console.log('✅ DETECTADO CAMBIO - Actualizando flowData');
        console.log('📝 NUEVO FLOWDATA:', JSON.stringify(flowData, null, 2));
        
        const updatedContent = {
          ...props.content,
          flowData: stringifiedData
        };
        emit('update:content', updatedContent);
        
        // Emit flowSaved event with the updated flow data usando la función helper
        setTimeout(() => emitFlowSaved('watcherDetected'), 10);
        
        console.log('🚀 EVENTOS EMITIDOS:', {
          'update:content': 'Contenido actualizado',
          'trigger-event': 'flowSaved con nueva data'
        });
      } else {
        console.log('⚪ SIN CAMBIOS - No se actualiza flowData');
      }
      
      console.log('─'.repeat(80)); // Separador visual
    }, { deep: true });

    onMounted(() => {
      console.log('🚀 INICIANDO COMPONENTE FLOWCHART');
      console.log('📋 PROPS RECIBIDOS:', {
        tieneFlowData: !!props.content?.flowData,
        flowDataType: typeof props.content?.flowData,
        flowDataSize: props.content?.flowData?.length || 0,
        tieneInitialNodeValue: !!props.content?.initialNodeValue
      });

      try {
        if (props.content?.flowData) {
          console.log('✅ USANDO FLOWDATA EXISTENTE');
          console.log('📦 FLOWDATA RAW:', props.content.flowData);
          
          const parsedData = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData;
          
          console.log('🔄 FLOWDATA PARSEADO:', {
            nodes: parsedData.nodes?.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
            edges: parsedData.edges?.map(e => ({ id: e.id, source: e.source, target: e.target }))
          });
          
          elements.value = [
            ...parsedData.nodes,
            ...parsedData.edges
          ];
        } else {
          console.log('🆕 USANDO INITIAL NODE VALUE (Primera vez)');
          console.log('📦 INITIAL NODE VALUE:', defaultFlowData.value);
          
          elements.value = [
            ...defaultFlowData.value.nodes,
            ...defaultFlowData.value.edges
          ];
        }
        
        initialized.value = true;
        console.log('✅ COMPONENTE INICIALIZADO CORRECTAMENTE');
        console.log('📊 ELEMENTOS FINALES:', {
          totalElements: elements.value.length,
          nodes: elements.value.filter(el => el.id && !el.source).length,
          edges: elements.value.filter(el => el.source).length
        });
        
        setTimeout(() => {
          fitView({ padding: 0.2 });
          console.log('🎯 VISTA AJUSTADA AL CONTENIDO');
        }, 100);
      } catch (error) {
        console.error('❌ ERROR AL INICIALIZAR:', error);
        console.log('🔧 INICIALIZANDO CON ELEMENTOS VACÍOS');
        elements.value = [];
        initialized.value = true;
      }
      console.log('═'.repeat(80)); // Separador visual
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
      
      // Emitir flowSaved después de añadir nodo
      setTimeout(() => emitFlowSaved('nodeAdded'), 50);
    };

    const onNodeClick = (event, node) => {
      console.log('🖱️ NODE CLICK:', {
        nodeId: node?.id,
        nodeType: node?.type,
        nodeData: node?.data
      });
      
      selectedNode.value = node;
      emit('trigger-event', { name: 'nodeSelected', event: { node } });
    };

    const onConnect = (connection) => {
      console.log('🔗 CONNECTION CREATED:', {
        source: connection?.source,
        target: connection?.target,
        connection: connection
      });

      if (connection?.source && connection?.target) {
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          ...connection,
          type: 'smoothstep',
          animated: true,
        };
        
        addEdges([newEdge]);
        emit('trigger-event', { name: 'connectionCreated', event: { connection: newEdge } });
        console.log('✅ Edge agregado correctamente:', newEdge.id);
        
        // Emitir flowSaved después de crear conexión
        setTimeout(() => emitFlowSaved('connectionCreated'), 50);
      } else {
        console.warn('⚠️ Conexión inválida - source o target faltante');
      }
    };

    const onPaneClick = () => {
      selectedNode.value = null;
      emit('trigger-event', { name: 'selectionCleared' });
    };

    const onNodeDragStop = (...args) => {
      console.log('🔄 NODE DRAG STOP - Argumentos recibidos:', {
        args: args,
        argsLength: args.length,
        timestamp: new Date().toLocaleTimeString()
      });

      // Vamos a inspeccionar el primer argumento en detalle
      if (args[0]) {
        console.log('🔍 PRIMER ARGUMENTO DETALLADO:', args[0]);
        console.log('🔍 KEYS DEL PRIMER ARGUMENTO:', Object.keys(args[0]));
        console.log('🔍 TIPO DEL PRIMER ARGUMENTO:', typeof args[0]);
        
        // Vamos a buscar si hay información del nodo en diferentes propiedades
        const firstArg = args[0];
        console.log('🔍 PROPIEDADES CANDIDATAS:', {
          node: firstArg.node,
          nodes: firstArg.nodes,
          target: firstArg.target,
          detail: firstArg.detail,
          data: firstArg.data,
          id: firstArg.id,
          type: firstArg.type
        });
      }

             // En VueFlow, nodeDragStop puede pasar los parámetros de diferentes maneras
       // Vamos a detectar el formato correcto
       let node = null;
       let event = null;

       if (args.length >= 1 && args[0]) {
         const firstArg = args[0];
         
         // Caso 1: El primer argumento es el nodo directamente
         if (firstArg.id && firstArg.type) {
           node = firstArg;
           console.log('✅ CASO 1: Primer argumento es el nodo');
         }
         // Caso 2: El nodo está en la propiedad 'node'
         else if (firstArg.node && firstArg.node.id) {
           node = firstArg.node;
           console.log('✅ CASO 2: Nodo en propiedad .node');
         }
         // Caso 3: El nodo está en la propiedad 'nodes' (array)
         else if (firstArg.nodes && Array.isArray(firstArg.nodes) && firstArg.nodes.length > 0) {
           node = firstArg.nodes[0];
           console.log('✅ CASO 3: Nodo en array .nodes');
         }
         // Caso 4: El nodo está en la propiedad 'target'
         else if (firstArg.target && firstArg.target.id) {
           node = firstArg.target;
           console.log('✅ CASO 4: Nodo en propiedad .target');
         }
         // Caso 5: Es un evento de drag con información del nodo en 'detail'
         else if (firstArg.detail && firstArg.detail.id) {
           node = firstArg.detail;
           console.log('✅ CASO 5: Nodo en propiedad .detail');
         }
         // Caso 6: El segundo argumento es el nodo
         else if (args[1] && args[1].id) {
           node = args[1];
           event = firstArg;
           console.log('✅ CASO 6: Nodo es el segundo argumento');
         }
       }

      console.log('🔍 Nodo detectado:', {
        node: node,
        nodeId: node?.id,
        nodeType: node?.type,
        nodePosition: node?.position
      });

      // Validaciones de seguridad
      if (!node) {
        console.error('❌ ERROR: No se pudo detectar el nodo en onNodeDragStop');
        console.error('📋 Todos los argumentos:', args);
        return;
      }

      if (!node.id) {
        console.error('❌ ERROR: node.id es undefined en onNodeDragStop', node);
        return;
      }

      try {
        const updatedNode = findNode(node.id);
        console.log('🔍 Buscando nodo actualizado:', {
          nodeId: node.id,
          encontrado: !!updatedNode,
          updatedNodeData: updatedNode ? {
            id: updatedNode.id,
            position: updatedNode.position,
            type: updatedNode.type
          } : null
        });

        if (updatedNode) {
          emit('trigger-event', { name: 'nodeMoved', event: { node: updatedNode } });
          console.log('✅ Evento nodeMoved emitido correctamente');
          
          // Emitir flowSaved después de mover nodo
          setTimeout(() => emitFlowSaved('nodeMoved'), 50);
          
          // 📋 MOSTRAR FLOWDATA COMPLETO DESPUÉS DEL MOVIMIENTO
          try {
            console.log('🔧 Accediendo a nodes y edges como objetos reactivos...');
            
            // getNodes y getEdges son objetos reactivos, no funciones
            const nodesValue = getNodes.value;
            const edgesValue = getEdges.value;
            
            console.log('🔧 nodesValue:', nodesValue);
            console.log('🔧 edgesValue:', edgesValue);
            console.log('🔧 Cantidad de nodos:', nodesValue?.length);
            console.log('🔧 Cantidad de edges:', edgesValue?.length);
            
            const currentFlowData = {
              nodes: nodesValue || [],
              edges: edgesValue || []
            };
            const currentFlowDataText = JSON.stringify(currentFlowData);
            
            console.log('📋 FLOWDATA DESPUÉS DEL MOVIMIENTO (TEXTO):', currentFlowDataText);
            console.log('📋 FLOWDATA DESPUÉS DEL MOVIMIENTO (OBJETO):', JSON.stringify(currentFlowData, null, 2));
            
            // 🔍 POSICIÓN ACTUALIZADA DEL NODO MOVIDO
            console.log('🎯 NODO MOVIDO - POSICIÓN ACTUALIZADA:', {
              id: updatedNode.id,
              nuevaPosicion: updatedNode.position,
              tipo: updatedNode.type,
              data: updatedNode.data
            });
          } catch (flowDataError) {
            console.error('❌ ERROR obteniendo flowData:', flowDataError);
            console.log('🔧 Usando solo información del nodo actualizado');
            console.log('🎯 NODO MOVIDO - POSICIÓN ACTUALIZADA:', {
              id: updatedNode.id,
              nuevaPosicion: updatedNode.position,
              tipo: updatedNode.type,
              data: updatedNode.data
            });
          }
        } else {
          console.warn('⚠️ No se encontró el nodo actualizado con id:', node.id);
        }
      } catch (error) {
        console.error('❌ ERROR en onNodeDragStop:', error);
      }
    };

    const onNodesDelete = (nodes) => {
      nodes.forEach(node => {
        emit('trigger-event', { name: 'nodeDeleted', event: { nodeId: node.id } });
      });
      
      // Emitir flowSaved después de eliminar nodos
      setTimeout(() => emitFlowSaved('nodesDeleted'), 50);
    };

    const onEdgesDelete = (edges) => {
      edges.forEach(edge => {
        emit('trigger-event', { name: 'edgeDeleted', event: { edgeId: edge.id } });
      });
      
      // Emitir flowSaved después de eliminar edges
      setTimeout(() => emitFlowSaved('edgesDeleted'), 50);
    };

    const onNodeDataUpdate = (nodeId, newData) => {
      console.log('📝 NODE DATA UPDATE:', {
        nodeId: nodeId,
        newData: newData,
        timestamp: new Date().toLocaleTimeString()
      });

      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...newData };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
        console.log('✅ Nodo actualizado correctamente:', node.id);
        
        // Emitir flowSaved después de actualizar nodo
        setTimeout(() => emitFlowSaved('nodeDataUpdated'), 50);
      } else {
        console.warn('⚠️ No se encontró el nodo para actualizar:', nodeId);
      }
    };

    const deleteSelected = () => {
      if (selectedNode.value) {
        removeNodes([selectedNode.value.id]);
        selectedNode.value = null;
        emit('trigger-event', { name: 'nodeDeleted' });
        
        // Emitir flowSaved después de eliminar nodo seleccionado
        setTimeout(() => emitFlowSaved('selectedNodeDeleted'), 50);
      }
    };

    const updateNodeData = (nodeId, data) => {
      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...data };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
        
        // Emitir flowSaved después de actualizar nodo
        setTimeout(() => emitFlowSaved('nodeUpdated'), 50);
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

    // Función para obtener el flowData actual como texto
    const getCurrentFlowDataAsText = () => {
      try {
        const currentNodes = getNodes.value || [];
        const currentEdges = getEdges.value || [];
        const currentFlowData = {
          nodes: currentNodes,
          edges: currentEdges
        };
        const flowDataText = JSON.stringify(currentFlowData);
        
        console.log('📤 SOLICITADO FLOWDATA COMO TEXTO:', {
          text: flowDataText,
          size: flowDataText.length + ' caracteres',
          nodesCount: currentNodes.length,
          edgesCount: currentEdges.length,
          timestamp: new Date().toLocaleTimeString()
        });
        
        return flowDataText;
      } catch (error) {
        console.error('❌ ERROR obteniendo flowData como texto:', error);
        return '{"nodes":[],"edges":[]}';
      }
    };

    // Función para obtener el flowData actual como objeto
    const getCurrentFlowDataAsObject = () => {
      try {
        const currentNodes = getNodes.value || [];
        const currentEdges = getEdges.value || [];
        return {
          nodes: currentNodes,
          edges: currentEdges
        };
      } catch (error) {
        console.error('❌ ERROR obteniendo flowData como objeto:', error);
        return { nodes: [], edges: [] };
      }
    };

    // Función helper para emitir el evento flowSaved
    const emitFlowSaved = (actionType = 'unknown') => {
      try {
        const flowDataObject = getCurrentFlowDataAsObject();
        const flowData = JSON.stringify(flowDataObject);
        
        console.log(`💾 EMITIENDO FLOWSAVED - ${actionType}:`, {
          actionType,
          flowDataSize: flowData.length + ' caracteres',
          nodesCount: flowDataObject.nodes?.length || 0,
          edgesCount: flowDataObject.edges?.length || 0,
          timestamp: new Date().toLocaleTimeString()
        });
        
        emit('trigger-event', { 
          name: 'flowSaved', 
          event: { 
            flowData: flowData,
            flowDataObject: flowDataObject,
            actionType: actionType,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('❌ ERROR emitiendo flowSaved:', error);
      }
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
      getCurrentFlowDataAsText,
      getCurrentFlowDataAsObject,
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

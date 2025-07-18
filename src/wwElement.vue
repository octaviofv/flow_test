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
      </VueFlow>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  VueFlow, 
  useVueFlow
} from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
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
    wwEditorState: { type: Object, required: true },
  },
  emits: ['trigger-event', 'update:content'],
  setup(props, { emit }) {
    const initialized = ref(false);
    const elements = ref([]);
    const selectedNode = ref(null);

    const isEditing = computed(() => {
      return props.wwEditorState?.isEditing;
    });

    const defaultEdgeOptions = {
      type: 'smoothstep',
      animated: true,
      style: { 
        strokeWidth: 1,
        stroke: '#373E58'
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 30,
        height: 30,
        color: '#373E58',
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

    const isInitializing = ref(true);
    const userHasModified = ref(false);

    watch([() => getNodes().value, () => getEdges().value], ([nodes, edges]) => {
      console.log('🔍 WATCHER DISPARADO:', {
        initialized: initialized.value,
        isInitializing: isInitializing.value,
        nodesCount: nodes?.length || 0,
        edgesCount: edges?.length || 0,
        timestamp: new Date().toLocaleTimeString(),
        trigger: 'CAMBIO EN NODES/EDGES DETECTADO'
      });

      if (!initialized.value || isInitializing.value || !nodes || !edges) {
        console.log('❌ WATCHER CANCELADO - Condiciones no cumplidas:', {
          initialized: initialized.value,
          isInitializing: isInitializing.value,
          hasNodes: !!nodes,
          hasEdges: !!edges
        });
        return;
      }

      // Verificar si hay cambios reales comparando con los datos iniciales
      const hasRealChanges = () => {
        if (!props.content?.initialNodeValue?.nodes) {
          return true; // No hay datos iniciales, cualquier cambio es real
        }
        
        const initialNodes = props.content.initialNodeValue.nodes;
        if (nodes.length !== initialNodes.length) {
          return true; // Cambio en cantidad de nodos
        }
        
        // Comparar cada nodo para detectar cambios cualitativos
        for (const currentNode of nodes) {
          const initialNode = initialNodes.find(n => n.id === currentNode.id);
          if (!initialNode) {
            return true; // Nodo nuevo
          }
          
          const currentData = currentNode.data || {};
          const initialData = initialNode.data || {};
          
          if (currentData.label !== initialData.label ||
              currentData.content !== initialData.content ||
              currentData.toolName !== initialData.toolName ||
              JSON.stringify(currentNode.position) !== JSON.stringify(initialNode.position)) {
            return true; // Cambio cualitativo detectado
          }
        }
        
        return false; // No hay cambios significativos
      };

      if (hasRealChanges() && !userHasModified.value) {
        console.log('👤 PRIMERA MODIFICACIÓN DEL USUARIO DETECTADA');
        userHasModified.value = true;
      }
      
      const flowData = {
        nodes,
        edges
      };

      const stringifiedData = JSON.stringify(flowData);
      
      console.log('📊 DATOS ACTUALES DEL FLOW:', {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
        flowDataSize: stringifiedData.length + ' caracteres',
        userHasModified: userHasModified.value,
        estadoActual: userHasModified.value ? 'USUARIO HA MODIFICADO' : 'DATOS ORIGINALES'
      });

      console.log('📋 FLOWDATA COMPLETO (TEXTO):', stringifiedData);
      console.log('📋 FLOWDATA COMPLETO (OBJETO):', JSON.stringify(flowData, null, 2));
      
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
        
        setTimeout(() => emitFlowSaved('watcherDetected'), 10);
        
        console.log('🚀 EVENTOS EMITIDOS:', {
          'update:content': 'Contenido actualizado',
          'trigger-event': 'flowSaved con nueva data'
        });
      } else {
        console.log('⚪ SIN CAMBIOS - No se actualiza flowData');
      }
      
      console.log('─'.repeat(80));
    }, { deep: true });

    watch(() => props.content?.initialNodeValue, (newInitialNodeValue) => {
      console.log('🔄 CAMBIO EN INITIAL NODE VALUE DETECTADO:', {
        hasNewValue: !!newInitialNodeValue,
        hasNodes: !!(newInitialNodeValue?.nodes),
        nodesCount: newInitialNodeValue?.nodes?.length || 0,
        edgesCount: newInitialNodeValue?.edges?.length || 0,
        userHasModified: userHasModified.value,
        timestamp: new Date().toLocaleTimeString()
      });

      if (!initialized.value) {
        console.log('⏳ COMPONENTE NO INICIALIZADO - Cambio será aplicado en onMounted');
        return;
      }

      // NO aplicar initialNodeValue si el usuario ya ha hecho modificaciones
      if (userHasModified.value) {
        console.log('🚫 IGNORANDO CAMBIO EN INITIAL NODE VALUE - Usuario ya ha modificado el flow');
        console.log('📝 Preservando cambios del usuario en lugar de aplicar initialNodeValue');
        return;
      }

      if (newInitialNodeValue && newInitialNodeValue.nodes && newInitialNodeValue.nodes.length > 0) {
        console.log('🔄 ACTUALIZANDO ELEMENTOS CON NUEVO INITIAL NODE VALUE');
        console.log('📦 NUEVOS DATOS:', {
          nodes: newInitialNodeValue.nodes.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
          edges: (newInitialNodeValue.edges || []).map(e => ({ id: e.id, source: e.source, target: e.target }))
        });

        isInitializing.value = true;

        elements.value = [
          ...(newInitialNodeValue.nodes || []),
          ...(newInitialNodeValue.edges || [])
        ];

        setTimeout(() => {
          if (elements.value.length > 0) {
            fitView({ padding: 0.2 });
            console.log('🎯 VISTA AJUSTADA AL NUEVO CONTENIDO');
          }
          
          setTimeout(() => {
            isInitializing.value = false;
            console.log('🔓 ACTUALIZACIÓN DE INITIAL NODE VALUE COMPLETA');
          }, 100);
        }, 150);
      }
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
        let dataToLoad = null;

        const hasInitialNodeValue = props.content?.initialNodeValue && 
                                   props.content.initialNodeValue.nodes && 
                                   props.content.initialNodeValue.nodes.length > 0;
        
        const hasFlowData = props.content?.flowData && 
                           props.content.flowData !== '{"nodes":[],"edges":[]}';

        if (hasFlowData && hasInitialNodeValue) {
          console.log('🤔 TENEMOS AMBOS: initialNodeValue Y flowData');
          
          const parsedFlowData = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData;
          
          const flowDataNodeCount = parsedFlowData.nodes?.length || 0;
          const initialNodeCount = props.content.initialNodeValue.nodes?.length || 0;
          
          // Función para detectar cambios cualitativos en los nodos
          const hasQualitativeChanges = () => {
            if (flowDataNodeCount !== initialNodeCount) {
              return true; // Cambio cuantitativo
            }
            
            // Comparar nodos individualmente para detectar cambios en contenido
            for (let i = 0; i < flowDataNodeCount; i++) {
              const flowNode = parsedFlowData.nodes[i];
              const initialNode = props.content.initialNodeValue.nodes.find(n => n.id === flowNode.id);
              
              if (!initialNode) {
                return true; // Nodo nuevo con ID diferente
              }
              
              // Comparar datos importantes del nodo
              const flowData = flowNode.data || {};
              const initialData = initialNode.data || {};
              
              if (flowData.label !== initialData.label ||
                  flowData.content !== initialData.content ||
                  flowData.toolName !== initialData.toolName ||
                  JSON.stringify(flowNode.position) !== JSON.stringify(initialNode.position)) {
                return true; // Cambio cualitativo detectado
              }
            }
            
            return false; // No hay cambios significativos
          };
          
          if (hasQualitativeChanges()) {
            console.log('👤 USANDO FLOWDATA (Usuario ha modificado nodos)');
            console.log(`📊 Cambios detectados: ${flowDataNodeCount} nodos vs Initial: ${initialNodeCount} nodos`);
            dataToLoad = parsedFlowData;
            userHasModified.value = true;
          } else {
            console.log('🎯 USANDO INITIAL NODE VALUE (Sin modificaciones significativas)');
            dataToLoad = props.content.initialNodeValue;
            userHasModified.value = false;
          }
          
        } else if (hasInitialNodeValue) {
          console.log('🎯 USANDO INITIAL NODE VALUE (ÚNICA OPCIÓN)');
          console.log('📦 INITIAL NODE VALUE:', props.content.initialNodeValue);
          dataToLoad = props.content.initialNodeValue;
          userHasModified.value = false;
          
        } else if (hasFlowData) {
          console.log('✅ USANDO FLOWDATA EXISTENTE (SIN INITIAL NODE VALUE)');
          console.log('📦 FLOWDATA RAW:', props.content.flowData);
          dataToLoad = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData;
          userHasModified.value = true;
          
        } else {
          console.log('🔧 USANDO DEFAULT FLOW DATA (ÚLTIMO RECURSO)');
          console.log('📦 DEFAULT FLOW DATA:', defaultFlowData.value);
          dataToLoad = defaultFlowData.value;
          userHasModified.value = false;
        }

        if (!dataToLoad || !dataToLoad.nodes || !Array.isArray(dataToLoad.nodes)) {
          console.warn('⚠️ DATOS INVÁLIDOS - Usando fallback vacío');
          dataToLoad = { nodes: [], edges: [] };
        }

        console.log('🔄 DATOS A CARGAR:', {
          nodes: dataToLoad.nodes?.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
          edges: dataToLoad.edges?.map(e => ({ id: e.id, source: e.source, target: e.target }))
        });
        
        elements.value = [
          ...(dataToLoad.nodes || []),
          ...(dataToLoad.edges || [])
        ];
        
        console.log('✅ COMPONENTE INICIALIZADO CORRECTAMENTE');
        console.log('📊 ELEMENTOS FINALES:', {
          totalElements: elements.value.length,
          nodes: elements.value.filter(el => el.id && !el.source).length,
          edges: elements.value.filter(el => el.source).length
        });
        
        initialized.value = true;
        
        setTimeout(() => {
          if (elements.value.length > 0) {
            fitView({ padding: 0.2 });
            console.log('🎯 VISTA AJUSTADA AL CONTENIDO');
          }
          
          setTimeout(() => {
            isInitializing.value = false;
            console.log('🔓 INICIALIZACIÓN COMPLETA - Watcher habilitado');
          }, 100);
        }, 150);
        
      } catch (error) {
        console.error('❌ ERROR AL INICIALIZAR:', error);
        console.error('📋 ERROR DETAILS:', {
          message: error.message,
          stack: error.stack,
          flowData: props.content?.flowData,
          initialNodeValue: props.content?.initialNodeValue
        });
        
        console.log('🔧 INICIALIZANDO CON ELEMENTOS VACÍOS (EMERGENCY)');
        elements.value = [];
        initialized.value = true;
        
        setTimeout(() => {
          isInitializing.value = false;
          console.log('🔓 INICIALIZACIÓN DE EMERGENCIA COMPLETA - Watcher habilitado');
        }, 200);
      }
      
      console.log('═'.repeat(80));
    });

    const generateId = () => `node_${Date.now()}`;

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const getNextNodeNumber = (nodeType) => {
      if (nodeType !== 'custom') return null;
      
      const currentNodes = getNodes.value || [];
      const customNodes = currentNodes.filter(node => node.type === 'custom');
      
      if (customNodes.length === 0) return '1';
      
      const existingNumbers = customNodes
        .map(node => {
          const number = node.data?.number;
          if (typeof number === 'string' && number !== 'N' && !isNaN(parseInt(number))) {
            return parseInt(number);
          }
          return 0;
        })
        .filter(num => num > 0);
      
      if (existingNumbers.length === 0) return '1';
      
      const maxNumber = Math.max(...existingNumbers);
      return String(maxNumber + 1);
    };

    const onDrop = (event) => {
      const data = JSON.parse(event.dataTransfer.getData('application/vueflow'));
      const position = project({ x: event.clientX, y: event.clientY });

      let nodeNumber = null;
      if (data.type === 'custom') {
        nodeNumber = getNextNodeNumber(data.type);
      }

      const newNode = {
        id: generateId(),
        ...data,
        position,
        data: {
          ...data.data,
          content: data.data?.content || 'Nuevo Nodo',
          ...(nodeNumber && { number: nodeNumber })
        }
      };

      // Marcar que el usuario ha modificado el flow al agregar un nodo
      if (!userHasModified.value) {
        console.log('👤 USUARIO AGREGÓ NODO - Marcando como modificado');
        userHasModified.value = true;
      }

      addNodes([newNode]);
      emit('trigger-event', { name: 'nodeAdded', event: { node: newNode } });
      
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
        // Marcar que el usuario ha modificado el flow al crear una conexión
        if (!userHasModified.value) {
          console.log('👤 USUARIO CREÓ CONEXIÓN - Marcando como modificado');
          userHasModified.value = true;
        }
        
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          ...connection,
          type: 'smoothstep',
          animated: true,
        };
        
        addEdges([newEdge]);
        emit('trigger-event', { name: 'connectionCreated', event: { connection: newEdge } });
        console.log('✅ Edge agregado correctamente:', newEdge.id);
        
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

      if (args[0]) {
        console.log('🔍 PRIMER ARGUMENTO DETALLADO:', args[0]);
        console.log('🔍 KEYS DEL PRIMER ARGUMENTO:', Object.keys(args[0]));
        console.log('🔍 TIPO DEL PRIMER ARGUMENTO:', typeof args[0]);
        
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

      let node = null;
      let event = null;

      if (args.length >= 1 && args[0]) {
        const firstArg = args[0];
        
        if (firstArg.id && firstArg.type) {
          node = firstArg;
          console.log('✅ CASO 1: Primer argumento es el nodo');
        }
        else if (firstArg.node && firstArg.node.id) {
          node = firstArg.node;
          console.log('✅ CASO 2: Nodo en propiedad .node');
        }
        else if (firstArg.nodes && Array.isArray(firstArg.nodes) && firstArg.nodes.length > 0) {
          node = firstArg.nodes[0];
          console.log('✅ CASO 3: Nodo en array .nodes');
        }
        else if (firstArg.target && firstArg.target.id) {
          node = firstArg.target;
          console.log('✅ CASO 4: Nodo en propiedad .target');
        }
        else if (firstArg.detail && firstArg.detail.id) {
          node = firstArg.detail;
          console.log('✅ CASO 5: Nodo en propiedad .detail');
        }
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
          // Marcar que el usuario ha modificado el flow al mover un nodo
          if (!userHasModified.value) {
            console.log('👤 USUARIO MOVIÓ NODO - Marcando como modificado');
            userHasModified.value = true;
          }
          
          emit('trigger-event', { name: 'nodeMoved', event: { node: updatedNode } });
          console.log('✅ Evento nodeMoved emitido correctamente');
          
          setTimeout(() => emitFlowSaved('nodeMoved'), 50);
          
          try {
            console.log('🔧 Accediendo a nodes y edges como objetos reactivos...');
            
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
      // Marcar que el usuario ha modificado el flow al eliminar nodos
      if (!userHasModified.value) {
        console.log('👤 USUARIO ELIMINÓ NODOS - Marcando como modificado');
        userHasModified.value = true;
      }
      
      nodes.forEach(node => {
        emit('trigger-event', { name: 'nodeDeleted', event: { nodeId: node.id } });
      });
      
      setTimeout(() => emitFlowSaved('nodesDeleted'), 50);
    };

    const onEdgesDelete = (edges) => {
      edges.forEach(edge => {
        emit('trigger-event', { name: 'edgeDeleted', event: { edgeId: edge.id } });
      });
      
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
        const previousData = { ...node.data };
        node.data = { ...node.data, ...newData };
        
        // Marcar que el usuario ha modificado datos si hay cambios reales
        const hasDataChanged = JSON.stringify(previousData) !== JSON.stringify(node.data);
        if (hasDataChanged && !userHasModified.value) {
          console.log('👤 MODIFICACIÓN DE DATOS DETECTADA - Marcando userHasModified como true');
          userHasModified.value = true;
        }
        
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
        console.log('✅ Nodo actualizado correctamente:', {
          nodeId: node.id,
          previousData,
          newData: node.data,
          hasChanged: hasDataChanged,
          userHasModified: userHasModified.value
        });
        
        setTimeout(() => emitFlowSaved('nodeDataUpdated'), 50);
      } else {
        console.warn('⚠️ No se encontró el nodo para actualizar:', nodeId);
      }
    };

    const deleteSelected = () => {
      if (selectedNode.value) {
        // Marcar que el usuario ha modificado el flow al eliminar nodo seleccionado
        if (!userHasModified.value) {
          console.log('👤 USUARIO ELIMINÓ NODO SELECCIONADO - Marcando como modificado');
          userHasModified.value = true;
        }
        
        removeNodes([selectedNode.value.id]);
        selectedNode.value = null;
        emit('trigger-event', { name: 'nodeDeleted' });
        
        setTimeout(() => emitFlowSaved('selectedNodeDeleted'), 50);
      }
    };

    const updateNodeData = (nodeId, data) => {
      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...data };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
        
        setTimeout(() => emitFlowSaved('nodeUpdated'), 50);
      }
    };

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
        
        console.log('📤 FLOW DATA STRING:', flowData);
        console.log('📤 FLOW DATA OBJECT:', flowDataObject);
        
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

    const resetToInitialNodeValue = () => {
      if (props.content?.initialNodeValue && 
          props.content.initialNodeValue.nodes && 
          props.content.initialNodeValue.nodes.length > 0) {
        
        console.log('🔄 RESETEANDO A INITIAL NODE VALUE');
        
        isInitializing.value = true;
        userHasModified.value = false;

        elements.value = [
          ...(props.content.initialNodeValue.nodes || []),
          ...(props.content.initialNodeValue.edges || [])
        ];

        setTimeout(() => {
          if (elements.value.length > 0) {
            fitView({ padding: 0.2 });
          }
          
          setTimeout(() => {
            isInitializing.value = false;
            console.log('✅ RESET COMPLETO - Volviendo a initialNodeValue');
          }, 100);
        }, 150);
      }
    };

    return {
      elements,
      initialized,
      isInitializing,
      userHasModified,
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
      getCurrentFlowDataAsText,
      getCurrentFlowDataAsObject,
      resetToInitialNodeValue,
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
    background: #373E58;
    border: 2px solid white;
  }

  :deep(.vue-flow__edge-path) {
    stroke: #373E58;
    stroke-width: 2;
  }
}
</style>


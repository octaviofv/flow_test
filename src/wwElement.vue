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
      </VueFlow>
    </div>
  </div>
</template>

<script>
// VERSIÓN 2.0.0 - LIMPIA PARA WEWEB - SOLO VUE-FLOW CORE
import { ref, computed, watch, onMounted } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import CustomNode from './components/CustomNode.vue'
import CommentNode from './components/CommentNode.vue'
import ConditionalNode from './components/ConditionalNode.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'FlowChartComponentV2',
  components: {
    VueFlow,
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
    const initialized = ref(false)
    const elements = ref([])
    const selectedNode = ref(null)

    const isEditing = computed(() => {
      return props.wwEditorState?.isEditing || false
    })

    const defaultEdgeOptions = {
      type: 'smoothstep',
      animated: true,
      style: { 
        strokeWidth: 2,
        stroke: '#373E58'
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#373E58',
      },
    }

    const { 
      findNode, 
      addNodes, 
      addEdges, 
      removeNodes, 
      project,
      fitView,
      getNodes,
      getEdges,
    } = useVueFlow({
      defaultEdgeOptions,
    })

    const containerStyle = computed(() => ({
      height: props.content?.height || '600px',
      backgroundColor: '#fafafa',
    }))

    const defaultZoom = computed(() => props.content?.defaultZoom || 1)
    const minZoom = computed(() => props.content?.minZoom || 0.1)
    const maxZoom = computed(() => props.content?.maxZoom || 4)

    const defaultFlowData = {
      nodes: [
        {
          id: 'input',
          type: 'custom',
          position: { x: 250, y: 50 },
          data: {
            label: 'Entrada',
            content: 'Información de entrada',
            number: '1',
            backgroundColor: '#E3F2FD',
            toolName: 'Sin herramienta'
          }
        }
      ],
      edges: []
    }

    const isInitializing = ref(true)
    const userHasModified = ref(false)

    // Watch para actualizar flowData cuando cambien nodos o edges
    watch([() => getNodes().value, () => getEdges().value], ([nodes, edges]) => {
      if (!initialized.value || isInitializing.value || !nodes || !edges) {
        return
      }

      if (!userHasModified.value) {
        userHasModified.value = true
      }
      
      const flowData = { nodes, edges }
      const stringifiedData = JSON.stringify(flowData)
      
      if (stringifiedData !== props.content.flowData) {
        const updatedContent = {
          ...props.content,
          flowData: stringifiedData
        }
        emit('update:content', updatedContent)
        
        setTimeout(() => {
          emit('trigger-event', { 
            name: 'flowSaved', 
            event: { 
              flowData: stringifiedData,
              flowDataObject: flowData,
              timestamp: new Date().toISOString()
            }
          })
        }, 10)
      }
    }, { deep: true })

    onMounted(() => {
      try {
        let dataToLoad = null

        const hasInitialNodeValue = props.content?.initialNodeValue && 
                                   props.content.initialNodeValue.nodes && 
                                   props.content.initialNodeValue.nodes.length > 0

        const hasFlowData = props.content?.flowData && 
                           props.content.flowData !== '{"nodes":[],"edges":[]}'

        if (hasFlowData && hasInitialNodeValue) {
          const parsedFlowData = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData
          
          const flowDataNodeCount = parsedFlowData.nodes?.length || 0
          const initialNodeCount = props.content.initialNodeValue.nodes?.length || 0
          
          if (flowDataNodeCount > initialNodeCount) {
            dataToLoad = parsedFlowData
            userHasModified.value = true
          } else {
            dataToLoad = props.content.initialNodeValue
            userHasModified.value = false
          }
        } else if (hasInitialNodeValue) {
          dataToLoad = props.content.initialNodeValue
          userHasModified.value = false
        } else if (hasFlowData) {
          dataToLoad = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData
          userHasModified.value = true
        } else {
          dataToLoad = defaultFlowData
          userHasModified.value = false
        }

        if (!dataToLoad || !dataToLoad.nodes || !Array.isArray(dataToLoad.nodes)) {
          dataToLoad = { nodes: [], edges: [] }
        }

        elements.value = [
          ...(dataToLoad.nodes || []),
          ...(dataToLoad.edges || [])
        ]
        
        initialized.value = true
        
        setTimeout(() => {
          if (elements.value.length > 0) {
            fitView({ padding: 0.2 })
          }
          
          setTimeout(() => {
            isInitializing.value = false
          }, 100)
        }, 150)
        
      } catch (error) {
        console.error('Error inicializando flowchart:', error)
        elements.value = []
        initialized.value = true
        
        setTimeout(() => {
          isInitializing.value = false
        }, 200)
      }
    })

    const generateId = () => `node_${Date.now()}`

    const onDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }

    const getNextNodeNumber = (nodeType) => {
      if (nodeType !== 'custom') return null
      
      const currentNodes = getNodes.value || []
      const customNodes = currentNodes.filter(node => node.type === 'custom')
      
      if (customNodes.length === 0) return '1'
      
      const existingNumbers = customNodes
        .map(node => {
          const number = node.data?.number
          if (typeof number === 'string' && number !== 'N' && !isNaN(parseInt(number))) {
            return parseInt(number)
          }
          return 0
        })
        .filter(num => num > 0)
      
      if (existingNumbers.length === 0) return '1'
      
      const maxNumber = Math.max(...existingNumbers)
      return String(maxNumber + 1)
    }

    const onDrop = (event) => {
      const data = JSON.parse(event.dataTransfer.getData('application/vueflow'))
      const position = project({ x: event.clientX, y: event.clientY })

      let nodeNumber = null
      if (data.type === 'custom') {
        nodeNumber = getNextNodeNumber(data.type)
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
      }

      addNodes([newNode])
      emit('trigger-event', { name: 'nodeAdded', event: { node: newNode } })
    }

    const onNodeClick = (event, node) => {
      selectedNode.value = node
      emit('trigger-event', { name: 'nodeSelected', event: { node } })
    }

    const onConnect = (connection) => {
      if (connection?.source && connection?.target) {
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          ...connection,
          type: 'smoothstep',
          animated: true,
        }
        
        addEdges([newEdge])
        emit('trigger-event', { name: 'connectionCreated', event: { connection: newEdge } })
      }
    }

    const onPaneClick = () => {
      selectedNode.value = null
      emit('trigger-event', { name: 'selectionCleared' })
    }

    const onNodeDragStop = (...args) => {
      let node = null
      
      if (args.length >= 1 && args[0]) {
        const firstArg = args[0]
        
        if (firstArg.id && firstArg.type) {
          node = firstArg
        } else if (firstArg.node && firstArg.node.id) {
          node = firstArg.node
        } else if (firstArg.nodes && Array.isArray(firstArg.nodes) && firstArg.nodes.length > 0) {
          node = firstArg.nodes[0]
        } else if (args[1] && args[1].id) {
          node = args[1]
        }
      }

      if (!node || !node.id) {
        return
      }

      try {
        const updatedNode = findNode(node.id)
        if (updatedNode) {
          emit('trigger-event', { name: 'nodeMoved', event: { node: updatedNode } })
        }
      } catch (error) {
        console.error('Error en onNodeDragStop:', error)
      }
    }

    const onNodesDelete = (nodes) => {
      nodes.forEach(node => {
        emit('trigger-event', { name: 'nodeDeleted', event: { nodeId: node.id } })
      })
    }

    const onEdgesDelete = (edges) => {
      edges.forEach(edge => {
        emit('trigger-event', { name: 'edgeDeleted', event: { edgeId: edge.id } })
      })
    }

    const onNodeDataUpdate = (nodeId, newData) => {
      const node = findNode(nodeId)
      if (node) {
        node.data = { ...node.data, ...newData }
        emit('trigger-event', { name: 'nodeUpdated', event: { node } })
      }
    }

    return {
      elements,
      initialized,
      isEditing,
      containerStyle,
      defaultZoom,
      minZoom,
      maxZoom,
      defaultEdgeOptions,
      onNodeClick,
      onConnect,
      onPaneClick,
      onDragOver,
      onDrop,
      onNodeDragStop,
      onNodesDelete,
      onEdgesDelete,
      onNodeDataUpdate,
    }
  },
}
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
</style>

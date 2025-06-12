<template>
  <div class="sidebar">
    <h3 class="sidebar-title">Elementos</h3>
    <div class="node-list">
      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'custom', 'process')"
      >
        <div class="preview-node">
          <div class="preview-number">N</div>
          <div class="preview-content">
            <span>Nuevo Proceso</span>
          </div>
        </div>
      </div>

      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'comment', 'comment')"
      >
        <div class="preview-node comment-node">
          <div class="preview-number">
            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <div class="preview-content">
            <span>Comentario</span>
          </div>
        </div>
      </div>

      <!--
      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'conditional', 'condition')"
      >
        <div class="preview-node condition-node">
          <div class="preview-number">
            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;">
              <path d="M19 5L12 12L19 19M5 19L12 12L5 5"/>
            </svg>
          </div>
          <div class="preview-content">
            <span>Condición</span>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  setup() {
    const onDragStart = (event, nodeType, variant) => {
      let nodeData = {
        type: nodeType,
        data: {}
      };

      if (nodeType === 'custom') {
        nodeData.data = {
          label: 'Proceso',
          content: 'Procesamiento de información',
          number: '1',
          backgroundColor: '#f0f0f0',
          subTitle: 'Sin herramienta'
        };
      } else if (nodeType === 'comment') {
        nodeData.data = {
          label: 'Nuevo Comentario',
          content: '',
          timestamp: new Date().toISOString()
        };
      } else if (nodeType === 'conditional') {
        nodeData.data = {
          condition: '',
          label: 'Nueva Condición'
        };
      }

      event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return {
      onDragStart
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.draggable-node {
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.preview-node {
  padding: 16px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    border-color: #d0d0d0;
  }

  &.comment-node .preview-number {
    background-color: #6366F1;
  }

  &.condition-node .preview-number {
    background-color: #3B82F6;
  }
}

.preview-number {
  width: 32px;
  height: 32px;
  background-color: #333333;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.preview-content {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}
</style>

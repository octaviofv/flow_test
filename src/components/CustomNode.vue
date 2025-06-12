<template>
  <div 
    class="custom-node" 
    :class="{ selected, editing: isEditing }"
    @dblclick="startEditing"
  >
    <div class="node-header">
      <div class="node-icon">
        <div class="node-number">{{ data.number || '1' }}</div>
      </div>
      <div class="node-title">{{ data.label || 'Proceso' }}</div>
      <div class="node-type">{{ data.subTitle || 'Proceso' }}</div>
    </div>
    
    <div class="node-content">
      <div v-if="!isEditing" class="content-display" @click="startEditing">
        <div class="content-label">DESCRIPCIÓN</div>
        <div class="content-text">
          {{ data.content || 'Doble clic para editar descripción...' }}
        </div>
      </div>
      <div v-else class="content-editor">
        <div class="editor-row">
          <label>Título:</label>
          <input
            v-model="editedLabel"
            class="edit-input"
            @keyup.enter="saveChanges"
            @keyup.esc="cancelEdit"
            ref="labelInput"
            placeholder="Título del proceso"
          />
        </div>
        <div class="editor-row">
          <label>Descripción:</label>
          <textarea
            v-model="editedContent"
            class="edit-textarea"
            @keyup.esc="cancelEdit"
            ref="contentTextarea"
            placeholder="Descripción del proceso"
            rows="3"
          ></textarea>
        </div>
        <div class="editor-actions">
          <button class="save-button" @click="saveChanges">Guardar</button>
          <button class="cancel-button" @click="cancelEdit">Cancelar</button>
        </div>
      </div>

      <div class="process-container">
        <div class="process-info">
          <div class="process-header">
            <div class="process-icon">⚙️</div>
            <div class="process-label">PROCESO</div>
          </div>
          <div class="process-description">Ejecuta la operación definida</div>
        </div>
      </div>
    </div>

    <div class="node-handles">
      <Handle
        v-for="handle in handles"
        :key="handle.id"
        :id="handle.id"
        :type="handle.type"
        :position="handle.position"
      />
    </div>
  </div>
</template>

<script>
import { Handle } from '@vue-flow/core';
import { ref, watch } from 'vue';

export default {
  name: 'CustomNode',
  components: {
    Handle,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:data'],
  setup(props, { emit }) {
    const handles = [
      { id: 'top', type: 'target', position: 'top' },
      { id: 'right', type: 'source', position: 'right' },
      { id: 'bottom', type: 'source', position: 'bottom' },
      { id: 'left', type: 'target', position: 'left' },
    ];

    const isEditing = ref(false);
    const editedLabel = ref('');
    const editedContent = ref('');
    const labelInput = ref(null);
    const contentTextarea = ref(null);

    const startEditing = () => {
      editedLabel.value = props.data.label || '';
      editedContent.value = props.data.content || '';
      isEditing.value = true;
      
      setTimeout(() => {
        labelInput.value?.focus();
      }, 0);
    };

    const saveChanges = () => {
      const updatedData = {
        ...props.data,
        label: editedLabel.value,
        content: editedContent.value,
      };
      
      emit('update:data', props.id, updatedData);
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const handleClickOutside = (event) => {
      if (isEditing.value && !event.target.closest('.custom-node')) {
        saveChanges();
      }
    };

    watch(isEditing, (newValue) => {
      if (newValue) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    });

    return {
      handles,
      isEditing,
      editedLabel,
      editedContent,
      labelInput,
      contentTextarea,
      startEditing,
      saveChanges,
      cancelEdit,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-node {
  min-width: 280px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;

  &.selected {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &.editing {
    border-color: #3B82F6;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
  }
}

.node-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #F3F4F6;
  border-bottom: 1px solid #E5E7EB;
  gap: 12px;
}

.node-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333333;
  border-radius: 8px;
  flex-shrink: 0;
}

.node-number {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.node-title {
  font-weight: 500;
  color: #111827;
  font-size: 14px;
  flex-grow: 1;
}

.node-type {
  font-size: 12px;
  color: #6B7280;
  padding: 4px 8px;
  background: #F9FAFB;
  border-radius: 4px;
  border: 1px solid #E5E7EB;
}

.node-content {
  padding: 16px;
}

.content-display {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  cursor: text;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #F3F4F6;
  }
}

.content-label {
  font-weight: 600;
  color: #3B82F6;
  font-size: 12px;
  padding: 2px 6px;
  background: #EFF6FF;
  border-radius: 4px;
  flex-shrink: 0;
}

.content-text {
  flex-grow: 1;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

.content-editor {
  margin-bottom: 16px;
}

.editor-row {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.editor-row label {
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 13px;
  margin-bottom: 6px;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 13px;
  background: #F9FAFB;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

.edit-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 13px;
  resize: vertical;
  min-height: 60px;
  background: #F9FAFB;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

.editor-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;

  button {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &.save-button {
      background: #3B82F6;
      color: white;
      border: none;

      &:hover {
        background: #2563EB;
      }
    }

    &.cancel-button {
      background: white;
      color: #4B5563;
      border: 1px solid #D1D5DB;

      &:hover {
        background: #F3F4F6;
      }
    }
  }
}

.process-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  overflow: hidden;
}

.process-info {
  padding: 12px;
  background: #EFF6FF;
}

.process-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.process-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3B82F6;
  border-radius: 4px;
  color: white;
  font-size: 12px;
}

.process-label {
  font-weight: 600;
  color: #3B82F6;
  font-size: 12px;
}

.process-description {
  font-size: 12px;
  color: #6B7280;
}

.node-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;

  :deep(.vue-flow__handle) {
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid #3B82F6;
    border-radius: 50%;
    pointer-events: all;
    transition: all 0.2s ease;

    &:hover {
      background: #DBEAFE;
      transform: scale(1.2);
    }

    &.vue-flow__handle-connecting {
      background: #3B82F6;
    }

    &.vue-flow__handle-valid {
      background: #10B981;
      border-color: #059669;
    }

    &.vue-flow__handle-invalid {
      background: #EF4444;
      border-color: #DC2626;
    }
  }
}
</style>

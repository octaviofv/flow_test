<template>
  <div 
    class="custom-node" 
    :class="{ selected, editing: isEditing }"
    @dblclick="startEditing"
  >
    <div class="node-header">
      <div class="node-icon">
        <div class="node-number">{{ data.number || 'N' }}</div>
      </div>
      <div class="node-title" v-if="!isEditing">{{ data.label || 'Proceso' }}</div>
      <input
        v-else
        v-model="editedLabel"
        class="edit-input-header"
        @keyup.enter="saveChanges"
        @keyup.esc="cancelEdit"
        ref="labelInput"
        placeholder="Título del proceso"
      />
      <div class="node-type">{{ data.subTitle || 'Proceso' }}</div>
    </div>
    
    <div class="node-content">
      <div v-if="!isEditing" class="content-text" @dblclick="startEditing">
        {{ data.content || 'Doble clic para editar descripción...' }}
      </div>
      <textarea
        v-else
        v-model="editedContent"
        class="edit-textarea"
        @keyup.esc="cancelEdit"
        ref="contentTextarea"
        placeholder="Descripción del proceso"
        rows="3"
      ></textarea>
    </div>

    <div v-if="isEditing" class="edit-actions">
      <button class="save-button" @click="saveChanges">Guardar</button>
      <button class="cancel-button" @click="cancelEdit">Cancelar</button>
    </div>

    <div class="node-handles">
      <Handle
        type="target"
        position="top"
        id="input"
      />
      <Handle
        type="source"
        position="bottom"
        id="output"
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
  min-width: 300px;
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
  padding: 8px 12px;
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
  padding: 10px;
}

.content-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
  white-space: pre-wrap;
  cursor: text;
  padding: 8px;
  background: #F9FAFB;
  border-radius: 8px;
  min-height: 40px;
  transition: all 0.2s ease;

  &:hover {
    background: #F3F4F6;
  }
}

.edit-input-header {
  flex-grow: 1;
  padding: 6px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;  
  font-size: 14px;
  font-weight: 500;
  background: white;
  margin-right: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

.edit-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 50px;
  background: #F9FAFB;
  box-sizing: border-box;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 0 10px 10px;

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

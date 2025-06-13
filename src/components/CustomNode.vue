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
      <div class="header-content">
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
        <div class="node-subtitle">{{ data.subTitle || 'Sin herramienta' }}</div>
      </div>
    </div>
    
    <div class="node-body">
      <div class="content-section">
        <div v-if="!isEditing" class="content-text" @dblclick="startEditing">
          {{ data.content || 'Información del proceso' }}
        </div>
        <textarea
          v-else
          v-model="editedContent"
          class="edit-textarea"
          @keyup.esc="cancelEdit"
          ref="contentTextarea"
          placeholder="Información del proceso"
          rows="3"
        ></textarea>
      </div>

      <div v-if="isEditing" class="edit-actions">
        <button class="save-button" @click="saveChanges">Guardar</button>
        <button class="cancel-button" @click="cancelEdit">Cancelar</button>
      </div>
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
  min-width: 280px;
  max-width: 320px;
  background: white;
  border-radius: 16px;
  border: 2px solid #E5E7EB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;

  &.selected {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &.editing {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 8px 24px rgba(59, 130, 246, 0.15);
  }
}

.node-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
  position: relative;
}

.node-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1F2937;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(31, 41, 55, 0.2);
}

.node-number {
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.node-title {
  font-weight: 600;
  color: #111827;
  font-size: 18px;
  margin-bottom: 4px;
  line-height: 1.3;
}

.node-subtitle {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.node-body {
  padding: 0 20px 20px;
}

.content-section {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #E2E8F0;
}

.content-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-wrap;
  cursor: text;
  min-height: 40px;
  font-weight: 500;

  &:hover {
    color: #334155;
  }
}

.edit-input-header {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #E2E8F0;
  border-radius: 8px;  
  font-size: 18px;
  font-weight: 600;
  background: white;
  margin-bottom: 8px;
  box-sizing: border-box;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
    font-weight: 500;
  }
}

.edit-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  background: white;
  box-sizing: border-box;
  line-height: 1.6;
  font-weight: 500;
  color: #475569;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;

  button {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    &.save-button {
      background: #3B82F6;
      color: white;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

      &:hover {
        background: #2563EB;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }
    }

    &.cancel-button {
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #E2E8F0;

      &:hover {
        background: #E2E8F0;
        transform: translateY(-1px);
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
    width: 14px;
    height: 14px;
    background: white;
    border: 3px solid #3B82F6;
    border-radius: 50%;
    pointer-events: all;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);

    &:hover {
      background: #DBEAFE;
      transform: scale(1.3);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &.vue-flow__handle-connecting {
      background: #3B82F6;
      transform: scale(1.2);
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

<template>
  <div 
    class="custom-node" 
    :class="{ selected }"
    @dblclick="startEditing"
  >
    <div class="node-header">
      <div class="node-icon">
        <div class="node-number">{{ data.number || '1' }}</div>
      </div>
      <div class="node-info">
        <div class="node-title" v-if="!isEditing">{{ data.label || 'Proceso' }}</div>
        <input
          v-else
          v-model="editedLabel"
          class="edit-input"
          @keyup.enter="saveChanges"
          @keyup.esc="cancelEdit"
          ref="labelInput"
          placeholder="Enter title"
        />
        <div class="node-subtitle">{{ data.subTitle || 'Sin herramienta' }}</div>
      </div>
    </div>
    
    <div class="node-content">
      <div class="content-text" v-if="!isEditing">{{ data.content || 'Procesamiento de información' }}</div>
      <textarea
        v-else
        v-model="editedContent"
        class="edit-textarea"
        @keyup.esc="cancelEdit"
        ref="contentTextarea"
        placeholder="Enter content"
      ></textarea>
    </div>

    <div v-if="isEditing" class="edit-actions">
      <button class="save-button" @click="saveChanges">Save</button>
      <button class="cancel-button" @click="cancelEdit">Cancel</button>
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
  min-width: 300px;
  max-width: 300px;
  background: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &.selected {
    border-color: #999999;
    box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.3);
  }
}

.node-header {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.node-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333333;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
}

.node-number {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.node-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-title {
  font-weight: 600;
  color: #333333;
  font-size: 16px;
  line-height: 1.2;
}

.node-subtitle {
  font-size: 12px;
  color: #666666;
  font-weight: 400;
}

.node-content {
  padding: 0 16px 16px 16px;
}

.content-text {
  font-size: 14px;
  color: #555555;
  line-height: 1.4;
  white-space: pre-wrap;
  padding-left: 48px;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  background: white;

  &:focus {
    outline: none;
    border-color: #999999;
    box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
  }
}

.edit-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  color: #555555;
  resize: vertical;
  background: white;
  margin-left: 48px;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: #999999;
    box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
  }
}

.edit-actions {
  display: flex;
  gap: 8px;
  padding: 8px 16px 16px;
  justify-content: flex-end;

  button {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &.save-button {
      background: #333333;
      color: white;
      border: none;

      &:hover {
        background: #555555;
      }
    }

    &.cancel-button {
      background: white;
      color: #666666;
      border: 1px solid #d0d0d0;

      &:hover {
        background: #f8f8f8;
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
    border: 2px solid #666666;
    border-radius: 50%;
    pointer-events: all;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      transform: scale(1.2);
    }

    &.vue-flow__handle-connecting {
      background: #666666;
    }

    &.vue-flow__handle-valid {
      background: #4CAF50;
      border-color: #2E7D32;
    }

    &.vue-flow__handle-invalid {
      background: #F44336;
      border-color: #C62828;
    }
  }
}
</style>

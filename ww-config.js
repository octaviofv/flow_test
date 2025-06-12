export default {
  editor: {
    label: {
      en: 'Flow-puente',
    },
    icon: 'workflow',
  },
  properties: {
    backgroundColor: {
      label: { en: 'Background Color' },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ffffff',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Set the background color of the flow chart',
      },
      propertyHelp: {
        tooltip: 'Define the background color of the flow chart container',
      },
      /* wwEditor:end */
    },

    backgroundGap: {
      label: { en: 'Background Grid Gap' },
      type: 'Number',
      section: 'style',
      bindable: true,
      defaultValue: 20,
      options: {
        min: 10,
        max: 100,
        step: 5,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'The gap between background grid lines (in pixels)',
      },
      propertyHelp: {
        tooltip: 'Set the spacing between background grid lines',
      },
      /* wwEditor:end */
    },

    width: {
      label: { en: 'Width' },
      type: 'Length',
      section: 'settings',
      bindable: true,
      defaultValue: '100%',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The width of the flow chart container (e.g., "100%", "500px")',
      },
      propertyHelp: {
        tooltip: 'Set the width of the flow chart container',
      },
      /* wwEditor:end */
    },

    height: {
      label: { en: 'Height' },
      type: 'Length',
      section: 'settings',
      bindable: true,
      defaultValue: '500px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The height of the flow chart container (e.g., "500px", "80vh")',
      },
      propertyHelp: {
        tooltip: 'Set the height of the flow chart container',
      },
      /* wwEditor:end */
    },

    toolOptions: {
      label: { en: 'Tool Options' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: ['Sin herramienta', 'Hubspot', 'Gmail'],
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of available tool options for nodes',
      },
      propertyHelp: {
        tooltip: 'Define the list of available tools that can be selected for nodes',
      },
      /* wwEditor:end */
    },

    toolName: {
      label: { en: 'Tool Name' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'Sin herramienta',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The name of the tool used in this node',
      },
      propertyHelp: {
        tooltip: 'Set the name of the tool used in this process step',
      },
      /* wwEditor:end */
    },

    initialNodeValue: {
      label: { en: 'Initial Node Value' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'Nodo Inicial',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The initial value/text that will be displayed in new nodes',
      },
      propertyHelp: {
        tooltip: 'Set the initial value/text that will be displayed in new nodes',
      },
      /* wwEditor:end */
    },

    flowData: {
      label: { en: 'Flow Data' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: JSON.stringify({
      "nodes": [
        {
          "id": "input",
          "type": "custom",
          "position": { "x": 60, "y": 20 },
          "size": { "width": 280, "height": 100 },
          "data": {
            "label": "Entrada",
            "content": "Información de entrada",
            "number": "1",
            "backgroundColor": "#E3F2FD",
            "toolName": "Sin herramienta"
          },
          "handles": {
            "source": ["bottom"],
            "target": ["top"]
          }
        },
        {
          "id": "process",
          "type": "custom",
          "position": { "x": 60, "y": 150 },
          "size": { "width": 280, "height": 100 },
          "data": {
            "label": "Proceso",
            "content": "Procesamiento de información",
            "number": "2",
            "backgroundColor": "#F3E5F5",
            "toolName": "Sin herramienta"
          },
          "handles": {
            "source": ["bottom"],
            "target": ["top"]
          }
        },
        {
          "id": "output",
          "type": "custom",
          "position": { "x": 60, "y": 280 },
          "size": { "width": 280, "height": 100 },
          "data": {
            "label": "Salida",
            "content": "Información de salida",
            "number": "3",
            "backgroundColor": "#E8F5E9",
            "toolName": "Sin herramienta"
          },
          "handles": {
            "source": ["bottom"],
            "target": ["top"]
          }
        }
      ],
      "edges": [
        {
          "id": "e1-2",
          "source": "input",
          "sourceHandle": "bottom",
          "target": "process",
          "targetHandle": "top",
          "type": "smoothstep",
          "animated": true
        },
        {
          "id": "e2-3",
          "source": "process",
          "sourceHandle": "bottom",
          "target": "output",
          "targetHandle": "top",
          "type": "smoothstep",
          "animated": true
        }
      ]
    }
    ),
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A JSON string containing nodes and edges data for the flow chart',
      },
      propertyHelp: {
        tooltip: 'The flow chart structure defined as a JSON string with nodes and their connections',
      },
      /* wwEditor:end */
    },

    defaultZoom: {
      label: { en: 'Default Zoom' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 1,
      options: {
        min: 0.1,
        max: 4,
        step: 0.1,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'The default zoom level (between 0.1 and 4)',
      },
      propertyHelp: {
        tooltip: 'Set the initial zoom level of the flow chart',
      },
      /* wwEditor:end */
    },

    minZoom: {
      label: { en: 'Min Zoom' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 0.1,
      options: {
        min: 0.1,
        max: 1,
        step: 0.1,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'The minimum allowed zoom level (between 0.1 and 1)',
      },
      propertyHelp: {
        tooltip: 'Set the minimum zoom level allowed',
      },
      /* wwEditor:end */
    },

    maxZoom: {
      label: { en: 'Max Zoom' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 4,
      options: {
        min: 1,
        max: 10,
        step: 0.1,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'The maximum allowed zoom level (between 1 and 10)',
      },
      propertyHelp: {
        tooltip: 'Set the maximum zoom level allowed',
      },
      /* wwEditor:end */
    },

    showMinimap: {
      label: { en: 'Show Minimap' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Toggle the minimap visibility',
      },
      propertyHelp: {
        tooltip: 'Show or hide the minimap overview',
      },
      /* wwEditor:end */
    },
  },
  triggerEvents: [
    {
      name: 'nodeAdded',
      label: { en: 'On Node Added' },
      event: { node: null },
    },
    {
      name: 'nodeSelected',
      label: { en: 'On Node Selected' },
      event: { node: null },
    },
    {
      name: 'nodeDeleted',
      label: { en: 'On Node Deleted' },
      event: {},
    },
    {
      name: 'nodeUpdated',
      label: { en: 'On Node Updated' },
      event: { node: null },
    },
    {
      name: 'connectionCreated',
      label: { en: 'On Connection Created' },
      event: { connection: null },
    },
    {
      name: 'selectionCleared',
      label: { en: 'On Selection Cleared' },
      event: {},
    },
    {
      name: 'flowSaved',
      label: { en: 'On Flow Saved' },
      event: { flowData: null },
    },
    {
      name: 'flowManuallySaved',
      label: { en: 'On Flow Manually Saved' },
      event: { flowData: null },
    }
  ],
  actions: [
    {
      name: 'addNode',
      label: { en: 'Add Node' },
    },
    {
      name: 'deleteSelected',
      label: { en: 'Delete Selected' },
    },
    {
      name: 'updateNodeData',
      label: { en: 'Update Node Data' },
      args: [
        {
          name: 'nodeId',
          type: 'string',
          label: { en: 'Node ID' },
        },
        {
          name: 'data',
          type: 'object',
          label: { en: 'Node Data' },
        },
      ],
    },
  ],
};

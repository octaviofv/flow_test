export default {
  editor: {
    label: {
    en: 'flow-puente',
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

  initialNodeValue: {
    label: { en: 'Initial Node Value' },
    type: 'Object',
    section: 'settings',
    bindable: true,
    defaultValue: {
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
        },
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
            "x": -34.0342699571773,
            "y": 150,
            "z": 0
          },
          "selected": false,
          "dragging": false,
          "resizing": false,
          "initialized": true,
          "data": {
            "label": "Proceso",
            "content": "Procesamiento de informacións",
            "number": "2",
            "backgroundColor": "#F3E5F5",
            "toolName": "Sin herramienta"
          },
          "events": {},
          "id": "process",
          "position": {
            "x": -34.0342699571773,
            "y": 150
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
        },
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
                "x": 278.00001525878906,
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
            "x": 115.74888861746939,
            "y": 306.8669342734793,
            "z": 0
          },
          "selected": false,
          "dragging": false,
          "resizing": false,
          "initialized": true,
          "data": {
            "label": "Salida",
            "content": "Información de salida",
            "number": "3",
            "backgroundColor": "#E8F5E9",
            "toolName": "Sin herramienta"
          },
          "events": {},
          "id": "output",
          "position": {
            "x": 115.74888861746939,
            "y": 306.8669342734793
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
        },
        {
          "type": "custom",
          "dimensions": {
            "width": 280,
            "height": 75
          },
          "handleBounds": {
            "source": [
              {
                "id": "right",
                "position": "right",
                "x": 278,
                "y": 34.5,
                "width": 6,
                "height": 6
              },
              {
                "id": "bottom",
                "position": "bottom",
                "x": 137,
                "y": 73,
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
                "y": 34.5,
                "width": 6,
                "height": 6
              }
            ]
          },
          "computedPosition": {
            "x": -184.2932138185039,
            "y": -1148.9886907503105,
            "z": 0
          },
          "selected": false,
          "dragging": false,
          "resizing": false,
          "initialized": true,
          "data": {
            "label": "Nuevo Proceso",
            "content": "",
            "number": "N",
            "backgroundColor": "#ffffff"
          },
          "events": {},
          "id": "node_1749019815180",
          "position": {
            "x": -184.2932138185039,
            "y": -1148.9886907503105
          }
        }
      ],
      "edges": [
        {
          "type": "smoothstep",
          "animated": true,
          "markerEnd": {
            "type": "arrow",
            "color": "#37352F",
            "width": 20,
            "height": 20
          },
          "sourceHandle": "bottom",
          "targetHandle": "top",
          "source": "input",
          "target": "process",
          "data": {},
          "events": {},
          "id": "e1-2",
          "sourceNode": {
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
          },
          "targetNode": {
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
              "x": -34.0342699571773,
              "y": 150,
              "z": 0
            },
            "selected": false,
            "dragging": false,
            "resizing": false,
            "initialized": true,
            "data": {
              "label": "Proceso",
              "content": "Procesamiento de informacións",
              "number": "2",
              "backgroundColor": "#F3E5F5",
              "toolName": "Sin herramienta"
            },
            "events": {},
            "id": "process",
            "position": {
              "x": -34.0342699571773,
              "y": 150
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
          },
          "sourceX": 14.824796465654117,
          "sourceY": 33.08279496231803,
          "targetX": 105.9657300428227,
          "targetY": 146
        },
        {
          "type": "smoothstep",
          "animated": true,
          "markerEnd": {
            "type": "arrow",
            "color": "#37352F",
            "width": 20,
            "height": 20
          },
          "sourceHandle": "bottom",
          "targetHandle": "top",
          "source": "process",
          "target": "output",
          "data": {},
          "events": {},
          "id": "e2-3",
          "sourceNode": {
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
              "x": -34.0342699571773,
              "y": 150,
              "z": 0
            },
            "selected": false,
            "dragging": false,
            "resizing": false,
            "initialized": true,
            "data": {
              "label": "Proceso",
              "content": "Procesamiento de informacións",
              "number": "2",
              "backgroundColor": "#F3E5F5",
              "toolName": "Sin herramienta"
            },
            "events": {},
            "id": "process",
            "position": {
              "x": -34.0342699571773,
              "y": 150
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
          },
          "targetNode": {
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
                  "x": 278.00001525878906,
                  "y": 45,
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
              "x": 115.74888861746939,
              "y": 306.8669342734793,
              "z": 0
            },
            "selected": false,
            "dragging": false,
            "resizing": false,
            "initialized": true,
            "data": {
              "label": "Salida",
              "content": "Información de salida",
              "number": "3",
              "backgroundColor": "#E8F5E9",
              "toolName": "Sin herramienta"
            },
            "events": {},
            "id": "output",
            "position": {
              "x": 115.74888861746939,
              "y": 306.8669342734793
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
          },
          "sourceX": 105.9657300428227,
          "sourceY": 250,
          "targetX": 255.7488886174694,
          "targetY": 302.8669342734793
        }
      ]
    },
    /* wwEditor:start */
    bindingValidation: {
      type: 'object',
      tooltip: 'Set the default flow data with nodes and edges',
    },
    propertyHelp: {
      tooltip: 'Define the complete default flow structure including nodes and edges',
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
    }
  },
  triggerEvents: [
    {
      name: 'flowSaved',
      label: { en: 'On Flow Saved' },
      event: { flowData: 'flowData'}
    },
  ]
};

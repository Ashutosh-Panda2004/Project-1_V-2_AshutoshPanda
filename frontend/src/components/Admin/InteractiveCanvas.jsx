// // frontend/src/components/Admin/InteractiveCanvas.jsx

// import React, { useCallback, useRef, useState } from 'react';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { v4 as uuidv4 } from 'uuid';
// import { useDrop } from 'react-dnd';
// import { ConditionNode, OperatorNode, ContainerNode } from './CustomNodes';
// import Toolbar from './Toolbar';
// import ConfirmationModal from './ConfirmationModal';
// import api from '../../api';

// const nodeTypes = {
//   condition: ConditionNode,
//   operator: OperatorNode,
//   container: ContainerNode,
// };

// const InteractiveCanvas = () => {
//   const reactFlowWrapper = useRef(null);
//   const reactFlowInstance = useRef(null);

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [nodeToDelete, setNodeToDelete] = useState(null);
//   const [selectedNodes, setSelectedNodes] = useState([]);
//   const [ruleString, setRuleString] = useState('');
//   const [showRuleModal, setShowRuleModal] = useState(false);

//   // Handlers for node data changes
//   const handleChangeOperator = (id, newOperator) => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === id) {
//           node.data = { ...node.data, operator: newOperator };
//         }
//         return node;
//       })
//     );
//   };

//   const handleChangeValue = (id, newValue) => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === id) {
//           node.data = { ...node.data, value: newValue };
//         }
//         return node;
//       })
//     );
//   };

//   const handleChangeContainerName = (id, newName) => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === id) {
//           node.data = { ...node.data, name: newName };
//         }
//         return node;
//       })
//     );
//   };

//   // Handlers for node deletion
//   const handleDelete = (id) => {
//     setNodeToDelete(id);
//     setShowModal(true);
//   };

//   const confirmDelete = () => {
//     setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
//     setEdges((eds) =>
//       eds.filter(
//         (edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete
//       )
//     );
//     setShowModal(false);
//     setNodeToDelete(null);
//   };

//   const cancelDelete = () => {
//     setShowModal(false);
//     setNodeToDelete(null);
//   };

//   // Drop handler for drag-and-drop
//   const [, drop] = useDrop({
//     accept: ['ATTRIBUTE', 'OPERATOR'],
//     drop: (item, monitor) => {
//       if (!reactFlowInstance.current) return;

//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const clientOffset = monitor.getClientOffset();

//       // Ensure clientOffset is available
//       if (!clientOffset) return;

//       const position = reactFlowInstance.current.project({
//         x: clientOffset.x - reactFlowBounds.left,
//         y: clientOffset.y - reactFlowBounds.top,
//       });

//       let newNode = {};

//       if (item.type === 'ATTRIBUTE') {
//         newNode = {
//           id: uuidv4(),
//           type: 'condition',
//           position,
//           data: {
//             label: item.label,
//             operator: '>',
//             value: '',
//             subtype: item.subtype,
//             onDelete: handleDelete,
//             onChangeOperator: handleChangeOperator,
//             onChangeValue: handleChangeValue,
//           },
//         };
//       } else if (item.type === 'OPERATOR') {
//         newNode = {
//           id: uuidv4(),
//           type: 'operator',
//           position,
//           data: {
//             label: item.label,
//             onDelete: handleDelete,
//           },
//         };
//       }

//       setNodes((nds) => nds.concat(newNode));
//     },
//   });

//   // Selection change handler
//   const onSelectionChange = useCallback((selection) => {
//     setSelectedNodes(selection.nodes);
//   }, []);

//   // Handler to add a container around selected nodes
//   const addContainer = () => {
//     if (selectedNodes.length < 2) {
//       alert('Please select at least two nodes to wrap into a container.');
//       return;
//     }

//     const containerId = uuidv4();
//     const containerPosition = {
//       x: Math.min(...selectedNodes.map((node) => node.position.x)) - 50,
//       y: Math.min(...selectedNodes.map((node) => node.position.y)) - 50,
//     };

//     // Access width and height from node's style or set default values
//     const containerWidth =
//       Math.max(
//         ...selectedNodes.map(
//           (node) => (node.style?.width ? parseInt(node.style.width) : 100) + node.position.x
//         )
//       ) - containerPosition.x + 50;
//     const containerHeight =
//       Math.max(
//         ...selectedNodes.map(
//           (node) => (node.style?.height ? parseInt(node.style.height) : 50) + node.position.y
//         )
//       ) - containerPosition.y + 50;

//     const containerNode = {
//       id: containerId,
//       type: 'container',
//       position: containerPosition,
//       data: {
//         name: 'New Container',
//         onDelete: handleDelete,
//         onChangeName: handleChangeContainerName,
//       },
//       style: {
//         width: containerWidth,
//         height: containerHeight,
//         background: '#2D3748', // Maintain original canvas color
//         border: '2px solid #4A5568',
//       },
//     };

//     const updatedNodes = nodes.map((node) => {
//       if (selectedNodes.find((sn) => sn.id === node.id)) {
//         return {
//           ...node,
//           parentNode: containerId,
//           extent: 'parent',
//           draggable: true,
//         };
//       }
//       return node;
//     });

//     setNodes([...updatedNodes, containerNode]);
//   };

//   // Function to build individual rule parts
//   const buildRule = (nodeId, visitedNodes) => {
//     const node = nodes.find((n) => n.id === nodeId);
//     if (!node || visitedNodes.has(nodeId)) return '';

//     visitedNodes.add(nodeId);

//     if (node.type === 'condition') {
//       const value =
//         node.data.subtype === 'string' ? `'${node.data.value}'` : node.data.value;
//       const operator =
//         node.data.operator === '==' || node.data.operator === '!='
//           ? node.data.operator
//           : node.data.subtype === 'string'
//           ? '=='
//           : node.data.operator;
//       return `(${node.data.label} ${operator} ${value})`;
//     }

//     if (node.type === 'operator') {
//       const incomingEdges = edges.filter((e) => e.target === nodeId);
//       const connectedNodes = incomingEdges.map((e) => e.source);
//       const connectedRules = connectedNodes
//         .map((id) => buildRule(id, visitedNodes))
//         .filter(Boolean);

//       if (connectedRules.length > 1) {
//         const operator = node.data.label === 'AND' ? '&&' : '||';
//         return `(${connectedRules.join(` ${operator} `)})`;
//       }
//       return connectedRules[0] || '';
//     }

//     if (node.type === 'container') {
//       // Process child nodes within the container
//       const containerEdges = edges.filter((e) => e.source === node.id);
//       const containerRules = containerEdges
//         .map((e) => buildRule(e.target, visitedNodes))
//         .filter(Boolean)
//         .join(' && '); // Link rules inside the container

//       return containerRules ? `(${containerRules})` : '';
//     }

//     return '';
//   };

//   // Function to generate the complete rule string
//   const generateRuleString = () => {
//     const visitedNodes = new Set(); // Shared visitedNodes set
//     const rootNodes = nodes.filter((node) => !node.parentNode);
//     const ruleParts = rootNodes.map((node) => buildRule(node.id, visitedNodes)).filter(Boolean);

//     return ruleParts.join(' && ');
//   };

//   // Handler to generate and display the rule string
//   const handleGenerateRule = () => {
//     const generatedRule = generateRuleString();
//     setRuleString(generatedRule);
//     setShowRuleModal(true);
//   };

//   // Handler to save the generated rule
//   const handleSaveRule = async () => {
//     if (!ruleString) {
//       alert('Rule string is empty. Generate the rule first.');
//       return;
//     }

//     try {
//       const response = await api.post('/api/create-rule', { ruleString });
//       alert('Rule saved successfully!');
//       setNodes([]);
//       setEdges([]);
//       setShowRuleModal(false);
//     } catch (err) {
//       console.error('Error saving rule:', err);
//       alert('Failed to save rule.');
//     }
//   };

//   return (
//     <ReactFlowProvider>
//       <div className="flex h-screen">
//         {/* Toolbar */}
//         <Toolbar />

//         {/* Canvas Area */}
//         <div className="flex-1 relative">
//           <div
//             ref={(el) => {
//               reactFlowWrapper.current = el;
//               drop(el);
//             }}
//             className="h-full bg-gray-100" // Maintain original canvas color
//           >
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={(params) =>
//                 setEdges((eds) => addEdge({ ...params, animated: true }, eds))
//               }
//               onInit={(instance) => (reactFlowInstance.current = instance)}
//               nodeTypes={nodeTypes}
//               initialZoom={1} // Set initial zoom level
//               connectionLineStyle={{ stroke: '#fff' }}
//               connectionLineType="smoothstep"
//               snapToGrid={true}
//               snapGrid={[15, 15]}
//               onSelectionChange={onSelectionChange}
//             >
//               <MiniMap
//                 nodeStrokeColor={(n) => {
//                   if (n.type === 'condition') return '#63b3ed';
//                   if (n.type === 'operator') return '#f6ad55';
//                   if (n.type === 'container') return '#d69e2e';
//                   return '#a0aec0';
//                 }}
//                 nodeColor={(n) => {
//                   if (n.type === 'condition') return '#2c5282';
//                   if (n.type === 'operator') return '#dd6b20';
//                   if (n.type === 'container') return '#975a16';
//                   return '#2d3748';
//                 }}
//                 nodeBorderRadius={2}
//               />
//               <Controls />
//               <Background color="#aaa" gap={16} />
//             </ReactFlow>
//           </div>

//           {/* Generate Rule Button */}
//           <button
//             onClick={handleGenerateRule}
//             className="absolute bottom-4 right-36 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out"
//           >
//             Generate Rule
//           </button>

//           {/* Save Rule Button */}
//           {ruleString && (
//             <button
//               onClick={handleSaveRule}
//               className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 ease-in-out"
//             >
//               Save Rule
//             </button>
//           )}

//           {/* Wrap in Container Button */}
//           {selectedNodes.length >= 2 && (
//             <button
//               onClick={addContainer}
//               className="absolute bottom-16 right-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-300 ease-in-out"
//             >
//               Wrap in Container
//             </button>
//           )}

//           {/* Rule String Modal */}
//           {showRuleModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//               <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
//                 <h3 className="text-xl font-semibold mb-4 text-white">Generated Rule</h3>
//                 <textarea
//                   readOnly
//                   value={ruleString}
//                   className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded h-32"
//                 ></textarea>
//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={() => setShowRuleModal(false)}
//                     className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300 ease-in-out"
//                   >
//                     Close
//                   </button>
//                   <button
//                     onClick={handleSaveRule}
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Confirmation Modal */}
//           {showModal && (
//             <ConfirmationModal
//               message="Are you sure you want to delete this node?"
//               onConfirm={confirmDelete}
//               onCancel={cancelDelete}
//             />
//           )}
//         </div>
//       </div>
//     </ReactFlowProvider>
//   );
// };

// export default InteractiveCanvas;






























// frontend/src/components/Admin/InteractiveCanvas.jsx

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { useDrop } from 'react-dnd';
import { ConditionNode, OperatorNode, ContainerNode } from './CustomNodes';
import Toolbar from './Toolbar';
import ConfirmationModal from './ConfirmationModal';
import api from '../../api';

const nodeTypes = {
  condition: ConditionNode,
  operator: OperatorNode,
  container: ContainerNode,
};

const InteractiveCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [ruleString, setRuleString] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);

  // Handlers for node data changes
  const handleChangeOperator = (id, newOperator) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, operator: newOperator };
        }
        return node;
      })
    );
  };

  const handleChangeValue = (id, newValue) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, value: newValue };
        }
        return node;
      })
    );
  };

  const handleChangeContainerName = (id, newName) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, name: newName };
        }
        return node;
      })
    );
  };

  // Handlers for node deletion
  const handleDelete = (id) => {
    setNodeToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete
      )
    );
    setShowModal(false);
    setNodeToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setNodeToDelete(null);
  };

  // Drop handler for drag-and-drop
  const [, drop] = useDrop({
    accept: ['ATTRIBUTE', 'OPERATOR'],
    drop: (item, monitor) => {
      if (!reactFlowInstance.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      // Ensure clientOffset is available
      if (!clientOffset) return;

      const position = reactFlowInstance.current.project({
        x: clientOffset.x - reactFlowBounds.left,
        y: clientOffset.y - reactFlowBounds.top,
      });

      let newNode = {};

      if (item.type === 'ATTRIBUTE') {
        newNode = {
          id: uuidv4(),
          type: 'condition',
          position,
          data: {
            label: item.label,
            operator: '>',
            value: '',
            subtype: item.subtype,
            onDelete: handleDelete,
            onChangeOperator: handleChangeOperator,
            onChangeValue: handleChangeValue,
          },
        };
      } else if (item.type === 'OPERATOR') {
        newNode = {
          id: uuidv4(),
          type: 'operator',
          position,
          data: {
            label: item.label,
            onDelete: handleDelete,
          },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
  });

  // Selection change handler
  const onSelectionChange = useCallback((selection) => {
    setSelectedNodes(selection.nodes);
  }, []);

  // Handler to add a container around selected nodes
  const addContainer = () => {
    if (selectedNodes.length < 2) {
      alert('Please select at least two nodes to wrap into a container.');
      return;
    }

    const containerId = uuidv4();
    const containerPosition = {
      x: Math.min(...selectedNodes.map((node) => node.position.x)) - 50,
      y: Math.min(...selectedNodes.map((node) => node.position.y)) - 50,
    };

    // Access width and height from node's style or set default values
    const containerWidth =
      Math.max(
        ...selectedNodes.map(
          (node) => (node.style?.width ? parseInt(node.style.width) : 100) + node.position.x
        )
      ) - containerPosition.x + 50;
    const containerHeight =
      Math.max(
        ...selectedNodes.map(
          (node) => (node.style?.height ? parseInt(node.style.height) : 50) + node.position.y
        )
      ) - containerPosition.y + 50;

    const containerNode = {
      id: containerId,
      type: 'container',
      position: containerPosition,
      data: {
        name: 'New Container',
        onDelete: handleDelete,
        onChangeName: handleChangeContainerName,
      },
      style: {
        width: containerWidth,
        height: containerHeight,
        background: '#2D3748', // Maintain original canvas color
        border: '2px solid #4A5568',
      },
    };

    const updatedNodes = nodes.map((node) => {
      if (selectedNodes.find((sn) => sn.id === node.id)) {
        return {
          ...node,
          parentNode: containerId,
          extent: 'parent',
          draggable: true,
        };
      }
      return node;
    });

    setNodes([...updatedNodes, containerNode]);
  };

  // Function to build individual rule parts
  const buildRule = (nodeId, visitedNodes) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || visitedNodes.has(nodeId)) return '';

    visitedNodes.add(nodeId);

    if (node.type === 'condition') {
      const value =
        node.data.subtype === 'string' ? `'${node.data.value}'` : node.data.value;
      const operator =
        node.data.operator === '==' || node.data.operator === '!='
          ? node.data.operator
          : node.data.subtype === 'string'
          ? '=='
          : node.data.operator;
      return `(${node.data.label} ${operator} ${value})`;
    }

    if (node.type === 'operator') {
      const incomingEdges = edges.filter((e) => e.target === nodeId);
      const connectedNodes = incomingEdges.map((e) => e.source);
      const connectedRules = connectedNodes
        .map((id) => buildRule(id, visitedNodes))
        .filter(Boolean);

      if (connectedRules.length > 1) {
        const operator = node.data.label === 'AND' ? '&&' : '||';
        return `(${connectedRules.join(` ${operator} `)})`;
      }
      return connectedRules[0] || '';
    }

    if (node.type === 'container') {
      // Process child nodes within the container
      const containerEdges = edges.filter((e) => e.source === node.id);
      const containerRules = containerEdges
        .map((e) => buildRule(e.target, visitedNodes))
        .filter(Boolean)
        .join(' && '); // Link rules inside the container

      return containerRules ? `(${containerRules})` : '';
    }

    return '';
  };

  // Function to generate the complete rule string
  const generateRuleString = () => {
    const visitedNodes = new Set(); // Shared visitedNodes set
    const rootNodes = nodes.filter((node) => !node.parentNode);
    const ruleParts = rootNodes.map((node) => buildRule(node.id, visitedNodes)).filter(Boolean);

    return ruleParts.join(' && ');
  };

  // Handler to generate and display the rule string
  const handleGenerateRule = () => {
    const generatedRule = generateRuleString();
    setRuleString(generatedRule);
    setShowRuleModal(true);
  };

  // Handler to save the generated rule (Removed functionality)
  // const handleSaveRule = async () => {
  //   if (!ruleString) {
  //     alert('Rule string is empty. Generate the rule first.');
  //     return;
  //   }

  //   try {
  //     const response = await api.post('/api/create-rule', { ruleString });
  //     alert('Rule saved successfully!');
  //     setNodes([]);
  //     setEdges([]);
  //     setShowRuleModal(false);
  //   } catch (err) {
  //     console.error('Error saving rule:', err);
  //     alert('Failed to save rule.');
  //   }
  // };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        {/* Toolbar */}
        <Toolbar />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <div
            ref={(el) => {
              reactFlowWrapper.current = el;
              drop(el);
            }}
            className="h-full bg-gray-100" // Maintain original canvas color
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params) =>
                setEdges((eds) => addEdge({ ...params, animated: true }, eds))
              }
              onInit={(instance) => (reactFlowInstance.current = instance)}
              nodeTypes={nodeTypes}
              initialZoom={1} // Set initial zoom level
              connectionLineStyle={{ stroke: '#fff' }}
              connectionLineType="smoothstep"
              snapToGrid={true}
              snapGrid={[15, 15]}
              onSelectionChange={onSelectionChange}
            >
              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.type === 'condition') return '#63b3ed';
                  if (n.type === 'operator') return '#f6ad55';
                  if (n.type === 'container') return '#d69e2e';
                  return '#a0aec0';
                }}
                nodeColor={(n) => {
                  if (n.type === 'condition') return '#2c5282';
                  if (n.type === 'operator') return '#dd6b20';
                  if (n.type === 'container') return '#975a16';
                  return '#2d3748';
                }}
                nodeBorderRadius={2}
              />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>

          {/* Generate Rule Button */}
          <button
            onClick={handleGenerateRule}
            className="absolute bottom-4 right-36 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Generate Rule
          </button>

          {/* Save Rule Button (Removed) */}
          {/* {ruleString && (
            <button
              onClick={handleSaveRule}
              className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              Save Rule
            </button>
          )} */}

          {/* Wrap in Container Button */}
          {selectedNodes.length >= 2 && (
            <button
              onClick={addContainer}
              className="absolute bottom-16 right-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-300 ease-in-out"
            >
              Wrap in Container
            </button>
          )}

          {/* Rule String Modal */}
          {showRuleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4 text-white">Generated Rule</h3>
                <textarea
                  readOnly
                  value={ruleString}
                  className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded h-32"
                ></textarea>
                <p className="mt-4 text-white">
                  Copy the rule and paste it into a text editor to save.
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowRuleModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300 ease-in-out"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showModal && (
            <ConfirmationModal
              message="Are you sure you want to delete this node?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default InteractiveCanvas;

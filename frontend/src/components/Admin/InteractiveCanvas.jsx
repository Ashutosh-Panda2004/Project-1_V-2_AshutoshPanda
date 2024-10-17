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

  const handleDelete = (id) => {
    setNodeToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete));
    setShowModal(false);
    setNodeToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setNodeToDelete(null);
  };

  const [, drop] = useDrop({
    accept: ['ATTRIBUTE', 'OPERATOR'],
    drop: (item, monitor) => {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: monitor.getClientOffset().x - reactFlowBounds.left,
        y: monitor.getClientOffset().y - reactFlowBounds.top,
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

  const onSelectionChange = useCallback((selection) => {
    setSelectedNodes(selection.nodes);
  }, []);

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

    const containerWidth =
      Math.max(...selectedNodes.map((node) => node.position.x + node.width)) - containerPosition.x + 50;
    const containerHeight =
      Math.max(...selectedNodes.map((node) => node.position.y + node.height)) - containerPosition.y + 50;

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

  const generateRuleString = () => {
    const buildRule = (nodeId, visitedNodes = new Set()) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || visitedNodes.has(nodeId)) return '';

      visitedNodes.add(nodeId);

      if (node.type === 'condition') {
        const value = node.data.subtype === 'string' ? `'${node.data.value}'` : node.data.value;
        const operator = node.data.operator === '==' || node.data.operator === '!=' 
                          ? node.data.operator 
                          : node.data.subtype === 'string' ? '==' : node.data.operator;
        return `(${node.data.label} ${operator} ${value})`;
      }

      if (node.type === 'operator') {
        const incomingEdges = edges.filter((e) => e.target === nodeId);
        const connectedNodes = incomingEdges.map((e) => e.source);
        const connectedRules = connectedNodes.map((id) => buildRule(id, visitedNodes)).filter(Boolean);
        
        if (connectedRules.length > 1) {
          const operator = node.data.label === 'AND' ? '&&' : '||';
          return `(${connectedRules.join(` ${operator} `)})`;
        }
        return connectedRules[0] || '';
      }

      return '';
    };

    const rootNodes = nodes.filter((node) => !node.parentNode);
    const ruleParts = rootNodes.map((node) => buildRule(node.id)).filter(Boolean);
    
    const uniqueRuleParts = Array.from(new Set(ruleParts));

    return uniqueRuleParts.join(' && ');
  };

  const handleGenerateRule = () => {
    const generatedRule = generateRuleString();
    setRuleString(generatedRule);
    setShowRuleModal(true);
  };

  const handleSaveRule = async () => {
    if (!ruleString) {
      alert('Rule string is empty. Generate the rule first.');
      return;
    }

    try {
        const response = await api.post('/api/create-rule', { ruleString });
        alert('Rule saved successfully!');
        setNodes([]);
        setEdges([]);
        setShowRuleModal(false);
      } catch (err) {
        console.error('Error saving rule:', err);
        alert('Failed to save rule.');
      }
  };

  return (
    <div className="flex h-screen">
      <Toolbar />

      <div className="flex-1 relative">
        <div ref={(el) => { reactFlowWrapper.current = el; drop(el); }} className="h-full bg-gray-100">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds))}
              onInit={(instance) => (reactFlowInstance.current = instance)}
              nodeTypes={nodeTypes}
              fitView
              connectionLineStyle={{ stroke: '#fff' }}
              connectionLineType="smoothstep"
              snapToGrid={true}
              snapGrid={[15, 15]}
              onSelectionChange={onSelectionChange}
            >
              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.type === 'condition') return '#0041d0';
                  if (n.type === 'operator') return '#ff0072';
                  if (n.type === 'container') return '#1a1a1a';
                  return '#fff';
                }}
                nodeBorderRadius={2}
              />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        <button
          onClick={handleGenerateRule}
          className="absolute bottom-4 right-36 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Rule
        </button>

        {ruleString && (
          <button
            onClick={handleSaveRule}
            className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save Rule
          </button>
        )}

        {selectedNodes.length >= 2 && (
          <button
            onClick={addContainer}
            className="absolute bottom-16 right-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Wrap in Container
          </button>
        )}

        {showRuleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Generated Rule</h3>
              <textarea
                readOnly
                value={ruleString}
                className="w-full p-2 border rounded h-32"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <ConfirmationModal
            message="Are you sure you want to delete this node?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default InteractiveCanvas;





















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

//   const handleDelete = (id) => {
//     setNodeToDelete(id);
//     setShowModal(true);
//   };

//   const confirmDelete = () => {
//     setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
//     setEdges((eds) => eds.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete));
//     setShowModal(false);
//     setNodeToDelete(null);
//   };

//   const cancelDelete = () => {
//     setShowModal(false);
//     setNodeToDelete(null);
//   };

//   const [, drop] = useDrop({
//     accept: ['ATTRIBUTE', 'OPERATOR'],
//     drop: (item, monitor) => {
//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const position = reactFlowInstance.current.project({
//         x: monitor.getClientOffset().x - reactFlowBounds.left,
//         y: monitor.getClientOffset().y - reactFlowBounds.top,
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

//   const onSelectionChange = useCallback((selection) => {
//     setSelectedNodes(selection.nodes);
//   }, []);

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

//     const containerWidth =
//       Math.max(...selectedNodes.map((node) => node.position.x + node.width)) - containerPosition.x + 50;
//     const containerHeight =
//       Math.max(...selectedNodes.map((node) => node.position.y + node.height)) - containerPosition.y + 50;

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

//   // Recursively build rules for nodes and their containers
//   const buildRule = (nodeId, visitedNodes = new Set()) => {
//     const node = nodes.find((n) => n.id === nodeId);
//     if (!node || visitedNodes.has(nodeId)) return '';

//     visitedNodes.add(nodeId);

//     if (node.type === 'condition') {
//       const value = node.data.subtype === 'string' ? `'${node.data.value}'` : node.data.value;
//       const operator = node.data.operator === '==' || node.data.operator === '!='
//         ? node.data.operator
//         : node.data.subtype === 'string'
//         ? '=='
//         : node.data.operator;
//       return `(${node.data.label} ${operator} ${value})`;
//     }

//     if (node.type === 'operator') {
//       const incomingEdges = edges.filter((e) => e.target === nodeId);
//       const connectedNodes = incomingEdges.map((e) => e.source);
//       const connectedRules = connectedNodes.map((id) => buildRule(id, visitedNodes)).filter(Boolean);

//       if (connectedRules.length > 1) {
//         const operator = node.data.label === 'AND' ? '&&' : '||';
//         return `(${connectedRules.join(` ${operator} `)})`;
//       }
//       return connectedRules[0] || '';
//     }

//     if (node.type === 'container') {
//       // Recursively process container's child nodes
//       const containerConditions = edges
//         .filter((e) => e.source === node.id)
//         .map((e) => buildRule(e.target, visitedNodes))
//         .filter(Boolean)
//         .join(' && '); // Link rules inside the container

//       return containerConditions ? `(${containerConditions})` : '';
//     }

//     return '';
//   };

//   const generateRuleString = () => {
//     const rootNodes = nodes.filter((node) => !node.parentNode);
//     const ruleParts = rootNodes.map((node) => buildRule(node.id)).filter(Boolean);

//     return ruleParts.join(' && ');
//   };

//   const handleGenerateRule = () => {
//     const generatedRule = generateRuleString();
//     setRuleString(generatedRule);
//     setShowRuleModal(true);
//   };

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
//     <div className="flex h-screen">
//       <Toolbar />

//       <div className="flex-1 relative">
//         <div ref={(el) => { reactFlowWrapper.current = el; drop(el); }} className="h-full bg-gray-100">
//           <ReactFlowProvider>
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={(params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds))}
//               onInit={(instance) => (reactFlowInstance.current = instance)}
//               nodeTypes={nodeTypes}
//               fitView
//               connectionLineStyle={{ stroke: '#fff' }}
//               connectionLineType="smoothstep"
//               snapToGrid={true}
//               snapGrid={[15, 15]}
//               onSelectionChange={onSelectionChange}
//             >
//               <MiniMap
//                 nodeStrokeColor={(n) => {
//                   if (n.type === 'condition') return '#0041d0';
//                   if (n.type === 'operator') return '#ff0072';
//                   if (n.type === 'container') return '#1a1a1a';
//                   return '#fff';
//                 }}
//                 nodeBorderRadius={2}
//               />
//               <Controls />
//               <Background color="#aaa" gap={16} />
//             </ReactFlow>
//           </ReactFlowProvider>
//         </div>

//         <button
//           onClick={handleGenerateRule}
//           className="absolute bottom-4 right-36 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Generate Rule
//         </button>

//         {ruleString && (
//           <button
//             onClick={handleSaveRule}
//             className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//           >
//             Save Rule
//           </button>
//         )}

//         {selectedNodes.length >= 2 && (
//           <button
//             onClick={addContainer}
//             className="absolute bottom-16 right-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
//           >
//             Wrap in Container
//           </button>
//         )}

//         {showRuleModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <h3 className="text-lg font-bold mb-4">Generated Rule</h3>
//               <textarea
//                 readOnly
//                 value={ruleString}
//                 className="w-full p-2 border rounded h-32"
//               ></textarea>
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => setShowRuleModal(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showModal && (
//           <ConfirmationModal
//             message="Are you sure you want to delete this node?"
//             onConfirm={confirmDelete}
//             onCancel={cancelDelete}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default InteractiveCanvas;

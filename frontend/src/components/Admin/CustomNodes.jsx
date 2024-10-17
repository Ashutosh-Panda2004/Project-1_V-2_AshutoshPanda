// // frontend/src/components/Admin/CustomNodes.jsx

// import React, { useState } from 'react';
// import { Handle, Position } from 'reactflow';
// import { motion } from 'framer-motion';

// export const ConditionNode = ({ data }) => {
//   const [operator, setOperator] = useState(data.operator || '>');
//   const [value, setValue] = useState(data.value || '');

//   const handleOperatorChange = (e) => {
//     setOperator(e.target.value);
//     data.onChangeOperator(data.id, e.target.value);
//   };

//   const handleValueChange = (e) => {
//     const newValue = e.target.value;
//     // Validate based on subtype
//     if (data.subtype === 'number') {
//       if (/^\d*$/.test(newValue)) {
//         setValue(newValue);
//         data.onChangeValue(data.id, newValue);
//       }
//     } else if (data.subtype === 'string') {
//       const lowercased = newValue.toLowerCase();
//       setValue(lowercased);
//       data.onChangeValue(data.id, lowercased);
//     }
//   };

//   return (
//     <motion.div
//       className="p-2 bg-blue-200 rounded border border-blue-400"
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.8 }}
//       layout
//     >
//       <div className="flex flex-col">
//         <span className="font-semibold">{data.label}</span>
//         <div className="flex items-center mt-1">
//           <select
//             className="mr-2 p-1 border rounded"
//             value={operator}
//             onChange={handleOperatorChange}
//           >
//             {data.subtype === 'number' ? (
//               <>
//                 <option value=">">&gt;</option>
//                 <option value="<">&lt;</option>
//                 <option value="=">=</option>
//                 <option value="!=">!=</option>
//                 <option value="≥">≥</option>
//                 <option value="≤">≤</option>
//               </>
//             ) : (
//               <>
//                 <option value="=">=</option>
//                 <option value="!=">!=</option>
//               </>
//             )}
//           </select>
//           <input
//             type={data.subtype === 'number' ? 'number' : 'text'}
//             className="p-1 border rounded"
//             value={value}
//             onChange={handleValueChange}
//             placeholder="Value"
//           />
//         </div>
//         <button
//           onClick={() => data.onDelete(data.id)}
//           className="self-end text-red-500 text-sm mt-1"
//         >
//           Delete
//         </button>
//       </div>
//       <Handle type="target" position={Position.Top} />
//       <Handle type="source" position={Position.Bottom} />
//     </motion.div>
//   );
// };

// export const OperatorNode = ({ data }) => {
//   return (
//     <motion.div
//       className="p-2 bg-green-200 rounded border border-green-400 text-center"
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.8 }}
//       layout
//     >
//       {data.label}
//       <Handle type="target" position={Position.Top} />
//       <Handle type="source" position={Position.Bottom} />
//     </motion.div>
//   );
// };

// export const ContainerNode = ({ data }) => {
//   const [name, setName] = useState(data.name || 'Container');

//   const handleNameChange = (e) => {
//     const newName = e.target.value;
//     setName(newName);
//     data.onChangeName(data.id, newName);
//   };

//   return (
//     <motion.div
//       className="p-4 bg-yellow-200 rounded border border-yellow-400"
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.8 }}
//       layout
//     >
//       <div className="flex justify-between items-center mb-2">
//         <input
//           type="text"
//           className="p-1 border rounded"
//           value={name}
//           onChange={handleNameChange}
//           placeholder="Container Name"
//         />
//         <button
//           onClick={() => data.onDelete(data.id)}
//           className="text-red-500 text-sm"
//         >
//           Delete
//         </button>
//       </div>
//       {/* Children Nodes will be rendered here by React Flow */}
//       <Handle type="target" position={Position.Top} />
//       <Handle type="source" position={Position.Bottom} />
//     </motion.div>
//   );
// };









// frontend/src/components/Admin/CustomNodes.jsx

import ConditionNode from './ConditionNode';
import OperatorNode from './OperatorNode';
import ContainerNode from './ContainerNode';

export { ConditionNode, OperatorNode, ContainerNode };

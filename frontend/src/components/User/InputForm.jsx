// import React from 'react';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import axios from 'axios';

// const InputForm = ({ setEvaluationResult }) => {
//   const formik = useFormik({
//     initialValues: {
//       age: '',
//       salary: '',
//       department: '',
//       experience: '',
//       location: '',
//       role: '',
//     },
//     validationSchema: yup.object({
//       age: yup
//         .number()
//         .required('Age is required')
//         .positive('Age must be positive')
//         .integer('Age must be an integer'),
//       salary: yup
//         .number()
//         .required('Salary is required')
//         .positive('Salary must be positive'),
//       department: yup.string().required('Department is required'),
//       experience: yup
//         .number()
//         .required('Experience is required')
//         .min(0, 'Experience cannot be negative')
//         .integer('Experience must be an integer'),
//       location: yup.string().required('Location is required'),
//       role: yup.string().required('Role is required'),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         console.log('Submitting values:', values); // Add this line
//         const response = await axios.post('/api/rules/evaluate', values);
//         console.log('Response:', response.data); // Add this line
//         setEvaluationResult(response.data.eligible);
//       } catch (error) {
//         console.error('Error evaluating rules:', error.response?.data || error.message);
//         alert('Failed to evaluate rules. Please try again.');
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
//       {/* Age Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="age">
//           Age
//         </label>
//         <input
//           id="age"
//           name="age"
//           type="number"
//           placeholder="Enter your age"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.age}
//           className={`w-full p-2 border rounded ${
//             formik.touched.age && formik.errors.age ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.age && formik.errors.age && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
//         )}
//       </div>

//       {/* Salary Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="salary">
//           Salary
//         </label>
//         <input
//           id="salary"
//           name="salary"
//           type="number"
//           placeholder="Enter your salary"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.salary}
//           className={`w-full p-2 border rounded ${
//             formik.touched.salary && formik.errors.salary ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.salary && formik.errors.salary && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.salary}</div>
//         )}
//       </div>

//       {/* Department Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="department">
//           Department
//         </label>
//         <input
//           id="department"
//           name="department"
//           type="text"
//           placeholder="Enter your department"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.department}
//           className={`w-full p-2 border rounded ${
//             formik.touched.department && formik.errors.department ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.department && formik.errors.department && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.department}</div>
//         )}
//       </div>

//       {/* Experience Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="experience">
//           Experience (Years)
//         </label>
//         <input
//           id="experience"
//           name="experience"
//           type="number"
//           placeholder="Enter your experience in years"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.experience}
//           className={`w-full p-2 border rounded ${
//             formik.touched.experience && formik.errors.experience ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.experience && formik.errors.experience && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.experience}</div>
//         )}
//       </div>

//       {/* Location Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="location">
//           Location
//         </label>
//         <input
//           id="location"
//           name="location"
//           type="text"
//           placeholder="Enter your location"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.location}
//           className={`w-full p-2 border rounded ${
//             formik.touched.location && formik.errors.location ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.location && formik.errors.location && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
//         )}
//       </div>

//       {/* Role Input */}
//       <div className="mb-4">
//         <label className="block text-white mb-1" htmlFor="role">
//           Role
//         </label>
//         <input
//           id="role"
//           name="role"
//           type="text"
//           placeholder="Enter your role"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.role}
//           className={`w-full p-2 border rounded ${
//             formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formik.touched.role && formik.errors.role && (
//           <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={formik.isSubmitting}
//         className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full ${
//           formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//         }`}
//       >
//         {formik.isSubmitting ? 'Submitting...' : 'Submit'}
//       </button>
//     </form>
//   );
// };

// export default InputForm;












import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const InputForm = ({ setEvaluationResult }) => {
  const formik = useFormik({
    initialValues: {
      age: '',
      salary: '',
      department: '',
      experience: '',
      location: '',
      role: '',
    },
    validationSchema: yup.object({
      age: yup
        .number()
        .required('Age is required')
        .positive('Age must be positive')
        .integer('Age must be an integer'),
      salary: yup
        .number()
        .required('Salary is required')
        .positive('Salary must be positive'),
      department: yup.string().required('Department is required'),
      experience: yup
        .number()
        .required('Experience is required')
        .min(0, 'Experience cannot be negative')
        .integer('Experience must be an integer'),
      location: yup.string().required('Location is required'),
      role: yup.string().required('Role is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('Submitting values:', values); // Debugging line
        const response = await axios.post('/api/rules/evaluate', values);
        console.log('Response:', response.data); // Debugging line
        setEvaluationResult(response.data.eligible);
      } catch (error) {
        console.error('Error evaluating rules:', error.response?.data || error.message);
        alert('Failed to evaluate rules. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
      {/* Age Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="age">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          placeholder="Enter your age"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.age}
          className={`w-full p-2 border rounded text-black ${
            formik.touched.age && formik.errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.age && formik.errors.age && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
        )}
      </div>

      {/* Salary Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="salary">
          Salary
        </label>
        <input
          id="salary"
          name="salary"
          type="number"
          placeholder="Enter your salary"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.salary}
          className={`w-full p-2 border rounded text-black ${
            formik.touched.salary && formik.errors.salary ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.salary && formik.errors.salary && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.salary}</div>
        )}
      </div>

      {/* Department Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="department">
          Department
        </label>
        <input
          id="department"
          name="department"
          type="text"
          placeholder="Enter your department"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.department}
          className={`w-full p-2 border rounded ${
            formik.touched.department && formik.errors.department ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.department && formik.errors.department && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.department}</div>
        )}
      </div>

      {/* Experience Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="experience">
          Experience (Years)
        </label>
        <input
          id="experience"
          name="experience"
          type="number"
          placeholder="Enter your experience in years"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.experience}
          className={`w-full p-2 border rounded text-black ${
            formik.touched.experience && formik.errors.experience ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.experience && formik.errors.experience && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.experience}</div>
        )}
      </div>

      {/* Location Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Enter your location"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.location}
          className={`w-full p-2 border rounded ${
            formik.touched.location && formik.errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.location && formik.errors.location && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
        )}
      </div>

      {/* Role Input */}
      <div className="mb-4">
        <label className="block text-white mb-1" htmlFor="role">
          Role
        </label>
        <input
          id="role"
          name="role"
          type="text"
          placeholder="Enter your role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          className={`w-full p-2 border rounded ${
            formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.role && formik.errors.role && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full ${
          formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default InputForm;

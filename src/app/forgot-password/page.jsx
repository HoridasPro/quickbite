// "use client";

// import { useState } from "react";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch(
//       `${process.env.EMAIL_PASS}/api/forgot-password`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       },
//     );
//     const data = await res.json();
//     setMessage(data.message);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-80"
//       >
//         <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>

//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full border p-2 mb-3 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <button className="w-full bg-orange-500 text-white py-2 rounded">
//           Send Reset Link
//         </button>

//         {message && <p className="mt-3 text-sm text-center">{message}</p>}
//       </form>
//     </div>
//   );
// }

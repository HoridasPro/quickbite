// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";

// export default function ResetPassword() {
//   const { token } = useParams();
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch(`${process.env.EMAIL_PASS}/api/reset-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, password }),
//     });
//     const data = await res.json();
//     setMessage(data.message);
//     s;
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <form
//         className="bg-white p-6 rounded-lg shadow-md w-80"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-lg font-semibold mb-4">Set New Password</h2>
//         <input
//           type="password"
//           placeholder="New password"
//           className="w-full border p-2 mb-3 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button className="w-full bg-orange-500 text-white py-2 rounded">
//           Update Password
//         </button>
//         {message && <p className="mt-3 text-sm text-center">{message}</p>}
//       </form>
//     </div>
//   );
// }

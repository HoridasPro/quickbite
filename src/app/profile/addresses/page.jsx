export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 text-gray-800">
      <div className="w-full max-w-2xl space-y-6">

        {/* ================= Delivery Address ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-md">

          <h2 className="text-xl font-extrabold mb-4 text-black">
            Delivery address
          </h2>

          <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border">
            <iframe
              className="w-full h-full"
              src="https://maps.google.com/maps?q=Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <p className="font-semibold text-black">📍 Road 71</p>
              <p className="text-sm text-gray-600">Dhaka</p>
            </div>
            <button className="text-gray-600 text-sm font-medium">
              Edit
            </button>
          </div>

          <hr className="mb-4 border-gray-300" />

          <p className="font-bold mb-4 text-black">
            We’re missing your street / house number
          </p>

          {/* Inputs */}
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Street / House Number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />

            <input
              type="text"
              placeholder="Apartment #"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />

            <textarea
              rows="3"
              placeholder="Note to rider - e.g. building, landmark"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black resize-none focus:outline-none focus:border-gray-600"
            />

          </div>

          {/* Add Label */}
          <div className="mt-6">
            <p className="mb-2 font-medium text-black">Add a Label</p>
            <div className="flex gap-3 flex-wrap">
              {["Home", "Work", "Partner", "Other"].map((item, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-full border border-gray-400 text-sm text-black hover:border-gray-600 hover:text-orange-600 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition">
            Save and continue
          </button>

          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-black">
              Contactless delivery
            </span>
          </div>

        </div>

        {/* ================= Delivery Options ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Delivery options
          </h2>

          <div className="space-y-3">
            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer">
              <span className="text-black">Standard 30 – 45 mins</span>
              <input type="radio" name="delivery" defaultChecked />
            </label>

            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer">
              <span className="text-black">Priority 25 – 40 mins (+ Tk 40)</span>
              <input type="radio" name="delivery" />
            </label>
          </div>
        </div>

        {/* ================= Personal Details ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Personal details
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
            />

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
              />
            </div>

            <input
              type="text"
              placeholder="Mobile number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
            />

            <button className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-medium">
              Save
            </button>
          </div>
        </div>

        {/* ================= Tip Section ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Tip your rider
          </h2>

          <p className="text-sm text-gray-700 mb-4">
            Your rider receives 100% of the tip
          </p>

          <div className="flex gap-3 flex-wrap">
            {["Not now", "Tk 10", "Tk 20", "Tk 30", "Tk 50"].map(
              (tip, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-full border border-gray-400 text-sm text-black hover:border-gray-600 hover:text-gray-600 transition"
                >
                  {tip}
                </button>
              )
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm text-black">
              Save it for the next order
            </span>
          </div>
        </div>

        <button className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-semibold">
          Place order
        </button>

        <p className="text-gray-600 text-sm">
          By making this purchase you agree to our terms and conditions.
        </p>
        <p className="text-gray-600 text-sm ">
            I agree that placing the order places me under an obligation to make a payment in accordance with the General Terms and Conditions.
        </p>

      </div>
    </div>
  );
}

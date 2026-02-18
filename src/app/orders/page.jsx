export default function OrdersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Container */}
      <div className="max-w-[760px] mx-auto px-6 py-10">

        {/* Active Orders */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Active orders
          </h2>

          <p className="text-gray-600">
            You have no active orders.
          </p>
        </div>

        {/* Past Orders */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Past orders
          </h2>

          <p className="text-gray-600">
            Oops, looks like you havent placed any orders yet.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t"></div>

        {/* Empty Illustration Style Card  */}
        <div className="mt-10 bg-white rounded-2xl p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>

          <p className="text-gray-600 mb-6">
            When you place orders, they will appear here.
          </p>

          <button className="
            bg-orange-500 
            hover:bg-orange-600 
            text-white 
            px-6 py-3 
            rounded-lg 
            font-medium 
            transition
          ">
            Browse restaurants
          </button>
        </div>

      </div>

    </div>
  );
}

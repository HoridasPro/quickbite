export default function OrderHistoryCard({
  image,
  restaurant,
  items,
  date,
  status,
  price,
}) {

  const getStatusStyle = () => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-600";
    } 
    if (status === "Cancelled") {
      return "bg-red-100 text-red-600";
    }
    if (status === "On the way") {
      return "bg-orange-100 text-orange-600";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl p-5 flex gap-4 items-center border border-gray-100 hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <div className="w-20 h-20">
        <img
          src={image}
          alt={restaurant}
          className="w-full h-full rounded-xl object-cover"
        />
      </div>

      {/* Middle */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base">
          {restaurant}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          {items}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {date}
        </p>
      </div>

      {/* Right */}
      <div className="text-right">
        <p className="font-semibold text-gray-900 text-base">
          ৳{price}
        </p>

        <span
          className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getStatusStyle()}`}
        >
          {status}
        </span>
      </div>

    </div>
  );
}

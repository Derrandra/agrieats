function SummaryCard({

  title,
  value

}) {

  return (

    <div
      className="
        bg-white
        p-6
        rounded-2xl
        shadow
      "
    >

      <h2 className="text-gray-500 mb-3">
        {title}
      </h2>

      <h1 className="text-3xl font-bold text-green-700">
        {value}
      </h1>

    </div>

  );
}

export default SummaryCard;
const BookedRankingTable = () => {
  const salesData = [
    { rank: 1, name: "Ryan Fridley", sales: "$89,000" },
    { rank: 2, name: "Ryan Fridley", sales: "$89,000" },
    { rank: 3, name: "Ryan Fridley", sales: "$89,000" },
    { rank: 4, name: "Ryan Fridley", sales: "$89,000" },
    { rank: 5, name: "Ryan Fridley", sales: "$89,000" },
  ];

  const half = Math.floor(salesData.length / 2);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={4} className="py-2">
              <div className="flex justify-center">
                <h1 className="text-center">SHIPPED</h1>
              </div>
            </th>
          </tr>
          <tr className="border-b border-gray-800">
            <th className="py-3 text-sm font-medium text-gray-500 uppercase text-center tracking-wider">
              RANK
            </th>
            <th className="py-3 text-sm font-medium text-gray-500 uppercase text-center tracking-wider">
              SALES PERSON
            </th>
            <th className="py-3 text-sm font-medium text-gray-500 uppercase text-center tracking-wider">
              MTD
            </th>
            <th className="py-3 text-sm font-medium text-gray-500 uppercase text-center tracking-wider">
              YTD
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {salesData.map((item, index) => {
            const rowTextColor =
              index < half ? "text-green-500" : "text-red-500";
            return (
              <tr key={item.rank} className={rowTextColor}>
                <td className="py-3 text-sm font-medium text-center">
                  {item.rank}
                </td>
                <td className="py-3 text-sm text-center">{item.name}</td>
                <td className="py-3 text-sm text-center">{item.sales}</td>
                <td className="py-3 text-sm text-center">{item.sales}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookedRankingTable;

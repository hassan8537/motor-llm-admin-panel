
const ArcheiveUser = () => {
  const salesData = [
    { rank: 1, name: "Kebby Industries",salesperson: "600758",  sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1"},
    { rank: 2, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 3, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 4, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 5, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 6, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 7, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1"},
    { rank: 8, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
    { rank: 9, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1"},
    { rank: 10, name: "Kebby Industries", salesperson: "600758", sales: "Brandon Gerak", amount: "$15.00", completion: "23-10-1" },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">SO#</th>
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Customer Name</th>
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Account Manager Name</th>
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Customer PO</th>
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Sale $</th>
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Ship Date</th>

          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {salesData.map((item) => {
            return (
              <tr key={item.rank} >
                <td className="py-3 font-medium text-center">{item.rank}</td>
                <td className="py-3 text-center">{item.name}</td>
                <td className="py-3 text-center">{item.sales}</td>
                <td className="py-3 text-center">{item.salesperson}</td>
                <td className="py-3 text-center">{item.amount}</td>
                <td className="py-3 text-center">{item.completion}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ArcheiveUser;

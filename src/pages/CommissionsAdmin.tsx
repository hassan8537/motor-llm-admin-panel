
const CommissionAdmin = () => {
    const salesData = [
      { rank: 101, name: "Kebby Industries",salesperson: "600758",  sales: "3%", amount: "$65.00", completion: "$1,860"},
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860"},
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860"},
      { rank: 101, name: "Kebby Industries", salesperson: "600758", sales: "3%", amount: "$65.00", completion: "$1,860" },
    ];
  
  
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
            <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Emp ID</th>
              <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Employee Name</th>
              <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Total Sales(Month)</th>
              <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Commission Rate</th>
              <th className="py-3 font-medium text-black uppercase text-center tracking-wider">Commission Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {salesData.map((item) => {
              return (
                <tr key={item.rank} >
   <td className="py-3 font-medium text-center">{item.rank}</td>
                  <td className="py-3 text-center">{item.name}</td>
                  <td className="py-3 text-center">{item.amount}</td>
                  <td className="py-3 text-center">{item.sales}</td>
                  <td className="py-3 text-center">{item.completion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CommissionAdmin;
  
import React, { useState, useEffect } from "react";
import { fetchData } from "./api/data";
import RewardsCustTable from "./RewardsCustTable";
import RewardsCustMonthTable from "./RewardsCustMonthTable";

function calculateResults(incomingData) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pointsPerTransaction = incomingData.map((transaction) => {
    let points = 0;
    let over100 = transaction.amt - 100;

    if (over100 > 0) {
      // A customer receives 2 points for every dollar spent over $100 in each transaction
      points += over100 * 2;
    }
    if (transaction.amt > 50) {
      // plus 1 point for every dollar spent over $50 in each transaction
      points += 50;
    }
    debugger;
    const month = new Date(transaction.transactionDt).getMonth();
    return { ...transaction, points, month };
  });

  let byCustomer = {};
  let totalPointsByCustomer = {};
  pointsPerTransaction.forEach((pointsPerTransaction) => {
    debugger;
    let { custid, name, month, points } = pointsPerTransaction;
    if (!byCustomer[custid]) {
      byCustomer[custid] = [];
    }
    if (!totalPointsByCustomer[name]) {
      totalPointsByCustomer[name] = 0;
    }

    totalPointsByCustomer[name] += points;
    if (byCustomer[custid][month]) {
      byCustomer[custid][month].points += points;
      byCustomer[custid][month].monthNumber = month;
      byCustomer[custid][month].numTransactions++;
    } else {
      byCustomer[custid][month] = {
        custid,
        name,
        monthNumber: month,
        month: months[month],
        numTransactions: 1,
        points,
      };
    }
  });
  let tot = [];
  for (var custKey in byCustomer) {
    debugger;
    byCustomer[custKey].forEach((cRow) => {
      tot.push(cRow);
    });
  }
  let totByCustomer = [];
  for (custKey in totalPointsByCustomer) {
    debugger;
    totByCustomer.push({
      name: custKey,
      points: totalPointsByCustomer[custKey],
    });
  }
  return {
    summaryByCustomer: tot,
    pointsPerTransaction,
    totalPointsByCustomer: totByCustomer,
  };
}

function App() {
  const [transactionData, setTransactionData] = useState(null);

  const columns = [
    {
      Header: () => null,
      id: "expander",
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? "👇" : "👉"}
        </span>
      ),
    },
    {
      Header: "Customer",
      accessor: "name",
    },
    {
      Header: "Month",
      accessor: "month",
    },
    {
      Header: "# of Transactions",
      accessor: "numTransactions",
    },
    {
      Header: "Reward Points",
      accessor: "points",
    },
  ];
  const totalsByColumns = [
    {
      Header: "Customer",
      accessor: "name",
    },
    {
      Header: "Points",
      accessor: "points",
    },
  ];

  useEffect(() => {
    fetchData().then((data) => {
      debugger;
      const results = calculateResults(data);
      setTransactionData(results);
    });
  }, []);

  if (transactionData == null) {
    return <div>Loading...</div>;
  }

  return transactionData == null ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Reward points earned by each customer per month</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <RewardsCustMonthTable
              data={transactionData.summaryByCustomer}
              columns={columns}
              transactionData={transactionData}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Total reward points earned by each customer</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <RewardsCustTable
              data={transactionData.totalPointsByCustomer}
              columns={totalsByColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

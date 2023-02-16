import { useTable, useExpanded } from "react-table";
import _ from "lodash";

const RewardsCustMonthTable = ({ columns, data, transactionData }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable(
    {
      initialState: {},
      columns,
      data,
    },
    useExpanded
  );
  function getIndividualTransactions(row) {
    let byCustMonth = _.filter(transactionData.pointsPerTransaction, (tRow) => {
      return (
        row.original.custid === tRow.custid &&
        row.original.monthNumber === tRow.month
      );
    });
    return byCustMonth;
  }

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    {getIndividualTransactions(row).map((tran) => {
                      return (
                        <div className="container">
                          <div className="row">
                            <div className="col-8">
                              <strong>Transaction Date:</strong>{" "}
                              {tran.transactionDt} - <strong>$</strong>
                              {tran.amt} - <strong>Points: </strong>
                              {tran.points}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </td>
                </tr>
              ) : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
};
export default RewardsCustMonthTable;

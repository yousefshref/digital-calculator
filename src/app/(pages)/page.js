"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust the path as needed

const Home = () => {
  // Admin columns from Firestore (each with a category and a multiplier)
  const [columns, setColumns] = useState([]);
  // Employee input rows: each row is an array of numbers
  const [tableRows, setTableRows] = useState([]);

  // Fetch admin configuration on mount
  useEffect(() => {
    async function fetchColumns() {
      try {
        const docRef = doc(db, "admin", "data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const cols = data.columns || [];
          setColumns(cols);
          // Initialize with one row (all zeros) if columns exist.
          if (cols.length > 0) {
            setTableRows([new Array(cols.length).fill(0)]);
          }
        } else {
          console.error("No admin data found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }
    fetchColumns();
  }, []);

  // Update an input cell value
  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedRows = [...tableRows];
    const parsed = parseFloat(value);
    updatedRows[rowIndex][colIndex] = isNaN(parsed) ? 0 : parsed;
    setTableRows(updatedRows);
  };

  // Add a new row of inputs
  const addRow = () => {
    if (columns.length > 0) {
      setTableRows([...tableRows, new Array(columns.length).fill(0)]);
    }
  };

  // Compute the total for each column (sum of inputs multiplied by the column's multiplier)
  const columnTotals = columns.map((col, colIndex) => {
    const colSum = tableRows.reduce(
      (acc, row) => acc + (row[colIndex] || 0),
      0
    );
    return colSum * col.value;
  });

  // Compute the grand total (sum of all column totals)
  const grandTotal = columnTotals.reduce((acc, total) => acc + total, 0);

  return (
    <div
      dir="rtl"
      className="container mx-auto md:p-4 p-1 h-screen justify-center flex flex-col md:text-base text-sm"
    >
      {/* <h1 className="text-3xl font-bold mb-4 text-center">Employee Table</h1> */}
      <div className="flex flex-col gap-1 mb-5 px-2">
        <p>القيمة الإجماليه:</p>
        <p>{grandTotal}</p>
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="border border-gray-300 md:px-4 px-1.5 md:py-2 py-1 text-center"
              >
                <div className="font-semibold">{col.category}</div>
                <div className="text-sm">{columnTotals[index]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-300 md:px-4 px-1.5 md:py-2 py-1">
                  <input
                    type="number"
                    value={cell}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                    className="w-full text-center border rounded p-1"
                  />
                </td>
              ))}
              {/* Empty cell for the extra grand total column */}
              {/* <td className="border border-gray-300 md:px-4 px-1.5 md:py-2 py-1"></td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-center">
        <button
          onClick={addRow}
          className="bg-blue-500 text-white md:px-4 px-1.5 md:py-2 py-1 rounded hover:bg-blue-600 transition"
        >
          أضف قيمة اخرى
        </button>
      </div>
    </div>
  );
};

export default Home;

'use client';
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust the path as needed

const AdminColumnsPage = () => {
    // Each column has a category name and a numeric value.
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    // Load the columns configuration from Firestore when the component mounts.
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const docRef = doc(db, "admin", "data");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Expecting document structure: { columns: [ { category, value } ] }
                    const data = docSnap.data();
                    setColumns(data.columns || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Handle changes for a specific column field.
    const handleInputChange = (index, field, value) => {
        const updatedColumns = [...columns];
        // For the "value" field, parse it as a number; for category, just use the string.
        updatedColumns[index][field] =
            field === "value" ? parseFloat(value) || 0 : value;
        setColumns(updatedColumns);
    };

    // Add a new column with default empty values.
    const addColumn = () => {
        setColumns([...columns, { category: "", value: 0 }]);
    };

    // Delete a column by its index.
    const deleteColumn = (index) => {
        setColumns(columns.filter((_, i) => i !== index));
    };

    // Save/update the columns configuration in Firestore.
    const saveData = async () => {
        try {
            await setDoc(doc(db, "admin", "data"), { columns });
            alert("Data saved to Firebase!");
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Failed to save data to Firebase.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                {
                    loading ? (
                        <div className="mb-5">
                            <p>Loading...</p>
                        </div>
                    ) : null
                }
                {columns.map((col, index) => (
                    <div key={index} className="flex items-center mb-4">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={col.category}
                            onChange={(e) =>
                                handleInputChange(index, "category", e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 mr-2 flex-1"
                        />
                        <input
                            type="number"
                            placeholder="Number"
                            value={col.value}
                            onChange={(e) =>
                                handleInputChange(index, "value", e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 mr-2 w-20"
                        />
                        <button
                            onClick={() => deleteColumn(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
                <div className="flex justify-between">
                    <button
                        onClick={addColumn}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add More
                    </button>
                    <button
                        onClick={saveData}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminColumnsPage;

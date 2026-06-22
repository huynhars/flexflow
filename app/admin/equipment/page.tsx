"use client";

import { useState } from "react";

// ===== TYPE =====
type Equipment = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  condition: number; // 0 - 100
  status: "good" | "broken" | "repairing";
  lastMaintenance: string;
  repairCost: number;
  replaceCost: number;
};

// ===== MOCK DATA =====
const initialEquipments: Equipment[] = [
  {
    id: 1,
    name: "Dumbbell 20kg",
    type: "Weight",
    quantity: 10,
    condition: 80,
    status: "good",
    lastMaintenance: "2026-04-01",
    repairCost: 200000,
    replaceCost: 800000,
  },
  {
    id: 2,
    name: "Treadmill",
    type: "Cardio",
    quantity: 2,
    condition: 40,
    status: "broken",
    lastMaintenance: "2026-03-20",
    repairCost: 1500000,
    replaceCost: 8000000,
  },
];

// ===== HELPER =====
const getSuggestion = (e: Equipment) => {
  if (e.condition > 70) return "OK";
  if (e.repairCost < e.replaceCost * 0.5) return "Repair";
  return "Replace";
};

// ===== COMPONENT =====
export default function EquipmentPage() {
  const [equipments, setEquipments] = useState(initialEquipments);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);

  const [form, setForm] = useState<Equipment>({
    id: 0,
    name: "",
    type: "",
    quantity: 1,
    condition: 100,
    status: "good",
    lastMaintenance: "",
    repairCost: 0,
    replaceCost: 0,
  });

  // ===== CRUD =====
  const handleSubmit = () => {
    if (editing) {
      setEquipments((prev) =>
        prev.map((e) => (e.id === editing.id ? form : e))
      );
    } else {
      setEquipments((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }

    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      type: "",
      quantity: 1,
      condition: 100,
      status: "good",
      lastMaintenance: "",
      repairCost: 0,
      replaceCost: 0,
    });
  };

  const handleEdit = (e: Equipment) => {
    setEditing(e);
    setForm(e);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setEquipments((prev) => prev.filter((e) => e.id !== id));
  };

  // ===== STATS =====
  const total = equipments.length;
  const broken = equipments.filter((e) => e.status === "broken").length;
  const repairing = equipments.filter(
    (e) => e.status === "repairing"
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Equipment Management
        </h1>

        <button
          onClick={() => {
            setOpen(true);
            setEditing(null);
            resetForm();
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300"
        >
          + Add Equipment
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total</p>
          <h2 className="text-xl text-yellow-400 font-bold">
            {total}
          </h2>
        </div>

        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Broken</p>
          <h2 className="text-xl text-red-400 font-bold">
            {broken}
          </h2>
        </div>

        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Repairing</p>
          <h2 className="text-xl text-yellow-400 font-bold">
            {repairing}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50 text-gray-300 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Status</th>
              <th className="p-3">Suggestion</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {equipments.map((e) => (
              <tr
                key={e.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-3 text-white">{e.name}</td>
                <td className="p-3 text-gray-300">{e.type}</td>

                <td className="p-3">
                  <div className="w-full bg-black/40 rounded h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${e.condition}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {e.condition}%
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      e.status === "good"
                        ? "bg-green-500/20 text-green-400"
                        : e.status === "repairing"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                <td className="p-3 text-yellow-400 font-semibold">
                  {getSuggestion(e)}
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(e)}
                    className="text-yellow-400 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px] space-y-4">
            <h2 className="text-lg font-bold text-yellow-400">
              {editing ? "Edit Equipment" : "Add Equipment"}
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full p-2 bg-black/40 rounded"
            />

            <input
              placeholder="Type"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="w-full p-2 bg-black/40 rounded"
            />

            <input
              type="number"
              placeholder="Condition %"
              value={form.condition}
              onChange={(e) =>
                setForm({
                  ...form,
                  condition: Number(e.target.value),
                })
              }
              className="w-full p-2 bg-black/40 rounded"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Equipment["status"],
                })
              }
              className="w-full p-2 bg-black/40 rounded"
            >
              <option value="good">Good</option>
              <option value="repairing">Repairing</option>
              <option value="broken">Broken</option>
            </select>

            <input
              type="number"
              placeholder="Repair Cost"
              value={form.repairCost}
              onChange={(e) =>
                setForm({
                  ...form,
                  repairCost: Number(e.target.value),
                })
              }
              className="w-full p-2 bg-black/40 rounded"
            />

            <input
              type="number"
              placeholder="Replace Cost"
              value={form.replaceCost}
              onChange={(e) =>
                setForm({
                  ...form,
                  replaceCost: Number(e.target.value),
                })
              }
              className="w-full p-2 bg-black/40 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

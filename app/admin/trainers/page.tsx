"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Trainer = {
  _id?: string;
  name: string;
  dob: string;
  position: string;
  specialty: string;
  price: number;
  image: string;
};

const API = "http://localhost:5000/api/trainers";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState<Trainer>({
    name: "", dob: "", position: "", specialty: "", price: 0, image: ""
  });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    const res = await axios.get(API);
    setTrainers(res.data);
  };

  const handleSubmit = async () => {
    if (editing?._id) {
      await axios.put(`${API}/${editing._id}`, form);
    } else {
      await axios.post(API, form);
    }
    fetchTrainers();
    setOpen(false);
    setEditing(null);
    setForm({ name: "", dob: "", position: "", specialty: "", price: 0, image: "" });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchTrainers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Trainer Management</h1>
        <button onClick={() => { setOpen(true); setEditing(null); }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg">+ Add Trainer</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {trainers.map((t) => (
          <div key={t._id} className="glass rounded-xl overflow-hidden space-y-0">

            {/* ✅ Ảnh cân đối */}
            <div className="w-full aspect-square bg-black/40 overflow-hidden">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "";
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">🏋️</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-1">
              <h3 className="text-white font-semibold">{t.name}</h3>
              <p className="text-gray-400 text-sm">DOB: {t.dob || "—"}</p>
              <p className="text-yellow-400 text-sm">{t.position}</p>
              <p className="text-gray-400 text-sm">Specialty: {t.specialty}</p>

              <div className="flex justify-between pt-2">
                <button onClick={() => { setEditing(t); setForm(t); setOpen(true); }}
                  className="text-yellow-400 text-sm">Edit</button>
                <button onClick={() => handleDelete(t._id!)}
                  className="text-red-400 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-[420px] space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-yellow-400">
              {editing ? "Edit Trainer" : "Add Trainer"}
            </h2>

            {[
              { label: "Name", key: "name", type: "text" },
              { label: "DOB", key: "dob", type: "date" },
              { label: "Position", key: "position", type: "text" },
            ].map(({ label, key, type }) => (
              <input key={key} type={type} placeholder={label}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full p-2 rounded bg-black/40 text-white" />
            ))}

            {/* Specialty dropdown */}
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white"
            >
              <option value="">-- Chọn Specialty --</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Yoga">Yoga</option>
              <option value="Bodybuilding">Bodybuilding</option>
              <option value="HIIT">HIIT</option>
              <option value="Boxing">Boxing</option>
            </select>

            {/* ✅ Image URL + Preview */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Image URL</label>
              <input
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full p-2 rounded bg-black/40 text-white"
              />
              {form.image && (
                <div className="w-full aspect-square bg-black/40 rounded-xl overflow-hidden">
                  <img
                    src={form.image}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
              <p className="text-gray-500 text-xs">
                💡 Chuột phải ảnh trên Google → "Copy image address"
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
              <button onClick={handleSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
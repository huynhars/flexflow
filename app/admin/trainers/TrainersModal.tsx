'use client';

import { useEffect, useState } from 'react';

export type Trainer = {
  id: number;
  name: string;
  dob: string;
  position: string;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editing: Trainer | null;
  onSubmit: (data: Trainer) => void;
};

export default function TrainerModal({
  open,
  setOpen,
  editing,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<Trainer>({
    id: 0,
    name: '',
    dob: '',
    position: 'Personal Trainer',
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
      setForm({
        id: 0,
        name: '',
        dob: '',
        position: 'Personal Trainer',
      });
    }
  }, [editing]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] w-[400px] p-6 rounded-2xl space-y-4 border border-yellow-400/20">

        <h2 className="text-yellow-400 font-bold text-lg">
          {editing ? "Edit Trainer" : "Add Trainer"}
        </h2>

        {/* NAME */}
        <input
          placeholder="Trainer Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-2 rounded bg-black/40 text-white border border-gray-700"
        />

        {/* DOB */}
        <input
          type="date"
          value={form.dob}
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
          className="w-full p-2 rounded bg-black/40 text-white border border-gray-700"
        />

        {/* POSITION */}
        <select
          value={form.position}
          onChange={(e) =>
            setForm({ ...form, position: e.target.value })
          }
          className="w-full p-2 rounded bg-black/40 text-white border border-gray-700"
        >
          <option>Personal Trainer</option>
          <option>Yoga Instructor</option>
          <option>Boxing Coach</option>
          <option>Gym Manager</option>
          <option>Nutrition Coach</option>
        </select>

        {/* ACTION */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!form.name) return;

              onSubmit(form);
              setOpen(false);
            }}
            className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold"
          >
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

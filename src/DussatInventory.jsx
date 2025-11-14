import React, { useEffect, useState } from "react";

// Small helper to persist to localStorage
const STORAGE_KEY = "dussat_inventory_v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function DussatInventory() {
  const [view, setView] = useState("home"); // home | add | search
  const [items, setItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load inventory", e);
    }
  }, []);

  // Save when items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Add item helper
  function addItem(obj) {
    setItems((s) => [
      { ...obj, id: uid(), addedAt: new Date().toISOString() },
      ...s,
    ]);
    setView("search");
  }

  // Delete helper
  function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    setItems((s) => s.filter((i) => i.id !== id));
  }

  // Export CSV
  function exportCSV() {
    const header = ["id,name,description,location,quantity,addedAt"].join("\n");
    const rows = items
      .map((it) =>
        [it.id, it.name, it.description, it.location, it.quantity, it.addedAt]
          .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const csv = [header, rows].filter(Boolean).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dussat_inventory_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import CSV (very small parser)
  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const txt = reader.result;
      const lines = txt.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      // naive parse assuming header present
      const data = lines.slice(1).map((ln) => {
        // split on commas outside quotes (very naive); this app is for small imports
        const cols =
          ln
            .match(/(".*?"|[^,]+)(?=,|$)/g)
            ?.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
        return {
          id: cols[0] || uid(),
          name: cols[1] || "",
          description: cols[2] || "",
          location: cols[3] || "",
          quantity: Number(cols[4] || 1),
          addedAt: cols[5] || new Date().toISOString(),
        };
      });
      setItems((s) => [...data, ...s]);
      setView("search");
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">Dussat Inventory Wizard</h1>
          <p className="text-gray-600 mt-2">Manage your inventory like magic</p>
        </header>

        {view === "home" && (
          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Add New Item"
              accent="blue"
              onClick={() => setView("add")}
            >
              <p className="text-sm text-gray-600">
                Store items in specific cupboards or racks for easy tracking.
              </p>
            </Card>

            <Card
              title="Find Items"
              accent="green"
              onClick={() => setView("search")}
            >
              <p className="text-sm text-gray-600">
                Quickly locate where each item is stored in your inventory.
              </p>
            </Card>
          </main>
        )}

        {view === "add" && (
          <div className="mt-6 p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Add New Inventory Item
            </h2>
            <AddForm onCancel={() => setView("home")} onSave={addItem} />
          </div>
        )}

        {view === "search" && (
          <div className="mt-6 p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Find Inventory Items
            </h2>
            <SearchPanel
              items={items}
              onBack={() => setView("home")}
              onDelete={deleteItem}
              onExport={exportCSV}
              onImport={importCSV}
            />
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-gray-500">
          Dussat Global — Inventory System
        </footer>
      </div>
    </div>
  );
}

function Card({ title, children, onClick, accent = "blue" }) {
  const btnColor =
    accent === "green"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-blue-500 hover:bg-blue-600";
  return (
    <div className="p-6 bg-white rounded-2xl shadow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="text-gray-600">{children}</div>
      </div>
      <div className="mt-6">
        <button
          onClick={onClick}
          className={`${btnColor} text-white px-4 py-2 rounded-full shadow`}
        >
          {accent === "green" ? "Go to Search Items" : "Go to Add Items"}
        </button>
      </div>
    </div>
  );
}

function AddForm({ onCancel, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Please provide an item name");
    onSave({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      quantity: Number(quantity || 1),
    });
    // clear
    setName("");
    setDescription("");
    setLocation("");
    setQuantity(1);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Item Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3"
          placeholder="e.g. Pressure sensor"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3 h-28"
          placeholder="Short description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Cupboard / Rack Number
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="A3 / Rack 2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Save Item
        </button>
      </div>
    </form>
  );
}

function SearchPanel({ items, onBack, onDelete, onExport, onImport }) {
  const [q, setQ] = useState("");
  const [filtered, setFiltered] = useState(items);

  useEffect(() => {
    const t = q.trim().toLowerCase();
    if (!t) return setFiltered(items);
    setFiltered(
      items.filter((it) =>
        [it.name, it.description, it.location]
          .join(" ")
          .toLowerCase()
          .includes(t)
      )
    );
  }, [q, items]);

  function handleImportChange(e) {
    const f = e.target.files?.[0];
    if (f) importFile(f);
    e.target.value = "";
  }

  function importFile(f) {
    // bubble up
    if (typeof onImport === "function") onImport(f);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex-1">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by item name, description, or location..."
              className="w-full border rounded-lg p-3 pl-10"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white"
          >
            Export CSV
          </button>

          <label className="px-3 py-2 rounded-lg border cursor-pointer">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportChange}
              className="hidden"
            />
          </label>

          <button onClick={onBack} className="px-3 py-2 rounded-lg border">
            Back
          </button>
        </div>
      </div>

      <div className="pt-6">
        {filtered.length === 0 ? (
          <EmptySearch q={q} />
        ) : (
          <div className="space-y-3">
            {filtered.map((it) => (
              <div
                key={it.id}
                className="p-4 bg-gray-50 rounded-lg border flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-lg">{it.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {it.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Location: {it.location || "-"} • Qty: {it.quantity}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400">
                    Added: {new Date(it.addedAt).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard?.writeText(JSON.stringify(it))
                      }
                      className="px-2 py-1 border rounded"
                    >
                      Copy JSON
                    </button>
                    <button
                      onClick={() => onDelete(it.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptySearch({ q }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <div className="mb-4 text-4xl">🔍</div>
      <div className="text-lg">
        {q
          ? "No items match your search."
          : "Enter a search term to find items in your inventory"}
      </div>
    </div>
  );
}

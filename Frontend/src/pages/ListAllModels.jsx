import React, { useEffect, useState } from "react";
import { config } from "../services/api";

function openPlayground(modelPath){
    const url = config.baseURL + "/playground/new";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model_path: modelPath }),
    }

    // Fire and forget the request
    fetch(url, options);
}

const ListAllModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(config.baseURL + "/models/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch models");
        return res.json();
      })
      .then((data) => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-2">
      <div className="max-w-6xl mx-auto bg-gray-900/80 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-400 mb-8 text-center tracking-tight">
          All Models
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] text-orange-400 text-lg">
            <svg className="animate-spin h-6 w-6 mr-2 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center my-6">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">ID</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Model Name</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Base Model</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Task</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Description</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Created At</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Model Path</th>
                  <th className="px-4 py-3 bg-orange-500/20 text-orange-400 font-semibold text-left">Playground Link</th>
                </tr>
              </thead>
              <tbody>
                {models.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-8">
                      No models found.
                    </td>
                  </tr>
                ) : (
                  models.map((model, idx) => (
                    <tr
                      key={model.id}
                      className={idx % 2 === 0 ? "bg-gray-900/60" : "bg-gray-800/80"}
                    >
                      <td className="px-4 py-3 text-gray-200">{model.id}</td>
                      <td className="px-4 py-3 text-orange-300 break-all">{model.model_name}</td>
                      <td className="px-4 py-3 text-gray-300 break-all">{model.base_model}</td>
                      <td className="px-4 py-3 text-gray-300">{model.task}</td>
                      <td className="px-4 py-3 text-gray-400">{model.description}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(model.creation_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-400 break-all max-w-xs">
                        <span className="break-all">{model.model_path}</span>
                      </td>
                      <td className="px-4 py-3" >
                        <a
                          onClick={() => openPlayground(model.model_path)}
                          className="text-orange-400 underline hover:text-orange-300 transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                            <span style={{cursor: 'pointer'}}>Open in playground</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAllModels;

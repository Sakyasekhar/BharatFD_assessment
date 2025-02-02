import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import axios from "axios";
import sanitizeHtml from "sanitize-html";

const AddFAQ = ({ onFAQAdded }) => {
  const editor = useRef(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize answer before sending to backend
    const sanitizedAnswer = sanitizeHtml(answer, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
    });

    try {
      await axios.post("https://bharatfdassessment-server.up.railway.app/api/faq/add", { question, answer: sanitizedAnswer });
      setQuestion("");
      setAnswer("");
      onFAQAdded(); // Refresh FAQ list
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add FAQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Answer</label>
          <JoditEditor
            ref={editor}
            value={answer}
            onChange={(newContent) => setAnswer(newContent)}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add FAQ
          </button>
        </div>
      </form>

      {/* Preview the parsed HTML content */}
      <div className="mt-4 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div>{HTMLReactParser(sanitizeHtml(answer))}</div>
      </div>
    </div>
  );
};

export default AddFAQ;
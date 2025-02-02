import { useState, useEffect } from "react";
import axios from "axios";
import HTMLReactParser from "html-react-parser";
import sanitizeHtml from "sanitize-html";

const languages = {
  auto: "Automatic",
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese Simplified",
  "zh-tw": "Chinese Traditional",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  he: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu",
};



const FAQList = () => {
    const [faqs, setFaqs] = useState([]);
    const [selectedLang, setSelectedLang] = useState("en");
    const [editFaq, setEditFaq] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
  
    useEffect(() => {
      const fetchFaqs = async () => {
        setLoading(true); // Set loading to true before starting the fetch
        try {
          const res = await axios.get(`https://bharatfdassessment-server.up.railway.app/api/faqs/?lang=${selectedLang}`);
          setFaqs(res.data);
        } catch (error) {
          console.error("Error fetching FAQs:", error);
        } finally {
          setLoading(false); // Set loading to false after fetch is complete
        }
      };
  
      fetchFaqs();
    }, [selectedLang]);
  
    const handleUpdate = async (id) => {
      try {
        console.log(id);
        await axios.put(`https://bharatfdassessment-server.up.railway.app/api/faq/update/${id}`, {
          question: editedQuestion,
          answer: editedAnswer,
        });
        setFaqs(faqs.map(faq => (faq._id === id ? { ...faq, question: editedQuestion, answer: editedAnswer } : faq)));
        setEditFaq(null);
      } catch (error) {
        console.error("Error updating FAQ:", error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        console.log(id);
        await axios.delete(`https://bharatfdassessment-server.up.railway.app/api/faq/delete/${id}`);
        setFaqs(faqs.filter(faq => faq._id !== id));
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">All FAQs</h2>
        <div className="mb-4">
          <label className="font-bold">Select Language: </label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="border p-2 rounded ml-2 focus:outline-none focus:ring focus:border-blue-300"
          >
            {Object.entries(languages).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
  
        {loading ? (  // Show loading message when fetching
          <div className="text-center">Loading FAQs...</div>
        ) : faqs.length > 0 ? (
          <ul className="space-y-3">
            {faqs.map((faq) => (
              <li key={faq._id} className="p-2 border-b">
                {editFaq === faq._id ? (
                  <div>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                    />
                    <textarea
                      className="border p-1 rounded w-full mt-2"
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                    />
                    <button className="bg-green-500 text-white p-1 mt-2 rounded" onClick={() => handleUpdate(faq._id)}>
                      Save
                    </button>
                    <button className="bg-gray-500 text-white p-1 mt-2 rounded ml-2" onClick={() => setEditFaq(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <strong>{faq.translations?.[selectedLang] ?? faq.question}</strong>
                    <p>{HTMLReactParser(sanitizeHtml(faq.translations?.[selectedLang] ?? faq.answer))}</p>
                    {selectedLang === "en" && (
                      <div className="mt-2">
                        <button className="bg-blue-500 text-white p-1 rounded" onClick={() => {
                          setEditFaq(faq._id);
                          setEditedQuestion(faq.question);
                          setEditedAnswer(faq.answer);
                        }}>
                          Edit
                        </button>
                        <button className="bg-red-500 text-white p-1 rounded ml-2" onClick={() => handleDelete(faq._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No FAQs available</p>
        )}
      </div>
    );
  };
  
  export default FAQList;
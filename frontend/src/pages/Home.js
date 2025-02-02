import { useState } from "react";
import AddFAQ from "../components/AddFAQ";
import FAQList from "../components/FAQList";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl space-y-6">
        <AddFAQ onFAQAdded={() => setRefresh((prev) => !prev)} />
        <FAQList key={refresh} />
      </div>
    </div>
  );
};

export default App;
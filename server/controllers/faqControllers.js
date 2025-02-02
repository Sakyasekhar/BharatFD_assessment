const redisClient = require("../config/redisClient");
//model
const Faq = require("../models/Faq");

//googleTranslate
const translate = require("../config/googleTranslate");

const add_faq = async (req, res) => {
  try {
    // Get the details from the request body
    const { question, answer } = req.body;

    // Add to MongoDB
    const faq = new Faq({ question, answer,translations: {"en": {question,answer}} });
    await faq.save();

    // Clear Redis cache for translations since a new FAQ changes the dataset
    redisClient.flushAll(); 

    res.status(201).json({ message: "FAQ added successfully", faq });
  } catch (err) {
    res.status(500).json({ message: "Error adding FAQ", error: err.message });
  }
};



const delete_faq = async (req, res) => {
  try {
    const id = req.params.id;
    //find by the id and delete from mongodb
    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Clear Redis cache for translations since deletion of FAQ changes the dataset
    redisClient.flushAll();

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const cleanText = (text) => {
    return text.replace(/<br\s*\/?>/g, "\n"); // Convert <br> to newline
  };

//tanslated Faqs
const view_all_translated_Faqs = async (req, res) => {
    try {
      const {lang='en'} = req.query;
      //first check in redis for specific lang
      const cacheKey = lang;
  
      const cachedData = await redisClient.get(cacheKey);
      //if present - return all translated faqs
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
  
      
      //if not present - for each record
          //if it have lang in translations column : add it return value
          //else use google tranlate api to get the translated Faq and then add it return value
      const faqs = await Faq.find();


      const translatedFaqs = await Promise.all(
        faqs.map(async (faq) => {
          try {
            // Ensure translations exist in the document
            if (!faq.translations) {
              faq.translations = {};
            }
      
            // Check if translation already exists
            if (faq.translations[lang] && faq.translations[lang].length>0) {
              return {
                _id:faq._id,
                question: faq.translations[lang].question,
                answer: faq.translations[lang].answer,
              };
            }
      
            // Translate using Google Translate API
            const translatedQuestion = await translate(cleanText(faq.question), { to: lang });
            const translatedAnswer = await translate(cleanText(faq.answer), { to: lang });

            faq.translations[lang] = {
                question: translatedQuestion.text,
                answer: translatedAnswer.text,
              };
    
            // **Manually mark translations as modified**
            faq.markModified("translations");
      
            // Save updated document in MongoDB
            await faq.save();
      
            return {
                _id:faq._id,
              question: translatedQuestion.text,
              answer: translatedAnswer.text,
            };
          } catch (error) {
            console.error("Translation error:", error);
            return {
              question: faq.question,
              answer: faq.answer,
            };
          }
        })
      );

      //then add them into the redis and also return them
      // Store translated FAQs in Redis for caching (1-hour expiration)
      await redisClient.set(cacheKey, JSON.stringify(translatedFaqs), 'EX', 3600); 
  
      return res.status(200).json(translatedFaqs);
    } catch (err) {
        console.error("Error fetching translated FAQs:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
  };

const update_faq = async (req, res) => {
  try {
    // id of faq
    const id = req.params.id;
    const { question, answer } = req.body;

    // update in mongodb
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Clear Redis cache for translations since a new FAQ changes the dataset
    redisClient.flushAll();

    res.status(200).json(updatedFaq);
  } catch (err) {
    console.error("Error updating FAQ:", err);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

//search question

module.exports = {
  add_faq,
  delete_faq,
  update_faq,
  view_all_translated_Faqs,
};

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // simple demo logic
    let answer = "Sorry, no data found";
    let source = "N/A";

    if (question.toLowerCase().includes("refund")) {
      answer = "To process a refund, verify the request and approve it.";
      source = "Refund Policy - Page 12";
    }

    if (question.toLowerCase().includes("leave")) {
      answer = "Employees must apply leave via HR portal.";
      source = "HR Policy - Page 5";
    }

    res.json({
      question,
      answer,
      source,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
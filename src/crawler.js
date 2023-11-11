const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.lebenindeutschland.eu"; // Modify as needed

exports.getQuestions = async function () {
  try {
    let question_data = {};
    question_data["Deutschland"] = [];
    // Deutschland
    for (let i = 1; i <= 10; i++) {
      let url = `${BASE_URL}/fragenkatalog/${i}`;
      questions = await parseQuestionPage(url);
      question_data["Deutschland"].push(...questions);
    }
    // Bundesland
    const response = await axios.get(`${BASE_URL}/fragenkatalog`);
    const $ = cheerio.load(response.data);
    let info = [];
    $(
      "div.md\\:grid.md\\:grid-cols-2.lg\\:grid-cols-4.gap-4.mb-8 a.state-link"
    ).each((i, elem) => {
      const title = $(elem)
        .find("span.inline-block.font-semibold")
        .first()
        .text()
        .trim();
      const link = $(elem).attr("href");
      info.push({ title, link });
    });
    for (let i = 0; i < info.length; i++) {
      let url = info[i].link;
      questions = await parseQuestionPage(url);
      question_data[info[i].title] = questions;
    }
    return question_data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

async function parseQuestionPage(url) {
    let questions = [];
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $("div.p-4.mb-8").each((index, element) => {
      const questionText = $(element).find("h3.mb-4").text().trim();
      const questionImage = $(element).find("div.mb-8 img").attr("src");
      let options = [];
      $(element)
        .find("div.mb-4")
        .each((i, el) => {
          const isCorrect = $(el).find("span").hasClass("bg-green-100");
          const optionText = $(el).find("span").text().trim();

          options.push({
            text: optionText,
            isCorrect: isCorrect,
          });
        });
      questions.push({
        questionText: questionText,
        questionImage: questionImage,
        options: options,
        answer: options
          .find((option) => option.isCorrect)
          .text.trim(),
      });
    });
    return questions;
  } catch (error) {
    console.error("Error parsing question page:", error);
    return [];
  }
}

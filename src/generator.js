const Epub = require("epub-gen");

exports.generateEpub = async function (question_data) {
  // CSS styles
  const styles = `
    <style>
      .option-list {
        list-style-type: none;
        padding-left: 0;
      }
      .option-list li {
        background-color: #eef2f7;
        margin-bottom: 5px;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .answer-section {
        margin-top: 20px;
        padding: 10px;
        background-color: #f7f7f7;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: none; /* Initially hidden */
      }
      .answer-title {
        color: #336699;
        font-weight: bold;
        margin-bottom: 5px;
        cursor: pointer; /* Indicates it's clickable */
      }
      .answer {
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        border-left: 5px solid #336699;
      }
      /* Hide the table of contents */
      .table-of-contents {
        display: none;
      }
    </style>
  `;


  let content = [];

  for (let section in question_data) {
    let questions = question_data[section];
    let sectionContent = questions.map((question, index) => {
      let questionContent = `
              <h3>${question.questionText}</h3>
              ${
                question.questionImage
                  ? `<img src="https://www.lebenindeutschland.eu/${question.questionImage}" alt="Question Image"/>`
                  : ""
              }
              <ul class="option-list">${question.options.map(option => `<li>${option.text}</li>`).join('')}</ul>
              <p><strong>Answer:</strong> ${question.answer}</p>
          `;
      return {
        title: question.questionText,
        data: styles + questionContent,
      };
    });

    content.push({
      title: section,
      data: sectionContent.map((c) => c.data).join(""),
    });
  }

  const option = {
    title: "Leben in Deutschland",
    author: "StefanieZhao",
    content: content,
  };

  return new Epub(option, "Leben_in_Deutschland.epub").promise;
};



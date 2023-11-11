const crawler = require('./crawler');
const generator = require('./generator');

const main = async () => {
  try {
    const question_data = await crawler.getQuestions();
    await generator.generateEpub(question_data);
    // generator.generatePdf(questions);
    console.log('eBook has been generated successfully.');
  } catch (error) {
    console.error('Error during eBook generation:', error);
  }
};

main();

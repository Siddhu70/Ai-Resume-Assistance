import PDFParser from "pdf2json";

export const extractTextFromPDF = (filePath) => {

  return new Promise((resolve, reject) => {

    const pdfParser = new PDFParser();

    pdfParser.on(
      "pdfParser_dataError",
      errData => reject(errData.parserError)
    );

    pdfParser.on(
      "pdfParser_dataReady",
      pdfData => {

        let text = "";

        pdfData.Pages.forEach(page => {

          page.Texts.forEach(textItem => {

            try {

              const decodedText =
                decodeURIComponent(
                  textItem.R[0].T
                );

              text += decodedText + " ";

            } catch (error) {

              // Skip broken characters
              console.log(
                "Skipping malformed text"
              );

            }

          });

        });

        resolve(text);

      }
    );

    pdfParser.loadPDF(filePath);

  });

};
package dev.ajeetverma01.aihire.resume.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeTextExtractor {

    public String extractText(MultipartFile file) throws IOException {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper textStripper = new PDFTextStripper();
            String extractedText = textStripper.getText(document);

            if (extractedText == null || extractedText.isBlank()) {
                throw new IllegalArgumentException(
                        "The PDF contains no extractable text."
                );
            }

            return extractedText.trim();
        }
    }
}
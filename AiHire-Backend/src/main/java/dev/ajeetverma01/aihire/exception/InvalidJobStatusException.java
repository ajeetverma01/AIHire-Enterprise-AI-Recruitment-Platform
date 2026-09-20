package dev.ajeetverma01.aihire.exception;

public class InvalidJobStatusException extends RuntimeException {

    public InvalidJobStatusException(String message) {
        super(message);
    }
}
package dev.ajeetverma01.aihire.exception;

public class InvalidApplicationStatusTransitionException
        extends RuntimeException {

    public InvalidApplicationStatusTransitionException(String message) {
        super(message);
    }
}
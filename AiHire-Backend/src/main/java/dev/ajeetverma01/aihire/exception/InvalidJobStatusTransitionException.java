package dev.ajeetverma01.aihire.exception;

public class InvalidJobStatusTransitionException extends RuntimeException{
    public InvalidJobStatusTransitionException(String msg){
        super(msg);
    }
}

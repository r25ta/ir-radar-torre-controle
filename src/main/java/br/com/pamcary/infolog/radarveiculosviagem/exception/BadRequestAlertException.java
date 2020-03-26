package br.com.pamcary.infolog.radarveiculosviagem.exception;

public class BadRequestAlertException extends RuntimeException {

	public BadRequestAlertException(String message) {
		super(message);
	}

	public BadRequestAlertException(String message, Throwable cause) {
		super(message, cause);
	}
	
	
	private static final long serialVersionUID = 1L;

}

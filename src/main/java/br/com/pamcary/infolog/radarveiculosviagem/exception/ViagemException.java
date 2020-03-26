package br.com.pamcary.infolog.radarveiculosviagem.exception;

public class ViagemException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ViagemException(String message) {
		super(message);
	}

	public ViagemException(String message, Throwable cause) {
		super(message, cause);
	}

}
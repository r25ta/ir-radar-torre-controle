package br.com.pamcary.infolog.radarveiculosviagem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ViagemNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ViagemNotFoundException(String message) {
		super(message);
	}
	
	public ViagemNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}	
	
}

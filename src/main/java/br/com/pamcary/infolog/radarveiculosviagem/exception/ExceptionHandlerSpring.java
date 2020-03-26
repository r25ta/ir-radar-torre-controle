package br.com.pamcary.infolog.radarveiculosviagem.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class ExceptionHandlerSpring {
	
	private final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandlerSpring.class);
	
    
    @ExceptionHandler({ViagemException.class})
    private ResponseEntity<List<Error>>handleViagemInvalidaException(ViagemException e) {
        return error(INTERNAL_SERVER_ERROR, e,"Erro, sistema cometeu uma operação ilegal!");
    }
    
    @ExceptionHandler({BadRequestAlertException.class})
    private ResponseEntity<List<Error>>handleBadRequestAlertException(BadRequestAlertException e) {
        return error(BAD_REQUEST, e,null);
    }
    
    @ExceptionHandler({MethodArgumentNotValidException.class})
    private ResponseEntity<List<Error>> handleHttpMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return error(BAD_REQUEST, e, "Argumento inválido.");
    }
    
    @ExceptionHandler({SQLException.class})
    private ResponseEntity<List<Error>> handleSQLException(SQLException e) {
        return error(INTERNAL_SERVER_ERROR, e, "Erro ao executar SQL.");
    }
    
    @ExceptionHandler({RuntimeException.class})
    private ResponseEntity<List<Error>> handleRunTimeException(RuntimeException e) {
        return error(INTERNAL_SERVER_ERROR, e,null);
    }
    
    @ExceptionHandler({Exception.class})
    private ResponseEntity<List<Error>> handleException(Exception e) {
        return error(INTERNAL_SERVER_ERROR, e,null);
    }
    
    private ResponseEntity<List<Error>> error(HttpStatus status, Exception e, String msg) {
        LOGGER.error("Exception : ", e);
		List<Error> listErros = createListError(e,msg);
        return ResponseEntity.status(status).body(listErros);
    }
    
	private List<Error> createListError(Exception ex, String msg) {
		List<Error> listErros = new ArrayList<>();
		String msgUser = msg != null ? msg : ex.getMessage();
		String msgDeveloper = ex.toString();
		listErros.add(new Error(msgUser, msgDeveloper));

		return listErros;
	}
    
	public static class Error {

		public Error(final String msgUser, final String msgDeveloper) {
			this.msgUser = msgUser;
			this.msgDeveloper = msgDeveloper;
		}

		private String msgUser;
		private String msgDeveloper;

		public String getMsgUser() {
			return msgUser;
		}

		public void setMsgUser(String msgUser) {
			this.msgUser = msgUser;
		}

		public String getMsgDeveloper() {
			return msgDeveloper;
		}

		public void setMsgDeveloper(String msgDeveloper) {
			this.msgDeveloper = msgDeveloper;
		}

	}
}
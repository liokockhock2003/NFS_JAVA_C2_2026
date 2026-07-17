package com.example.assettracker.exception;

import com.example.assettracker.dto.ApiErrorResponse;
import com.example.assettracker.dto.FieldErrorDetail;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/*
 * GlobalExceptionHandler
 * ----------------------
 * Central place to convert Java exceptions into HTTP responses.
 * - @RestControllerAdvice makes these handlers apply across all controllers.
 * - @ExceptionHandler methods deal with specific exception types.
 * - This keeps controller code focused on happy-path logic.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Map ResourceNotFoundException -> 404 Not Found with a simple JSON body.
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleResourceNotFound(ResourceNotFoundException exception) {
        return new ApiErrorResponse(exception.getMessage());
    }

    // Map validation errors (triggered by @Valid) -> 400 Bad Request.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleValidationError(MethodArgumentNotValidException exception) {
        List<FieldErrorDetail> errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new FieldErrorDetail(error.getField(), error.getDefaultMessage()))
                .toList();

        return new ApiErrorResponse("Validation failed", errors);
    }

    // Map DuplicateResourceException -> 409 Conflict (e.g. duplicate email on register).
    @ExceptionHandler(DuplicateResourceException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleDuplicateResource(DuplicateResourceException exception) {
        return new ApiErrorResponse(exception.getMessage());
    }

    // Map authentication failures (e.g. wrong password on login) -> 401 Unauthorized.
    // A generic message is used deliberately so callers cannot tell whether the
    // email exists or the password was wrong (avoids user enumeration).
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrorResponse handleAuthenticationFailure(AuthenticationException exception) {
        return new ApiErrorResponse("Invalid email or password");
    }
}

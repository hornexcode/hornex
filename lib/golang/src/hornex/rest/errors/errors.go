package errors

import (
	"net/http"

	"hornex.gg/hornex/errors"
)

func BadRequest(err error, format string, a ...interface{}) error {
	return errors.WrapErrorf(err, http.StatusBadRequest, format, a...)
}

func Unauthorized(format string, a ...interface{}) error {
	return errors.NewErrorf(http.StatusUnauthorized, format, a...)
}

func Forbidden(format string, a ...interface{}) error {
	return errors.NewErrorf(http.StatusForbidden, format, a...)
}

func NotFound(format string, a ...interface{}) error {
	return errors.NewErrorf(http.StatusNotFound, format, a...)
}

func MethodNotAllowed(format string, a ...interface{}) error {
	return errors.NewErrorf(http.StatusMethodNotAllowed, format, a...)
}

func InternalServerError(err error, format string, a ...interface{}) error {
	return errors.WrapErrorf(err, http.StatusInternalServerError, format, a...)
}

func NotImplemented(format string, a ...interface{}) error {
	return errors.NewErrorf(http.StatusNotImplemented, format, a...)
}

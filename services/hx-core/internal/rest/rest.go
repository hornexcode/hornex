package rest

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/render"
	validation "github.com/go-ozzo/ozzo-validation/v4"
	hxerrors "hornex.gg/hornex/errors"
)

// ErrorResponse represents a response containing an error message.
type ErrorResponse struct {
	Error       string            `json:"error"`
	Validations validation.Errors `json:"validations,omitempty"`
}

func renderErrorResponse(w http.ResponseWriter, r *http.Request, msg string, err error) {
	resp := ErrorResponse{Error: msg}
	status := http.StatusInternalServerError

	var ierr *hxerrors.Error

	if !errors.As(err, &ierr) {
		resp.Error = "internal error"
	} else {
		switch ierr.Code() {
		case hxerrors.ErrorCodeValidationError:
			status = http.StatusConflict
		case hxerrors.ErrorCodeNotFound:
			status = http.StatusNotFound
		case hxerrors.ErrorCodeInvalidArgument:
			status = http.StatusBadRequest

			var verrors validation.Errors
			if errors.As(ierr, &verrors) {
				resp.Validations = verrors
			}
		case hxerrors.ErrorCodeUnknown:
			fallthrough
		default:
			status = http.StatusInternalServerError
		}
	}

	// if err != nil {
	// 	_, span := otel.Tracer(otelName).Start(r.Context(), "renderErrorResponse")
	// 	defer span.End()

	// 	span.RecordError(err)
	// }

	fmt.Printf("Error: %v\n", err)

	render.Status(r, status)
	render.JSON(w, r, &resp)
}

func renderResponse(w http.ResponseWriter, r *http.Request, res interface{}, status int) {
	render.Status(r, status)
	render.JSON(w, r, res)
}

package rest

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type Error struct {
	Code        string            `json:"code"`
	Message     string            `json:"message"`
	Validations []ValidationError `json:"validations,omitempty"`
}

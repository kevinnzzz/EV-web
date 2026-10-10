# Draft API Contract — EV Purchase Prediction Web

## Base URL

Local development:

`http://127.0.0.1:8000`

Frontend reads the URL from `VITE_API_BASE_URL`.

## 1. GET /health

Purpose: Check whether the API is running and whether the models are ready.

The response must report the actual readiness status. Do not return a successful model status if the model failed to load.

## 2. GET /models

Purpose: Return the available prediction models.

Each model should include:
- `name`: internal model identifier.
- `display_name`: human-readable model name.
- `available`: whether the model is ready for prediction.

The frontend uses this response to populate model selection.

## 3. GET /features

Purpose: Return the input schema required by the prediction form.

Each feature should describe:
- `name`: model input field name.
- `label`: display label.
- `type`: input type.
- `required`: whether the field is required.
- `options`: allowed choices for categorical fields, when applicable.
- `min` and `max`: allowed numeric bounds, when known.
- `description`: optional explanation or unit.

The schema must reflect the actual model requirements. Do not invent feature names, category choices, or numeric limits.

## 4. POST /predict

Purpose: Run prediction using the selected model.

Request fields:
- `model_name`: `xgboost` or `catboost`.
- `features`: object containing the required model input values.

The response should include:
- `model_name`: model used.
- `prediction`: predicted class.
- `prediction_label`: readable class label.
- `probability`: positive-class probability when supported by the model.

The probability must be calculated from the actual model output. If it is unavailable, return `null` rather than generating an estimate.

## 5. Error Handling

The frontend must support:
- `422`: invalid or incomplete input.
- `503`: model unavailable.
- `500`: prediction processing error.

Error responses should provide a readable message and, where appropriate, a stable error code.

## 6. Compatibility

The frontend and backend teams must agree on field names, data types, class labels, probability semantics, and error formats before integration testing.

This document is a preliminary interface contract. The detailed backend requirements, model loading behavior, validation rules, and final response examples will be documented separately.

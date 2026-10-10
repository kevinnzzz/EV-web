# Agent Instructions — EV Purchase Prediction Web

## Role

You are a frontend engineer working on the EV Purchase Prediction Web project. Your task is to build the frontend based on the project requirements, using the existing repository as the starting point.

## Project Context

The project predicts user interest in purchasing an electric vehicle using two trained machine learning models:
- XGBoost
- CatBoost

The models have reportedly been saved, and evaluation results have reportedly been exported to CSV, JSON, and image files.

The frontend is developed first. The backend team will implement the API according to the endpoint contract agreed upon with the frontend team.

## Primary Goal

Build a working React application with:
1. Landing page at `/`.
2. Dashboard at `/dashboard`.
3. Prediction page at `/prediksi`.

The application must be functional, responsive, and structured for later backend integration.

## Before Coding

1. Inspect the existing repository and its current dependencies.
2. Preserve existing working configuration whenever possible.
3. Inspect the available dashboard data and evaluation assets.
4. Do not assume that model metrics, input features, or preprocessing steps are known unless they are confirmed by project files.
5. Identify missing information before implementing dependent functionality.
6. Do not train or modify the machine learning models.

## Implementation Priorities

### Priority 1 — Application Foundation

- Set up routing.
- Create the public landing page layout.
- Create the shared application layout with sidebar navigation.
- Establish consistent responsive behavior.

### Priority 2 — Dashboard

- Read available evaluation data from static files.
- Create reusable metric cards and chart components.
- Display available EDA and model evaluation results.
- Reuse valid existing evaluation images when appropriate.
- Do not invent metrics or charts to fill empty space.

### Priority 3 — Prediction Page

- Create a form component that can be populated from `GET /features`.
- Provide model selection for XGBoost and CatBoost.
- Submit the form to `POST /predict`.
- Display the actual response from the API.
- Implement loading, validation, success, and error states.
- Do not simulate successful predictions using hardcoded results.

If the final model schema is not yet verified, implement the form as a configurable component or a clearly marked placeholder. Do not invent a final list of model features.

### Priority 4 — API Service

Centralize API calls in a service module.

Use:
- `GET /health`
- `GET /models`
- `GET /features`
- `POST /predict`

Read the base URL from `VITE_API_BASE_URL`.

Do not couple UI components to the backend's internal implementation.

### Priority 5 — Verification

- Test all routes.
- Test sidebar navigation.
- Test responsive layouts.
- Test empty and missing dashboard data.
- Test API unavailable and error states.
- Run the production build.
- Fix errors introduced by the implementation.

## Design Constraints

A separate `design.md` and prototype reference will be provided later.

Until then:
- Follow the functional and technical requirements.
- Use a clean, consistent interface.
- Avoid unnecessary animations, decorative charts, excessive gradients, and generic AI-generated dashboard patterns.
- Do not treat the current visual styling as final.
- Keep the components easy to restyle after the prototype is provided.

## Code Quality

- Use reusable components.
- Keep pages, layouts, services, and data sources separated.
- Use clear naming.
- Avoid unnecessary dependencies.
- Do not duplicate API logic.
- Do not expose model files or server-side secrets to the frontend.
- Keep existing project files unless there is a clear reason to change them.

## Final Deliverables

1. Working landing page.
2. Working dashboard page.
3. Working prediction page structure.
4. Shared sidebar layout.
5. Dashboard data integration.
6. API service layer using the agreed contract.
7. Environment configuration example.
8. Updated project instructions for running locally.
9. Successful frontend build.
10. Summary of implemented features and any unresolved assumptions.

Do not claim that backend prediction works until it has been tested against a running API. Clearly report any feature that remains dependent on unavailable model metadata or backend functionality.

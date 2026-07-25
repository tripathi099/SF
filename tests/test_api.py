import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.app import main
from backend.app.predictor import ModelRuntime


VALID_PAYLOAD = {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93,
}


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(main.app)

    def test_health_reports_ready_model(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "model_status": "ready"})

    def test_prediction_returns_ranked_recommendations(self):
        response = self.client.post("/predict", json=VALID_PAYLOAD)

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["model_status"], "ready")
        self.assertEqual(len(body["top_3_predictions"]), 3)
        self.assertEqual(body["recommended_crop"], body["top_3_predictions"][0]["crop"])
        self.assertEqual(body["confidence"], body["top_3_predictions"][0]["confidence"])

    def test_out_of_range_input_is_rejected(self):
        response = self.client.post("/predict", json={**VALID_PAYLOAD, "humidity": 120})

        self.assertEqual(response.status_code, 422)

    def test_missing_model_returns_controlled_error(self):
        original_runtime = main.runtime
        main.runtime = ModelRuntime(
            model=None,
            classes=[],
            feature_columns=original_runtime.feature_columns,
            status="missing",
        )
        try:
            response = self.client.post("/predict", json=VALID_PAYLOAD)
        finally:
            main.runtime = original_runtime

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["detail"], "Model artifact is not available.")

    def test_internal_prediction_error_is_not_exposed(self):
        with (
            patch("backend.app.main.predict_crop", side_effect=RuntimeError("internal detail")),
            patch.object(main.logger, "exception"),
        ):
            response = self.client.post("/predict", json=VALID_PAYLOAD)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.json()["detail"],
            "Prediction could not be completed. Please try again.",
        )
        self.assertNotIn("internal detail", response.text)


if __name__ == "__main__":
    unittest.main()

import unittest

from backend.app.config import DATASET_PATH
from backend.ml.train import train_model


class TrainingReproducibilityTests(unittest.TestCase):
    def test_committed_configuration_reproduces_published_metric(self):
        _, metrics, report = train_model(DATASET_PATH)

        self.assertEqual(metrics.test_size, 440)
        self.assertAlmostEqual(metrics.accuracy, 0.9681818181818181)
        self.assertAlmostEqual(report["macro avg"]["f1-score"], 0.9677453043373433)
        self.assertAlmostEqual(report["weighted avg"]["f1-score"], 0.9677453043373434)


if __name__ == "__main__":
    unittest.main()

import os

from ModelForge.FastAPI_server.utilities.DBManager import DatabaseManager
from ModelForge.FastAPI_server.utilities.hardware_detector import HardwareDetector
from ModelForge.FastAPI_server.utilities.settings_builder import SettingsBuilder

class GlobalSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GlobalSettings, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        self.hardware_detector = HardwareDetector()
        self.settings_builder = SettingsBuilder(None, None, None)
        self.settings_cache = {}
        self.finetuning_status = {"status": "idle", "progress": 0, "message": ""}
        self.datasets_dir = "./datasets"
        self.model_path = os.path.join(os.path.dirname(__file__), "model_checkpoints")
        self.db_manager = DatabaseManager(db_path=os.getenv("DB_PATH", "./database/modelforge.sqlite"))
        self.app_name = "ModelForge"

    @classmethod
    def get_instance(cls):
        return cls.__new__(cls)

    def clear_settings_cache(self):
        self.settings_cache.clear()

    def reset_finetuning_status(self):
        self.finetuning_status = {"status": "idle", "progress": 0, "message": ""}

    def reset_settings_builder(self):
        self.settings_builder.reset()

    def get_app_name(self):
        return self.app_name

    def get_db_manager(self):
        return self.db_manager

    def get_hardware_detector(self):
        return self.hardware_detector

    def get_settings_builder(self):
        return self.settings_builder

    def get_settings_cache(self):
        return self.settings_cache

    def get_finetuning_status(self):
        return self.finetuning_status

    def get_datasets_dir(self):
        return self.datasets_dir

    def get_model_path(self):
        return self.model_path



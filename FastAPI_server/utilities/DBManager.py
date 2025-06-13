import sqlite3
import json
from datetime import datetime
import traceback


class DatabaseManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DatabaseManager, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self, db_path="./database/modelforge.db"):
        self.db_path = db_path
        self.conn = None
        self.cursor = None
        self.initialize_db()

    def initialize_db(self):
        """Create database and tables if they don't exist"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()

            # Create fine-tuned models table
            self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS fine_tuned_models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT NOT NULL,
                base_model TEXT NOT NULL,
                task TEXT NOT NULL,
                description TEXT,
                creation_date TEXT NOT NULL,
                model_path TEXT NOT NULL,
                config_path TEXT,
            )
            ''')
            self.conn.commit()
        except sqlite3.Error as e:
            print(f"Database error: {e}")
            traceback.print_exc()
        finally:
            if self.conn:
                self.conn.close()

    def add_model(self, model_data):
        """Add a new fine-tuned model to the database"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()

            self.cursor.execute('''
            INSERT INTO fine_tuned_models 
            (model_name, base_model, task, description, creation_date, 
            model_path, config_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                model_data['model_name'],
                model_data['base_model'],
                model_data['task'],
                model_data.get('description', ''),
                model_data.get('creation_date', datetime.now().isoformat()),
                model_data['model_path'],
                model_data.get('config_path', '')
            ))

            self.conn.commit()
            return self.cursor.lastrowid
        except sqlite3.Error as e:
            print(f"Error adding model to database: {e}")
            traceback.print_exc()
            return None
        finally:
            if self.conn:
                self.conn.close()

    def get_all_models(self):
        """Get all fine-tuned models"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row
            self.cursor = self.conn.cursor()

            self.cursor.execute('''
            SELECT * FROM fine_tuned_models 
            WHERE is_active = 1
            ORDER BY creation_date DESC
            ''')

            rows = self.cursor.fetchall()
            models = []
            for row in rows:
                model = dict(row)
                model['training_params'] = json.loads(model['training_params'])
                model['performance_metrics'] = json.loads(model['performance_metrics'])
                models.append(model)

            return models
        except sqlite3.Error as e:
            print(f"Error retrieving models: {e}")
            return []
        finally:
            if self.conn:
                self.conn.close()

    def get_model_by_id(self, model_id):
        """Get a specific model by ID"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row
            self.cursor = self.conn.cursor()

            self.cursor.execute('SELECT * FROM fine_tuned_models WHERE id = ?', (model_id,))
            row = self.cursor.fetchone()

            if row:
                model = dict(row)
                model['training_params'] = json.loads(model['training_params'])
                model['performance_metrics'] = json.loads(model['performance_metrics'])
                return model
            return None
        except sqlite3.Error as e:
            print(f"Error retrieving model: {e}")
            return None
        finally:
            if self.conn:
                self.conn.close()

    def delete_model(self, model_id):
        """Delete a model"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()

            self.cursor.execute('DELETE FROM fine_tuned_models WHERE id = ?', (model_id,))
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            print(f"Error deleting model: {e}")
            traceback.print_exc()
            return False
        finally:
            if self.conn:
                self.conn.close()
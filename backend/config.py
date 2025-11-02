import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Secret key for JWT or session handling
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key_here')

    # Database configuration (PostgreSQL)
    DB_USER = os.environ.get('DB_USER', 'postgres')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '1234')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'sync_hub')

    SQLALCHEMY_DATABASE_URI = (
        f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Optional: enable debugging (turn off in production)
    DEBUG = True

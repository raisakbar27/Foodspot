import sys
import pandas as pd
import joblib
import numpy as np
import tensorflow as tf
import json
import os
from pathlib import Path

# Mendapatkan direktori saat ini
current_dir = Path(__file__).parent.absolute()
model_dir = current_dir / "model"

# Import fungsi dari modul foodspot
sys.path.append(str(current_dir.parent))
from foodspot.recommendation import get_recommendations_tf
from foodspot.feature_engineering import prepare_features

def predict(query):
    """
    Fungsi untuk memprediksi rekomendasi berdasarkan query
    """
    try:
        # Load data dan model
        data = pd.read_csv(os.path.join(model_dir, 'clean_resto_data.csv'))
        model = tf.keras.models.load_model(os.path.join(model_dir, 'tf_model.keras'))
        scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
        
        # Persiapkan data
        data.set_index('Nama Restoran', inplace=True)
        fitur_scaled, _, fitur = prepare_features(data.reset_index())
        
        # Proses query
        query = query.strip().lower()
        
        # Cari berdasarkan nama restoran
        nama_cocok = [nama for nama in data.index if query in nama.lower()]
        
        # Jika ada nama restoran yang cocok, gunakan model untuk rekomendasi
        if nama_cocok:
            input_vector = scaler.transform(fitur.loc[[nama_cocok[0]]])
            rekomendasi = get_recommendations_tf(input_vector[0], model, fitur_scaled, fitur.index, data, top_n=10)
            return {
                'type': 'recommendation',
                'query': query,
                'match_type': 'restaurant_name',
                'results': rekomendasi.to_dict('records')
            }
        
        # Cari berdasarkan jenis makanan
        jenis_cocok = data[data['Jenis Makanan'].str.lower().str.contains(query)]
        if not jenis_cocok.empty:
            hasil = jenis_cocok.reset_index()[['Nama Restoran', 'Rating', 'Harga', 'Alamat', 'Jenis Makanan']].sort_values(by='Rating', ascending=False).head(10)
            return {
                'type': 'search',
                'query': query,
                'match_type': 'food_type',
                'results': hasil.to_dict('records')
            }
        
        # Cari berdasarkan lokasi
        lokasi_cocok = data[data['Kota'].str.lower().str.contains(query)]
        if not lokasi_cocok.empty:
            hasil = lokasi_cocok.reset_index()[['Nama Restoran', 'Rating', 'Jenis Makanan', 'Alamat', 'Kota']].sort_values(by='Rating', ascending=False).head(10)
            return {
                'type': 'search',
                'query': query,
                'match_type': 'location',
                'results': hasil.to_dict('records')
            }
        
        # Jika tidak ada yang cocok
        return {
            'type': 'search',
            'query': query,
            'match_type': 'none',
            'results': []
        }
    
    except Exception as e:
        return {
            'error': str(e),
            'type': 'error'
        }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        query = sys.argv[1]
        result = predict(query)
        print(json.dumps(result))
    else:
        print(json.dumps({'error': 'No query provided', 'type': 'error'}))
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def prepare_features(data):
    """
    Fungsi untuk mempersiapkan fitur dari data restoran
    
    Parameters:
    -----------
    data : DataFrame
        DataFrame berisi data restoran
        
    Returns:
    --------
    tuple
        (features_scaled, scaler, features)
    """
    # Pilih fitur yang akan digunakan
    features = data.set_index('Nama Restoran')
    
    # Buat fitur numerik
    numeric_features = features[['Rating', 'Harga']].copy()
    
    # One-hot encoding untuk fitur kategorikal
    categorical_features = pd.get_dummies(features[['Jenis Makanan', 'Kota']])
    
    # Gabungkan semua fitur
    all_features = pd.concat([numeric_features, categorical_features], axis=1)
    
    # Normalisasi fitur numerik
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(all_features)
    features_scaled = pd.DataFrame(features_scaled, index=all_features.index, columns=all_features.columns)
    
    return features_scaled, scaler, all_features
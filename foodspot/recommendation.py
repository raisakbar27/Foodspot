import pandas as pd
import numpy as np

def get_recommendations_tf(input_vector, model, features_scaled, index_list, original_data, top_n=5):
    """
    Fungsi untuk mendapatkan rekomendasi restoran berdasarkan model TensorFlow
    
    Parameters:
    -----------
    input_vector : array
        Vector input untuk model
    model : tf.keras.Model
        Model TensorFlow yang sudah dilatih
    features_scaled : DataFrame
        DataFrame fitur yang sudah di-scale
    index_list : array
        List index dari fitur
    original_data : DataFrame
        Data asli restoran
    top_n : int
        Jumlah rekomendasi yang diinginkan
        
    Returns:
    --------
    DataFrame
        DataFrame berisi rekomendasi restoran
    """
    # Prediksi menggunakan model
    predictions = model.predict(np.array([input_vector]))
    
    # Hitung similarity score
    similarity_scores = np.dot(features_scaled.values, predictions[0])
    
    # Dapatkan indeks restoran dengan similarity tertinggi
    top_indices = np.argsort(similarity_scores)[::-1][:top_n+1]
    
    # Ambil nama restoran dari indeks
    top_restaurants = [index_list[i] for i in top_indices]
    
    # Jika restoran input ada dalam rekomendasi, hapus
    if top_restaurants[0] in original_data.index:
        top_restaurants.remove(top_restaurants[0])
    
    # Ambil data lengkap dari restoran yang direkomendasikan
    recommendations = original_data.loc[top_restaurants[:top_n]].reset_index()
    
    # Tambahkan kolom similarity score
    recommendations['similarity_score'] = [similarity_scores[i] for i in top_indices[:top_n]]
    
    return recommendations[['Nama Restoran', 'Rating', 'Jenis Makanan', 'Harga', 'Alamat', 'similarity_score']]
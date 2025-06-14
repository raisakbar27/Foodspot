# FoodSpot dengan Integrasi ML

## Cara Menggunakan Fitur ML

1. Pastikan model ML sudah diletakkan di direktori `ml/model/`:
   - `clean_resto_data.csv` - Data restoran yang sudah dibersihkan
   - `tf_model.keras` - Model TensorFlow yang sudah dilatih
   - `scaler.pkl` - Scaler untuk normalisasi fitur

2. Jalankan aplikasi dengan:
   ```
   npm start
   ```

3. Akses fitur rekomendasi ML di menu "AI Recommendation" atau di `/ml-search`

## Fitur ML

- Pencarian restoran berdasarkan nama, jenis makanan, atau lokasi
- Rekomendasi restoran berdasarkan kemiripan menggunakan model ML
- Hasil pencarian diurutkan berdasarkan rating

## Struktur Integrasi ML

- `ml/predict.py` - Script Python untuk menjalankan prediksi
- `foodspot/` - Package Python berisi modul-modul ML
- `api/controllers/ml.controller.js` - Controller untuk endpoint ML
- `api/routers/ml.route.js` - Router untuk endpoint ML
- `client/src/pages/MLSearch.jsx` - Halaman frontend untuk fitur ML
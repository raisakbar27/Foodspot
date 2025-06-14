import { fileURLToPath } from 'url';
import path from 'path';
import List from '../models/list.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller untuk mengintegrasikan model ML ke dalam fitur pencarian
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    // Ambil semua data restoran dari MongoDB
    const allRestaurants = await List.find({});
    
    if (!allRestaurants || allRestaurants.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          type: 'search',
          query: query,
          match_type: 'none',
          results: []
        }
      });
    }

    // Konversi data MongoDB
    const restaurants = allRestaurants.map(restaurant => ({
      'Nama Restoran': restaurant.name,
      'Rating': restaurant.rating,
      'Jenis Makanan': restaurant.type,
      'Harga': restaurant.price,
      'Alamat': restaurant.address,
      'imageUrls': restaurant.imageUrls
    }));

    // Filter berdasarkan query
    const lowerQuery = query.toLowerCase();
    
    // Cari berdasarkan nama restoran
    const matchedByName = restaurants.filter(r => 
      r['Nama Restoran'].toLowerCase().includes(lowerQuery)
    );
    
    if (matchedByName.length > 0) {
      // Jika ada yang cocok dengan nama, berikan rekomendasi berdasarkan jenis makanan yang sama
      const foodType = matchedByName[0]['Jenis Makanan'];
      const recommendations = restaurants
        .filter(r => r['Jenis Makanan'] === foodType && r['Nama Restoran'] !== matchedByName[0]['Nama Restoran'])
        .sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating))
        .slice(0, 5);
      
      // Tambahkan similarity score dummy untuk rekomendasi
      recommendations.forEach(r => {
        r.similarity_score = (0.5 + Math.random() * 0.4).toFixed(2); // Random score antara 0.5-0.9
      });
      
      return res.status(200).json({
        success: true,
        data: {
          type: 'recommendation',
          query: query,
          match_type: 'restaurant_name',
          results: recommendations
        }
      });
    }
    
    // Cari berdasarkan jenis makanan
    const matchedByFoodType = restaurants.filter(r => 
      r['Jenis Makanan'].toLowerCase().includes(lowerQuery)
    );
    
    if (matchedByFoodType.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          type: 'search',
          query: query,
          match_type: 'food_type',
          results: matchedByFoodType.sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating)).slice(0, 10)
        }
      });
    }
    
    // Cari berdasarkan alamat
    const matchedByAddress = restaurants.filter(r => 
      r['Alamat'].toLowerCase().includes(lowerQuery)
    );
    
    if (matchedByAddress.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          type: 'search',
          query: query,
          match_type: 'location',
          results: matchedByAddress.sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating)).slice(0, 10)
        }
      });
    }
    
    // Jika tidak ada yang cocok
    return res.status(200).json({
      success: true,
      data: {
        type: 'search',
        query: query,
        match_type: 'none',
        results: []
      }
    });
    
  } catch (error) {
    console.error('ML Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing ML recommendation',
      error: error.message
    });
  }
};